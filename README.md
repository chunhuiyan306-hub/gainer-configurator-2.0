# Gainer 铝框配置器

React + Vite + Zustand。本地开发：`npm install` → `npm run dev`。

## 部署到 Vercel（通过 GitHub）

1. **在 GitHub 新建仓库**（例如 `gainer-configurator`），不要勾选添加 README（本地已有代码时）。

2. **把本项目推上去**（在项目根目录执行，把 `你的用户名` 和仓库名改成自己的）：

   ```bash
   git init
   git add .
   git commit -m "Initial commit: Gainer configurator"
   git branch -M main
   git remote add origin https://github.com/你的用户名/gainer-configurator.git
   git push -u origin main
   ```

3. 打开 [vercel.com](https://vercel.com)，用 GitHub 登录。

4. **Add New Project** → 选中刚建的仓库 → **Import**。

5. 保持默认即可（Vercel 会识别 Vite：`Build Command` = `npm run build`，`Output` = `dist`）。点 **Deploy**。

6. 部署完成后，页面会给出 **`https://xxx.vercel.app`** 这类网址，那就是可访问的线上地址。

若构建失败，在 Vercel 项目 **Settings → General → Node.js Version** 里选 **20.x** 再试一次。
