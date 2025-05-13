<template>
  <div class="icon-body">
    <el-input
      v-model="iconName"
      class="icon-search"
      clearable
      placeholder="请输入图标名称"
      @clear="filterIcons"
      @input="filterIcons"
    >
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
    </el-input>
    
    <div class="icon-list">
      <div class="list-container">
        <div 
          v-for="(item, index) in iconList" 
          :key="index" 
          class="icon-item-wrapper" 
          @click="selectedIcon(item)"
        >
          <div :class="['icon-item', { active: activeIcon === item }]">
            <svg-icon :icon-class="item" />
            <span>{{ item }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent } from 'vue'
import { Search } from '@element-plus/icons-vue'
import icons from './requireIcons'

export default defineComponent({
  name: 'IconSelect',
  components: {
    Search
  },
  props: {
    activeIcon: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const iconName = ref('')
    const iconList = ref(icons)

    const filterIcons = () => {
      if (iconName.value) {
        iconList.value = icons.filter(item => 
          item.toLowerCase().includes(iconName.value.toLowerCase())
        )
      } else {
        iconList.value = icons
      }
    }

    const selectedIcon = (name) => {
      emit('selected', name)
      document.body.click()
    }

    const reset = () => {
      iconName.value = ''
      iconList.value = icons
    }

    return {
      iconName,
      iconList,
      filterIcons,
      selectedIcon,
      reset
    }
  }
})
</script>

<style scoped>
.icon-body {
  width: 100%;
  padding: 10px;
}

.icon-search {
  margin-bottom: 10px;
}

.icon-list {
  height: 200px;
  overflow-y: auto;
}

.list-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
}

.icon-item-wrapper {
  cursor: pointer;
}

.icon-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.icon-item:hover,
.icon-item.active {
  background-color: #f5f7fa;
}

.icon-item svg-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

.icon-item span {
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>