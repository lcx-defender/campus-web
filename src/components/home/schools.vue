<script setup>
import { ref } from 'vue';

// 模拟数据：已使用本平台的院校名称
const schools = ref([
  '中华**大学',
  '北京**大学',
  '上海**大学',
  '浙江**大学',
  '上海**大学',
  '南京**大学',
  '中国科学**大学',
  '武汉**大学',
  '中山**大学',
  '哈尔滨**大学',
]);
</script>

<template>
  <div class="schools-page">
    <h2 class="title">已使用本平台的院校</h2>
    <el-table :data="schools" border style="width: 100%">
      <el-table-column prop="name" label="院校名称" align="center">
        <template #default="{ row }">
          <span>{{ row }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.schools-page {
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.el-table {
  background-color: white;
}
</style>