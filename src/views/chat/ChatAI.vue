<template>
  <div class="ai-chat" :class="{ dark: isDark }">
    <div class="chat-container">
      <div class="sidebar">
        <div class="history-header">
          <h2>聊天记录</h2>
          <button class="new-chat" @click="startNewChat">
            <PlusIcon class="icon" />
            新对话
          </button>
        </div>
        <div class="history-list">
          <div
            v-for="chat in chatHistory"
            :key="chat.id"
            class="history-item"
            :class="{ active: currentChatId === chat.id }"
            @click="loadChat(chat.id)"
          >
            <ChatBubbleLeftRightIcon class="icon" />
            <span class="title">{{ chat.title || "新对话" }}</span>
          </div>
        </div>
      </div>

      <div class="chat-main">
        <div class="messages" ref="messagesRef">
          <ChatMessage
            v-for="(message, index) in currentMessages"
            :key="index"
            :message="message"
            :is-stream="isStreaming && index === currentMessages.length - 1"
          />
        </div>

        <div class="input-area">
          <div v-if="selectedFiles.length > 0" class="selected-files">
            <div
              v-for="(file, index) in selectedFiles"
              :key="index"
              class="file-item"
            >
              <div class="file-info">
                <DocumentIcon class="icon" />
                <span class="file-name">{{ file.name }}</span>
                <span class="file-size">({{ formatFileSize(file.size) }})</span>
              </div>
              <button class="remove-btn" @click="removeFile(index)">
                <XMarkIcon class="icon" />
              </button>
            </div>
          </div>

          <div class="input-row">
            <div class="file-upload">
              <input
                type="file"
                ref="fileInput"
                @change="handleFileUpload"
                accept="image/*,audio/*,video/*"
                multiple
                class="hidden"
              />
              <button
                class="upload-btn"
                @click="triggerFileInput"
                :disabled="isStreaming"
              >
                <PaperClipIcon class="icon" />
              </button>
            </div>

            <textarea
              v-model="userInput"
              @keydown.enter.prevent="sendMessage"
              :placeholder="getPlaceholder()"
              rows="1"
              ref="inputRef"
            ></textarea>
            <button
              class="send-button"
              @click="sendMessage"
              :disabled="
                isStreaming || (!userInput.trim() && !selectedFiles.length)
              "
            >
              <PaperAirplaneIcon class="icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useDark } from "@vueuse/core";
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  PlusIcon,
  PaperClipIcon,
  DocumentIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import ChatMessage from "@/views/chat/ChatMessage.vue";
import { chatAPI } from "@/api/chatAPI.js";

const isDark = useDark();
const messagesRef = ref(null);
const inputRef = ref(null);
const userInput = ref("");
const isStreaming = ref(false);
const currentChatId = ref(null);
const currentMessages = ref([]);
const chatHistory = ref([]);
const fileInput = ref(null);
const selectedFiles = ref([]);

// 自动调整输入框高度
const adjustTextareaHeight = () => {
  const textarea = inputRef.value;
  if (textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  } else {
    textarea.style.height = "50px";
  }
};

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick();
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
  }
};

// 文件类型限制
const FILE_LIMITS = {
  image: {
    maxSize: 10 * 1024 * 1024, // 单个文件 10MB
    maxFiles: 3, // 最多 3 个文件
    description: "图片文件",
  },
  audio: {
    maxSize: 10 * 1024 * 1024, // 单个文件 10MB
    maxDuration: 180, // 3分钟
    maxFiles: 3, // 最多 3 个文件
    description: "音频文件",
  },
  video: {
    maxSize: 150 * 1024 * 1024, // 单个文件 150MB
    maxDuration: 40, // 40秒
    maxFiles: 3, // 最多 3 个文件
    description: "视频文件",
  },
};

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value?.click();
};

// 检查文件是否符合要求
const validateFile = async (file) => {
  const type = file.type.split("/")[0];
  const limit = FILE_LIMITS[type];

  if (!limit) {
    return { valid: false, error: "不支持的文件类型" };
  }

  if (file.size > limit.maxSize) {
    return {
      valid: false,
      error: `文件大小不能超过${limit.maxSize / 1024 / 1024}MB`,
    };
  }

  if ((type === "audio" || type === "video") && limit.maxDuration) {
    try {
      const duration = await getMediaDuration(file);
      if (duration > limit.maxDuration) {
        return {
          valid: false,
          error: `${type === "audio" ? "音频" : "视频"}时长不能超过${
            limit.maxDuration
          }秒`,
        };
      }
    } catch (error) {
      return { valid: false, error: "无法读取媒体文件时长" };
    }
  }

  return { valid: true };
};

// 获取媒体文件时长
const getMediaDuration = (file) => {
  return new Promise((resolve, reject) => {
    const element = file.type.startsWith("audio/")
      ? new Audio()
      : document.createElement("video");
    element.preload = "metadata";

    element.onloadedmetadata = () => {
      resolve(element.duration);
      URL.revokeObjectURL(element.src);
    };

    element.onerror = () => {
      reject(new Error("无法读取媒体文件"));
      URL.revokeObjectURL(element.src);
    };

    element.src = URL.createObjectURL(file);
  });
};

// 修改文件上传处理函数
const handleFileUpload = async (event) => {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;

  // 检查所有文件类型是否一致
  const firstFileType = files[0].type.split("/")[0];
  const hasInconsistentType = files.some(
    (file) => file.type.split("/")[0] !== firstFileType
  );

  if (hasInconsistentType) {
    alert("请选择相同类型的文件（图片、音频或视频）");
    event.target.value = "";
    return;
  }

  // 验证所有文件
  for (const file of files) {
    const { valid, error } = await validateFile(file);
    if (!valid) {
      alert(error);
      event.target.value = "";
      selectedFiles.value = [];
      return;
    }
  }

  // 检查文件总大小
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const limit = FILE_LIMITS[firstFileType];
  if (totalSize > limit.maxSize * 3) {
    // 允许最多3个文件的总大小
    alert(
      `${
        firstFileType === "image"
          ? "图片"
          : firstFileType === "audio"
          ? "音频"
          : "视频"
      }文件总大小不能超过${(limit.maxSize * 3) / 1024 / 1024}MB`
    );
    event.target.value = "";
    selectedFiles.value = [];
    return;
  }

  selectedFiles.value = files;
};

// 修改文件输入提示
const getPlaceholder = () => {
  if (selectedFiles.value.length > 0) {
    const type = selectedFiles.value[0].type.split("/")[0];
    const desc = FILE_LIMITS[type].description;
    return `已选择 ${selectedFiles.value.length} 个${desc}，可继续输入消息...`;
  }
  return "输入消息，可上传图片、音频或视频...";
};

const sendMessage = async () => {
  if (isStreaming.value) return;
  if (!userInput.value.trim() && !selectedFiles.value.length) return;

  const messageContent = userInput.value.trim();

  // 添加用户消息
  const userMessage = {
    role: "user",
    content: messageContent,
    timestamp: new Date(),
  };
  currentMessages.value.push(userMessage);

  // 清空输入
  userInput.value = "";
  adjustTextareaHeight();
  await scrollToBottom();

  // 准备发送数据
  const formData = new FormData();
  if (messageContent) {
    formData.append("prompt", messageContent);
  }
  selectedFiles.value.forEach((file) => {
    formData.append("files", file);
  });

  // 添加助手消息占位
  const assistantMessage = {
    role: "assistant",
    content: "",
    timestamp: new Date(),
  };
  currentMessages.value.push(assistantMessage);
  isStreaming.value = true;

  try {
    const reader = await chatAPI.sendMessage(formData, currentChatId.value);
    const decoder = new TextDecoder("utf-8");
    let accumulatedContent = ""; // 添加累积内容变量

    // 添加安全超时机制
    let streamTimeout = null;
    const setStreamTimeout = () => {
      // 清除现有超时
      if (streamTimeout) clearTimeout(streamTimeout);

      // 设置新的超时 - 如果 10 秒内没有新数据，认为流已结束
      streamTimeout = setTimeout(() => {
        console.log("流接收超时，可能已完成");
        isStreaming.value = false; // 强制重置状态
      }, 10000);
    };

    // 初始设置超时
    setStreamTimeout();

    while (true) {
      try {
        const { value, done } = await reader.read();
        if (done) {
          console.log("流正常结束");
          clearTimeout(streamTimeout); // 清除超时计时器
          break;
        }

        // 重置超时计时器 - 收到数据了
        setStreamTimeout();

        // 累积新内容
        const chunk = decoder.decode(value, { stream: true }); // 使用 stream 选项
        accumulatedContent += chunk;

        await nextTick(() => {
          // 更新消息，使用累积的内容
          const updatedMessage = {
            ...assistantMessage,
            content: accumulatedContent,
          };
          const lastIndex = currentMessages.value.length - 1;
          currentMessages.value.splice(lastIndex, 1, updatedMessage);
        });
        await scrollToBottom();
      } catch (readError) {
        console.error("读取流错误:", readError);
        clearTimeout(streamTimeout); // 出错时清除超时计时器
        break;
      }
    }
  } catch (error) {
    console.error("发送消息失败:", error);
    assistantMessage.content = "抱歉，发生了错误，请稍后重试。";
  } finally {
    console.log("处理完成，重置发送状态");
    // 强制重置状态为同步操作，确保生效
    isStreaming.value = false;
    selectedFiles.value = []; // 清空已选文件
    if (fileInput.value) fileInput.value.value = ""; // 清空文件输入
    await scrollToBottom();
  }
};

// 加载特定对话
const loadChat = async (chatId) => {
  currentChatId.value = chatId;
  try {
    const messages = await chatAPI.getChatMessages(chatId, "chat");
    currentMessages.value = messages;
  } catch (error) {
    console.error("加载对话消息失败:", error);
    currentMessages.value = [];
  }
};

// 加载聊天历史
const loadChatHistory = async () => {
  try {
    const history = await chatAPI.getChatHistory("chat");
    chatHistory.value = history || [];
    if (history && history.length > 0) {
      await loadChat(history[0].id);
    } else {
      startNewChat();
    }
  } catch (error) {
    console.error("加载聊天历史失败:", error);
    chatHistory.value = [];
    startNewChat();
  }
};

// 开始新对话
const startNewChat = () => {
  const newChatId = Date.now().toString();
  currentChatId.value = newChatId;
  currentMessages.value = [];

  // 添加新对话到聊天历史列表
  const newChat = {
    id: newChatId,
    title: `对话 ${newChatId.slice(-6)}`,
  };
  chatHistory.value = [newChat, ...chatHistory.value]; // 将新对话添加到列表开头
};

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

// 移除文件
const removeFile = (index) => {
  selectedFiles.value = selectedFiles.value.filter((_, i) => i !== index);
  if (selectedFiles.value.length === 0) {
    fileInput.value.value = ""; // 清空文件输入
  }
};

onMounted(() => {
  loadChatHistory();
  adjustTextareaHeight();
});
</script>

<style scoped lang="scss">
.ai-chat {
  // 修改从固定定位为相对定位，适应layout中的Main区域
  position: relative;
  display: flex;
  background: var(--bg-color);
  overflow: hidden;
  height: calc(100vh - 64px); // 适应整个视口高度减去导航栏高度

  .chat-container {
    flex: 1;
    display: flex;
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    padding: 0.75rem;
    gap: 0.75rem;
    height: 100%;
    overflow: hidden;
  }

  .sidebar {
    width: 220px; // 减小侧边栏宽度
    min-width: 180px; // 设置最小宽度
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 0.75rem; // 稍微减小圆角
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

    .history-header {
      flex-shrink: 0;
      padding: 0.75rem; // 减少内边距
      display: flex;
      justify-content: space-between;
      align-items: center;

      h2 {
        font-size: 1.1rem; // 减小标题字号
      }

      .new-chat {
        display: flex;
        align-items: center;
        gap: 0.35rem; // 减小间距
        padding: 0.4rem 0.75rem; // 减小按钮尺寸
        border-radius: 0.5rem;
        background: #007cf0;
        color: white;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
          background: #0066cc;
        }

        .icon {
          width: 1rem; // 减小图标尺寸
          height: 1rem;
        }
      }
    }

    .history-list {
      flex: 1;
      overflow-y: auto;
      padding: 0 0.75rem 0.75rem;

      .history-item {
        display: flex;
        align-items: center;
        gap: 0.35rem; // 减小间距
        padding: 0.6rem; // 减小内边距
        border-radius: 0.5rem;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        &.active {
          background: rgba(0, 124, 240, 0.1);
        }

        .icon {
          width: 1.1rem; // 减小图标尺寸
          height: 1.1rem;
        }

        .title {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.9rem; // 稍微减小字体
        }
      }
    }
  }

  .chat-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 0.75rem; // 稍微减小圆角
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    max-width: calc(100% - 240px); // 确保主区域不会太宽

    .messages {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem; // 减少内边距
    }

    .input-area {
      flex-shrink: 0;
      padding: 1rem 1.5rem; // 减少内边距
      background: rgba(255, 255, 255, 0.98);
      border-top: 1px solid rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      gap: 0.75rem; // 减小间距

      .selected-files {
        background: rgba(0, 0, 0, 0.02);
        border-radius: 0.75rem;
        padding: 0.6rem; // 减少内边距
        border: 1px solid rgba(0, 0, 0, 0.05);

        .file-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem; // 减少内边距
          background: #fff;
          border-radius: 0.5rem;
          margin-bottom: 0.6rem; // 减少间距
          border: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease;

          &:last-child {
            margin-bottom: 0;
          }

          &:hover {
            background: rgba(0, 124, 240, 0.02);
            border-color: rgba(0, 124, 240, 0.2);
          }

          .file-info {
            display: flex;
            align-items: center;
            gap: 0.6rem; // 减小间距

            .icon {
              width: 1.25rem;
              height: 1.25rem;
              color: #007cf0;
            }

            .file-name {
              font-size: 0.85rem; // 减小字体
              color: #333;
              font-weight: 500;
              max-width: 180px; // 限制长文件名
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .file-size {
              font-size: 0.7rem; // 减小字体
              color: #666;
              background: rgba(0, 0, 0, 0.05);
              padding: 0.2rem 0.4rem; // 减少内边距
              border-radius: 1rem;
            }
          }

          .remove-btn {
            padding: 0.3rem; // 减少内边距
            border: none;
            background: rgba(0, 0, 0, 0.05);
            color: #666;
            cursor: pointer;
            border-radius: 0.375rem;
            transition: all 0.2s ease;

            &:hover {
              background: #ff4d4f;
              color: #fff;
            }

            .icon {
              width: 1.1rem; // 减小图标尺寸
              height: 1.1rem;
            }
          }
        }
      }

      .input-row {
        display: flex;
        gap: 0.75rem; // 减小间距
        align-items: flex-end;
        background: #fff;
        padding: 0.6rem; // 减少内边距
        border-radius: 0.75rem;
        border: 1px solid rgba(0, 0, 0, 0.1);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

        .file-upload {
          .hidden {
            display: none;
          }

          .upload-btn {
            width: 2.25rem; // 减小按钮尺寸
            height: 2.25rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            border-radius: 0.6rem; // 减小圆角
            background: rgba(0, 124, 240, 0.1);
            color: #007cf0;
            cursor: pointer;
            transition: all 0.2s ease;

            &:hover:not(:disabled) {
              background: rgba(0, 124, 240, 0.2);
            }

            &:disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }

            .icon {
              width: 1.1rem; // 减小图标尺寸
              height: 1.1rem;
            }
          }
        }

        textarea {
          flex: 1;
          resize: none;
          border: none;
          background: transparent;
          padding: 0.6rem; // 减少内边距
          color: inherit;
          font-family: inherit;
          font-size: 0.95rem; // 稍微减小字体
          line-height: 1.5;
          max-height: 120px; // 减小最大高度

          &:focus {
            outline: none;
          }

          &::placeholder {
            color: #999;
          }
        }

        .send-button {
          width: 2.25rem; // 减小按钮尺寸
          height: 2.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 0.6rem; // 减小圆角
          background: #007cf0;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover:not(:disabled) {
            background: #0066cc;
            transform: translateY(-1px);
          }

          &:disabled {
            background: #ccc;
            cursor: not-allowed;
          }

          .icon {
            width: 1.1rem; // 减小图标尺寸
            height: 1.1rem;
          }
        }
      }
    }
  }
}

.dark {
  .sidebar {
    background: rgba(40, 40, 40, 0.95);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  }

  .chat-main {
    background: rgba(40, 40, 40, 0.95);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);

    .input-area {
      background: rgba(30, 30, 30, 0.98);
      border-top: 1px solid rgba(255, 255, 255, 0.05);

      .selected-files {
        background: rgba(255, 255, 255, 0.02);
        border-color: rgba(255, 255, 255, 0.05);

        .file-item {
          background: rgba(255, 255, 255, 0.02);
          border-color: rgba(255, 255, 255, 0.05);

          &:hover {
            background: rgba(0, 124, 240, 0.1);
            border-color: rgba(0, 124, 240, 0.3);
          }

          .file-info {
            .icon {
              color: #007cf0;
            }

            .file-name {
              color: #fff;
            }

            .file-size {
              color: #999;
              background: rgba(255, 255, 255, 0.1);
            }
          }

          .remove-btn {
            background: rgba(255, 255, 255, 0.1);
            color: #999;

            &:hover {
              background: #ff4d4f;
              color: #fff;
            }
          }
        }
      }

      .input-row {
        background: rgba(255, 255, 255, 0.02);
        border-color: rgba(255, 255, 255, 0.05);
        box-shadow: none;

        textarea {
          color: #fff;

          &::placeholder {
            color: #666;
          }
        }

        .file-upload .upload-btn {
          background: rgba(0, 124, 240, 0.2);
          color: #007cf0;

          &:hover:not(:disabled) {
            background: rgba(0, 124, 240, 0.3);
          }
        }
      }
    }
  }

  .history-item {
    &:hover {
      background: rgba(255, 255, 255, 0.05) !important;
    }

    &.active {
      background: rgba(0, 124, 240, 0.2) !important;
    }
  }

  textarea {
    background: rgba(255, 255, 255, 0.05) !important;

    &:focus {
      background: rgba(255, 255, 255, 0.1) !important;
    }
  }

  .input-area {
    .file-upload {
      .upload-btn {
        background: rgba(255, 255, 255, 0.1);
        color: #999;

        &:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
        }
      }
    }
  }
}

// 增强响应式设计
@media (max-width: 1200px) {
  .ai-chat {
    .chat-container {
      padding: 0.5rem;
      gap: 0.5rem;
    }
    
    .sidebar {
      width: 200px;
    }
    
    .chat-main {
      max-width: calc(100% - 210px);
      
      .messages {
        padding: 1.25rem;
      }
      
      .input-area {
        padding: 0.75rem 1.25rem;
      }
    }
  }
}

@media (max-width: 992px) {
  .ai-chat {
    .sidebar {
      width: 180px;
      
      .history-header h2 {
        font-size: 1rem;
      }
    }
    
    .chat-main {
      max-width: calc(100% - 190px);
      
      .messages {
        padding: 1rem;
      }
    }
  }
}

@media (max-width: 768px) {
  .ai-chat {
    .chat-container {
      padding: 0;
      flex-direction: column;
    }

    .sidebar {
      display: none; // 在移动端隐藏侧边栏
    }

    .chat-main {
      border-radius: 0;
      max-width: 100%;
    }
  }
}

// 处理消息内容最大宽度
:deep(.message-content) {
  max-width: 95%;
}

// 确保代码块适当换行
:deep(.markdown-content pre) {
  overflow-x: auto;
  max-width: 100%;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>