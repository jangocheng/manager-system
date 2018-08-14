<template>
  <div class="rights">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 表格 -->
    <el-table
      ref="rightsList"
      :data="rightsList"
      stripe
      style="width: 100%">
      <el-table-column type="index" width="150"></el-table-column>
      <el-table-column property="authName" label="权限名称" ></el-table-column>
      <el-table-column property="path" label="路径" ></el-table-column>
      <el-table-column label="层级">
        <template slot-scope="scope">
          <span v-if="+scope.row.level === 0">一级</span>
          <span v-else-if="+scope.row.level === 1">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightsList: []// 存储权限
    }
  },
  methods: {
    // 获取权限列表
    async getRightsList () {
      let res = await this.axios.get('rights/list')
      let {meta: {status}, data} = res.data
      if (status === 200) {
        this.rightsList = data
      }
    }
  },
  created () {
    this.getRightsList()
  }
}
</script>

<style>
.el-main {
  background-color: #eee;
}
.el-breadcrumb {
  height: 30px;
  line-height: 30px;
}
</style>
