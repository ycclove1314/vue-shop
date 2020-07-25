<template>
  <div class="orders">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <!-- 搜索区域 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="info.query"
            clearable
            @clear="getOrderList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- table表格区域 -->
      <el-table :data="getorderList" style="width: 100%">
        <el-table-column label="序号" type="index" width="70">
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="180">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="100">
        </el-table-column>
        <el-table-column label="是否付款">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.order_pay === 0"
              >已付款</el-tag
            >
            <el-tag type="warning" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template v-slot="scope">
            {{ scope.row.create_time | time }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
            ></el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location"
              @click="locationkuaidi"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="info.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="info.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 显示快递信息弹出框 -->
    <el-dialog
      title="物流详情"
      :visible.sync="showdialogVisiblekuaidi"
      width="50%"
    >
      <!-- 物流时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in kuaidiInfo"
          :key="index"
          :timestamp="item.time"
        >
          {{ item.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      getorderList: [],
      info: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      /* 总条数 */
      total: 0,
      showdialogVisiblekuaidi: false,
      kuaidiInfo: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    /* 获取所有的订单列表 */
    async getOrderList() {
      const res = await this.axios.get('orders', {
        params: {
          query: this.info.query,
          pagenum: this.info.pagenum,
          pagesize: this.info.pagesize
        }
      })
      if (res.data.meta.status === 200) {
        this.getorderList = res.data.data.goods
        this.total = res.data.data.total
      }
    },
    /* 选中的页面发生变化 触发的事件 */
    handleSizeChange(val) {
      this.info.pagesize = val
      this.getOrderList()
    },
    /* 当前页发生改变触发的事件 */
    handleCurrentChange(val) {
      this.info.pagenum = val
      this.getOrderList()
    },
    /* 显示物流详情对话框和物流信息 */
    async locationkuaidi() {
      this.showdialogVisiblekuaidi = true
      const res = await this.axios.get('/kuaidi/1106975712662')
      // console.log(res)
      if (res.data.meta.status === 200) {
        this.kuaidiInfo = res.data.data
        console.log(this.kuaidiInfo)
      }
    }
  }
}
</script>

<style></style>
