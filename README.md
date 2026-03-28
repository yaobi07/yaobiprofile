# 个人作品集网站

深色、简洁现代风格的个人作品集网站（首页 / 关于我 / 项目展示 / 联系方式），包含平滑滚动与滚动进入动效，移动端自适应。

## 开发

在项目目录下执行：

```bash
npm install
npm run dev
```

然后打开 `http://localhost:5173/`。

## 打包

```bash
npm run build
npm run preview
```

## 如何替换为你的内容

- **个人信息与技能**：编辑 `src/App.tsx` 里的 `profile`
- **项目列表**：编辑 `src/App.tsx` 里的 `projects`
- **头像与项目截图**：
  - 头像：`public/avatar.svg`
  - 项目占位图：`public/project-1.svg` / `public/project-2.svg` / `public/project-3.svg`
  - 你也可以把这些文件替换成自己的真实截图（保持同名即可）

## 部署建议

- **GitHub Pages / Vercel / Netlify** 都可以直接部署 `npm run build` 产物（`dist/`）。
