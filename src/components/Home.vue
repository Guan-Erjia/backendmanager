<template>
  <el-button type="info" @click="logout">退出</el-button>
</template>
<script>
import { getCurrentInstance } from "vue";

export default {
  name: "Home",
  setup() {
    const { proxy } = getCurrentInstance();
    const logout = () => {
      window.sessionStorage.clear();
      proxy.$router.push("/login");
    };
    return {
      logout,
    };
  },
};
</script>