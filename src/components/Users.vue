<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card class="box-card">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-input
          placeholder="请输入内容"
          class="input-with-select"
          v-model="param.query"
          clearable
          @clear="getUserList"
        >
          <template #append>
            <el-button icon="el-icon-search" @click="getUserList"></el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="addDialogVisible = true"
          >添加用户</el-button
        >
      </el-col>
    </el-row>
    <!-- 用户列表区 -->
    <el-table :data="userList.value" style="width: 100%" border stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="username" label="姓名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="mobile" label="电话" />
      <el-table-column prop="role_name" label="角色" />
      <el-table-column prop="mg_state" label="状态" v-slot="scope">
        <el-switch
          v-model="scope.row.mg_state"
          @change="userDataChange(scope.row)"
        />
      </el-table-column>
      <el-table-column label="操作" width="180px" v-slot="scope">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-edit"
          @click="showEditDialog(scope)"
        ></el-button>
        <el-button
          type="danger"
          size="mini"
          icon="el-icon-delete"
          @click="removeUserById(scope.row.id)"
        ></el-button>
        <el-tooltip
          effect="dark"
          content="分配角色"
          placement="top-start"
          :enterable="false"
        >
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-setting"
            @click="setRole(scope.row)"
          ></el-button>
        </el-tooltip>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      :currentPage="param.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="param.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </el-card>

  <!-- 添加用户对话框 -->
  <el-dialog
    title="添加用户"
    width="50%"
    v-model="addDialogVisible"
    @close="addDialogClosed"
  >
    <el-form
      ref="addFormRef"
      :model="addForm"
      :rules="addFormRules"
      label-width="70px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addForm.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="addForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addUser">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 修改用户对话框 -->
  <el-dialog
    v-model="editDialogVisible"
    title="修改用户"
    width="50%"
    @close="editDialogClosed"
  >
    <el-form
      ref="editFormRef"
      :model="editForm"
      :rules="editFormRules"
      label-width="70px"
    >
      <el-form-item label="用户名">
        <el-input disabled v-model="editForm.username"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="editForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <span class="dialog-footer">
      <el-button type="primary" @click="editUserInfo">确认</el-button>
      <el-button @click="editDialogVisible = false">取消</el-button>
    </span>
  </el-dialog>

  <!-- 分配角色的对话框 -->
  <el-dialog
    title="分配角色"
    v-model="setRoleDialogVisible"
    width="50%"
    @close="setRoleDialogClosed"
  >
    <div>
      <p>当前的用户：{{ userInfo.username }}</p>
      <p>当前的角色：{{ userInfo.userInfo }}</p>
      <p>
        分配新角色：
        <el-select v-model="currentSelect" placeholder="Select">
          <el-option
            v-for="item in roleList.value"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </p>
    </div>
    <template #footer>
      <span>
        <el-button @click="setRoleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { getCurrentInstance, reactive } from "@vue/runtime-core";
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  name: "Users",
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setup() {
    const { proxy }: any = getCurrentInstance();
    const param = reactive({
      query: "",
      pagenum: 1,
      pagesize: 2,
    });
    const userList: any = reactive([]);
    const total = ref(0);
    const addDialogVisible = ref(false);
    const editDialogVisible = ref(false);
    const setRoleDialogVisible = ref(false);
    const currentSelect = ref("");
    const addForm: any = reactive({
      username: "",
      password: "",
      email: "",
      mobile: "",
    });
    const editForm: any = reactive({
      id: "",
      username: "",
      email: "",
      mobile: "",
    });
    const userInfo: any = reactive({});
    const roleList: any = reactive({});
    //校验邮箱
    const checkEmail = (rule: any, value: string, cb: any) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };
    //校验手机号
    const checkMobile = (rule: any, value: string, cb: any) => {
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的手机号"));
    };
    const addFormRules = {
      username: [
        { required: true, message: "请输入用户名", trigger: "blur" },
        {
          min: 3,
          max: 10,
          message: "用户名的长读在3~10个字符之间",
          trigger: "blur",
        },
      ],
      password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        {
          min: 6,
          max: 15,
          message: "用户名的长读在6~15个字符之间",
          trigger: "blur",
        },
      ],
      email: [
        { required: true, message: "请输入邮箱", trigger: "blur" },
        { validator: checkEmail },
      ],
      mobile: [
        { required: true, message: "请输入手机", trigger: "blur" },
        { validator: checkMobile },
      ],
    };
    const editFormRules = {
      email: [
        { required: true, message: "请输入邮箱", trigger: "blur" },
        { validator: checkEmail },
      ],
      mobile: [
        { required: true, message: "请输入手机", trigger: "blur" },
        { validator: checkMobile },
      ],
    };
    //添加用户
    const addUser = () => {
      proxy.$refs.addFormRef.validate((valid: boolean) => {
        if (!valid) {
          return;
        }
        proxy.$axios.post("users", addForm).then((resolve: any) => {
          let response = resolve.data;
          if (response.meta.status !== 201) {
            return proxy.$message.error("添加失败");
          }
          addDialogVisible.value = false;
          getUserList();
          proxy.$message.success("添加成功");
        });
      });
    };

    //编辑表单提交
    const editUserInfo = () => {
      proxy.$refs.editFormRef.validate((valid: boolean) => {
        if (valid) {
          console.log("users/" + editForm.id);
          proxy.$axios
            .put("users/" + editForm.id, {
              email: editForm.email,
              mobile: editForm.mobile,
            })
            .then((resolve: any) => {
              let response = resolve.data;
              console.log(response);
              if (response.meta.status !== 200) {
                return proxy.$message.error("编辑用户信息失败");
              }
              editDialogVisible.value = false;
              getUserList();
              proxy.$message.success("编辑用户信息成功");
            });
        }
      });
    };

    //数据请求
    const handleSizeChange = (newSize: number) => {
      param.pagesize = newSize;
      getUserList();
    };
    const handleCurrentChange = (newPage: number) => {
      param.pagenum = newPage;
      getUserList();
    };
    const getUserList = () => {
      proxy.$axios
        .get("users", {
          params: param,
        })
        .then((resolve: any) => {
          let response = resolve.data;
          if (response.meta.status !== 200) {
            return proxy.$message.error("获取列表失败");
          }
          userList.value = response.data.users;
          total.value = response.data.total;
        });
    };
    getUserList();

    //清空添加用户表单
    const addDialogClosed = () => {
      proxy.$refs.addFormRef.resetFields();
    };
    //清空编辑用户表单
    const editDialogClosed = () => {
      proxy.$refs.editFormRef.resetFields();
    };

    //数据状态更改
    const userDataChange = (val: any) => {
      proxy.$axios
        .put(`users/${val.id}/state/${val.mg_state}`)
        .then((resolve: any) => {
          if (resolve.data.meta.status !== 200) {
            val.mg_state = !val.mg_state;
            return proxy.$message.error("处理失败");
          }
          return proxy.$message.success("处理成功");
        });
    };

    //展示编辑对话框
    const showEditDialog = (scope: any) => {
      editDialogVisible.value = true;
      proxy.$axios.get(`users/${scope.row.id}`).then((resolve: any) => {
        let response = resolve.data;
        if (response.meta.status !== 200) {
          return proxy.$message.error("数据查询失败");
        }
        editForm.id = response.data.id;
        editForm.username = response.data.username;
        editForm.email = response.data.email;
        editForm.mobile = response.data.mobile;
        // proxy.$message.success("数据查询成功");
      });
    };

    //删除用户
    const removeUserById = (val: number) => {
      ElMessageBox.confirm("是否删除该用户", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((resolve) => {
          if (resolve === "confirm") {
            console.log("user/" + val);
            proxy.$axios.delete("users/" + val).then((resolve: any) => {
              console.log(resolve.data.meta.status);
              if (resolve.data.meta.status === 200) {
                ElMessage({
                  type: "success",
                  message: "删除成功",
                });
                getUserList();
              } else {
                ElMessage({
                  type: "error",
                  message: "删除失败",
                });
                getUserList();
              }
            });
          }
        })
        .catch((reject) => {
          if (reject === "cancel") {
            ElMessage({
              type: "info",
              message: "已取消删除",
            });
          }
        });
    };

    //分配角色
    const setRole = (val: any) => {
      userInfo.username = val.username;
      userInfo.userInfo = val.role_name;
      userInfo.userId = val.id;
      proxy.$axios.get("roles").then((resolve: any) => {
        if (resolve.data.meta.status === 200) {
          roleList.value = resolve.data.data;
          setRoleDialogVisible.value = true;
        } else {
          proxy.$message.failure("获取角色列表失败");
        }
      });
    };

    //确定分配角色
    const saveRoleInfo = () => {
      if (!currentSelect.value) {
        return proxy.$message.error("请选择要分配的角色");
      }
      proxy.$axios
        .put(`users/${userInfo.userId}/role`, {
          rid: currentSelect.value,
        })
        .then((resolve: any) => {
          if (resolve.data.meta.status !== 200) {
            proxy.$message.error("分配角色失败！");
          } else {
            proxy.$message.success("分配角色成功！");
            getUserList;
            setRoleDialogVisible.value = false;
          }
        });
    };

    //分配角色关闭事件
    const setRoleDialogClosed = () => {
      currentSelect.value = "";
      userInfo.value = {};
    };
    return {
      userList,
      addDialogVisible,
      editDialogVisible,
      addForm,
      editForm,
      total,
      param,
      handleSizeChange,
      handleCurrentChange,
      getUserList,
      userDataChange,
      addFormRules,
      editFormRules,
      addDialogClosed,
      editDialogClosed,
      addUser,
      showEditDialog,
      editUserInfo,
      removeUserById,
      setRoleDialogVisible,
      setRole,
      userInfo,
      roleList,
      currentSelect,
      saveRoleInfo,
      setRoleDialogClosed,
    };
  },
};
</script>
<style lang="less" scoped>
.text {
  font-size: 14px;
}
.item {
  padding: 18px 0;
}
</style>