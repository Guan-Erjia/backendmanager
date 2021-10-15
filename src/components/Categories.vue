<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品分类</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-row>
      <el-col>
        <el-button type="primary" @click="addCategory">添加分类</el-button>
      </el-col>
    </el-row>
    <div class="title">
      <div class="start">#</div>
      <div class="first">分类名称</div>
      <div class="second">是否有效</div>
      <div class="third">排序</div>
      <div class="forth">操作</div>
    </div>
    <el-tree
      :data="categoriesList.value"
      show-checkbox
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
      height="60px"
    >
      <template #default="{ data }">
        <span class="custom-tree-node">
          <span>{{ data.cat_name }}</span>
          <span>
            <i
              class="el-icon-success"
              style="color: lightgreen"
              v-if="!data.cat_deleted"
            ></i>
            <i class="el-icon-error" style="color: red" v-else></i>
          </span>
          <span>
            <el-tag v-if="data.cat_level == 0">一级</el-tag>
            <el-tag type="success" v-if="data.cat_level == 1">二级</el-tag>
            <el-tag type="warning" v-if="data.cat_level == 2">三级</el-tag>
          </span>
          <span>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              class="edit"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              class="delete"
              >删除</el-button
            >
          </span>
        </span>
      </template>
    </el-tree>
  </el-card>

  <el-dialog
    v-model="addCategoryDialogVisible"
    title="添加分类"
    width="50%"
    @close="addCateDialogClosed"
  >
    <el-form
      :model="addCateForm"
      :rules="addCateFormRules"
      ref="addCateFormRef"
      label-width="160px"
    >
      <el-form-item label="分类名称" prop="cat_name">
        <el-input v-model="addCateForm.cat_name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="父级分类">
        <el-cascader
          v-model="hasSelected"
          :options="parentCateList.value"
          :props="cascaderProps"
          @change="parentCateChanged"
          clearable
        ></el-cascader>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addCategoryDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addCate">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
interface Iresult {
  data: {
    data: Array<any>;
    meta: {
      msg: string;
      status: number;
    };
  };
  handers: any;
  request: XMLHttpRequest;
}
import { getCurrentInstance, reactive, ref } from "@vue/runtime-core";
export default {
  name: "Categories",
  setup() {
    const { proxy }: any = getCurrentInstance();
    const getCateList = () => {
      proxy.$axios
        .get("categories", {
          type: 3,
          pagenum: 1,
          pagesize: 5,
        })
        .then((resolve: Iresult) => {
          if (resolve.data.meta.status === 200) {
            categoriesList.value = resolve.data.data;
          } else {
            proxy.$message.error("获取商品分类失败");
          }
        });
    };
    getCateList();
    const categoriesList: any = reactive([]);
    const addCategoryDialogVisible: any = ref(false);
    const cascaderProps: any = reactive({
      expandTrigger: "hover",
      value: "cat_id",
      label: "cat_name",
      children: "children",
      checkStrictly: true,
    });
    const addCateForm: any = reactive({
      cat_name: "a",
      cat_pid: 0,
      cat_level: 0,
    });
    const parentCateList: any = reactive([]);
    const addCateFormRules: any = reactive({
      cat_name: [
        {
          required: true,
          message: "请输入分类名称",
          trigger: "blur",
        },
      ],
    });
    const hasSelected: any = reactive([0]);

    //获取添加的分类列表
    const addCategory = () => {
      proxy.$axios
        .get("categories", {
          type: 2,
        })
        .then((resolve: Iresult) => {
          if (resolve.data.meta.status === 200) {
            parentCateList.value = resolve.data.data;
            addCategoryDialogVisible.value = true;
          } else {
            proxy.$message.error("获取分类列表失败");
          }
        });
    };

    //表单改变
    const parentCateChanged = () => {
      console.log(proxy.hasSelected);
      if (proxy.hasSelected && proxy.hasSelected.length > 0) {
        addCateForm.cat_pid = proxy.hasSelected[hasSelected.length - 1];
        addCateForm.cat_level = proxy.hasSelected.length;
      } else {
        addCateForm.cat_pid = 0;
        addCateForm.cat_level = 0;
      }
    };
    const addCate = () => {
      console.log(proxy.addCateForm);
      proxy.$refs.addCateFormRef.validate((valid: boolean) => {
        if (!valid) {
          return;
        } else {
          proxy.$axios
            .post("categories", addCateForm)
            .then((resolve: Iresult) => {
              console.log(resolve);
              if (resolve.data.meta.status !== 201) {
                proxy.$message.failure("添加分类失败");
              } else {
                proxy.$message.success("添加分类成功");
                getCateList();
                addCategoryDialogVisible.value = false;
              }
            });
        }
      });
    };

    //关闭添加分类对话框
    const addCateDialogClosed = () => {
      proxy.$refs.addCateFormRef.resetFields();
      proxy.hasSelected.splice(0, hasSelected.length);
      proxy.addCateForm.cat_level = 0;
      proxy.addCateForm.cat_pid = 0;
    };
    return {
      categoriesList,
      hasSelected,
      addCategory,
      addCategoryDialogVisible,
      addCateForm,
      addCateFormRules,
      parentCateList,
      cascaderProps,
      parentCateChanged,
      addCate,
      addCateDialogClosed,
      getCateList,
    };
  },
};
</script>
<style lang="less" scoped>
i {
  position: absolute;
  right: 60%;
}
.el-tag {
  position: absolute;
  right: 35%;
}
.el-tree {
  font-size: 10px;
  margin-left: 50px;
}
.title {
  display: flex;
  margin: 15px 0;
}
.title div {
  font-size: 15px;
  flex-grow: 1;
}
.first {
  margin-left: -10px;
}

.edit {
  position: absolute;
  right: 16%;
}
.delete {
  position: absolute;
  right: 4%;
}
.el-cascader {
  width: 100px;
}
</style>