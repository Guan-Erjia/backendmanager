<template>
  <el-container class="el-container">
    <el-header class="el-header">
      <div>
        <img src="@/assets/heima.png" alt="" />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
        >
          <el-sub-menu
            v-for="item in MenuList"
            :key="item.id"
            :index="item.id + ''"
          >
            <template #title>
              <i class="el-icon-location"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              v-for="item1 in item.children"
              :key="item1.id"
              :index="item1.id + ''"
            >
              <template #title>
                <i class="el-icon-location"></i>
                <span>{{ item1.authName }}</span>
              </template></el-menu-item
            >
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-main class="el-main">Main</el-main>
    </el-container>
  </el-container>
</template>
<script>
import { getCurrentInstance, created, reactive } from "vue";

export default {
  name: "Home",
  setup() {
    const { proxy } = getCurrentInstance();
    const MenuList = reactive({});
    const logout = () => {
      window.sessionStorage.clear();
      proxy.$router.push("/login");
    };
    proxy.$axios.get("menus").then((resolve) => {
      let response = resolve.data;
      if (response.meta.status !== 200) {
        return proxy.$message.error(response.meta.msg);
      }
      proxy.MenuList = response.data;
      console.log(proxy.MenuList);
    });
    return {
      logout,
      MenuList,
    };
  },
};
</script>
<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  color: #fff;
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0px;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
    > span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  height: calc(100vh-200px);
}
.el-main {
  background: #eaedf1;
}
</style>