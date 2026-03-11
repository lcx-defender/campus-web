# Campus Web (校园综合服务 Web 端)

基于 Vue 3 + TypeScript + Vite 构建的校园前端项目，提供高效、流畅的现代化 Web 交互体验。

## 特性

- **最新技术栈**：基于 Vue 3 (Composition API)、Vite 6 极速构建。
- **类型安全**：采用 TypeScript 进行强类型开发。
- **状态管理**：使用 Pinia + `pinia-plugin-persistedstate` 进行状态管理及本地持久化。
- **UI 组件库**：接入 Element Plus，并结合 `@heroicons/vue` 及内置的 SVG 图标方案集成了丰富的 UI 组件。
- **网络请求**：基于 Axios 封装了规范的 HTTP 请求拦截器。
- **文章/动态渲染**：集成 `marked` + `highlight.js` 实现 Markdown 高级渲染与代码高亮，同时使用 `dompurify` 预防 XSS 攻击。
- **实用功能**：内置 `vue-cropper`（图片裁剪）、`nprogress`（顶部进度条）、`dayjs`（时间处理）等高质量工具库。

## 技术栈

- **核心**：[Vue 3](https://cn.vuejs.org/) / [Vite](https://cn.vitejs.dev/) / [TypeScript](https://www.typescriptlang.org/)
- **路由**：[Vue Router 4](https://router.vuejs.org/zh/)
- **状态管理**：[Pinia](https://pinia.vuejs.org/zh/)
- **UI 框架**：[Element Plus](https://element-plus.gitee.io/zh-CN/)
- **样式**：Sass (SCSS) / CSS 变量

## 快速开始

### 1. 环境准备

请确保您的本地环境中已安装 [Node.js](https://nodejs.org/) (推荐 v18 或更高版本)，建议使用 `pnpm` 或 `npm` 进行依赖管理。

### 2. 克隆项目

```bash
git clone https://github.com/lcx-defender/campus-web.git
cd campus-web
```

### 3. 安装依赖

```bash
npm install
# 或者使用 pnpm (推荐)
# pnpm install
```

### 4. 本地运行

```bash
npm run dev
# 或者 pnpm dev
```
项目将在本地启动开发服务器，可通过终端输出的 `http://localhost:80` 地址进行访问。

### 5. 生产构建

```bash
npm run build
```
构建成功后，静态文件将输出到 `dist` 目录中，可直接部署至 Nginx 或各大云服务的静态托管上。您也可以使用 `npm run preview` 在本地预览构建后的产物。

## 目录结构

```text
campus-web/
├── public/              # 静态资源（不经过 Vite 编译的资源）
├── src/                 # 源代码目录
│   ├── api/             # 接口请求定义目录 (Axios 封装等)
│   ├── assets/          # 静态资源（会被 Vite 处理的图片、样式等）
│   ├── components/      # 公共业务组件
│   ├── layout/          # 页面基础布局
│   ├── router/          # Vue Router 路由配置
│   ├── store/           # Pinia 状态管理
│   ├── utils/           # 全局工具函数
│   ├── views/           # 所有路由页面组件
│   ├── App.vue          # 根组件
│   └── main.ts          # 项目入口文件
├── index.html           # HTML 模板入口
├── package.json         # 项目依赖及 scripts 脚本
└── vite.config.ts       # Vite 构建配置
```

## 参与贡献

1. Fork 本仓库
2. 创建您的 Feature 分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的修改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request (PR)

## 开源协议

MIT License.