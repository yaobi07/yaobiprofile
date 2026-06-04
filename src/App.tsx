import { useEffect, useRef, useState } from 'react'
import './App.css'
import coverTestaments from '../camera/证言.jpg'
import coverHiddenCorner from '../camera/隐秘的角落.jpg'
import coverSexRights from '../camera/性权利.jpg'
import profileAvatar from '../camera/个人头像.jpg'

type Project = {
  name: string
  image: string
  description: string
  techStack: string[]
  links: { label: string; href: string }[]
  author?: string
}

type CapabilityModule = {
  title: string
  subtitle: string
  description: string
  href: string
}

const profile = {
  name: '咬笔',
  title: '性别研究/AI',
  bio: '持续学习数据分析与可视化，关注把复杂信息整理成清晰、可操作的结论。',
  avatarAlt: '头像',
  skills: ['写作', 'SPSS', 'Axure', 'CAD', 'SQL'],
  contact: {
    email: 'yaobi_07@163.com',
    socials: [
      { label: '主邮箱', href: 'mailto:yaobi_07@163.com' },
      { label: '备用邮箱', href: 'mailto:linminglei22@gmail.com' },
      {
        label: '购物篮网络可视化',
        href: 'https://basketanalysis-yabijongjiongjiong.netlify.app/',
      },
      {
        label: '用户画像可视化分析',
        href: 'https://user-persona-visualization-xiaban.netlify.app/',
      },
    ],
  },
} as const

const projects: Project[] = [
  {
    name: '亚马逊购物篮分析及可视化项目',
    image: '/ai-basket-network.svg',
    description:
      '对亚马逊购物篮分析的原始数据进行赋分排序，识别高频组合购买的商品对。',
    techStack: ['数据清洗', '赋分排序', '可视化分析'],
    links: [
      {
        label: '在线预览',
        href: 'https://basketanalysis-yabijongjiongjiong.netlify.app/',
      },
    ],
  },
  {
    name: '亚马逊用户画像分析',
    image: '/ai-user-persona.svg',
    description: '对亚马逊用户画像分析的原始数据进行可视化呈现。',
    techStack: ['用户画像', '数据可视化', '分析看板'],
    links: [
      {
        label: '在线预览',
        href: 'https://user-persona-visualization-xiaban.netlify.app/',
      },
    ],
  },
]

const homeCapabilities: CapabilityModule[] = [
  {
    title: '公众号《明听影思》',
    subtitle: '写作与性别研究',
    description: '在光明在倾听，在阴影中思考——性别视角何以改造世界。',
    href: '#writing',
  },
  {
    title: 'AI学习者',
    subtitle: '学习与实践',
    description: '用AI，是为了展示自己。',
    href: '#projects',
  },
  {
    title: '阅读即世界',
    subtitle: '阅读与思考',
    description: '最近都看了什么书？',
    href: '#reading',
  },
] as const

const writingArticles: Project[] = [
  {
    name: '自由戏 | 厕所与性别：我们如何度过更好的三年？',
    image: '/writing-cover-1.png',
    description: '厕所问题也是一个性别问题',
    techStack: ['明听影思', '自由戏', '性别'],
    links: [{ label: '阅读文章', href: 'https://mp.weixin.qq.com/s/f6at7XM9MBYkZ8kH26S0Pw' }],
  },
  {
    name: '到达 | 作为母亲晒"孕肚"，反而更"去人性"？',
    image: '/writing-cover-2.png',
    description:
      '这种歌颂带来的，可能只是被架空的"英雄"形象，无需人性，只需生产。',
    techStack: ['明听影思', '到达', '母职'],
    links: [{ label: '阅读文章', href: 'https://mp.weixin.qq.com/s/SniRMS2rkwg7xj6-BpdEBQ' }],
  },
  {
    name: '自由戏 | 一聊黄的就不痛了，我们是在性解放吗？',
    image: '/writing-cover-3.png',
    description:
      '如果"一聊黄就不痛了"，那么真正值得警惕的，也许不是痛的消失，而是我们失去了面对它的语言。',
    techStack: ['明听影思', '自由戏', '性政治'],
    links: [{ label: '阅读文章', href: 'https://mp.weixin.qq.com/s/ExQ1EwGYoEiSDK6lyqcK2A' }],
  },
]

const recentBooks: Project[] = [
  {
    name: '《证言》',
    author: '玛格丽特·阿特伍德',
    image: coverTestaments,
    description:
      '故事发生在《使女的故事》结局十五年后：基列国的极权统治在内部逐渐显露出裂痕。三位出身不同、却被同一体制塑形的女性共同叙述，层层揭开基列国倾覆背后的真相。',
    techStack: ['阅读笔记', '叙事/政治'],
    links: [],
  },
  {
    name: '《隐秘的角落》',
    author: '劳拉·贝茨',
    image: coverHiddenCorner,
    description:
      '本书聚焦网络"厌女男性"社群的形成与扩散。作者以卧底与访谈的方式追踪仇恨叙事如何在圈层内部强化，并逐步渗透到现实冲突中，进而讨论如何拆解厌女叙事、重建公共对话。',
    techStack: ['阅读笔记', '社会观察'],
    links: [],
  },
  {
    name: '《性权利：21世纪的女权主义》',
    author: '埃米娅·斯里尼瓦桑',
    image: coverSexRights,
    description:
      '所有只关注相关群体内部成员的解放运动——只关注女性的女权主义运动、只关注有色人种的反种族歧视运动、只关注工人阶级的劳工运动——都有一个共同点：此类运动只能最好地服务那些群体内部受压迫程度最轻的成员。',
    techStack: ['阅读笔记', '理论/伦理'],
    links: [],
  },
]

function setupRevealOnScroll() {
  if (typeof window === 'undefined') return
  const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
  if (!elements.length) return
  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.setAttribute('data-revealed', 'true'))
    return
  }

  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
  if (prefersReducedMotion) {
    elements.forEach((el) => el.setAttribute('data-revealed', 'true'))
    return
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement
          const delay = el.dataset.revealDelay ? parseInt(el.dataset.revealDelay) : 0
          if (delay > 0) {
            window.setTimeout(() => el.setAttribute('data-revealed', 'true'), delay)
          } else {
            el.setAttribute('data-revealed', 'true')
          }
          io.unobserve(entry.target)
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.06 },
  )
  elements.forEach((el) => io.observe(el))
  return () => io.disconnect()
}

function App() {
  useEffect(() => setupRevealOnScroll(), [])
  const [meritToasts, setMeritToasts] = useState<Array<{ id: string }>>([])
  const toastTimeoutMs = 900
  const trailCanvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = trailCanvasRef.current
    if (!canvas) return
    if (typeof window === 'undefined') return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.max(1, window.devicePixelRatio || 1)
    const points: Array<{ x: number; y: number; t: number }> = []
    const maxAgeMs = 550

    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()

    let raf = 0
    const draw = () => {
      raf = requestAnimationFrame(draw)
      const now = performance.now()

      while (points.length && now - points[0].t > maxAgeMs) points.shift()

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (points.length < 2) return

      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1]!
        const b = points[i]!
        const age = now - b.t
        const alpha = Math.max(0, 1 - age / maxAgeMs)
        const width = 1.5 + 3.5 * alpha
        ctx.strokeStyle = `rgba(197, 20, 20, ${0.75 * alpha})`
        ctx.lineWidth = width
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
    }

    const onMove = (e: PointerEvent) => {
      const now = performance.now()
      points.push({ x: e.clientX, y: e.clientY, t: now })
      if (points.length > 90) points.splice(0, points.length - 90)
    }

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="page">
      <canvas ref={trailCanvasRef} className="cursorTrail" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href="#home" aria-label="回到首页">
          <span className="brandDot" aria-hidden="true" />
          <span className="brandText">{profile.name}</span>
        </a>
        <nav className="nav">
          <a href="#about">关于我</a>
          <a href="#writing">写作</a>
          <a href="#projects">项目</a>
          <a href="#reading">阅读</a>
          <a href="#contact">联系</a>
        </nav>
      </header>

      <main>
        {/* Hero — 整体作为一块入场 */}
        <section id="home" className="section heroSection">
          <div className="heroGrid" data-reveal>
            <div className="homeSplit">
              <div className="heroCopy">
                <p className="eyebrow">{profile.title}</p>
                <h1 className="headline">
                  Future-ready insights <br />
                  start here.
                </h1>
                <p className="subhead">你好，我是咬笔，欢迎！</p>
                <div className="ctaRow">
                  <span className="meritWrap">
                    <button
                      className="btn primary"
                      type="button"
                      onClick={() => {
                        const id = `toast-${performance.now().toFixed(3)}`
                        setMeritToasts((prev) => [...prev, { id }])
                        window.setTimeout(() => {
                          setMeritToasts((prev) => prev.filter((t) => t.id !== id))
                        }, toastTimeoutMs)
                      }}
                    >
                      神秘按钮
                    </button>
                    <span className="meritLayer" aria-hidden="true">
                      {meritToasts.map((t) => (
                        <span key={t.id} className="meritToast">
                          功德+1
                        </span>
                      ))}
                    </span>
                  </span>
                  <a className="btn" href={`mailto:${profile.contact.email}`}>
                    发邮件联系
                  </a>
                </div>
                <img
                  className="heroGif"
                  src="/bibi.gif"
                  alt=""
                  aria-hidden="true"
                />
              </div>

              <div className="capabilityStack" aria-label="能力模块">
                {homeCapabilities.map((item) => (
                  <a key={item.title} className="capabilityCard" href={item.href}>
                    <p className="capabilitySubtitle">{item.subtitle}</p>
                    <h3 className="capabilityTitle">{item.title}</h3>
                    <p className="capabilityDesc">{item.description}</p>
                  </a>
                ))}
              </div>
            </div>
            <div className="heroCtaBand">
              <div className="heroCard" aria-label="头像卡片">
                <div className="avatar">
                  <img src={profileAvatar} alt={profile.avatarAlt} width={132} height={132} />
                </div>
                <div className="heroMeta">
                  <div className="metaName">{profile.name}</div>
                  <div className="metaTitle">{profile.title}</div>
                </div>
              </div>
              <div className="ctaPanel">
                <p className="ctaPanelEyebrow">Say Hello</p>
                <p className="ctaPanelText">
                  准备好一起做点有意思的项目了吗？
                </p>
                <a className="btn primary" href="#contact">
                  开始联系
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* About — 标题、正文、标签依次入场 */}
        <section id="about" className="section" aria-label="关于我">
          <div className="container sectionFrame">
            <h2 className="sectionTitle sectionTitleAbout" data-reveal>关于我</h2>
            <p className="sectionLead sectionLeadAboutNoBreak" data-reveal data-reveal-delay="80">
              我专注于将业务原始数据转化为可解释、可决策的可视化结果，结合写作能力输出清晰的<span className="noWrap">分析报告</span>。
            </p>
            <div className="chips" data-reveal data-reveal-delay="160">
              {profile.skills.map((s) => (
                <span key={s} className="chip">{s}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Writing — 标题先入，卡片 stagger */}
        <section id="writing" className="section" aria-label="公众号文章">
          <div className="container">
            <h2 className="sectionTitle sectionTitleWriting" data-reveal>公众号《明听影思》</h2>
            <div className="grid">
              {writingArticles.map((p, i) => (
                <article
                  key={p.name}
                  className="card"
                  data-reveal
                  data-reveal-delay={String(i * 90)}
                >
                  <div className="cardMedia">
                    <img src={p.image} alt="" loading="lazy" />
                  </div>
                  <div className="cardBody">
                    <h3 className="cardTitle">{p.name}</h3>
                    <p className="cardDesc">{p.description}</p>
                    <div className="tagRow">
                      {p.techStack.map((t) => (
                        <span key={t} className="tag">{t}</span>
                      ))}
                    </div>
                    <div className="linkRow">
                      <a className="link" href={p.links[0]?.href} target="_blank" rel="noreferrer">
                        阅读文章 <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Projects — 标题先入，两张卡片 stagger */}
        <section id="projects" className="section" aria-label="AI 项目">
          <div className="container">
            <h2 className="sectionTitle sectionTitleProjects" data-reveal>AI 项目</h2>
            <div className="grid grid2">
              {projects.map((p, i) => (
                <article
                  key={p.name}
                  className="card"
                  data-reveal
                  data-reveal-delay={String(i * 100)}
                >
                  <div className="cardMedia">
                    <img src={p.image} alt="" loading="lazy" />
                  </div>
                  <div className="cardBody">
                    <h3 className="cardTitle">{p.name}</h3>
                    <p className="cardDesc">{p.description}</p>
                    <div className="tagRow">
                      {p.techStack.map((t) => (
                        <span key={t} className="tag">{t}</span>
                      ))}
                    </div>
                    <div className="linkRow">
                      <a className="link" href={p.links[0]?.href} target="_blank" rel="noreferrer">
                        在线预览 <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Reading — 标题先入，每行依次入场 */}
        <section id="reading" className="section" aria-label="近期阅读">
          <div className="container">
            <h2 className="sectionTitle sectionTitleReading" data-reveal>近期阅读</h2>
            <div className="altList">
              {recentBooks.map((p, i) => (
                <article
                  key={p.name}
                  className="altItem"
                  data-reveal
                  data-reveal-delay={String(i * 100)}
                >
                  <div className="altItemImg">
                    <img src={p.image} alt="" loading="lazy" />
                  </div>
                  <div className="altItemBody">
                    <h3 className="altItemTitle">{p.name}</h3>
                    {p.author && <p className="altItemAuthor">{p.author}</p>}
                    <p className="altItemDesc">{p.description}</p>
                    <div className="tagRow">
                      {p.techStack.map((t) => (
                        <span key={t} className="tag">{t}</span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="section" aria-label="联系方式">
          <div className="container sectionFrame">
            <h2 className="sectionTitle sectionTitleContact" data-reveal>联系我</h2>
            <p className="sectionLead" data-reveal data-reveal-delay="80">
              邮箱：{' '}
              <a className="inlineLink" href={`mailto:${profile.contact.email}`}>
                {profile.contact.email}
              </a>
            </p>
            <p className="sectionLead" data-reveal data-reveal-delay="160">
              备用邮箱：{' '}
              <a className="inlineLink" href="mailto:linminglei22@gmail.com">
                linminglei22@gmail.com
              </a>
            </p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footerInner">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <a className="inlineLink" href="#home">
            回到顶部
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App
