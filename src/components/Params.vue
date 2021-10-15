<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>参数列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-alert
      title="注意：只允许为第三级分类设置相关参数！"
      type="warning"
      :closable="false"
      show-icon
    ></el-alert>
    <el-row class="cat_opt">
      <el-col><span>选择商品分类：</span></el-col>
    </el-row>
  </el-card>
</template>
<script>
export default {
  name: "Params",
};
</script>
<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
</style>