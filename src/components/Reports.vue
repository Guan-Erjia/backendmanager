<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>数据统计</el-breadcrumb-item>
    <el-breadcrumb-item>数据报表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card><div id="main" style="width: 750; height: 400px"></div></el-card>
</template>
<script lang="ts">
import * as echarts from "echarts";
import { getCurrentInstance, onMounted } from "vue-demi";
import _ from "lodash";

export default {
  name: "Reports",
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setup() {
    const { proxy }: any = getCurrentInstance();

    onMounted(() => {
      proxy.$axios.get("reports/type/1").then((resolve: any) => {
        if (resolve.data.meta.status === 200) {
          let options: any = {
            title: {
              text: "用户来源",
            },
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "cross",
                label: {
                  backgroundColor: "#6a7985",
                },
              },
            },
            legend: {
              data: [
                "Email",
                "Union Ads",
                "Video Ads",
                "Direct",
                "Search Engine",
              ],
            },
            toolbox: {
              feature: {
                saveAsImage: {},
              },
            },
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true,
            },
            xAxis: [
              {
                type: "category",
                boundaryGap: false,
                data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
              },
            ],
            yAxis: [
              {
                type: "value",
              },
            ],
            series: [
              {
                name: "Email",
                type: "line",
                stack: "Total",
                areaStyle: {},
                label: {
                  show: true,
                  position: "top",
                },
                emphasis: {
                  focus: "series",
                },
                data: [120, 132, 101, 134, 90, 230],
              },
              {
                name: "Union Ads",
                type: "line",
                stack: "Total",
                areaStyle: {},
                label: {
                  show: true,
                  position: "top",
                },
                emphasis: {
                  focus: "series",
                },
                data: [220, 182, 191, 234, 290, 330],
              },
              {
                name: "Video Ads",
                type: "line",
                stack: "Total",
                areaStyle: {},
                label: {
                  show: true,
                  position: "top",
                },
                emphasis: {
                  focus: "series",
                },
                data: [150, 232, 201, 154, 190, 330],
              },
              {
                name: "Direct",
                type: "line",
                stack: "Total",
                areaStyle: {},
                label: {
                  show: true,
                  position: "top",
                },
                emphasis: {
                  focus: "series",
                },
                data: [320, 332, 301, 334, 390, 330],
              },
              {
                name: "Search Engine",
                type: "line",
                stack: "Total",
                label: {
                  show: true,
                  position: "top",
                },
                areaStyle: {},
                emphasis: {
                  focus: "series",
                },
                data: [820, 932, 901, 934, 1290, 1330],
              },
            ],
          };
          console.log(resolve.data.data);

          _.merge(options, resolve.data.data);
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          var chartDom = document.getElementById("main")!;
          var myChart = echarts.init(chartDom);
          options && myChart.setOption(options);
        } else {
          proxy.$message.error("获取数据失败");
        }
      });
    });
  },
};
</script>