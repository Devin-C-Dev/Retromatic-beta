// 腾讯云云函数 SCF - Coze API 代理
// 用于处理图片生成请求

const axios = require('axios');

exports.main_handler = async (event, context) => {
  try {
    // 解析请求
    let body = {};

    if (event.body) {
      if (typeof event.body === 'string') {
        body = JSON.parse(event.body);
      } else {
        body = event.body;
      }
    }

    const { image } = body;

    if (!image) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: '缺少图片数据'
        })
      };
    }

    // 从环境变量获取 Coze API Token
    const cozeApiToken = process.env.COZE_API_TOKEN;

    if (!cozeApiToken) {
      console.error('未设置 COZE_API_TOKEN 环境变量');
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: '服务器配置错误：未设置 API Token'
        })
      };
    }

    console.log('📤 调用 Coze API...');

    // 调用 Coze API
    const cozeResponse = await axios.post(
      'https://wzd4ygmd58.coze.site/run',
      {
        user_photo: {
          url: image,
          file_type: 'image'
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${cozeApiToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('📥 Coze API 响应状态:', cozeResponse.status);
    const cozeResult = cozeResponse.data;
    console.log('✅ Coze API 调用成功');

    // 提取生成的图片 URL
    let generatedImageUrl = image;

    if (cozeResult.generated_photo && cozeResult.generated_photo.url) {
      generatedImageUrl = cozeResult.generated_photo.url;
      console.log('✅ 找到 Coze 生成的海马体证件照 URL');
    } else if (cozeResult.data && cozeResult.data.generated_photo && cozeResult.data.generated_photo.url) {
      generatedImageUrl = cozeResult.data.generated_photo.url;
      console.log('✅ 找到 Coze 生成的海马体证件照 URL (嵌套格式)');
    } else if (cozeResult.output_photo && cozeResult.output_photo.url) {
      generatedImageUrl = cozeResult.output_photo.url;
      console.log('✅ 找到 Coze 生成的图片 URL (直接格式)');
    } else if (cozeResult.data && cozeResult.data.output_photo && cozeResult.data.output_photo.url) {
      generatedImageUrl = cozeResult.data.output_photo.url;
      console.log('✅ 找到 Coze 生成的图片 URL (嵌套格式)');
    }

    console.log('🖼️ 最终使用的图片 URL:', generatedImageUrl.substring(0, 100));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        imageUrl: generatedImageUrl,
        data: cozeResult
      })
    };

  } catch (error) {
    console.error('❌ API 错误:', error);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: error.message || '生成失败'
      })
    };
  }
};
