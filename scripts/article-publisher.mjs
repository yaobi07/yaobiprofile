import { createServer } from 'node:http'
import { existsSync } from 'node:fs'
import { mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn, spawnSync } from 'node:child_process'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const HTML_PATH = join(ROOT, 'tools', 'article-publisher.html')
const DATA_PATH = join(ROOT, 'public', 'data', 'articles.json')
const COVERS_DIR = join(ROOT, 'public', 'covers')
const HOST = '127.0.0.1'
const PORTS = [4317, 4318, 4319, 4320, 4321]
const MAX_BODY = 16 * 1024 * 1024

const SERIES = {
  freeplay: { name: '自由戏', en: 'FREE PLAY' },
  arrival: { name: '到达', en: 'ARRIVAL' },
  fluidity: { name: '流动', en: 'FLUIDITY' },
  other: { name: '其他', en: 'EARLY WORKS' },
}

function sendJson(response, status, value) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  response.end(JSON.stringify(value))
}

function readJson(request) {
  return new Promise((resolveBody, reject) => {
    let size = 0
    const chunks = []
    request.on('data', (chunk) => {
      size += chunk.length
      if (size > MAX_BODY) {
        reject(new Error('封面文件过大，请控制在 12MB 以内。'))
        request.destroy()
        return
      }
      chunks.push(chunk)
    })
    request.on('end', () => {
      try {
        resolveBody(JSON.parse(Buffer.concat(chunks).toString('utf8')))
      } catch {
        reject(new Error('提交内容无法解析。'))
      }
    })
    request.on('error', reject)
  })
}

function normalizeQuote(value) {
  let quote = String(value || '').trim()
  if ((quote.startsWith('“') && quote.endsWith('”')) || (quote.startsWith('"') && quote.endsWith('"'))) {
    quote = quote.slice(1, -1).trim()
  }
  return quote.replaceAll('“', '‘').replaceAll('”', '’')
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function normalizeTitle(value, seriesId) {
  let title = String(value || '').trim()
  const labels = [SERIES[seriesId]?.name, SERIES[seriesId]?.en].filter(Boolean)
  for (const label of labels) {
    title = title.replace(new RegExp(`^\\s*${escapeRegExp(label)}\\s*(?:[|｜/／:：-]+)\\s*`, 'i'), '').trim()
  }
  return title
}

function safeId(seriesId, href) {
  let token = ''
  try {
    token = new URL(href).pathname.split('/').filter(Boolean).at(-1) || ''
  } catch {
    token = ''
  }
  token = token.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 28)
  return `${seriesId}-${token || Date.now().toString(36)}`
}

function parseCover(dataUrl) {
  const match = /^data:(image\/(?:png|jpeg|webp));base64,([a-zA-Z0-9+/=]+)$/.exec(String(dataUrl || ''))
  if (!match) throw new Error('封面仅支持 JPG、PNG 或 WebP。')
  const extensions = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' }
  const buffer = Buffer.from(match[2], 'base64')
  if (!buffer.length || buffer.length > 12 * 1024 * 1024) throw new Error('封面文件无效或超过 12MB。')
  return { buffer, extension: extensions[match[1]] }
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    encoding: 'utf8',
    windowsHide: true,
    maxBuffer: 10 * 1024 * 1024,
  })
  if (result.status !== 0) {
    const details = [result.error?.message, result.stdout, result.stderr].filter(Boolean).join('\n').trim()
    throw new Error(details || `${command} 执行失败。`)
  }
  return result.stdout.trim()
}

function npmCommand() {
  if (process.platform !== 'win32') return 'npm'
  const localNpm = join(dirname(process.execPath), 'npm.cmd')
  if (existsSync(localNpm)) return localNpm
  if (existsSync('D:\\npm.cmd')) return 'D:\\npm.cmd'
  return 'npm.cmd'
}

function publishArticle(title, coverPath) {
  run(npmCommand(), ['run', 'build'])
  const files = [
    relative(ROOT, DATA_PATH).replaceAll('\\', '/'),
    relative(ROOT, coverPath).replaceAll('\\', '/'),
  ]
  run('git', ['add', '--', ...files])
  const commit = spawnSync('git', ['commit', '-m', `Add article: ${title}`], {
    cwd: ROOT,
    encoding: 'utf8',
    windowsHide: true,
    maxBuffer: 10 * 1024 * 1024,
  })
  if (commit.status !== 0 && !`${commit.stdout}\n${commit.stderr}`.includes('nothing to commit')) {
    throw new Error(`${commit.stdout}\n${commit.stderr}`.trim())
  }
  run('git', ['push', 'origin', 'main'])
  return run('git', ['rev-parse', '--short', 'HEAD'])
}

async function saveArticle(payload) {
  const seriesId = String(payload.seriesId || '')
  const title = normalizeTitle(payload.title, seriesId)
  const href = String(payload.href || '').trim()
  const quote = normalizeQuote(payload.quote)
  const excerpt = String(payload.excerpt || '').trim() || quote.slice(0, 110)
  const tags = Array.isArray(payload.tags)
    ? payload.tags.map((tag) => String(tag).trim()).filter(Boolean).slice(0, 5)
    : []

  if (!SERIES[seriesId]) throw new Error('请选择文章系列。')
  if (!title) throw new Error('请填写文章标题。')
  if (!quote) throw new Error('请填写文章金句。')
  if (!href) throw new Error('请填写文章链接。')
  let parsedUrl
  try {
    parsedUrl = new URL(href)
  } catch {
    throw new Error('文章链接格式不正确。')
  }
  if (parsedUrl.protocol !== 'https:') throw new Error('文章链接必须使用 HTTPS。')
  if (!Number.isFinite(payload.coverWidth) || !Number.isFinite(payload.coverHeight)) throw new Error('无法读取封面尺寸。')

  const articles = JSON.parse(await readFile(DATA_PATH, 'utf8'))
  const requestedId = String(payload.articleId || '').trim()
  const existingIndex = requestedId ? articles.findIndex((article) => article.id === requestedId) : -1
  const duplicate = articles.findIndex((article) => article.href === href && article.id !== requestedId)
  if (duplicate >= 0) throw new Error('这个原文链接已经存在于网站中。')

  const id = existingIndex >= 0 ? articles[existingIndex].id : safeId(seriesId, href)
  const { buffer, extension } = parseCover(payload.coverData)
  const coverName = `${id}.${extension}`
  const coverPath = join(COVERS_DIR, coverName)
  const cover = `/covers/${coverName}`
  const coverOrientation = payload.coverHeight > payload.coverWidth ? 'portrait' : 'landscape'

  const article = {
    id,
    seriesId,
    title,
    quote,
    excerpt,
    tags,
    cover,
    coverOrientation,
    href,
  }

  if (existingIndex >= 0) {
    articles[existingIndex] = article
  } else {
    const sameSeries = articles.map((item, index) => ({ item, index })).filter(({ item }) => item.seriesId === seriesId)
    const insertIndex = payload.position === 'last' && sameSeries.length
      ? sameSeries.at(-1).index + 1
      : (sameSeries[0]?.index ?? articles.length)
    articles.splice(insertIndex, 0, article)
  }

  await mkdir(COVERS_DIR, { recursive: true })
  const dataTemp = `${DATA_PATH}.publisher.tmp`
  const coverTemp = `${coverPath}.publisher.tmp`
  await writeFile(coverTemp, buffer)
  await writeFile(dataTemp, `${JSON.stringify(articles, null, 2)}\n`, 'utf8')
  await rename(coverTemp, coverPath)
  await rename(dataTemp, DATA_PATH)

  let commit = null
  if (payload.publish) {
    try {
      commit = publishArticle(title, coverPath)
    } catch (error) {
      error.saved = true
      error.articleId = id
      throw error
    }
  }
  return { articleId: id, cover, commit, published: Boolean(payload.publish) }
}

async function handle(request, response) {
  try {
    const url = new URL(request.url, `http://${HOST}`)
    if (request.method === 'GET' && url.pathname === '/') {
      const html = await readFile(HTML_PATH)
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' })
      response.end(html)
      return
    }
    if (request.method === 'GET' && url.pathname === '/api/summary') {
      const articles = JSON.parse(await readFile(DATA_PATH, 'utf8'))
      sendJson(response, 200, {
        series: Object.entries(SERIES).map(([id, value]) => ({
          id,
          ...value,
          count: articles.filter((article) => article.seriesId === id).length,
        })),
      })
      return
    }
    if (request.method === 'POST' && url.pathname === '/api/articles') {
      const payload = await readJson(request)
      const result = await saveArticle(payload)
      sendJson(response, 200, result)
      return
    }
    sendJson(response, 404, { error: 'Not found' })
  } catch (error) {
    sendJson(response, 400, {
      error: error.saved ? `文章已保存到本地，但发布失败：${error.message}` : (error.message || '操作失败。'),
      saved: Boolean(error.saved),
      articleId: error.articleId || null,
    })
  }
}

async function start() {
  const htmlReady = existsSync(HTML_PATH)
  if (!htmlReady) throw new Error(`缺少发布器页面：${HTML_PATH}`)

  for (const port of PORTS) {
    const server = createServer(handle)
    const started = await new Promise((resolveStart) => {
      server.once('error', () => resolveStart(false))
      server.listen(port, HOST, () => resolveStart(true))
    })
    if (!started) continue

    const url = `http://${HOST}:${port}`
    console.log(`\n《流动》文章发布器已启动：${url}`)
    console.log('关闭此窗口即可停止发布器。\n')
    if (process.platform === 'win32' && process.env.PUBLISHER_NO_OPEN !== '1') {
      spawn('cmd.exe', ['/c', 'start', '', url], { detached: true, stdio: 'ignore', windowsHide: true }).unref()
    }
    return
  }
  throw new Error('发布器端口被占用，请关闭旧的发布器窗口后重试。')
}

start().catch(async (error) => {
  console.error(error.message)
  for (const path of [`${DATA_PATH}.publisher.tmp`]) {
    if (existsSync(path)) await unlink(path).catch(() => {})
  }
  process.exitCode = 1
})
