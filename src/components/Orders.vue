<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    <el-breadcrumb-item>订单列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-row
      ><el-col :span="8">
        <el-input placeholder="请输入内容" class="input-with-select" clearable
          ><template #append>
            <el-button icon="el-icon-search" @click="getOrderList"></el-button
          ></template> </el-input></el-col
    ></el-row>
    <el-table :data="orderList.value" border stripe>
      <el-table-column label="#" type="index"></el-table-column>
      <el-table-column label="订单编号" prop="order_number"></el-table-column>
      <el-table-column label="订单价格" prop="order_price"></el-table-column>
      <el-table-column label="是否付款" prop="pay_status" v-slot="scope"
        ><el-tag v-if="scope.row.pay_status === '1'" type="success"
          >已付款</el-tag
        >
        <el-tag v-else type="danger">未付款</el-tag>
      </el-table-column>
      <el-table-column label="是否发货" prop="is_send"></el-table-column>
      <el-table-column label="下单时间" prop="create_time" v-slot="scope">{{
        scope.row.create_time
      }}</el-table-column>
      <el-table-column label="操作" v-slot="scope">
        <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
        <el-button type="success" size="mini" icon="el-icon-edit"></el-button>
        {{ scope.row.order_id }}</el-table-column
      >
    </el-table>
    <!-- 页码区域 -->
    <el-pagination
      v-model:currentPage="queryInfo.pagenum"
      :page-sizes="[5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </el-card>
</template>
<script lang="ts">
import { getCurrentInstance, reactive } from "vue-demi";
import { ref } from "vue";
export default {
  name: "Orders",
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setup() {
    const { proxy }: any = getCurrentInstance();
    const queryInfo = reactive({
      query: "",
      pagenum: 1,
      pagesize: 10,
    });
    const total = ref(0);
    const orderList: any = reactive([]);
    const getOrderList = () => {
      proxy.$axios
        .get("orders", {
          params: queryInfo,
        })
        .then((resolve: any) => {
          if (resolve.data.meta.status === 200) {
            total.value = resolve.data.data.total;
            orderList.value = resolve.data.data.goods;
            orderList.value.forEach((item: any) => {
              item.create_time = proxy.$dateHandle(item.create_time);
            });
          } else {
            proxy.$message.error("获取订单信息失败");
          }
        });
    };
    getOrderList();
    const handleSizeChange = (val: number) => {
      queryInfo.pagesize = val;
      getOrderList();
    };
    const handleCurrentChange = (val: number) => {
      queryInfo.pagenum = val;
      getOrderList();
    };
    return {
      queryInfo,
      getOrderList,
      total,
      orderList,
      handleSizeChange,
      handleCurrentChange,
    };
  },
};
</script>