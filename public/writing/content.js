// 咬笔 · 写作作品集 — content.
// 3 articles carry real titles + 金句 (verbatim from the essays). The other 5
// are link-out folders pending titles/quotes from the author (marked needsContent).
window.YAOBI = {
  brand: {
    name: "咬笔",
    account: "明听影思",
    tagline: "在光明中倾听，在阴影中思考。",
    sub: "性别视角，何以改造世界。",
    intro: "这里是公众号《明听影思》的写作档案。两个系列，一些金句，慢慢读。",
    email: "yaobi_07@163.com",
  },
  // 主视觉 / 视差用的大金句（均来自下方真实文章）
  hero: [
    { text: "厕所问题，\n也是一个性别问题。", from: "自由戏 · 厕所与性别" },
    { text: "无需人性，\n只需生产。", from: "到达 · 孕肚与母职" },
    { text: "我们失去的，\n是面对它的语言。", from: "自由戏 · 性解放" },
  ],
  series: [
    {
      id: "freeplay",
      name: "自由戏",
      en: "FREE PLAY",
      blurb: "以性别视角切入当下社会事件，话题不设边界。",
      color: "var(--accent-hot)",
      articles: [
        {
          title: "厕所与性别：我们如何度过更好的三年？",
          quote: "厕所问题，也是一个性别问题。",
          excerpt: "排队、隔间、动线——看似中性的空间设计，处处写着谁被默认、谁被遗忘。",
          cover: "../../assets/writing-cover-1.png",
          tags: ["公共空间", "性别"],
          href: "https://mp.weixin.qq.com/s/f6at7XM9MBYkZ8kH26S0Pw",
        },
        {
          title: "一聊黄的就不痛了，我们是在性解放吗？",
          quote: "真正值得警惕的，不是痛的消失，而是我们失去了面对它的语言。",
          excerpt: "如果「一聊黄就不痛了」，那么值得警惕的，也许不是痛的消失，而是我们失去了面对它的语言。",
          cover: "../../assets/writing-cover-3.png",
          tags: ["性政治", "语言"],
          href: "https://mp.weixin.qq.com/s/ExQ1EwGYoEiSDK6lyqcK2A",
        },
        { title: "", needsContent: true, tags: ["自由戏"], href: "https://mp.weixin.qq.com/s/OjkEdP4ZYLT_g879FkSDNg" },
      ],
    },
{
      id: "arrival",
      name: "到达",
      en: "ARRIVAL",
      blurb: "梳理新近的性别实证研究，结合时事展开分析。",
      color: "var(--cobalt)",
      articles: [
        {
          title: "作为母亲晒「孕肚」，反而更「去人性」？",
          quote: "无需人性，只需生产。",
          excerpt: "这种歌颂带来的，可能只是被架空的「英雄」形象——无需人性，只需生产。",
          cover: "../../assets/writing-cover-2.png",
          tags: ["母职", "身体"],
          href: "https://mp.weixin.qq.com/s/SniRMS2rkwg7xj6-BpdEBQ",
        },
        { title: "", needsContent: true, tags: ["到达"], href: "https://mp.weixin.qq.com/s/J6IRBsYrQj8o7V8xeFBaVw" },
        { title: "", needsContent: true, tags: ["到达"], href: "https://mp.weixin.qq.com/s/qpvFG7EBQnlwz8ikLfLAFA" },
        { title: "", needsContent: true, tags: ["到达"], href: "https://mp.weixin.qq.com/s/xa9yv_M1pCcK5MifQ7XNwQ" },
        { title: "", needsContent: true, tags: ["到达"], href: "https://mp.weixin.qq.com/s/Q7ishmpyAFz8m_amOziMIw" },
      ],
    },
    {
      id: "other",
      name: "其他",
      en: "EARLY WORKS",
      blurb: "更早的书写与练笔——一些起点。",
      color: "var(--ink-night)",
      articles: [
        { title: "", needsContent: true, tags: ["早期"] },
        { title: "", needsContent: true, tags: ["早期"] },
        { title: "", needsContent: true, tags: ["早期"] },
      ],
    },
  ],
};
