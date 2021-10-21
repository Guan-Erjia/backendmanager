<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    <el-breadcrumb-item>订单列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-row
      ><el-col :span="8">
        <el-input
          placeholder="请输入内容"
          class="input-with-select"
          clearable
          v-model="queryInfo.qurey"
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
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-edit"
          @click="showBox"
        ></el-button>
        <el-button
          type="success"
          size="mini"
          icon="el-icon-location"
          @click="showProgressBox"
        ></el-button>
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

  <!-- 修改地址对话框 -->
  <el-dialog
    v-model="addressVisible"
    title="修改地址"
    width="50%"
    @close="addressDialogClosed"
  >
    <el-form
      ref="addressFormRef"
      :model="addressForm"
      :rules="addressFormRuels"
      label-width="100px"
    >
      <el-form-item label="省市区/县" prop="address1">
        <el-cascader
          :options="cityData1"
          v-model="addressForm.address1"
        ></el-cascader> </el-form-item
      ><el-form-item label="详细地址" prop="address2">
        <el-input v-model="addressForm.address2"></el-input> </el-form-item
    ></el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addressDialogClosed">取消</el-button>
        <el-button type="primary" @click="addressDialogClosed">确认</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 订单进度对话框 -->
  <el-dialog v-model="progressVisible" title="物流进度" width="50%">
    <el-timeline>
      <el-timeline-item
        v-for="(item, index) in progressInfo.value"
        :key="index"
        :timestamp="item.time"
      >
        {{ item.context }}
      </el-timeline-item>
    </el-timeline>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { getCurrentInstance, reactive } from "vue-demi";
import { Ref, ref } from "vue";
import cityData from "@/components/common/citydata";
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

    //订单请求
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
            console.log(resolve);
            
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

    //修改地址表单
    const addressVisible: Ref<boolean> = ref(false);
    const cityData1: any = reactive(cityData);
    const addressForm: any = reactive({
      address1: [],
      address2: "",
    });
    const addressFormRuels = reactive({
      address1: [
        { required: true, message: "请选择省市区县", trigger: "blur" },
      ],
      address2: [
        { required: true, message: "请填写详细地址", trigger: "blur" },
      ],
    });

    //地址编辑显示和隐藏
    const showBox = () => {
      addressVisible.value = true;
    };

    const addressDialogClosed = () => {
      addressVisible.value = false;
      proxy.$refs.addressFormRef.resetFields();
    };

    //订单进度对话框
    const progressVisible: Ref<boolean> = ref(false);
    const progressInfo: any = reactive({});
    const showProgressBox = () => {
      proxy.$axios
        .get("/kuaidi/1106975712662")
        .then((resolve: any) => {
          if (resolve.data.meta.status === 200) {
            progressInfo.value = resolve.data.data;
            console.log(progressInfo);
          } else {
            proxy.$message.error("获取订单失败");
          }
        })
        .catch((err: string) => {
          console.log(err);
        });
      progressVisible.value = true;
    };
    return {
      queryInfo,
      getOrderList,
      total,
      orderList,
      handleSizeChange,
      handleCurrentChange,
      showBox,
      addressVisible,
      addressForm,
      addressFormRuels,
      cityData1,
      addressDialogClosed,
      showProgressBox,
      progressVisible,
      progressInfo,
    };
  },
};
</script>
<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>