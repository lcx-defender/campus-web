import { createApp } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'

// 自动导入所有 svg 图标
const req = require.context('@/assets/icons/svg', false, /\.svg$/)
const requireAll = (requireContext: any) => requireContext.keys().map(requireContext)
requireAll(req)

export default {
  install(app: ReturnType<typeof createApp>) {
    app.component('svg-icon', SvgIcon)
  }
}