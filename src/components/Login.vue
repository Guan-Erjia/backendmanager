<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="@/assets/logo.png" alt="" />
      </div>
      <el-form
        :model="login_form"
        label-width="0px"
        class="login_form"
        :rules="loginFormRule"
        ref="login_form_ref"
      >
        <el-form-item label="" prop="username">
          <el-input
            v-model="login_form.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input
            v-model="login_form.password"
            type="password"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button prefix-icon="" type="info" @click="resetLoginForm"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { reactive, ref } from "@vue/reactivity";
import { getCurrentInstance } from "vue";
export default {
  name: "Login",
  setup() {
    const login_form = reactive({
      username: "admin",
      password: "123456",
    });
    const loginFormRule = reactive({
      //用户名验证
      username: [
        { require: true, message: "请输入登录名称", trigger: "blur" },
        { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" },
      ],
      //密码验证
      password: [
        { require: true, message: "请输入登录名称", trigger: "blur" },
        { min: 6, max: 15, message: "长度在 6到 15 个字符", trigger: "blur" },
      ],
    });
    let login_form_ref = ref(null);
    const resetLoginForm = () => {
      login_form_ref.value.resetFields();
    };
    //通过代理获取挂载axios
    const { proxy } = getCurrentInstance();
    const login = () => {
      login_form_ref.value.validate(async (valid) => {
        if (!valid) return;
        // let params = {
        //   username: login_form.username,
        //   password: login_form.password,
        // };
        let { data: result } = await proxy.$axios.post("login", login_form);
        if (result.meta.status !== 200) {
          return proxy.$message.error("登录失败");
        }
        proxy.$message.success("登录成功");
        window.sessionStorage.setItem("token", result.data.token);
        proxy.$router.push("/home");
      });
    };
    return {
      login_form,
      loginFormRule,
      resetLoginForm,
      login_form_ref,
      login,
    };
  },
};
</script>
<style lang='less' scoped>
.login_container {
  background-color: #2b4b6b;
  width: 100%;
  height: 100%;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avatar_box {
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      position: absolute;
      left: 50%;
      padding: 10px;
      transform: translate(-50%, -50%);
      img {
        width: 100%;
        height: 100%;
        background-color: #eee;
        border-radius: 50%;
      }
    }
  }
}
.btns {
  display: flex;
  width: 100%;
  text-align: right;
  justify-content: space-between;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>