<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue';
import { getMenuTree, addMenu, deleteMenu, updateMenu, queryMenu, getMenuTreeSelect } from '@/api/system/menu';
import IconSelect from '@/components/IconSelect/index.vue';
import { getCurrentInstance } from 'vue';
import { formatDate } from '@/utils/format';
// 查询表单
const searchForm = ref({
   menuName: null,
   menustatus: null,
});
// 图标选择器相关
const iconSelectRef = ref();
const showSelectIcon = () => {
   iconSelectRef.value?.reset();
}
const selected = (name: string) => {
   formData.value.icon = name;
}

// 表格数据
const tableData = ref([]);
const loading = ref(false);
const refreshTable = ref(true);
const isExpand = ref(false);

// 弹窗相关
const dialogVisible = ref(false);
const dialogTitle = ref('新增菜单');
const menuOptions = ref([]);
const formRef = ref();

// 表单数据
// 表单数据
const formData = ref({
   parentId: undefined,
   menuType: 'M',
   menuName: '',
   icon: '',
   orderNum: 0,
   routerPath: '',
   component: '',
   queryParam: '',
   isFrame: 1,
   menuStatus: '0',
   perms: ''
});

// 表单验证规则
const rules = {
   menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
   sort: [{ required: true, message: '请输入显示排序', trigger: 'blur' }],
   path: [{ required: true, message: '请输入路由地址', trigger: 'blur' }],
   component: [{ required: true, message: '请输入组件路径', trigger: 'blur' }],
   perms: [{ required: true, message: '请输入权限标识', trigger: 'blur' }]
};

// 获取菜单树数据
const getMenusTree = async () => {
   loading.value = true;
   try {
      const res = await getMenuTree(searchForm.value);
      tableData.value = res.data;
   } catch (error) {
      console.error('获取菜单列表失败:', error);
   } finally {
      loading.value = false;
   }
}

const getMenuOption = async () => {
   menuOptions.value = [];
   const res = await getMenuTreeSelect();
   const mainMenu = { value: 0, label: "主目录", children: [] };
   mainMenu.children = res.data;
   menuOptions.value.push(mainMenu);
}

// 搜索方法
const handleSearch = () => {
   getMenusTree();
}

// 重置搜索
const searchFormReset = () => {
   searchForm.value.menuName = null;
   searchForm.value.menustatus = null;
   getMenusTree();
}

// 新增方法
const handleAdd = async (row?: any) => {
   dialogTitle.value = '新增菜单';
   await getMenuOption();
   dialogVisible.value = true;
   // 如果是在某个菜单下新增,设置父级ID
   if (row) {
      formData.value.parentId = row.id;
   }
}

// 修改方法
const handleEdit = async (row: any) => {
   dialogTitle.value = '修改菜单';
   await getMenuOption();
   dialogVisible.value = true;
   Object.assign(formData.value, row);
}

// 提交表单
const handleSubmit = async () => {
   await formRef.value.validate();
   try {
      if (dialogTitle.value === '新增菜单') {
         await addMenu(formData.value);
      } else {
         await updateMenu(formData.value);
      }
      dialogVisible.value = false;
      getMenusTree();
   } catch (error) {
      console.error('保存失败:', error);
   }
}

// 删除方法
const handleDelete = async (row: any) => {
   try {
      await deleteMenu(row.id);
      getMenusTree();
   } catch (error) {
      console.error('删除失败:', error);
   }
}
const handleExpand = () => {
   refreshTable.value = false;
   isExpand.value = !isExpand.value;
   nextTick(() => {
      refreshTable.value = true;
   });
}

getMenusTree();
</script>
<template>
   <div class="menu-manage">
      <!-- 搜索栏 -->
      <div class="search-bar">
         <el-input v-model="searchForm.menuName" placeholder="请输入菜单名称" style="width: 200px" />
         <el-select v-model="searchForm.menustatus" placeholder="菜单状态" style="width: 120px; margin-left: 10px">
            <el-option label="正常" value="normal" />
            <el-option label="禁用" value="disabled" />
         </el-select>
         <el-button type="primary" @click="handleSearch" style="margin-left: 10px">
            搜索
         </el-button>
         <el-button @click="searchFormReset">重置</el-button>
      </div>

      <!-- 操作按钮 -->
      <div class="operation-bar">
         <el-button type="primary" @click="handleAdd">+ 新增</el-button>
         <el-button @click="handleExpand">展开/折叠</el-button>
      </div>

      <el-table v-if="refreshTable" :data="tableData" row-key="menuId" :default-expand-all="isExpand"
         :tree-props="{ children: 'children' }" v-loading="loading">
         <el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true" />
         <el-table-column prop="icon" label="图标" align="center" width="100">
            <template #default="scope">
               <svg-icon :icon-class="scope.row.icon" />
            </template>
         </el-table-column>
         <el-table-column prop="orderNum" label="排序" width="80" />
         <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true" />
         <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true" />
         <el-table-column prop="menuStatus" label="状态" width="100">
            <template #default="{ row }">
               <el-tag :type="row.menuStatus === '0' ? 'success' : 'danger'">
                  {{ row.menuStatus === '0' ? '正常' : '禁用' }}
               </el-tag>
            </template>
         </el-table-column>
         <el-table-column prop="createTime" label="创建时间" width="180">
            <template #default="scope">
               {{ formatDate(scope.row.createTime) }}
            </template>
         </el-table-column>
         <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
               <el-button type="primary" link @click="handleEdit(row)">修改</el-button>
               <el-button type="primary" link @click="handleAdd(row)">新增</el-button>
               <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
            </template>
         </el-table-column>
      </el-table>
   </div>
   <el-dialog :title="dialogTitle" v-model="dialogVisible" width="680px" append-to-body>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
         <el-row>
            <!-- 上级菜单 -->
            <el-col :span="24">
               <el-form-item label="上级菜单">
                  <el-tree-select v-model="formData.parentId" :data="menuOptions" :props="{
                     label: 'label',
                     value: 'value',
                     children: 'children'
                  }" check-strictly placeholder="选择上级菜单" />
               </el-form-item>
            </el-col>

            <!-- 菜单类型 -->
            <el-col :span="24">
               <el-form-item label="菜单类型" prop="menuType">
                  <el-radio-group v-model="formData.menuType">
                     <el-radio label="M">目录</el-radio>
                     <el-radio label="C">菜单</el-radio>
                     <el-radio label="F">按钮</el-radio>
                  </el-radio-group>
               </el-form-item>
            </el-col>

            <el-col :span="12" v-if="formData.menuType !== 'F'">
               <el-form-item label="菜单图标">
                  <el-popover placement="bottom-start" :width="540" trigger="click">
                     <template #reference>
                        <el-input v-model="formData.icon" placeholder="点击选择图标" readonly @click="showSelectIcon">
                           <template #prefix>
                              <svg-icon v-if="formData.icon" :icon-class="formData.icon" class="el-input__icon" />
                              <el-icon v-else>
                                 <Search />
                              </el-icon>
                           </template>
                        </el-input>
                     </template>
                     <icon-select ref="iconSelectRef" :active-icon="formData.icon" @selected="selected" />
                  </el-popover>
               </el-form-item>
            </el-col>

            <!-- 菜单名称 -->
            <el-col :span="12">
               <el-form-item label="菜单名称" prop="menuName">
                  <el-input v-model="formData.menuName" placeholder="请输入菜单名称" />
               </el-form-item>
            </el-col>

            <!-- 显示排序 -->
            <el-col :span="12">
               <el-form-item label="显示排序" prop="orderNum">
                  <el-input-number v-model="formData.orderNum" :min="0" />
               </el-form-item>
            </el-col>

            <!-- 路由地址 -->
            <el-col :span="12" v-if="formData.menuType !== 'F'">
               <el-form-item label="路由地址" prop="routerPath">
                  <el-input v-model="formData.routerPath" placeholder="请输入路由地址" />
               </el-form-item>
            </el-col>

            <!-- 组件路径 -->
            <el-col :span="12" v-if="formData.menuType === 'C'">
               <el-form-item label="组件路径" prop="component">
                  <el-input v-model="formData.component" placeholder="请输入组件路径" />
               </el-form-item>
            </el-col>

            <!-- 权限标识 -->
            <el-col :span="12" v-if="formData.menuType !== 'M'">
               <el-form-item label="权限标识" prop="perms">
                  <el-input v-model="formData.perms" placeholder="请输入权限标识" />
               </el-form-item>
            </el-col>

            <!-- 是否外链 -->
            <el-col :span="12" v-if="formData.menuType !== 'F'">
               <el-form-item label="是否外链">
                  <el-radio-group v-model="formData.isFrame">
                     <el-radio :label="1">是</el-radio>
                     <el-radio :label="0">否</el-radio>
                  </el-radio-group>
               </el-form-item>
            </el-col>

            <!-- 菜单状态 -->
            <el-col :span="12">
               <el-form-item label="菜单状态">
                  <el-radio-group v-model="formData.menuStatus">
                     <el-radio label="0">正常</el-radio>
                     <el-radio label="1">停用</el-radio>
                  </el-radio-group>
               </el-form-item>
            </el-col>
         </el-row>
      </el-form>
      <template #footer>
         <div class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
         </div>
      </template>
   </el-dialog>
</template>



<style scoped>
.menu-manage {
   padding: 20px;
}

.search-bar {
   margin-bottom: 20px;
}

.operation-bar {
   margin-bottom: 20px;
}
</style>