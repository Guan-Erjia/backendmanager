<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-row>
      <el-col>
        <el-button type="primary" @click="showAddRoleDialog"
          >添加角色</el-button
        >
      </el-col>
    </el-row>
    <el-table :data="rolesList.value" border stripe>
      <el-table-column type="expand" v-slot="scope">
        <el-row
          :class="['vcenter', 'bdbottom', index === 0 ? 'bdtop' : '']"
          v-for="(item, index) in scope.row.children"
          :key="item.id"
        >
          <!-- 渲染一级权限 -->
          <el-col :span="5">
            <el-tag closable @close="reomveRightById(scope.row, item.id)">{{
              item.authName
            }}</el-tag>
            <i class="el-icon-caret-right"></i>
          </el-col>
          <!-- 渲染二级权限 -->
          <el-col :span="19">
            <el-row
              v-for="(item1, index1) in item.children"
              :key="item1.id"
              :class="['vcenter', index1 === 0 ? '' : 'bdtop']"
            >
              <el-col :span="6">
                <el-tag
                  closable
                  @close="reomveRightById(scope.row, item1.id)"
                  type="success"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="18">
                <el-tag
                  v-for="item2 in item1.children"
                  :key="item2.id"
                  type="warning"
                  v-slot="scope"
                  closable
                  @close="reomveRightById(scope.row, item2.id)"
                  >{{ item2.authName }}</el-tag
                >
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-table-column>
      <el-table-column type="index" align="center" label="#"></el-table-column>
      <el-table-column label="角色名称" align="center" min-width="200" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" align="center" min-width="200" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" align="center" min-width="250" v-slot="scope">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="mini"
          @click="showEditRoleDialog(scope.row)"
          >编辑</el-button
        >
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          @click="deleteRole(scope.row)"
          >删除</el-button
        >
        <el-button
          type="warning"
          icon="el-icon-setting"
          size="mini"
          @click="showSetRightDialog(scope.row)"
          >分配权限</el-button
        >
      </el-table-column>
    </el-table>
  </el-card>

  <!-- 分配权限对话框 -->
  <el-dialog
    v-model="setRightDialogVisible"
    title="分配权限"
    width="50%"
    @close="setRightDialogClosed"
  >
    <!-- 树形控件 -->
    <el-tree
      :data="rightList.value"
      :props="treeProps"
      show-checkbox
      node-key="id"
      default-expand-all
      :default-checked-keys="defKeys"
      ref="treeRef"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="allotRights">确定</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 添加角色对话框 -->
  <el-dialog
    v-model="addRoleDialogVisible"
    title="添加角色"
    width="50%"
    @close="addRoleDialogClosed"
  >
    <el-form
      :model="addRoleForm"
      :rules="addRoleFormRules"
      ref="addRoleFormRef"
      label-width="160px"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="addRoleForm.roleName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="addRoleForm.roleDesc" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addRole">确定</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 编辑角色对话框 -->
  <el-dialog
    v-model="editRoleDialogVisible"
    title="编辑角色"
    width="50%"
    @close="editRoleDialogClosed"
  >
    <el-form
      :model="editRoleForm"
      :rules="editRoleFormRules"
      ref="editRoleFormRef"
      label-width="160px"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="editRoleForm.roleName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="editRoleForm.roleDesc" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editRole">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { getCurrentInstance, reactive, Ref, ref } from "vue";
export default {
  name: "Roles",
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setup() {
    const { proxy }: any = getCurrentInstance();
    const roleId: Ref<string> = ref("");
    const rolesList: any = reactive([]);
    const rightList: any = reactive([]);
    const treeProps: any = reactive({
      label: "authName",
      children: "children",
    });
    let defKeys: any = reactive([]);
    const setRightDialogVisible: any = ref(false);
    const getRolesList = () => {
      proxy.$axios.get("roles").then((resolve: any) => {
        let response = resolve.data;
        if (response.meta.status !== 200) {
          return proxy.$message.error("获取角色信息失败");
        } else {
          rolesList.value = response.data;
        }
      });
    };
    getRolesList();

    const reomveRightById = (role: any, rightId: number) => {
      proxy
        .$confirm("是否永久删除此权限？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          proxy.$axios
            .delete(`roles/${role.id}/rights/${rightId}`)
            .then((resolve: any) => {
              if (resolve.data.meta.status === 200) {
                proxy.$message.success("权限删除成功！");
                role.children = resolve.data.data;
              } else {
                proxy.$message.error("权限删除失败！");
              }
            });
        })
        .catch(() => {
          proxy.$message.info("取消了删除操作！");
        });
    };

    //获取角色下所有三级权限
    const getLeafKeys = (node: any, arr: any) => {
      if (!node.children) {
        console.log("aaaa");
        return arr.push(node.id);
      } else {
        node.children.forEach((item: any) => {
          getLeafKeys(item, arr);
        });
      }
    };

    //对话框开启
    const showSetRightDialog = (role: any) => {
      roleId.value = role.id;
      proxy.$axios.get("rights/tree").then((resolve: any) => {
        if (resolve.data.meta.status === 200) {
          rightList.value = resolve.data.data;
        }
        proxy.getLeafKeys(role, defKeys);
      });
      setRightDialogVisible.value = true;
    };

    //关闭对话框
    const setRightDialogClosed = () => {
      defKeys.splice(0, defKeys.length);
    };

    //确定分配权限
    const allotRights = () => {
      const keys = [
        ...proxy.$refs.treeRef.getCheckedKeys(),
        ...proxy.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      proxy.$axios
        .post(`roles/${roleId.value}/rights`, { rids: idStr })
        .then((resolve: any) => {
          if (resolve.data.meta.status === 200) {
            getRolesList();
            setRightDialogVisible.value = false;
            proxy.$message.success("更新成功");
          } else {
            proxy.$message.error("更新失败");
          }
        });
    };

    //添加角色
    const showAddRoleDialog = () => {
      addRoleDialogVisible.value = true;
    };
    const addRoleDialogVisible: Ref<boolean> = ref(false);
    const addRoleForm = reactive({
      roleName: "",
      roleDesc: "",
    });
    const addRoleFormRules: any = reactive({
      roleName: [
        {
          required: true,
          message: "请输入分类名称",
          trigger: "blur",
        },
      ],
    });
    const addRole = () => {
      proxy.$axios.post("roles", addRoleForm).then((resolve: any) => {
        if (resolve.data.meta.status === 201) {
          proxy.$message.success(
            "ID:" + resolve.data.data.roleId + resolve.data.meta.msg
          );
          getRolesList();
          addRoleDialogVisible.value = false;
        } else {
          proxy.$message.error("创建失败");
          getRolesList();
        }
      });
    };
    const addRoleDialogClosed = () => {
      proxy.$refs.addRoleFormRef.resetFields();
    };

    //编辑角色
    const editRoleID = ref(0);
    const showEditRoleDialog = (val: any) => {
      editRoleID.value = val.id;
      editRoleDialogVisible.value = true;
      return;
    };
    const editRoleDialogVisible: Ref<boolean> = ref(false);
    const editRoleForm = reactive({
      roleName: "",
      roleDesc: "",
    });
    const editRoleFormRules: any = reactive({
      roleName: [
        {
          required: true,
          message: "请输入分类名称",
          trigger: "blur",
        },
      ],
    });
    const editRole = () => {
      proxy.$axios
        .put(`roles/${editRoleID.value}`, editRoleForm)
        .then((resolve: any) => {
          if (resolve.data.meta.status === 200) {
            proxy.$message.success(
              "ID:" + resolve.data.data.roleId + "编辑成功"
            );
            editRoleDialogVisible.value = false;
            getRolesList();
          } else {
            proxy.$message.error("编辑失败");
            getRolesList();
          }
        });
    };
    const editRoleDialogClosed = () => {
      proxy.$refs.editRoleFormRef.resetFields();
    };

    //删除角色
    const deleteRole = (val: any) => {
      proxy
        .$confirm("此操作将永久删除角色，是否继续？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then((resolve: boolean) => {
          if (resolve) {
            proxy.$axios.delete(`roles/${val.id}`).then((resolve: any) => {
              if (resolve.data.meta.status === 200) {
                proxy.$message.success("删除角色成功");
                getRolesList();
              } else {
                proxy.$message.error("删除角色失败");
                getRolesList();
              }
            });
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    };

    return {
      rolesList,
      rightList,
      treeProps,
      setRightDialogVisible,
      getRolesList,
      reomveRightById,
      showSetRightDialog,
      defKeys,
      getLeafKeys,
      setRightDialogClosed,
      allotRights,
      roleId,
      showAddRoleDialog,
      addRoleForm,
      addRoleDialogVisible,
      addRoleFormRules,
      addRole,
      showEditRoleDialog,
      addRoleDialogClosed,
      editRoleDialogVisible,
      editRoleForm,
      editRoleFormRules,
      editRole,
      editRoleDialogClosed,
      editRoleID,
      deleteRole,
    };
  },
};
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>