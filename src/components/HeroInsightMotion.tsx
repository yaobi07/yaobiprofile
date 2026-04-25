import { useId } from 'react'

/**
 * CTA 行右侧小装饰：原创 SVG 小人 + CSS 动画（挥手、弹跳、眨眼），无外部素材。
 */
export function HeroInsightMotion() {
  const uid = useId().replace(/:/g, '')
  const skin = `hi-skin-${uid}`
  const shirt = `hi-shirt-${uid}`
  const hair = `hi-hair-${uid}`

  return (
    <div className="heroInsightMotionRoot">
      <div className="heroInsightCanvas" aria-hidden="true">
        <svg className="heroInsightScene" viewBox="0 0 140 118" aria-hidden="true">
          <defs>
            <linearGradient id={skin} x1="52" y1="38" x2="88" y2="78" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffe8d9" />
              <stop offset="1" stopColor="#ffd4bc" />
            </linearGradient>
            <linearGradient id={shirt} x1="40" y1="96" x2="100" y2="72" gradientUnits="userSpaceOnUse">
              <stop stopColor="#b8e0ff" />
              <stop offset="1" stopColor="#7ec8e3" />
            </linearGradient>
            <linearGradient id={hair} x1="58" y1="28" x2="82" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4a3728" />
              <stop offset="1" stopColor="#2d2118" />
            </linearGradient>
          </defs>

          <rect className="hi-panel-bg" x="4" y="4" width="132" height="110" rx="20" fill="#fff7f2" stroke="rgba(28,25,23,0.1)" strokeWidth="1" />

          <g className="hi-stars" opacity="0.9">
            <path className="hi-star hi-star-a" d="M22 28l2.2 4.6 5 .8-3.6 3.4 1 4.8-4.4-2.4-4.4 2.4 1-4.8-3.6-3.4 5-.8 2.2-4.6Z" fill="#f4b942" />
            <path className="hi-star hi-star-b" d="M118 22l1.4 3 3.2.5-2.3 2.2.6 3.2-2.9-1.6-2.9 1.6.6-3.2-2.3-2.2 3.2-.5 1.4-3Z" fill="#c54b3c" opacity="0.75" />
            <circle className="hi-dot-pulse" cx="116" cy="88" r="3" fill="#2f4f6f" opacity="0.45" />
          </g>

          <g className="hi-mascot">
            <ellipse className="hi-shadow" cx="70" cy="104" rx="28" ry="5" fill="rgba(28,25,23,0.06)" />

            <g className="hi-body-group">
              <path
                d="M48 78c0-4 4-8 22-8s22 4 22 8v22c0 5-10 9-22 9s-22-4-22-9V78Z"
                fill={`url(#${shirt})`}
                stroke="rgba(47,79,111,0.2)"
                strokeWidth="1"
              />
              <circle cx="70" cy="52" r="26" fill={`url(#${skin})`} stroke="rgba(197,75,60,0.15)" strokeWidth="1" />
              <path
                d="M52 44c4-14 14-22 18-22s14 8 18 22c-6-8-12-10-18-10s-12 2-18 10Z"
                fill={`url(#${hair})`}
              />
              <ellipse className="hi-blush hi-blush-l" cx="56" cy="56" rx="5" ry="3" fill="#ff8b9a" opacity="0.35" />
              <ellipse className="hi-blush hi-blush-r" cx="84" cy="56" rx="5" ry="3" fill="#ff8b9a" opacity="0.35" />

              <g className="hi-eyes">
                <g className="hi-eye hi-eye-l">
                  <ellipse cx="60" cy="52" rx="4" ry="5" fill="#2a2420" />
                  <circle cx="61" cy="50" r="1.4" fill="#fff" opacity="0.95" />
                </g>
                <g className="hi-eye hi-eye-r">
                  <ellipse cx="80" cy="52" rx="4" ry="5" fill="#2a2420" />
                  <circle cx="81" cy="50" r="1.4" fill="#fff" opacity="0.95" />
                </g>
              </g>

              <path
                className="hi-smile"
                d="M62 62c4 5 12 5 16 0"
                fill="none"
                stroke="#c54b3c"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.65"
              />

              <g className="hi-arm-wave">
                <path
                  d="M90 74c12-2 20 4 22 14"
                  fill="none"
                  stroke="#f0c4a8"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <circle cx="114" cy="90" r="7" fill={`url(#${skin})`} stroke="rgba(197,75,60,0.2)" strokeWidth="1" />
              </g>

              <ellipse cx="42" cy="80" rx="7" ry="6" fill={`url(#${skin})`} stroke="rgba(197,75,60,0.15)" strokeWidth="1" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
}
