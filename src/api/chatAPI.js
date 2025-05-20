import { getToken } from '@/utils/token.js';
import { ElMessage } from 'element-plus';
import { router } from '@/router/index.js';

// 确保 BASE_URL 有一个默认值
const BASE_URL = import.meta.env.VITE_APP_BASE_API || '/dev-api';

// 封装 fetch 请求，添加拦截器功能
const fetchWithInterceptors = async (url, options = {}) => {
  try {
    // 请求拦截 - 添加 token
    const token = getToken();
    if (token) {
      // 先设置 Authorization 头
      options.headers = {
        ...options.headers,
        'Authorization': token
      };

      // 如果用户没有指定 Content-Type，且不是 FormData，则设置默认值
      if (!options.headers['Content-Type'] && !(options.body instanceof FormData)) {
        options.headers['Content-Type'] = 'application/json;charset=utf-8';
      }
    }

    // 发送请求
    const response = await fetch(url, options);

    // 如果是流式响应，直接返回
    if (options.responseType === 'stream') {
      if (!response.ok) {
        if (response.status === 401) {
          ElMessage.error('请重新登录');
          router.push('/login');
        } else {
          ElMessage.error(`请求失败: ${response.status}`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.body.getReader();
    }

    // 检查 HTTP 状态
    if (!response.ok) {
      if (response.status === 401) {
        ElMessage.error('请重新登录');
        router.push('/login');
        throw new Error('请重新登录');
      } else {
        ElMessage.error(`请求失败: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    // 非流式响应处理 - 直接返回数据
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const chatAPI = {
  // 发送聊天消息
  async sendMessage(data, chatId) {
    try {
      // 确保 chatId 存在，如果不存在则生成一个
      const actualChatId = chatId || `chat-${Date.now()}`;

      // 构建完整的 URL 字符串
      const urlString = `${BASE_URL}/ai-chat/chat`;

      // 准备请求体和头信息
      let body;
      let headers = {};

      if (data instanceof FormData) {
        // 如果是 FormData，直接添加 chatId
        data.append('chatId', actualChatId);
        body = data;
        // FormData 不需要设置 Content-Type，浏览器会自动添加带边界的正确类型
      } else {
        // 对于普通文本请求，使用 x-www-form-urlencoded
        body = new URLSearchParams();
        body.append('prompt', data);
        body.append('chatId', actualChatId);
        headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
        };
      }

      return await fetchWithInterceptors(urlString, {
        method: 'POST',
        headers: headers,
        body: body,
        responseType: 'stream'
      });
    } catch (error) {
      console.error('发送消息失败:', error);
      throw error;
    }
  },

  // 获取聊天历史列表
  async getChatHistory(type = 'chat') {
    try {
      const chatIds = await fetchWithInterceptors(`${BASE_URL}/ai/history/${type}`, {
        method: 'GET'
      });

      // 转换为前端需要的格式
      return chatIds.map(id => ({
        id,
        title: type === 'pdf' ? `PDF对话 ${id.slice(-6)}` :
          type === 'service' ? `咨询 ${id.slice(-6)}` :
            `对话 ${id.slice(-6)}`
      }));
    } catch (error) {
      console.error('获取聊天历史失败:', error);
      return [];
    }
  },

  // 获取特定对话的消息历史
  async getChatMessages(chatId, type = 'chat') {
    try {
      const messages = await fetchWithInterceptors(`${BASE_URL}/ai/history/${type}/${chatId}`, {
        method: 'GET'
      });

      // 添加时间戳
      return messages.map(msg => ({
        ...msg,
        timestamp: new Date() // 由于后端没有提供时间戳，这里临时使用当前时间
      }));
    } catch (error) {
      console.error('获取消息历史失败:', error);
      return [];
    }
  },

  // 发送客服消息
  async sendServiceMessage(prompt, chatId) {
    try {
      // 确保 chatId 存在
      const actualChatId = chatId || `service-${Date.now()}`;

      // 使用查询参数构建 URL
      const params = new URLSearchParams({
        prompt: prompt,
        chatId: actualChatId
      });

      return await fetchWithInterceptors(`${BASE_URL}/ai-chat/service?${params}`, {
        method: 'GET',
        responseType: 'stream'
      });
    } catch (error) {
      console.error('发送客服消息失败:', error);
      throw error;
    }
  },

  // 发送 PDF 问答消息
  async sendPdfMessage(prompt, chatId) {
    try {
      // 确保 chatId 存在
      const actualChatId = chatId || `pdf-${Date.now()}`;

      // 使用查询参数构建 URL
      const params = new URLSearchParams({
        prompt: prompt,
        chatId: actualChatId
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时

      const reader = await fetchWithInterceptors(`${BASE_URL}/ai/pdf/chat?${params}`, {
        method: 'GET',
        signal: controller.signal,
        responseType: 'stream'
      });

      clearTimeout(timeoutId); // 清除超时
      return reader;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('PDF 问答请求超时');
        throw new Error('请求超时，请稍后再试');
      }
      console.error('发送 PDF 问答消息失败:', error);
      throw error;
    }
  }
};