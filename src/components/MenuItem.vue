<template>
  <el-sub-menu v-if="isDir" :index="item.path">
    <template #title>
      <i :class="item.meta?.icon"></i>
      <span>{{ item.meta?.title }}</span>
    </template>
    <menu-item
      v-for="child in item.children"
      :key="child.path"
      :item="child"
    />
  </el-sub-menu>
  <el-menu-item v-else :index="item.path">
    <i :class="item.meta?.icon"></i>
    <span>{{ item.meta?.title }}</span>
  </el-menu-item>
</template>
  
<script setup>
import { computed } from 'vue'
const props = defineProps(['item']);
const Layout = () => import('@/components/layout/index.vue')
const ParentView = () => import('@/components/ParentView/index.vue')
const isDir = computed(() => props.item.isLayout || props.item.isParentView)
console.warn(props);
console.warn(isDir.value);
</script>