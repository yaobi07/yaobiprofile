import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

type Project = {
  name: string
  image: string
  description: string
  techStack: string[]
  links: { label: string; href: string }[]
}

type CarouselItem = {
  eyebrow: string
  title: string
  description: string
  image: string
  href: string
  ctaLabel: string
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
    image:
      'https://image.thum.io/get/width/1200/crop/675/noanimate/https://basketanalysis-yabijongjiongjiong.netlify.app/',
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
    image:
      'https://image.thum.io/get/width/1200/crop/675/noanimate/https://user-persona-visualization-xiaban.netlify.app/',
    description: '对亚马逊用户画像分析的原始数据进行可视化呈现。',
    techStack: ['用户画像', '数据可视化', '分析看板'],
    links: [
      {
        label: '在线预览',
        href: 'https://user-persona-visualization-xiaban.netlify.app/',
      },
    ],
  },
  {
    name: '更多项目筹备中',
    image: '/project-3.svg',
    description: '后续会继续补充更多实战项目与案例。',
    techStack: ['持续更新'],
    links: [{ label: '敬请期待', href: '#projects' }],
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
    name: '到达 | 作为母亲晒“孕肚”，反而更“去人性”？',
    image: '/writing-cover-2.png',
    description:
      '这种歌颂带来的，可能只是被架空的“英雄”形象，无需人性，只需生产。',
    techStack: ['明听影思', '到达', '母职'],
    links: [{ label: '阅读文章', href: 'https://mp.weixin.qq.com/s/SniRMS2rkwg7xj6-BpdEBQ' }],
  },
  {
    name: '自由戏 | 一聊黄的就不痛了，我们是在性解放吗？',
    image: '/writing-cover-3.png',
    description:
      '如果“一聊黄就不痛了”，那么真正值得警惕的，也许不是痛的消失，而是我们失去了面对它的语言。',
    techStack: ['明听影思', '自由戏', '性政治'],
    links: [{ label: '阅读文章', href: 'https://mp.weixin.qq.com/s/ExQ1EwGYoEiSDK6lyqcK2A' }],
  },
]

const recentBooks: Project[] = [
  {
    name: '书名示例 1',
    image: '/project-1.svg',
    description: '在这里写这本书最打动你的观点，以及它如何影响你的思考。',
    techStack: ['阅读笔记', '思辨'],
    links: [{ label: '查看笔记', href: '#' }],
  },
  {
    name: '书名示例 2',
    image: '/project-2.svg',
    description: '在这里写你对作者观点的理解与延展。',
    techStack: ['观点', '方法'],
    links: [{ label: '查看笔记', href: '#' }],
  },
  {
    name: '书名示例 3',
    image: '/project-3.svg',
    description: '在这里写阅读后的问题意识与下一步阅读计划。',
    techStack: ['书单', '持续更新'],
    links: [{ label: '查看笔记', href: '#' }],
  },
]

function clampIndex(index: number, length: number) {
  if (length <= 0) return 0
  const mod = index % length
  return mod < 0 ? mod + length : mod
}

function CarouselSection({
  id,
  ariaLabel,
  items,
}: {
  id: string
  ariaLabel: string
  items: CarouselItem[]
}) {
  const [index, setIndex] = useState(0)
  const [lastInteractionMs, setLastInteractionMs] = useState<number>(0)
  const startXRef = useRef<number | null>(null)
  const pointerActiveRef = useRef(false)
  const indexRef = useRef(0)

  const count = items.length
  const current = items[clampIndex(index, count)]

  useEffect(() => {
    indexRef.current = index
  }, [index])

  useEffect(() => {
    if (count <= 1) return

    const interval = window.setInterval(() => {
      const now = Date.now()
      const hasInteractedRecently = lastInteractionMs > 0 && now - lastInteractionMs < 5 * 60 * 1000
      if (hasInteractedRecently) return
      setIndex((i) => clampIndex(i + 1, count))
    }, 10_000)

    return () => window.clearInterval(interval)
  }, [count, lastInteractionMs])

  const manualTo = (next: number) => {
    setLastInteractionMs(Date.now())
    setIndex(clampIndex(next, count))
  }

  return (
    <section id={id} className="section" aria-label={ariaLabel}>
      <div className="container" data-reveal>
        <div
          className="carousel"
          onPointerDown={(e) => {
            const target = e.target as HTMLElement | null
            if (target?.closest('button,a')) return
            pointerActiveRef.current = true
            startXRef.current = e.clientX
            ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
          }}
          onPointerUp={(e) => {
            if (!pointerActiveRef.current) return
            pointerActiveRef.current = false
            const startX = startXRef.current
            startXRef.current = null
            if (startX == null) return
            const delta = e.clientX - startX
            if (Math.abs(delta) < 42) return
            manualTo(indexRef.current + (delta < 0 ? 1 : -1))
          }}
        >
          <div className="carouselStage" style={{ transform: `translateX(${-100 * clampIndex(index, count)}%)` }}>
            {items.map((item) => (
              <article key={item.title} className="carouselSlide">
                <div className="carouselLeft">
                  <p className="carouselEyebrow">{item.eyebrow}</p>
                  <a className="carouselTitleLink" href={item.href} target="_blank" rel="noreferrer">
                    <h2 className="carouselTitle">{item.title}</h2>
                  </a>
                  <p className="carouselDesc">{item.description}</p>
                  <a className="carouselCta" href={item.href} target="_blank" rel="noreferrer">
                    {item.ctaLabel} <span aria-hidden="true">→</span>
                  </a>
                </div>
                <a className="carouselRight" href={item.href} target="_blank" rel="noreferrer" aria-label={`打开：${item.title}`}>
                  <img className="carouselImg" src={item.image} alt="" loading="lazy" />
                </a>
              </article>
            ))}
          </div>

          <div className="carouselControls" aria-label="轮播控制">
            <button
              className="carouselBtn"
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                manualTo(indexRef.current - 1)
              }}
              aria-label="上一条"
            >
              ←
            </button>
            <div className="carouselDots" aria-label="轮播分页">
              {items.map((_, i) => (
                <button
                  key={i}
                  className={`carouselDot ${clampIndex(index, count) === i ? 'isActive' : ''}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    manualTo(i)
                  }}
                  aria-label={`切换到第 ${i + 1} 条`}
                />
              ))}
            </div>
            <button
              className="carouselBtn"
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                manualTo(indexRef.current + 1)
              }}
              aria-label="下一条"
            >
              →
            </button>
          </div>
        </div>

        {/* 便于屏幕阅读器获取当前内容 */}
        <p className="srOnly" aria-live="polite">
          当前：{current?.title}
        </p>
      </div>
    </section>
  )
}

function setupRevealOnScroll() {
  // 轻量滚动进入动画：只在支持时启用
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
          ;(entry.target as HTMLElement).setAttribute('data-revealed', 'true')
          io.unobserve(entry.target)
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
  )
  elements.forEach((el) => io.observe(el))
  return () => io.disconnect()
}

function App() {
  useEffect(() => setupRevealOnScroll(), [])
  const [meritToasts, setMeritToasts] = useState<Array<{ id: string }>>([])
  const toastTimeoutMs = 900
  const toastIdPrefix = useMemo(
    () => `${Math.random().toString(16).slice(2)}-${Date.now().toString(16)}`,
    [],
  )

  return (
    <div className="page">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="回到首页">
          <span className="brandDot" aria-hidden="true" />
          <span className="brandText">{profile.name}</span>
        </a>
        <nav className="nav">
          <a href="#about">关于我</a>
          <a href="#projects">项目</a>
          <a href="#contact">联系</a>
        </nav>
      </header>

      <main>
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
                        const id = `${toastIdPrefix}-${performance.now().toFixed(3)}`
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
                  <img src="/avatar.jpg" alt={profile.avatarAlt} width={132} height={132} />
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

        <section id="about" className="section" aria-label="关于我">
          <div className="container sectionFrame" data-reveal>
            <h2 className="sectionTitle">关于我</h2>
            <p className="sectionLead">
              我专注于将业务原始数据转化为可解释、可决策的可视化结果，结合写作能力输出清晰的分析报告。
            </p>
            <div className="chips">
              {profile.skills.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>

        <CarouselSection
          id="writing"
          ariaLabel="公众号文章"
          items={writingArticles.slice(0, 3).map((p) => ({
            eyebrow: '公众号《明听影思》',
            title: p.name,
            description: p.description,
            image: p.image,
            href: p.links[0]?.href ?? '#',
            ctaLabel: '阅读文章',
          }))}
        />

        <CarouselSection
          id="projects"
          ariaLabel="AI项目"
          items={projects.slice(0, 3).map((p) => ({
            eyebrow: 'AI项目',
            title: p.name,
            description: p.description,
            image: p.image,
            href: p.links[0]?.href ?? '#',
            ctaLabel: '查看项目',
          }))}
        />

        <CarouselSection
          id="reading"
          ariaLabel="阅读即世界"
          items={recentBooks.slice(0, 3).map((p) => ({
            eyebrow: '阅读即世界',
            title: p.name,
            description: p.description,
            image: p.image,
            href: p.links[0]?.href ?? '#',
            ctaLabel: '查看笔记',
          }))}
        />

        <section id="contact" className="section" aria-label="联系方式">
          <div className="container sectionFrame" data-reveal>
            <h2 className="sectionTitle">联系我</h2>
            <p className="sectionLead">
              邮箱：{' '}
              <a className="inlineLink" href={`mailto:${profile.contact.email}`}>
                {profile.contact.email}
              </a>
            </p>
            <p className="sectionLead">
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
