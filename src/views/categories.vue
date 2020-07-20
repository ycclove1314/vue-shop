<template>
  <div class="categories">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="24">
          <div class="button">
            <el-button type="primary" @click="categoriesshow"
              >添加分类</el-button
            >
          </div>
        </el-col>
      </el-row>
      <el-table :data="categories" style="width: 100%" border stripe>
        <el-table-column
          align="center"
          label="序号"
          type="index"
          width="70"
          :index="indexMethod"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="cat_name"
          label="分类名称"
        ></el-table-column>
        <el-table-column align="center" prop="cat_pid" label="是否有效">
          <template v-slot="scope">
            <i class="el-icon-success" v-if="scope.row.cat_pid === 0"></i>
            <i class="el-icon-error" v-else></i>
          </template>
        </el-table-column>
        <el-table-column align="center" label="排序">
          <template v-slot="scope">
            <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.cat_level === 1"
              >二级</el-tag
            >
            <el-tag type="info" v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" @click="editshow"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="delcategories(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[5, 8, 13, 16]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="showcategories" width="50%">
      <div>
        <el-input v-model="info.cat_pid" placeholder="请输入分类ID"></el-input>
        <el-input
          v-model="info.cat_name"
          placeholder="请输入分类名称"
        ></el-input>
        <el-input
          v-model="info.cat_level"
          placeholder="请输入分类层级"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showcategories = false">取 消</el-button>
        <el-button type="primary" @click="showcategories = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 修改分类的对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editcategories" width="50%">
      <div>
        <el-input v-model="info.cat_pid"></el-input>
        <el-input v-model="info.cat_name"></el-input>
        <el-input v-model="info.cat_level"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editcategories = false">取 消</el-button>
        <el-button type="primary" @click="editcategories = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: 3,
      pagenum: 1,
      /* 每页获取5条数据 */
      pagesize: 5,
      /* 总条数 */
      total: 0,
      /* 存储商品分类数据 */
      categories: [],
      /* 控制添加弹出框的显示与隐藏 */
      showcategories: false,
      /* 添加弹出框的显示与隐藏 */
      info: {
        cat_pid: '',
        cat_name: '',
        cat_level: ''
      },
      /* 控制修改弹出框的显示与隐藏 */
      editcategories: false
    }
  },
  created() {
    this.categoriesList()
  },
  methods: {
    /* 进入页面获取列表数据 */
    async categoriesList() {
      const res = await this.axios.get('/categories', {
        params: {
          type: this.type,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (res.data.meta.status === 200) {
        this.categories = res.data.data.result
        /* 获取总条数 */
        this.total = res.data.data.total
      }
    },
    /* 点击删除按钮的事件 删除对应id的列表 */
    async delcategories(delcategories) {
      try {
        this.$confirm('您确定要删除该项分类吗', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await this.axios.delete(
          `categories/${delcategories.cat_id}`
        )
        console.log(res)
        if (res.data.meta.status === 200) {
          this.$message.success('删除成功')
          this.categoriesList()
        }
      } catch {}
    },
    /* 当选中的条数的发生变化时 触发的事件 获取选中条数的数据 */
    handleSizeChange(val) {
      this.pagesize = val
      this.categoriesList()
    },
    /* 当前页发生变化时触发的时候 获取改变后的页面的数据 */
    handleCurrentChange(val) {
      this.pagenum = val
      this.categoriesList()
    },
    /* 点击添加分类按钮 显示对话框 */
    categoriesshow() {
      this.showcategories = true
    },
    editshow() {
      this.editcategories = true
    },
    /* 让序号一直累加排列 */
    indexMethod(index) {
      return index + 1 + (this.pagenum - 1) * this.pagesize
    }
  }
}
</script>

<style lang="less" scoped>
.el-icon-success {
  color: green;
}
.el-icon-error {
  color: red;
}
.button {
  margin-bottom: 15px;
}
.el-pagination {
  margin-top: 20px;
}
.el-input {
  margin: 10px 0;
}
</style>
