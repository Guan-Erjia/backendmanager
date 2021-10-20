<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>添加商品</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <!-- 提示区 -->
    <el-alert
      title="添加商品信息"
      type="info"
      center
      show-icon
      :closable="false"
    ></el-alert>
    <!-- 步骤条 -->
    <el-steps
      :space="200"
      :active="currentStep"
      finish-status="success"
      align-center
    >
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <el-form
      :model="addForm"
      :rules="addFormRules"
      ref="addFormRef"
      label-width="100px"
      label-position="top"
    >
      <el-tabs
        v-model="activeIndex"
        tab-position="left"
        :before-leave="beforeTabLeave"
        @tab-click="tabClick"
      >
        <el-tab-pane label="基本信息" name="0"
          ><el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input></el-form-item
          ><el-form-item label="商品价格" prop="goods_price">
            <el-input
              v-model="addForm.goods_price"
              type="number"
            ></el-input></el-form-item
          ><el-form-item label="商品重量" prop="goods_weight">
            <el-input
              v-model="addForm.goods_weight"
              type="number"
            ></el-input></el-form-item
          ><el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addForm.goods_number" type="number"></el-input
          ></el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
              v-model="addForm.goods_cat"
              :options="cateList.value"
              :props="cateProps"
              @change="handleChange"
              placeholder="请选择"
            ></el-cascader></el-form-item
        ></el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form-item
            :label="item.attr_name"
            v-for="item in manyTableData.value"
            :key="item.attr_name"
          >
            <!-- 复选框 -->
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox
                border
                :label="item1"
                v-for="(item1, index1) in item.attr_vals"
                :key="index1"
              /> </el-checkbox-group
          ></el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item
            :label="item.attr_name"
            v-for="item in onlyTableData.value"
            :key="item.attr_id"
          >
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            class="upload-demo"
            action="https://lianghj.top:8888/api/private/v1/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :headers="headerObj"
            :on-success="handleSuccess"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <!-- 富文本编辑器组件 -->
          <div id="div1"></div>
          <el-button type="primary" class="btnAdd" @click="addGoods"
            >添加商品</el-button
          >
        </el-tab-pane>
        <el-tab-pane label="完成" name="5"
          ><el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input></el-form-item
        ></el-tab-pane> </el-tabs
    ></el-form>
  </el-card>
  <el-dialog title="图片预览" v-model="previewVisible" width="50%">
    <img :src="previewPath" class="previewImage" alt="" />
  </el-dialog>
</template>
<script lang="ts">
import { Ref } from "vue-demi";
import { computed, getCurrentInstance, onMounted, reactive, ref } from "vue";

//富文本编辑器
import E from "wangeditor";
import _ from "lodash";

export default {
  name: "Add",
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setup() {
    const { proxy }: any = getCurrentInstance();
    const activeIndex: Ref<string> = ref("0");
    const headerObj = reactive({
      Authorization: window.sessionStorage.getItem("token"),
    });
    const currentStep: Ref<number> = computed(() =>
      parseInt(activeIndex.value)
    );
    const manyTableData: any = reactive([]);
    const onlyTableData: any = reactive([]);
    const checkList: any = reactive([]);
    const previewPath: any = ref("");
    const previewVisible = ref(false);
    const editorSelf: any = reactive({});
    const addForm: any = reactive({
      goods_name: "",
      goods_price: 0,
      goods_weight: 0,
      goods_number: 0,
      //商品所属的分类数组
      goods_cat: [],
      pics: [],
      //商品详情描述
      goods_introduce: "",
      attrs: [],
    });
    const cateProps = reactive({
      label: "cat_name",
      value: "cat_id",
      children: "children",
      expandTrigger: "hover",
    });
    const addFormRules = reactive({
      goods_name: [
        { required: true, message: "请输入商品名称", trigger: "blur" },
      ],
      goods_price: [
        { required: true, message: "请输入商品价格", trigger: "blur" },
      ],
      goods_weight: [
        { required: true, message: "请输入商品重量", trigger: "blur" },
      ],
      goods_number: [
        { required: true, message: "请输入商品数量", trigger: "blur" },
      ],
      goods_cat: [
        { required: true, message: "请选择商品分类", trigger: "blur" },
      ],
    });
    const getCateList = () => {
      proxy.$axios.get("categories").then((resolve: any) => {
        if (resolve.data.meta.status === 200) {
          cateList.value = resolve.data.data;
        } else {
          proxy.$message.error("获取商品分类失败");
        }
      });
    };
    getCateList();
    const cateList: any = reactive([]);
    const currentSelect: any = reactive([]);
    //级联选择器选中项变化处理
    const handleChange = () => {
      // if (addForm.goods_cat.length === 3) {
      //   console.log(addForm);
      // } else {
      //   addForm.goods_cat.splice(0, addForm.goods_cat.length);
      //   proxy.$message.error("请选择三级分类");
      //   console.log(addForm);
      // }
    };

    //标签页离开验证
    const beforeTabLeave = (active: string, old: string) => {
      if (parseInt(old) + 1 === parseInt(active) || old > active) {
        return true;
      } else {
        return false;
      }
    };

    //点击标签页
    const tabClick = async () => {
      let catId = 465;
      if (addForm.goods_cat.length !== 0) {
        catId = addForm.goods_cat[addForm.goods_cat.length - 1];
      }
      if (currentStep.value === 1) {
        const { data: res } = await proxy.$axios.get(
          `categories/${catId}/attributes`,
          {
            params: {
              sel: "many",
            },
          }
        );
        if (res.meta.status === 200) {
          res.data.forEach((item: any) => {
            item.attr_vals =
              item.attr_vals.length === 0 ? [] : item.attr_vals.split(",");
          });
          manyTableData.value = res.data;
        } else {
          return proxy.$message.error("获取动态参数列表失败");
        }
      } else if (currentStep.value === 2) {
        const { data: res } = await proxy.$axios.get(
          `categories/${catId}/attributes`,
          {
            params: {
              sel: "only",
            },
          }
        );
        if (res.meta.status === 200) {
          onlyTableData.value = res.data;
        } else {
          return proxy.$message.error("获取静态属性列表失败");
        }
      }
    };

    //图片预览
    const handlePreview = (file: any) => {
      previewPath.value = file.response.data.url;
      previewVisible.value = true;
    };
    //图片移除
    const handleRemove = (file: any) => {
      const filePath = file.response.data.tmp_path;
      const i = addForm.pics.findIndex((x: any) => {
        x.pic === filePath;
      });
      addForm.pics.splice(i, 1);
    };

    //图片上传成功
    const handleSuccess = (response: any) => {
      const picInfo = { pic: response.data.tmp_path };
      addForm.pics.push(picInfo);
    };

    //富文本编辑器挂载
    onMounted(() => {
      const editor = new E("#div1");
      editorSelf.value = editor;
      editor.config.placeholder = "请编辑商品内容";
      // 或者 const editor = new E( document.getElementById('div1') )
      editor.create();
    });

    //添加商品
    const addGoods = () => {
      addForm.goods_introduce = editorSelf.value.txt.html();
      proxy.$refs.addFormRef.validate((valid: boolean) => {
        if (valid) {
          let requestForm = _.cloneDeep(addForm);
          requestForm.goods_cat = requestForm.goods_cat.join(",");
          //动态参数和静态属性处理
          manyTableData.value.forEach((item: any) => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(" "),
            };
            requestForm.attrs.push(newInfo);
          });
          onlyTableData.value.forEach((item: any) => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals,
            };
            requestForm.attrs.push(newInfo);
          });

          //发起请求
          proxy.$axios.post("goods", requestForm).then((resolve: any) => {
            if (resolve.data.meta.status === 201) {
              proxy.$message.success(resolve.data.meta.msg);
              proxy.$router.push("/goods");
            } else {
              proxy.$message.error(resolve.data.meta.msg);
            }
          });
          console.log(addForm, requestForm);
        } else {
          proxy.$message.error("请填写必要的表单项");
        }
      });
    };
    return {
      activeIndex,
      currentStep,
      addForm,
      addFormRules,
      getCateList,
      cateList,
      cateProps,
      currentSelect,
      handleChange,
      beforeTabLeave,
      tabClick,
      manyTableData,
      checkList,
      onlyTableData,
      handlePreview,
      handleRemove,
      headerObj,
      handleSuccess,
      previewPath,
      previewVisible,
      addGoods,
      editorSelf,
    };
  },
};
</script>
<style lang="less" scoped>
.el-steps {
  margin: 15px 0;
}
.el-checkbox {
  margin: 0 10px 0 0;
}
.previewImage {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}

#editor {
  height: 410px;
  width: auto;
  border: 1px solid #ccc;
}
.w-e-toolbar {
  background-color: #f1f1f1;
  border: 1px solid #ccc;
}
</style>