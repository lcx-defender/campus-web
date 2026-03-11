<template>
    <div class="user-info-head" @click="editCropper()">
        <img :src="options.img" title="点击上传头像" class="img-circle img-lg" />
        <el-dialog :title="title" v-model="open" width="800px" append-to-body @opened="modalOpened"
            @close="closeDialog">
            <el-row>
                <el-col :xs="24" :md="12" :style="{ height: '350px' }">
                    <vue-cropper ref="cropper" :img="options.img" :info="true" :autoCrop="options.autoCrop"
                        :autoCropWidth="options.autoCropWidth" :autoCropHeight="options.autoCropHeight"
                        :fixedBox="options.fixedBox" :outputType="options.outputType" @realTime="realTime"
                        @imgLoad="handleImgLoad"
                        v-if="visible" />
                </el-col>
                <el-col :xs="24" :md="12" :style="{ height: '350px' }">
                    <div class="avatar-upload-preview">
                        <img :src="options.previews.url" :style="options.previews.img" />
                    </div>
                </el-col>
            </el-row>
            <br />
            <el-row>
                <el-col :lg="2" :md="2">
                    <el-upload action="#" :http-request="requestUpload" :show-file-list="false"
                        :before-upload="beforeUpload">
                        <el-button>
                            选择
                            <el-icon class="el-icon--right">
                                <Upload />
                            </el-icon>
                        </el-button>
                    </el-upload>
                </el-col>
                <el-col :lg="{ span: 1, offset: 2 }" :md="2">
                    <el-button :icon="Plus" @click="changeScale(1)"></el-button>
                </el-col>
                <el-col :lg="{ span: 1, offset: 1 }" :md="2">
                    <el-button :icon="Minus" @click="changeScale(-1)"></el-button>
                </el-col>
                <el-col :lg="{ span: 1, offset: 1 }" :md="2">
                    <el-button :icon="RefreshLeft" @click="rotateLeft()"></el-button>
                </el-col>
                <el-col :lg="{ span: 1, offset: 1 }" :md="2">
                    <el-button :icon="RefreshRight" @click="rotateRight()"></el-button>
                </el-col>
                <el-col :lg="{ span: 2, offset: 6 }" :md="2">
                    <el-button type="primary" @click="uploadImg()">提 交</el-button>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script setup>
import "vue-cropper/dist/index.css";
import { VueCropper } from "vue-cropper";
import { uploadAvatar } from "@/api/upload";
import { useUserStore } from "@/store/user";
import { ref, reactive, onBeforeUnmount } from 'vue';
import { ElMessage } from 'element-plus';
import { Upload } from '@element-plus/icons-vue';
import { Plus, Minus, RefreshLeft, RefreshRight } from "@element-plus/icons-vue";

const userStore = useUserStore();
const cropper = ref(null);
const defaultAvatar = "https://greet-freshman.oss-cn-shanghai.aliyuncs.com/default-avatar.png";
const open = ref(false);
const visible = ref(false);
const title = ref("修改头像");
const localBlobUrl = ref('');

//图片裁剪数据
const options = reactive({
    img: userStore.userInfo.avatar || defaultAvatar,     // 裁剪图片的地址
    autoCrop: true,            // 是否默认生成截图框
    autoCropWidth: 200,        // 默认生成截图框宽度
    autoCropHeight: 200,       // 默认生成截图框高度
    fixedBox: true,            // 固定截图框大小 不允许改变
    outputType: "png",         // 默认生成截图为PNG格式
    filename: 'avatar',        // 文件名称
    previews: {}               //预览数据
});

/** 编辑头像 */
function editCropper() {
    open.value = true;
    syncCurrentAvatar();
}

async function syncCurrentAvatar() {
    const url = userStore.userInfo?.avatar || defaultAvatar;
    if (url.startsWith('blob:') || url.startsWith('data:')) {
        options.img = url;
        return;
    }
    try {
        // 尝试代理抓取转成本地blob以此规避直接加载报 canvas 跨域的错误（附加随机数避免缓存污染）
        const res = await fetch(url + (url.includes('?') ? '&' : '?') + '_t=' + new Date().getTime(), { 
            mode: 'cors',
            cache: 'no-cache'
        });
        if (res.ok) {
            const blob = await res.blob();
            const blobUrl = URL.createObjectURL(blob);
            if (localBlobUrl.value) {
                URL.revokeObjectURL(localBlobUrl.value);
            }
            localBlobUrl.value = blobUrl;
            options.img = blobUrl;
        } else {
            options.img = url;
        }
    } catch (e) {
        console.warn("无法 fetch 跨域图片，降级回直接赋值", e);
        options.img = url;
    }
}

/** 打开弹出层结束时的回调 */
function modalOpened() {
    visible.value = true;
}

function handleImgLoad(status) {
    if (status === 'error') {
        ElMessage.warning('当前头像地址无法被裁剪器读取，请重新选择本地图片后上传');
    }
}
/** 覆盖默认上传行为 */
function requestUpload() { }
/** 向左旋转 */
function rotateLeft() {
    cropper.value.rotateLeft();
}
/** 向右旋转 */
function rotateRight() {
    cropper.value.rotateRight();
}
/** 图片缩放 */
function changeScale(num) {
    num = num || 1;
    cropper.value.changeScale(num);
}
/** 上传预处理 */
function beforeUpload(file) {
    console.log("上传的文件进入预处理", file);
    const isLt2M = file.size / 1024 / 1024 < 5
    if (!isLt2M) {
        ElMessage.error('图片大小不能超过 5MB!');
        return false;
    };
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        ElMessage.error('只能上传 JPG 或 PNG 格式的图片!');
        return false;
    }
    if (file.type.indexOf("image/") == -1) {
        ElMessage.error("文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。");
    }
    // 创建 blob URL
    try {
        if (localBlobUrl.value) {
            URL.revokeObjectURL(localBlobUrl.value);
            localBlobUrl.value = '';
        }
        const blobUrl = URL.createObjectURL(file);
        localBlobUrl.value = blobUrl;
        console.log("生成的blob URL:", blobUrl);
        options.img = blobUrl;
        options.filename = file.name;
        
        // 可选：保存文件对象以供后续使用
        options.file = file;
        
        // 触发预览更新
        visible.value = true;
    } catch (error) {
        console.error("创建 blob URL 失败:", error);
        ElMessage.error("图片处理失败，请重试");
    }
    
    return false; // 阻止默认上传
}
/** 上传头像 */
function uploadImg() {
    if (!cropper.value) {
        ElMessage.error('裁剪器尚未初始化，请稍后重试');
        return;
    }
    cropper.value.getCropBlob(data => {
        let formData = new FormData();
        // 使用原始文件名，但确保添加正确的扩展名
        const filename = options.filename || 'avatar.png';
        // 创建文件对象并添加到 FormData
        const file = new File([data], filename, { 
            type: 'image/png',
            lastModified: new Date().getTime()
        });
        
        // 添加到 FormData，使用后端期望的字段名 'avatar'
        formData.append('avatar', file);
        uploadAvatar(formData).then(response => {
            open.value = false;
            options.img = response.data;
            userStore.userInfo.avatar = options.img;
            ElMessage.success("头像上传成功");
            visible.value = false;

            if (localBlobUrl.value) {
                URL.revokeObjectURL(localBlobUrl.value);
                localBlobUrl.value = '';
            }
        });
    });
}
/** 实时预览 */
function realTime(data) {
    options.previews = data;
}
/** 关闭窗口 */
function closeDialog() {
    if (localBlobUrl.value) {
        URL.revokeObjectURL(localBlobUrl.value);
        localBlobUrl.value = '';
    }
    options.img = userStore.userInfo?.avatar || defaultAvatar;
    options.visible = false;
    visible.value = false;
}

// 在组件卸载前清理 blob URL
onBeforeUnmount(() => {
    if (localBlobUrl.value) {
        URL.revokeObjectURL(localBlobUrl.value);
        localBlobUrl.value = '';
    }
});
</script>

<style lang='scss' scoped>
.user-info-head {
    position: relative;
    display: inline-block;
    height: 120px;

    .img-circle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;  /* 确保图片填充整个圆形区域 */
  }
}

.user-info-head:hover:after {
    content: "+";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    color: #eee;
    background: rgba(0, 0, 0, 0.5);
    font-size: 24px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    cursor: pointer;
    line-height: 110px;
    border-radius: 50%;
}

.avatar-upload-preview {
    position: relative;
    width: 200px;
    height: 200px;
    margin: 0 auto;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
    }
}
</style>