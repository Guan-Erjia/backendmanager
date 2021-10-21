<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-table :data="rightsList.value" border stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="权限等级" prop="level" v-slot="scope">
        <el-tag v-if="scope.row.level === '0'">一级</el-tag>
        <el-tag type="success" v-if="scope.row.level === '1'">二级</el-tag>
        <el-tag type="warning" v-if="scope.row.level === '2'">三级</el-tag>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script lang="ts">
import { getCurrentInstance, reactive } from "vue";
export default {
  name: "Rights",
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setup() {
    const { proxy }: any = getCurrentInstance();
    const rightsList: any = reactive([]);

    const getRightsLists = () => {
      proxy.$axios.get("/rights/list").then((resolve: any) => {
        let response = resolve.data;
        if (response.meta.status === 200) {
          rightsList.value = response.data;
          console.log(rightsList);
        }
      });
    };
    getRightsLists();

    return {
      getRightsLists,
      rightsList,
    };
  },
};
</script>