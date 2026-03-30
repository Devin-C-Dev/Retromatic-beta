const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env.local'), quiet: true });
dotenv.config({ path: path.join(__dirname, '.env'), quiet: true });

const app = express();
const PORT = Number(process.env.PORT || 3001);
const STATIC_DIR = __dirname;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(STATIC_DIR));

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    port: PORT,
    message: '拍立得相机服务运行中'
  });
});

// Coze API 代理路由
app.post('/api/generate', async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        error: '缺少图片数据'
      });
    }

    // 从环境变量获取 Coze API Token
    const cozeApiToken = process.env.COZE_API_TOKEN;
    if (!cozeApiToken) {
      console.error('未设置 COZE_API_TOKEN 环境变量');
      return res.status(500).json({
        success: false,
        error: '服务器配置错误：未设置 API Token'
      });
    }

    console.log('📤 调用 Coze API...');

    // 调用 Coze API (海马体证件照)
    const cozeResponse = await fetch('https://wzd4ygmd58.coze.site/run', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cozeApiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_photo: {
          url: image,
          file_type: 'image'
        }
      })
    });

    console.log('📥 Coze API 响应状态:', cozeResponse.status);

    if (!cozeResponse.ok) {
      const errorText = await cozeResponse.text();
      console.error('Coze API 错误响应:', errorText);
      throw new Error(`Coze API 调用失败: ${cozeResponse.status} ${errorText}`);
    }

    const cozeResult = await cozeResponse.json();
    console.log('✅ Coze API 调用成功');
    console.log('📦 Coze API 返回数据:', JSON.stringify(cozeResult, null, 2));

    // 返回成功响应
    // 提取 Coze API 生成的图片
    let generatedImageUrl = image; // 默认使用原始图片

    // 根据实际的 API 返回格式提取图片
    if (cozeResult.generated_photo && cozeResult.generated_photo.url) {
      // 海马体证件照 API 格式: { generated_photo: { url: "..." } }
      generatedImageUrl = cozeResult.generated_photo.url;
      console.log('✅ 找到 Coze 生成的海马体证件照 URL');
    } else if (cozeResult.data && cozeResult.data.generated_photo && cozeResult.data.generated_photo.url) {
      // 海马体证件照 API 格式（嵌套）: { data: { generated_photo: { url: "..." } } }
      generatedImageUrl = cozeResult.data.generated_photo.url;
      console.log('✅ 找到 Coze 生成的海马体证件照 URL (嵌套格式)');
    } else if (cozeResult.output_photo && cozeResult.output_photo.url) {
      // Coze API 直接返回格式: { output_photo: { url: "..." } }
      generatedImageUrl = cozeResult.output_photo.url;
      console.log('✅ 找到 Coze 生成的图片 URL (直接格式)');
    } else if (cozeResult.data && cozeResult.data.output_photo && cozeResult.data.output_photo.url) {
      // Coze API 返回格式: { data: { output_photo: { url: "..." } } }
      generatedImageUrl = cozeResult.data.output_photo.url;
      console.log('✅ 找到 Coze 生成的图片 URL (嵌套格式)');
    } else if (cozeResult.data && cozeResult.data.output) {
      generatedImageUrl = cozeResult.data.output;
    } else if (cozeResult.output) {
      generatedImageUrl = cozeResult.output;
    } else if (cozeResult.url) {
      generatedImageUrl = cozeResult.url;
    } else if (cozeResult.image_url) {
      generatedImageUrl = cozeResult.image_url;
    }

    console.log('🖼️ 最终使用的图片 URL:', generatedImageUrl.substring(0, 100));

    res.json({
      success: true,
      imageUrl: generatedImageUrl,
      data: cozeResult
    });

  } catch (error) {
    console.error('❌ /api/generate 错误:', error);
    res.status(500).json({
      success: false,
      error: error.message || '生成失败'
    });
  }
});

app.listen(PORT, () => {
  console.log('');
  console.log('=================================');
  console.log('拍立得相机服务运行中');
  console.log(`Local URL: http://localhost:${PORT}`);
  console.log(`Health URL: http://localhost:${PORT}/api/health`);
  console.log('=================================');
  console.log('');
});
