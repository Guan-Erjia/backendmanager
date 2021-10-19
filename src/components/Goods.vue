<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-input
          placeholder="请输入内容"
          class="input-with-select"
          clearable
          v-model="queryInfo.query"
          @clear="getGoodData"
          ><template #append>
            <el-button icon="el-icon-search" @click="getGoodData"></el-button
          ></template>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="goAddPage">添加商品</el-button>
      </el-col>
    </el-row>
    <el-table :data="goodList.value" border stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column
        label="商品价格(元)"
        prop="goods_price"
        width="60px"
      ></el-table-column>
      <el-table-column
        label="商品重量"
        prop="goods_weight"
        width="70px"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        prop="add_time"
        width="140px"
      ></el-table-column>
      <el-table-column label="操作" width="130px" v-slot="scope">
        <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
        <el-button
          type="danger"
          size="mini"
          icon="el-icon-delete"
          @click="removeById(scope.row)"
        ></el-button>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      v-model:currentPage="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
    >
    </el-pagination>
  </el-card>
</template>
<script lang="ts">
import { getCurrentInstance, reactive, Ref, ref } from "vue-demi";
export default {
  name: "Goods",
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setup() {
    const { proxy }: any = getCurrentInstance();
    const queryInfo: any = reactive({
      query: "",
      pagenum: 1,
      pagesize: 10,
    });
    const total: Ref<number> = ref(0);
    const goodList: any = reactive([]);
    const getGoodData = () => {
      proxy.$axios
        .get(`/goods`, {
          params: queryInfo,
        })
        .then((resolve: any) => {
          if (resolve.data.meta.status === 200) {
            resolve.data.data.goods.forEach((item: any) => {
              item.add_time = dateHandle(item.add_time);
            });
            goodList.value = resolve.data.data.goods;
            total.value = resolve.data.data.total;
            proxy.$message.success("获取商品列表成功");
          } else {
            proxy.$message.error("获取商品列表失败");
          }
        });
    };
    getGoodData();

    //时间处理
    const dateHandle = (val: number) => {
      const dt = new Date(val);
      const y = dt.getFullYear();
      const m = (dt.getMonth() + 1 + "").padStart(2, "0");
      const d = (dt.getDate() + "").padStart(2, "0");
      const hh = (dt.getHours() + "").padStart(2, "0");
      const mm = (dt.getMinutes() + "").padStart(2, "0");
      const ss = (dt.getSeconds() + "").padStart(2, "0");
      return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    };

    //翻页
    const handleSizeChange = (newSize: number) => {
      queryInfo.pagesize = newSize;
      getGoodData();
    };
    const handleCurrentChange = (newPage: number) => {
      queryInfo.pagenum = newPage;
      getGoodData();
    };

    //删除
    const removeById = (val: any) => {
      proxy
        .$confirm("此操作将永久删除商品，是否继续？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then((resolve: boolean) => {
          if (resolve) {
            proxy.$axios
              .delete(`goods/${val.goods_id}`)
              .then((resolve: any) => {
                if (resolve.data.meta.status === 200) {
                  proxy.$message.success("删除成功");
                  getGoodData();
                } else {
                  proxy.$message.failure("删除失败");
                  getGoodData();
                }
              });
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    };

    //跳转添加商品
    const goAddPage = () => {
      proxy.$router.push("/goods/add");
    };

    return {
      getGoodData,
      queryInfo,
      goodList,
      dateHandle,
      handleSizeChange,
      handleCurrentChange,
      total,
      removeById,
      goAddPage,
    };
  },
};
</script>