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
      <el-col
        ><span>选择商品分类：</span
        ><el-cascader
          :props="cateProps"
          v-model="currentCheck"
          :options="cartList.value"
          @change="handleChange"
        ></el-cascader>
      </el-col>
    </el-row>

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!-- 添加动态参数 -->
      <el-tab-pane label="用户管理" name="first">
        <el-button type="primary" size="mini" :disabled="buttonUseable"
          >添加参数</el-button
        >
      </el-tab-pane>
      <!-- 添加静态属性 -->
      <el-tab-pane label="用户配置" name="second"
        ><el-button type="primary" size="mini" :disabled="buttonUseable"
          >添加属性</el-button
        ></el-tab-pane
      >
    </el-tabs>
  </el-card>
</template>
<script lang="ts">
import { getCurrentInstance, reactive } from "@vue/runtime-core";
import { ref } from "vue";
import { computed } from "@vue/reactivity";
import { ComputedRef } from "@vue/reactivity";
export default {
  name: "Params",
  setup() {
    const { proxy }: any = getCurrentInstance();
    const cartList: any = reactive([]);
    const buttonUseable: any = ref(true);
    const currentCheck: any = reactive([]);
    const activeName = ref("first");
    const buttonDisabled: ComputedRef<boolean> = computed(() => {
      console.log(currentCheck);
      return proxy.currentCheck.length !== 3;
    });
    const cateProps = reactive({
      value: "cat_id",
      label: "cat_name",
      children: "children",
      expandTrigger: "hover",
    });
    const getCateList = () => {
      proxy.$axios.get("categories").then((resolve: any) => {
        if (resolve.data.meta.status === 200) {
          cartList.value = resolve.data.data;
        } else {
          proxy.$message.error("获取分类列表失败");
        }
      });
    };
    getCateList();
    const handleChange = () => {
      if (proxy.currentCheck.length !== 3) {
        proxy.currentCheck.splice(0, proxy.currentCheck.length);
        buttonUseable.value = true;
      } else {
        buttonUseable.value = false;
      }
    };
    const handleClick = () => {
      return;
    };
    return {
      getCateList,
      cartList,
      currentCheck,
      handleChange,
      cateProps,
      activeName,
      handleClick,
      buttonDisabled,
      buttonUseable,
    };
  },
};
</script>
<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
</style>