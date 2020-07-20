<template>
  <div class="rights">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightsList" style="width: 100%" stripe border>
        <el-table-column align="center" type="index" label="序号" width="70px"></el-table-column>
        <el-table-column align="center" prop="authName" label="权限名称"></el-table-column>
        <el-table-column align="center" prop="path" label="路径"></el-table-column>
        <el-table-column align="center" prop="level" label="权限等级">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level==='0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level==='1'">二级</el-tag>
            <el-tag type="info" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    }
  },
  created() {
    this.getrightsList()
  },
  methods: {
    /* 获取所有的权限列表 */
    async getrightsList() {
      const res = await this.axios.get('rights/list ')

      if (res.data.meta.status === 200) {
        this.rightsList = res.data.data
      }
    }
  }
}
</script>

<style>
</style>
