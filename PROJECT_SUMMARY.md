# 📸 拍立得相机 - EdgeOne 部署项目总结

## 项目概述

这是一个完整的拍立得相机 Web 应用，已经准备好部署到腾讯云 EdgeOne Pages。

**项目特点：**
- ✅ 前后端分离架构
- ✅ API Token 安全存储在云函数中
- ✅ 自动化部署流程
- ✅ 完整的文档和检查清单

## 📁 项目文件说明

### 核心文件

| 文件 | 说明 | 是否上传到 GitHub |
|------|------|------------------|
| `index.html` | 前端主应用（包含所有 HTML/CSS/JS） | ✅ 是 |
| `server.js` | 本地开发服务器（可选） | ✅ 是 |
| `package.json` | 项目依赖配置 | ✅ 是 |
| `.env.example` | 环境变量示例 | ✅ 是 |

### 部署相关文件

| 文件 | 说明 | 是否上传到 GitHub |
|------|------|------------------|
| `scf/index.js` | 腾讯云云函数代码（后端 API） | ✅ 是 |
| `scf/package.json` | 云函数依赖配置 | ✅ 是 |
| `.github/workflows/deploy.yml` | GitHub Actions 自动化部署 | ✅ 是 |
| `EDGEONE_DEPLOYMENT.md` | 详细部署指南 | ❌ 否（.gitignore） |
| `QUICK_START.md` | 快速开始指南 | ✅ 是 |
| `SETUP_CHECKLIST.md` | 部署检查清单 | ✅ 是 |

### 本地开发文件（不上传）

- `api/generate.js` - EdgeOne 边缘函数版本（备用）
- `.env` - 本地环境变量（包含敏感信息）
- `node_modules/` - 依赖包

## 🚀 快速部署流程

### 方法一：使用快速指南（推荐新手）

1. 打开 `QUICK_START.md`
2. 按照 5 个步骤操作
3. 30 分钟内完成部署

### 方法二：使用详细指南（推荐有经验的用户）

1. 打开 `EDGEONE_DEPLOYMENT.md`
2. 按照详细步骤操作
3. 了解每个步骤的原理

### 方法三：使用检查清单（确保不遗漏）

1. 打开 `SETUP_CHECKLIST.md`
2. 逐项检查完成情况
3. 确保所有配置正确

## 🔐 安全说明

### API Token 管理

- ✅ **不要**将 Coze API Token 提交到 GitHub
- ✅ API Token 存储在腾讯云函数的环境变量中
- ✅ 前端通过 API 网关调用云函数，不直接暴露 Token

### 环境变量配置

**本地开发：**
```bash
# 创建 .env 文件（不上传到 GitHub）
COZE_API_TOKEN=your_token_here
PORT=3001
```

**生产环境：**
- 在腾讯云云函数控制台配置环境变量
- 变量名：`COZE_API_TOKEN`
- 变量值：你的实际 Token

## 📊 部署架构

```
┌─────────────────────────────────────────┐
│           用户浏览器                      │
└─────────────────┬───────────────────────┘
                  │ HTTPS
                  ▼
┌─────────────────────────────────────────┐
│        EdgeOne Pages                    │
│  (前端静态文件托管)                       │
│  - index.html                           │
│  - 加速访问                              │
│  - CDN 分发                             │
└─────────────────┬───────────────────────┘
                  │ API 请求
                  ▼
┌─────────────────────────────────────────┐
│        API 网关                          │
│  - 路径: /api/generate                  │
│  - 鉴权: 免鉴成/密钥                     │
│  - CORS 配置                            │
└─────────────────┬───────────────────────┘
                  │ 触发
                  ▼
┌─────────────────────────────────────────┐
│        云函数 SCF                        │
│  - 运行环境: Node.js 16.13              │
│  - 代码: scf/index.js                   │
│  - 环境变量: COZE_API_TOKEN             │
└─────────────────┬───────────────────────┘
                  │ HTTPS 调用
                  ▼
┌─────────────────────────────────────────┐
│        Coze API                         │
│  - 图片生成服务                          │
│  - 海马体证件照                         │
└─────────────────────────────────────────┘
```

## 📝 部署步骤总结

### 第 1 步：创建 GitHub 仓库
```bash
# 1. 在 GitHub 创建新仓库
# 2. 在项目目录执行
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/instax-camera-web.git
git push -u origin main
```

### 第 2 步：创建云函数
1. 访问腾讯云 SCF 控制台
2. 创建函数 `instax-camera-api`
3. 复制 `scf/index.js` 内容
4. 配置环境变量 `COZE_API_TOKEN`
5. 创建 API 网关触发器
6. 复制 API 访问地址

### 第 3 步：更新前端 API 地址
1. 编辑 `index.html`
2. 修改 API 地址为云函数地址
3. 提交到 GitHub

### 第 4 步：部署到 EdgeOne
1. 访问 EdgeOne 控制台
2. 创建站点并连接 GitHub
3. 点击部署
4. 等待完成

### 第 5 步：测试
1. 访问网站
2. 测试拍照功能
3. 确认 API 调用成功

## 💰 成本估算

| 服务 | 免费额度 | 超出费用 |
|------|---------|---------|
| EdgeOne Pages | 100GB/月 流量 | ¥0.21/GB |
| 云函数 SCF | 100 万次调用/月 | ¥0.0000167/次 |
| API 网关 | 100 万次调用/月 | ¥0.0033/万次 |

**个人使用完全免费！**

## 🛠️ 本地开发

### 安装依赖
```bash
npm install
```

### 配置环境变量
```bash
# 复制示例文件
cp .env.example .env

# 编辑 .env 文件，填入你的 Coze API Token
```

### 启动本地服务器
```bash
# 方法一：使用 Node.js 服务器
npm start

# 方法二：使用 Python 服务器
python3 -m http.server 8000

# 方法三：使用 http-server
npx http-server -p 8000
```

访问：http://localhost:3001 或 http://localhost:8000

## 🔄 更新和维护

### 更新应用
```bash
# 1. 修改代码
# 2. 提交到 GitHub
git add .
git commit -m "Update description"
git push

# 3. EdgeOne 会自动部署
```

### 监控和日志
- **云函数日志**：SCF 控制台 → 函数日志
- **EdgeOne 日志**：EdgeOne 控制台 → 站点日志
- **API 调用统计**：API 网关控制台

## 🆘 常见问题

### Q: API 调用失败怎么办？
A:
1. 检查云函数是否正确部署
2. 确认环境变量已配置
3. 查看 SCF 日志
4. 检查 API 网关触发器状态

### Q: 前端无法连接后端？
A:
1. 确认 API 地址正确
2. 在 API 网关配置 CORS
3. 检查浏览器控制台错误信息

### Q: EdgeOne 部署失败？
A:
1. 确认 GitHub 仓库连接成功
2. 检查分支名称为 `main`
3. 查看 EdgeOne 部署日志

### Q: 如何更新 Coze API Token？
A:
1. 访问 SCF 控制台
2. 编辑函数环境变量
3. 更新 `COZE_API_TOKEN` 的值
4. 保存并重新部署函数

## 📞 获取帮助

- **EdgeOne 文档**：https://cloud.tencent.com/document/product/1552
- **云函数文档**：https://cloud.tencent.com/document/product/583
- **API 网关文档**：https://cloud.tencent.com/document/product/628
- **GitHub Issues**：在你的仓库提交问题

## 🎉 开始部署

选择一个指南开始：

1. **新手推荐**：打开 `QUICK_START.md`
2. **详细步骤**：打开 `EDGEONE_DEPLOYMENT.md`
3. **检查清单**：打开 `SETUP_CHECKLIST.md`

---

**祝你部署顺利！** 📸✨

如有问题，请参考详细文档或联系技术支持。
