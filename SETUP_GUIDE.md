# 拍立得相机 - Coze API 集成配置指南

## 🎉 新功能

本项目已集成 **Coze API**，支持调用 AI 服务生成照片，并将滤镜从黑白改为**拍立得青色调（彩色偏青）**。

## 📋 配置步骤

### 1. 设置 Coze API Token

1. 复制 `.env.example` 文件并重命名为 `.env`：
   ```bash
   cp .env.example .env
   ```

2. 在 `.env` 文件中设置你的 Coze API Token：
   ```
   COZE_API_TOKEN=your_actual_token_here
   PORT=3001
   ```

### 2. 安装依赖（如果还没有安装）

```bash
npm install
```

### 3. 启动服务

```bash
npm start
```

或者使用开发模式（如果配置了）：
```bash
npm run dev
```

### 4. 访问应用

打开浏览器访问：`http://localhost:3001`

## 🎨 滤镜说明

### 新滤镜：拍立得青色调（彩色偏青）

- **特点**：保留照片色彩，整体偏青色调
- **效果**：
  - 亮度提升 8%
  - 对比度微调 +2%
  - 饱和度降低 5%
  - 添加淡褐色效果 5%
  - 色相旋转 -5°（偏青）

### 滤镜效果示例

```css
filter: brightness(1.08)
        contrast(1.02)
        saturate(0.95)
        sepia(0.05)
        hue-rotate(-5deg);
```

## 🔧 API 说明

### Coze API 调用示例

```bash
curl --location --request POST 'https://rcj7hn5pzh.coze.site/run' \
  --header 'Authorization: Bearer <YOUR_TOKEN>' \
  --header 'Content-Type: application/json' \
  --data '{
    "input_photo": {
      "url": "data:image/jpeg;base64,...",
      "file_type": "image/jpeg"
    }
  }'
```

### 服务器端代理

服务器通过 `/api/generate` 路由代理请求到 Coze API，确保安全性：

```javascript
POST /api/generate
{
  "image": "base64_encoded_image_data"
}

Response:
{
  "success": true,
  "imageUrl": "...",
  "data": {...}
}
```

## 📸 使用流程

1. **开启摄像头**：允许浏览器访问摄像头
2. **拍照**：点击快门按钮
3. **API 处理**：自动调用 Coze API 处理照片
4. **显影**：相纸吐出，显示拍立得青色调效果
5. **摇晃加速**：在显影过程中可以摇晃手机或点击屏幕加速
6. **保存/下载**：显影完成后可以下载照片

## ⚠️ 注意事项

1. **API Token 安全**：不要将 `.env` 文件提交到版本控制系统
2. **API 失败处理**：如果 Coze API 调用失败，系统会自动使用原始照片继续显影流程
3. **图片格式**：当前支持 JPEG 格式，base64 编码

## 🐛 故障排查

### API 调用失败

- 检查 `.env` 文件中的 `COZE_API_TOKEN` 是否正确
- 查看服务器控制台的错误日志
- 确认网络连接正常

### 滤镜效果不生效

- 清除浏览器缓存（Ctrl+Shift+Delete）
- 强制刷新页面（Ctrl+F5）
- 检查浏览器控制台是否有 JavaScript 错误

## 📝 更新日志

### v2.1.0 (当前版本)
- ✨ 集成 Coze API
- 🎨 将黑白滤镜改为拍立得青色调（彩色偏青）
- 🔧 添加服务器端 API 代理
- 📝 添加配置指南文档

---

如有问题，请查看控制台日志或联系技术支持。
