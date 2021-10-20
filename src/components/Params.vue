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
          placeholder="请选择"
        ></el-cascader>
      </el-col>
    </el-row>

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!-- 添加动态参数 -->
      <el-tab-pane label="动态参数" name="many">
        <el-button
          type="primary"
          size="mini"
          :disabled="buttonUseable"
          @click="showAddParamsDialog"
          >添加参数</el-button
        >
        <!-- 动态参数表格 -->
        <el-table :data="manyTableData.value" border stripe>
          <el-table-column type="expand" v-slot="scope">
            <!-- 标签渲染 -->

            <span>{{ scope.row }}</span>
            <el-tag
              v-for="(item, index) in scope.row.attr_vals"
              :key="index"
              closable
              @close="handleClosed(index, scope.row)"
              >{{ item }}</el-tag
            >
            <el-input
              v-show="scope.row.inputVisible"
              ref="saveTagInput"
              v-model="scope.row.inputValue"
              class="input-new-tag"
              size="mini"
              @keyup.enter="handleInputConfirm(scope.row)"
              @blur="handleInputConfirm(scope.row)"
            >
            </el-input>
            <el-button
              v-show="!scope.row.inputVisible"
              class="button-new-tag"
              size="small"
              @click="showInput(scope.row)"
              >+ New Tag</el-button
            >
          </el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="参数名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作" v-slot="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.attr_id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="showDeleteDialog(scope.row.attr_id)"
              >删除</el-button
            >
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 添加静态属性 -->
      <el-tab-pane label="静态属性" name="only"
        ><el-button
          type="primary"
          size="mini"
          :disabled="buttonUseable"
          @click="showAddParamsDialog"
          >添加属性</el-button
        >
        <!-- 静态属性表格 -->
        <el-table :data="onlyTableData.value" border stripe>
          <el-table-column type="expand" v-slot="scope">
            <!-- 标签渲染 -->
            <el-tag
              v-for="(item, index) in scope.row.attr_vals"
              :key="index"
              closable
              @close="handleClosed(index, scope.row)"
              >{{ item }}</el-tag
            >
            <el-input
              v-if="scope.row.inputVisible"
              ref="saveTagInput"
              v-model="scope.row.inputValue"
              class="input-new-tag"
              size="mini"
              @keyup.enter="handleInputConfirm(scope.row)"
              @blur="handleInputConfirm(scope.row)"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput(scope.row)"
              >+ New Tag</el-button
            >
          </el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作" v-slot="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.attr_id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="showDeleteDialog(scope.row.attr_id)"
              >删除</el-button
            >
          </el-table-column>
        </el-table></el-tab-pane
      >
    </el-tabs>
  </el-card>
  <!-- 添加参数的对话框 -->
  <el-dialog
    v-model="paramDialogVisible"
    :title="'添加' + paramDialogTitle"
    width="30%"
    :before-close="paramDialogClose"
  >
    <!-- 添加参数的表单 -->
    <el-form
      ref="addFormRef"
      :model="addForm"
      :rules="addFormRules"
      label-width="100px"
    >
      <el-form-item :label="paramDialogTitle" prop="attr_name">
        <el-input v-model="addForm.attr_name"></el-input> </el-form-item
    ></el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="paramDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAddParam">确定</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 点击修改参数的对话框 -->
  <el-dialog
    v-model="editDialogVisible"
    :title="'修改' + paramDialogTitle"
    width="50%"
    :before-close="editDialogClose"
  >
    <!-- 添加参数的表单 -->
    <el-form
      ref="editFormRef"
      :model="editForm"
      :rules="editFormRules"
      label-width="100px"
    >
      <el-form-item :label="paramDialogTitle" prop="attr_name">
        <el-input v-model="editForm.attr_name"></el-input> </el-form-item
    ></el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmEditParam">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { getCurrentInstance, reactive } from "@vue/runtime-core";
import { nextTick, Ref, ref } from "vue";
export default {
  name: "Params",
  setup(): any {
    const { proxy }: any = getCurrentInstance();
    const cartList: any = reactive([]);
    const buttonUseable: Ref<boolean> = ref(true);

    const currentCheck: any = reactive([]);
    const cateId: any = ref("");
    const activeName = ref("many");

    const manyTableData: any = reactive([]);
    const onlyTableData: any = reactive([]);
    const titleText: Ref<string> = ref("");
    const paramDialogVisible: Ref<boolean> = ref(false);
    const editDialogVisible: Ref<boolean> = ref(false);
    const addForm: any = reactive({});
    const editForm: any = reactive({});
    const paramDialogTitle: Ref<string> = ref("");
    const addFormRules = reactive({
      attr_name: [
        {
          required: true,
          message: "请输入参数名称",
          trigger: "blur",
        },
      ],
    });
    const editFormRules = reactive({
      attr_name: [
        {
          required: true,
          message: "请输入参数名称",
          trigger: "blur",
        },
      ],
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
      buttonUseable.value = false;
      if (proxy.currentCheck.length !== 3) {
        proxy.currentCheck.splice(0, proxy.currentCheck.length);
        buttonUseable.value = true;
      } else if (proxy.currentCheck.length === 3) {
        cateId.value = proxy.currentCheck[2];
        getParams();
      }
    };

    //获取参数列表
    const getParams = () => {
      proxy.$axios
        .get(`categories/${cateId.value}/attributes`, {
          params: { sel: activeName.value },
        })
        .then((resolve: any) => {
          if (resolve.data.meta.status === 200) {
            if (activeName.value === "many") {
              resolve.data.data.map((item: any) => {
                //控制文本框显示与隐藏
                item.inputVisible = false;
                //文本框中输入的值
                item.inputValue = "";
                item.attr_vals = item.attr_vals
                  ? item.attr_vals.split(",")
                  : [];
              });
              manyTableData.value = resolve.data.data;
            } else {
              resolve.data.data.forEach((item: any) => {
                item.attr_vals = item.attr_vals.split(",");
              });
              onlyTableData.value = resolve.data.data;
            }
          } else {
            1;
            proxy.$message.error("获取参数失败");
          }
        });
    };

    //显示添加参数对话框
    const showAddParamsDialog = () => {
      paramDialogVisible.value = true;
      if (activeName.value === "many") {
        paramDialogTitle.value = "动态参数";
      } else {
        paramDialogTitle.value = "静态属性";
      }
    };

    //显示修改参数对话框
    const showEditDialog = (val: number) => {
      console.log(val);
      editDialogVisible.value = true;
      if (activeName.value === "many") {
        paramDialogTitle.value = "动态参数";
      } else {
        paramDialogTitle.value = "静态属性";
      }
      console.log(cateId.value, val);
      proxy.$axios
        .get("categories/" + cateId.value + "/attributes/" + val, {
          patams: {
            attr_sel: activeName.value,
          },
        })
        .then((resolve: any) => {
          if (resolve.data.meta.status === 200) {
            console.log(resolve.data.data);
            editForm.attr_id = resolve.data.data.attr_id;
            editForm.attr_name = resolve.data.data.attr_name;
            editForm.cat_id = resolve.data.data.cat_id;
            editForm.attr_sel = resolve.data.data.attr_sel;
            editForm.attr_vals = resolve.data.data.attr_vals;
            editForm.attr_write = resolve.data.data.attr_write;
            editForm.cat_id = resolve.data.data.cat_id;
          } else {
            proxy.$message.error("获取信息失败");
          }
        });
    };

    //显示删除对话框
    const showDeleteDialog = (val: number) => {
      proxy
        .$confirm("此操作将永久删除该参数，是否继续？", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then((resolve: string) => {
          if (resolve === "confirm") {
            proxy.$axios
              .delete(`categories/${cateId.value}/attributes/${val}`)
              .then((resolve: any) => {
                if (resolve.data.meta.status === 200) {
                  proxy.$message.success("删除参数成功");
                  getParams();
                } else {
                  proxy.$message.error("删除参数失败");
                  getParams();
                }
              });
          }
        })
        .catch(() => {
          proxy.$message.info("已取消删除");
          return;
        });
    };

    //重置表单操作
    const paramDialogClose = () => {
      proxy.$refs.addFormRef.resetFields();
      paramDialogVisible.value = false;
    };
    const editDialogClose = () => {
      proxy.$refs.editFormRef.resetFields();
      editDialogVisible.value = false;
    };
    //刷新数据
    const handleClick = () => {
      getParams();
      return;
    };

    //确认提交操作
    const confirmAddParam = () => {
      proxy.$refs.addFormRef.validate((valid: boolean) => {
        if (valid) {
          proxy.$axios
            .post(`categories/${cateId.value}/attributes`, {
              attr_name: addForm.attr_name,
              attr_sel: activeName.value,
            })
            .then((resolve: any) => {
              if (resolve.data.meta.status === 201) {
                paramDialogVisible.value = false;
                proxy.$message.success("添加参数成功");
                getParams();
              } else {
                proxy.$message.error("添加参数失败");
              }
            });
        }
      });

      paramDialogVisible.value = false;
    };
    const confirmEditParam = () => {
      proxy.$refs.editFormRef.validate((valid: boolean) => {
        if (valid) {
          proxy.$axios
            .put(`categories/${cateId.value}/attributes/${editForm.attr_id}`, {
              attr_name: editForm.attr_name,
              attr_sel: activeName.value,
            })
            .then((resolve: any) => {
              console.log(resolve);
              if (resolve.data.meta.status === 200) {
                proxy.$message.success("修改成功");
                editDialogVisible.value = false;
                getParams();
              } else {
                proxy.$message.success("修改失败");
                getParams();
              }
            });
        }
      });
    };

    //文本框失去焦点或者按下enter
    const handleInputConfirm = (val: any) => {
      if (val.inputValue.trim().length === 0) {
        val.inputValue = "";
        val.inputVisible = false;
        return;
      }
      val.attr_vals.push(val.inputValue.trim());
      val.inputValue = "";
      val.inputVisible = false;
      saveAttrVals(val);
    };

    //展开输入框
    const showInput = (val: any) => {
      val.inputVisible = true;
      nextTick(() => {
        // console.log(proxy);
        // proxy.$refs.saveTagInput.$refs.input.focus();
      });
    };

    //保存操作
    const saveAttrVals = (row: any) => {
      proxy.$axios
        .put(`categories/${cateId.value}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(""),
        })
        .then((resolve: any) => {
          console.log(resolve);
          if (resolve.data.meta.status === 200) {
            proxy.$message.success("修改参数成功");
          } else {
            proxy.$message.error("修改参数失败");
          }
        });
    };
    //删除el-tag
    const handleClosed = (val: number, row: any) => {
      row.attr_vals.splice(val, 1);
      saveAttrVals(row);
    };
    return {
      getCateList,
      cartList,
      currentCheck,
      handleChange,
      cateProps,
      activeName,
      handleClick,
      buttonUseable,
      cateId,
      getParams,
      manyTableData,
      onlyTableData,
      titleText,
      showAddParamsDialog,
      paramDialogVisible,
      editDialogVisible,
      paramDialogTitle,
      paramDialogClose,
      addForm,
      editForm,
      addFormRules,
      editFormRules,
      confirmAddParam,
      confirmEditParam,
      showEditDialog,
      editDialogClose,
      showDeleteDialog,
      handleInputConfirm,
      showInput,
      handleClosed,
      saveAttrVals,
    };
  },
};
</script>
<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 5px 10px;
}
.input-new-tag {
  width: 150px;
}
</style>