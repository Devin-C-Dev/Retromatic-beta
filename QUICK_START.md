# 快速部署指南 - 拍立得相机 Web 应用

这个指南会帮助你在 30 分钟内完成部署到腾讯云 EdgeOne Pages。

## 📦 前置准备

### 1. 所需账号
- [x] GitHub 账号（用于代码托管）
- [x] 腾讯云账号（用于 EdgeOne 和云函数）
- [x] Coze API Token（用于图片生成）

### 2. 所需工具
- [x] Git（版本控制）
- [x] 浏览器（Chrome/Edge/Safari）

## 🚀 部署流程（5 个步骤）

### 步骤 1：创建 GitHub 仓库（5 分钟）

1. 访问 https://github.com/new
2. 创建新仓库：
   - Repository name: `instax-camera-web`
   - Public 或 Private（选择 Public 可以免费部署）
3. 点击 "Create repository"

在项目目录执行：
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/instax-camera-web.git
git branch -M main
git push -u origin main
```

### 步骤 2：创建云函数（10 分钟）

1. 访问 https://console.cloud.tencent.com/scf
2. 点击 "新建" → "从头开始"
3. 配置：
   - 函数名称：`instax-camera-api`
   - 运行环境：Node.js 16.13
   - 地域：上海（或选择离你最近的）
4. 点击 "下一步"

5. 在函数编辑器中：
   - 复制 `scf/index.js` 的内容粘贴进去
   - 点击 "保存"

6. 配置环境变量：
   - 点击 "配置" → "环境变量"
   - 添加：
     ```
     名称: COZE_API_TOKEN
     值: 你的 Coze API Token
     ```
   - 点击 "保存"

7. 创建 API 网关触发器：
   - 点击 "触发管理" → "创建触发器"
   - 触发方式：API 网关触发
   - API 服务类型：新建
   - 请求方法：POST
   - 路径：`/api/generate`
   - 鉴权类型：免鉴权
   - 点击 "提交"

8. 复制 API 地址：
   - 在触发器列表中找到 API 网关触发器
   - 点击 "访问路径"
   - 复制完整的 URL（格式：`https://service-xxx.gz.apigw.tencentcs.com/api/generate`）

### 步骤 3：更新前端 API 地址（2 分钟）

1. 在项目目录找到 `index.html`
2. 搜索：`fetch('/api/generate'`
3. 修改为：
   ```javascript
   fetch('https://YOUR_API_URL/api/generate', {
   ```
   替换 `YOUR_API_URL` 为步骤 2 中复制的 API 地址（去掉 `/api/generate` 部分）

4. 提交到 GitHub：
   ```bash
   git add index.html
   git commit -m "Update API endpoint"
   git push
   ```

### 步骤 4：部署到 EdgeOne Pages（10 分钟）

1. 访问 https://console.cloud.tencent.com/edgeone
2. 点击 "添加站点"
3. 配置：
   - 站点类型：静态网站托管
   - 站点名称：`instax-camera`
   - 绑定域名：
     - 如果有域名，输入你的域名
     - 如果没有，使用 EdgeOne 提供的免费测试域名
4. 点击 "提交"

5. 配置部署源：
   - 在站点详情页，点击 "部署管理"
   - 部署源：GitHub
   - 点击 "授权" GitHub
   - 选择 `instax-camera-web` 仓库
   - 分支：`main`
   - 点击 "保存"

6. 点击 "立即部署"
7. 等待 1-2 分钟，部署完成

### 步骤 5：测试（3 分钟）

1. 访问 EdgeOne 提供的访问地址
2. 允许摄像头权限
3. 拍摄一张照片
4. 等待生成完成
5. ✅ 成功！

## 🎉 完成！

你的拍立得相机应用已经成功部署到腾讯云 EdgeOne Pages！

### 访问地址
- EdgeOne 提供的测试域名
- 或者你配置的自定义域名

### 管理地址
- GitHub：https://github.com/YOUR_USERNAME/instax-camera-web
- EdgeOne：https://console.cloud.tencent.com/edgeone
- 云函数：https://console.cloud.tencent.com/scf

## 🔄 更新应用

当你要更新应用时：

1. 修改代码
2. 提交到 GitHub：
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```
3. EdgeOne 会自动检测更新并部署

## 💰 费用说明

- **EdgeOne Pages**：免费 100GB/月流量
- **云函数 SCF**：免费 100 万次调用/月
- **API 网关**：免费 100 万次调用/月

个人使用完全免费！

## 🆘 遇到问题？

### API 调用失败
1. 检查云函数是否部署成功
2. 确认环境变量 `COZE_API_TOKEN` 已配置
3. 在云函数控制台查看日志

### 前端无法连接 API
1. 检查 API 地址是否正确
2. 在 API 网关控制台配置 CORS：
   - Allow-Origin: `*`
   - Allow-Methods: `POST, GET, OPTIONS`
   - Allow-Headers: `Content-Type, Authorization`

### EdgeOne 部署失败
1. 确认 GitHub 仓库连接成功
2. 检查分支名称是否为 `main`
3. 查看 EdgeOne 部署日志

## 📞 获取帮助

- EdgeOne 文档：https://cloud.tencent.com/document/product/1552
- 云函数文档：https://cloud.tencent.com/document/product/583
- 或在 GitHub 提交 Issue

---

**祝你部署顺利！** 📸✨
