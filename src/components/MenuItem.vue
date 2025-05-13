<template>
  <el-sub-menu v-if="item.children && item.children.length" :key="item.path" :index="item.path">
    <template #title>
      <svg-icon v-if="item.meta.icon" :icon-class="item.meta.icon" />
      <span>{{ item.meta.title }}</span>
    </template>
    <MenuItem v-for="child in item.children" :key="child.path" :item="child" />
  </el-sub-menu>
  <el-menu-item v-else :index="item.path">
    <svg-icon v-if="item.meta.icon" :icon-class="item.meta.icon" />
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

<style scoped>
.svg-icon {
  margin-right: 8px;
  width: 1em;
  height: 1em;
}
</style>