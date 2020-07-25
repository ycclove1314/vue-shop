<template>
  <div class="goods">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图模块 -->
    <el-card>
      <el-row>
        <!-- 搜索框 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="info.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="clearable"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 添加商品按钮 -->
        <el-col :span="4">
          <el-button
            type="primary"
            class="button"
            @click="$router.push('/goods/add')"
            >添加商品</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="goodsList" style="width: 100%" border>
        <el-table-column
          type="index"
          label="序号"
          width="60"
          :index="indexMethod"
        ></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="90"
        ></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="120">
          <template v-slot="scope">
            {{ scope.row.add_time | time }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditGoods(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="delGoodsList(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="info.pagenum"
        :page-sizes="[10, 15, 20, 25]"
        :page-size="info.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>

    <!-- 编辑按钮弹出框 -->
    <el-dialog
      title="编辑商品列表"
      :visible.sync="editdialogVisible"
      width="50%"
      @close="close"
    >
      <el-form
        :model="editGoodsList"
        :rules="editrules"
        ref="ruleFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="编辑商品" prop="goods_name">
          <el-input v-model="editGoodsList.goods_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateGoodsList">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      /* 商品列表数据 */
      goodsList: [],
      /* 总条数 */
      total: 0,
      /* 控制编辑弹出框的显示与隐藏 */
      editdialogVisible: false,
      editGoodsList: {},
      editrules: {
        goods_name: [
          {
            required: true,
            message: '请输入商品内容',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    /* 获取商品分类列表 */
    async getGoodsList() {
      const res = await this.axios.get('goods', {
        params: {
          query: this.info.query,
          pagenum: this.info.pagenum,
          pagesize: this.info.pagesize
        }
      })

      if (res.data.meta.status === 200) {
        this.goodsList = res.data.data.goods
        this.total = res.data.data.total
      }
    },
    /* 点击搜索按钮获取对应的数据 */
    clearable() {
      /* 如果用户输入为空 就不能发送ajax请求 */
      if (this.info.query === '') {
        this.$message.success('输入不能为空')
        return
      }
      this.getGoodsList()
    },
    /* 发送请求删除对应id的数据 */
    async delGoodsList(row) {
      console.log(row)
      try {
        await this.$confirm('此操作将永久删除商品列表, 是否继续?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await this.axios.delete(`goods/${row.goods_id}`)

        if (res.data.meta.status === 200) {
          this.$message.success('删除成功')
          this.getGoodsList()
        }
      } catch {}
    },
    /* 选中的条数发生变化后执行的函数 */
    handleSizeChange(value) {
      this.info.pagesize = value
      this.getGoodsList()
    },
    /* 当前页码发生变化的时候执行的函数 */
    handleCurrentChange(value) {
      this.info.pagenum = value
      this.getGoodsList()
    },
    /* 让序号从1开始排列 起始值为0 */
    indexMethod(index) {
      return index + 1 + (this.info.pagenum - 1) * this.info.pagesize
    },
    /* 点击编辑按钮 让弹出框显示 */
    async showEditGoods(row) {
      this.editdialogVisible = true
      const res = await this.axios.get(`goods/${row.goods_id}`)

      if (res.data.meta.status === 200) {
        this.editGoodsList = res.data.data
      }
    },
    /* 发生ajax请求 修改对应id的数据 */
    async updateGoodsList() {
      const res = await this.axios.put(
        `goods/${this.editGoodsList.goods_id}`,
        this.editGoodsList
      )
      if (res.data.meta.status === 200) {
        this.$message.success('修改成功')
        this.getGoodsList()
        this.editdialogVisible = false
      }
    },
    /* 关闭弹出框 重置表单 */
    close() {
      this.$refs.ruleFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.button {
  margin-left: 20px;
}
.el-table {
  margin-top: 20px;
}
.el-pagination {
  margin-top: 25px;
}
</style>
