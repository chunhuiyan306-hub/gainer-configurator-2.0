# Gainer 铝框配置器

React + Vite + Zustand。本地开发：`npm install` → `npm run dev`。

## 线上地址与仓库

| 用途 | 链接 |
|------|------|
| **GitHub 源码** | [chunhuiyan306-hub/gainer-configurator-2.0](https://github.com/chunhuiyan306-hub/gainer-configurator-2.0) |
| **Vercel 控制台** | [gainer-configurator-v2 项目设置](https://vercel.com/ryans-projects-1cb85f25/gainer-configurator-v2) |
| **生产站点** | 部署成功后一般为 `https://gainer-configurator-v2.vercel.app`（以 Vercel 项目 Domains 为准） |

Vercel 已与上述 GitHub 仓库 **Connect Git**：只要向 **`main`** 分支推送新提交，就会自动触发构建与部署。

---

## 每次改完代码后：推到 GitHub（必做）

在项目根目录执行：

```bash
git add -A
git commit -m "说明这次改了什么"
git push origin main
```

推送成功后，到 [Vercel Deployments](https://vercel.com/ryans-projects-1cb85f25/gainer-configurator-v2) 可看到新的构建；一般 1～2 分钟内线上更新。

> 在 Cursor 里让 AI 改代码时，可直接说「改完帮我 push 到 GitHub」，助手会按项目规则尽量执行 `git add` / `commit` / `push`（若本机未登录 GitHub，需你在终端自行 `git push`）。

---

## 首次克隆后

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

输出目录：`dist`（与 Vercel 默认一致）。

若构建失败，可在 Vercel **Settings → General → Node.js Version** 选择 **20.x**。
