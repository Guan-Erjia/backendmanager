<template>
  <div>
    <el-table
      :data="tableData1"
      style="width: 100%"
      row-key="id"
      lazy
      :load="load"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <af-table-column
        :key="index"
        v-for="(col, index) in cols"
        :prop="col.prop"
        :label="col.label"
      >
      </af-table-column>
      <el-table-column :label="label" width="200px">
        <template slot-scope="scope">
          <slot name="bth_" :scope="scope"> </slot>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    cols: "",
    tableData1: "",
    label: "",
  },
};
</script>
<style type="text/css">
.icon-file {
  padding-right: 7px;
  padding-left: 18px;
}

.icon-folder,
.icon-folder-open {
  padding-left: 7px;
  padding-right: 7px;
}
</style>