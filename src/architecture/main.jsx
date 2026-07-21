import { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react'
import './styles.css'

const asset = (path) => `${import.meta.env.BASE_URL}${path}`
const worldImage = asset('art-direction/00-world-projection-clean.png')
const dockImages = {
  freeplay: asset('art-direction/01-freeplay-projection-clean.png'),
  arrival: asset('art-direction/02-arrival-projection-clean.png'),
  fluidity: asset('art-direction/03-fluidity-projection-clean.png'),
  other: asset('art-direction/04-early-projection-clean.png'),
}

const fallbackSeries = [
  { id: 'freeplay', name: '自由戏', en: 'FREE PLAY', blurb: '以性别视角切入当下社会事件，话题不设边界。', color: '#c94a30', x: .135, y: .325, align: 'right' },
  { id: 'arrival', name: '到达', en: 'ARRIVAL', blurb: '梳理新近的性别实证研究，结合时事展开分析。', color: '#3c7891', x: .335, y: .305, align: 'right' },
  { id: 'fluidity', name: '流动', en: 'FLUIDITY', blurb: '追踪正在发生的变化，让经验、研究与叙事彼此汇流。', color: '#df711c', x: .735, y: .3, align: 'left' },
  { id: 'other', name: '其他', en: 'EARLY WORKS', blurb: '更早的书写与练笔，一些仍在河岸留下痕迹的起点。', color: '#27231f', x: .915, y: .245, align: 'left' },
]

function useCoverPoints(series) {
  const [size, setSize] = useState(() => ({ width: innerWidth, height: innerHeight }))
  useEffect(() => {
    const update = () => setSize({ width: innerWidth, height: innerHeight })
    addEventListener('resize', update)
    return () => removeEventListener('resize', update)
  }, [])

  return useMemo(() => {
    const imageAspect = 16 / 9
    const viewportAspect = size.width / size.height
    const isCompact = size.width <= 760 || matchMedia('(pointer: coarse)').matches
    const isPortrait = isCompact && size.height > size.width
    const displayedWidth = isCompact
      ? (isPortrait ? size.height * imageAspect : size.width)
      : (viewportAspect > imageAspect ? size.width : size.height * imageAspect)
    const displayedHeight = isCompact
      ? (isPortrait ? size.height : size.width / imageAspect)
      : (viewportAspect > imageAspect ? size.width / imageAspect : size.height)
    const offsetX = isCompact ? 0 : (size.width - displayedWidth) / 2
    const offsetY = (size.height - displayedHeight) / 2
    return {
      points: Object.fromEntries(series.map((item) => {
        const mobileY = isPortrait && item.id === 'freeplay' ? .22 : item.y
        return [item.id, {
          left: offsetX + item.x * displayedWidth,
          top: offsetY + mobileY * displayedHeight,
        }]
      })),
      frame: { width: displayedWidth, height: displayedHeight },
      isCompact,
      isPortrait,
    }
  }, [series, size])
}

function BuildingHotspot({ item, index, point, active, onActivate, onLeave, onEnter }) {
  return (
    <button
      type="button"
      className={`building-hotspot is-${item.align} ${active ? 'is-active' : ''}`}
      style={{ left: point.left, top: point.top }}
      onMouseEnter={onActivate}
      onMouseLeave={onLeave}
      onFocus={onActivate}
      onClick={(event) => onEnter(event, item.id)}
      aria-label={`${item.name}，${item.en}`}
    >
      <span className="building-hotspot__annotation">
        <span className="building-hotspot__name">
          <span>{String(index + 1).padStart(2, '0')}</span>
          <strong>{item.name}</strong>
        </span>
        <small>{item.en}</small>
      </span>
    </button>
  )
}

function WorldView({ series, onEnter }) {
  const [active, setActive] = useState(null)
  const [mobileIndex, setMobileIndex] = useState(0)
  const worldRef = useRef(null)
  const { points, frame, isCompact, isPortrait } = useCoverPoints(series)

  useEffect(() => {
    if (!isPortrait || !worldRef.current || !points[series[0]?.id]) return
    worldRef.current.scrollLeft = Math.max(0, points[series[0].id].left - worldRef.current.clientWidth / 2)
  }, [isPortrait, points, series])

  const handleEnter = (event, id) => {
    onEnter(id, event.clientX, event.clientY)
  }

  const syncMobileIndex = () => {
    if (!isPortrait || !worldRef.current) return
    const center = worldRef.current.scrollLeft + worldRef.current.clientWidth / 2
    const nextIndex = series.reduce((closest, item, index) => (
      Math.abs(points[item.id].left - center) < Math.abs(points[series[closest].id].left - center)
        ? index
        : closest
    ), 0)
    setMobileIndex(nextIndex)
  }

  const focusMobileSeries = (index) => {
    const point = points[series[index].id]
    if (!point || !worldRef.current) return
    setMobileIndex(index)
    worldRef.current.scrollTo({
      left: Math.max(0, point.left - worldRef.current.clientWidth / 2),
      behavior: 'smooth',
    })
  }

  return (
    <section
      ref={worldRef}
      className={`world-view ${active ? 'has-active' : ''} ${isPortrait ? 'is-mobile-river' : ''}`}
      onScroll={syncMobileIndex}
    >
      <img
        className="world-view__image"
        src={worldImage}
        alt="河流连接着四座建筑展馆"
        style={isCompact ? { width: frame.width, height: frame.height } : undefined}
      />
      <div className="world-view__glint" />
      {series.map((item, index) => points[item.id] && (
        <BuildingHotspot
          key={item.id}
          item={item}
          index={index}
          point={points[item.id]}
          active={active === item.id || (isPortrait && mobileIndex === index)}
          onActivate={() => setActive(item.id)}
          onLeave={() => setActive(null)}
          onEnter={handleEnter}
        />
      ))}
      {isPortrait && (
        <nav className="mobile-world-nav" aria-label="系列导航">
          {series.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={mobileIndex === index ? 'is-active' : ''}
              onClick={() => focusMobileSeries(index)}
              aria-label={`前往${item.name}`}
            >
              {String(index + 1).padStart(2, '0')}
            </button>
          ))}
        </nav>
      )}
    </section>
  )
}

function ArticlePreview({ article, series, onClose }) {
  const isPortraitCover = article.coverOrientation === 'portrait' || article.cover.startsWith('/book-')

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }
    addEventListener('keydown', closeOnEscape)
    return () => removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  return (
    <div className={`article-preview is-${series.id} ${isPortraitCover ? 'has-portrait-cover' : 'has-landscape-cover'}`} role="dialog" aria-modal="true" aria-label={`${article.title}预览`}>
      <img className="article-preview__scene" src={dockImages[series.id]} alt="" />
      <button className="article-preview__scrim" type="button" onClick={onClose} aria-label="关闭预览" />
      <article className="article-preview__sheet">
        <button className="article-preview__close" type="button" onClick={onClose} title="关闭预览"><X /></button>
        <div className="article-preview__cover">
          <img src={asset(article.cover.replace(/^\//, ''))} alt={article.title} />
        </div>
        <div className="article-preview__copy">
          <span>{series.name} / {series.en}</span>
          <h2>{article.title}</h2>
          <blockquote>“{article.quote}”</blockquote>
          <small>{article.tags.join(' / ')}</small>
          {article.href && (
            <a href={article.href} target="_blank" rel="noreferrer">
              阅读原文
              <ArrowUpRight />
            </a>
          )}
        </div>
      </article>
    </div>
  )
}

function DockView({ series, articles, onBack }) {
  const [preview, setPreview] = useState(null)
  const [scrollState, setScrollState] = useState({ left: false, right: false, progress: 0 })
  const listRef = useRef(null)

  const updateScrollState = () => {
    const list = listRef.current
    if (!list) return
    const max = Math.max(0, list.scrollWidth - list.clientWidth)
    setScrollState({
      left: list.scrollLeft > 2,
      right: list.scrollLeft < max - 2,
      progress: max ? list.scrollLeft / max : 0,
    })
  }

  useEffect(() => {
    const frame = requestAnimationFrame(updateScrollState)
    addEventListener('resize', updateScrollState)
    return () => {
      cancelAnimationFrame(frame)
      removeEventListener('resize', updateScrollState)
    }
  }, [articles])

  const scrollArticles = (direction) => {
    const list = listRef.current
    if (!list) return
    list.scrollBy({ left: direction * list.clientWidth * .72, behavior: 'smooth' })
  }

  return (
    <section className="dock-view">
      <img className="dock-view__image" src={dockImages[series.id]} alt={`${series.name}码头展馆`} />
      <div className="dock-view__glint" />
      <button className="dock-view__back" type="button" onClick={onBack} title="返回河流目录"><X /></button>
      <div className="dock-view__identity">
        <span>{series.en}</span>
        <h1>{series.name}</h1>
        <p>{series.blurb}</p>
      </div>
      <div className="exhibition-band">
        <div className="exhibition-band__label">
          <span>CURRENT</span>
          <strong>{String(articles.length).padStart(2, '0')}</strong>
          <small>篇文章正在展出</small>
        </div>
        <div className="exhibition-band__list" ref={listRef} onScroll={updateScrollState}>
          {articles.map((article, index) => {
            const isPortraitCover = article.coverOrientation === 'portrait' || article.cover.startsWith('/book-')
            return (
              <button
                key={article.id}
                className={`exhibition-item ${isPortraitCover ? 'is-portrait-cover' : 'is-landscape-cover'}`}
                type="button"
                onClick={() => setPreview(article)}
                aria-label={`预览：${article.title}`}
              >
                <img src={asset(article.cover.replace(/^\//, ''))} alt="" />
                <div>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h2>{article.title}</h2>
                  <p>“{article.quote}”</p>
                  <small>{article.tags.join(' / ')}</small>
                </div>
                <ArrowUpRight />
              </button>
            )
          })}
        </div>
        {(scrollState.left || scrollState.right) && (
          <div className="exhibition-scroll">
            <button type="button" onClick={() => scrollArticles(-1)} disabled={!scrollState.left} title="向左浏览">
              <ChevronLeft />
            </button>
            <span className="exhibition-scroll__track">
              <i style={{ transform: `translateX(${scrollState.progress * 42}px)` }} />
            </span>
            <button type="button" onClick={() => scrollArticles(1)} disabled={!scrollState.right} title="向右浏览">
              <ChevronRight />
            </button>
          </div>
        )}
      </div>
      {preview && <ArticlePreview article={preview} series={series} onClose={() => setPreview(null)} />}
    </section>
  )
}

function InkTransition({ transition, series }) {
  if (!transition) return null
  const item = series.find((entry) => entry.id === transition.id)
  return (
    <div className={`ink-transition is-${transition.id} is-${transition.direction}`} style={{ '--origin-x': `${transition.x}px`, '--origin-y': `${transition.y}px`, '--accent': item?.color }}>
      <div className="ink-transition__motif" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="ink-transition__label">
        <small>{transition.direction === 'leave' ? 'RETURNING' : 'ENTERING'}</small>
        <strong>{item?.name}</strong>
        <span>{item?.en}</span>
      </div>
    </div>
  )
}

function App() {
  const [series, setSeries] = useState(fallbackSeries)
  const [articles, setArticles] = useState([])
  const [scene, setScene] = useState('world')
  const [transition, setTransition] = useState(null)

  useEffect(() => {
    Promise.all([
      fetch(asset('data/series.json')).then((response) => response.json()),
      fetch(asset('data/articles.json')).then((response) => response.json()),
    ]).then(([seriesData, articleData]) => {
      setSeries(fallbackSeries.map((fallback) => ({ ...fallback, ...seriesData.find((item) => item.id === fallback.id), x: fallback.x, y: fallback.y, align: fallback.align })))
      setArticles(articleData)
    })
    Object.values(dockImages).forEach((src) => { const image = new Image(); image.src = src })
  }, [])

  const enter = (id, x, y) => {
    if (transition) return
    setTransition({ id, x, y, direction: 'enter' })
    setTimeout(() => setScene(id), 620)
    setTimeout(() => setTransition(null), 1400)
  }
  const back = () => {
    const x = innerWidth - 42
    const y = 42
    setTransition({ id: scene, x, y, direction: 'leave' })
    setTimeout(() => setScene('world'), 620)
    setTimeout(() => setTransition(null), 1400)
  }

  const currentSeries = series.find((item) => item.id === scene)
  const currentArticles = articles.filter((article) => article.seriesId === scene)

  return (
    <main className="architecture-shell">
      {scene === 'world' && (
        <header className="architecture-header">
          <div><strong>流动</strong><span>FLUIDITY</span></div>
          <a href="./" title="返回网站首页"><ArrowLeft /></a>
        </header>
      )}
      {scene === 'world' ? <WorldView series={series} onEnter={enter} /> : <DockView series={currentSeries} articles={currentArticles} onBack={back} />}
      <InkTransition transition={transition} series={series} />
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
