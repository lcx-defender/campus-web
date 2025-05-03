<template>
  <div class="app-wrapper">
    <el-container>
      <el-aside width="200px">
        <slot name="sidebar"></slot>
      </el-aside>
      <el-main>
        <slot></slot>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({
  name: 'Layout'
})
</script>

<style scoped>
.app-wrapper {
  height: 100%;
  width: 100%;
}

.el-container {
  height: 100%;
}

.el-aside {
  background-color: #304156;
  color: #fff;
}

.el-main {
  padding: 20px;
  background-color: #f0f2f5;
}
</style>
