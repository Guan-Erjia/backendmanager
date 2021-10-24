<template>
  <el-container class="el-container">
    <el-header class="el-header">
      <div>
        <img class="title" src="@/assets/home.gif" alt="" />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-menu" @click="handleMenu">|||</div>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="orange"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <el-sub-menu
            v-for="item in MenuList.value"
            :key="item.id"
            :index="item.id + ''"
          >
            <template #title>
              <i :class="IconList[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              v-for="item1 in item.children"
              :key="item1.id"
              :index="'/' + item1.path"
              @click="saveState(item1)"
            >
              <template #title>
                <i class="el-icon-menu"></i>
                <span>{{ item1.authName }}</span>
              </template></el-menu-item
            >
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-main class="el-main"><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>
<script lang="ts">
import { getCurrentInstance, ref, reactive } from "vue";

export default {
  name: "Home",
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setup() {
    interface Imenulist {
      value?: Array<any>;
      [propName: string]: any;
    }
    const { proxy }: any = getCurrentInstance();

    const activePath = ref("/users");
    const isCollapse = ref(false);
    const IconList = {
      125: "iconfont icon-user",
      103: "iconfont icon-tijikongjian",
      101: "iconfont icon-shangpin",
      102: "iconfont icon-danju",
      145: "iconfont icon-baobiao",
    };

    //保存菜单栏状态
    const saveState = (val: any) => {
      window.sessionStorage.setItem("currentState", "/" + val.path);
      activePath.value = "/" + val.path;
    };

    //退出登录
    const logout = () => {
      window.sessionStorage.clear();
      proxy.$router.push("/login");
    };

    //初始化
    activePath.value = window.sessionStorage.getItem("currentState") as string;
    const MenuList: Imenulist = reactive({});
    proxy.$axios.get("menus").then((resolve: any) => {
      let response = resolve.data;
      if (response.meta.status !== 200) {
        return proxy.$message.error(response.meta.msg);
      }
      MenuList.value = response.data;
    });

    //菜单折叠
    const handleMenu = () => {
      isCollapse.value = !isCollapse.value;
    };
    return {
      logout,
      MenuList,
      isCollapse,
      IconList,
      activePath,
      handleMenu,
      saveState,
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
.iconfont {
  margin-right: 10px;
}
.toggle-menu {
  background-color: #4a5064;
  color: #fff;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
ul {
  border: 0;
}
.title {
  height: 60px;
}
</style>