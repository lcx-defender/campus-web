<template>
  <el-sub-menu v-if="item.children && item.children.length" :key="item.path" :index="item.path">
    <template #title>
      <el-icon><component :is="item.meta.icon"></component></el-icon>
      <span>{{ item.meta.title }}</span>
    </template>
    <MenuItem v-for="child in item.children" :key="child.path" :item="child" />
  </el-sub-menu>
  <el-menu-item v-else :index="item.path">
    <el-icon><component :is="item.meta.icon"></component></el-icon>
    <template #title>
      {{ item.meta.title }}
    </template>
  </el-menu-item>
</template>

  
<script setup>
defineProps({
    item: {
        type: Object,
        required: true
    }
});
</script>