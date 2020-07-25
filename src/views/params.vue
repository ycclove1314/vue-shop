<template>
  <div class="params">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 警告提示框 -->
      <el-alert title="注意！只允许为第三级分类设置相关参数" type="warning" show-icon></el-alert>

      <el-row>
        <el-col>
          <span>选择商品分类:</span>
          <!-- 联级选择器 -->
          <el-cascader
            v-model="valuebtn"
            :props="prop"
            :options="cateList"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab栏模块 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="用户管理" name="many">
          <el-button type="primary" :disabled="btnDisable" @click="adddialogVisible = true">添加参数</el-button>
          <!-- 动态参数的表格 -->
          <el-table :data="manyParamsData" style="width: 100%" border>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  closable
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  @close="tabclose(i, scope.row)"
                >{{ item }}</el-tag>
                <el-input
                  class="input"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="70"></el-table-column>
            <el-table-column prop="attr_name" label="动态参数"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button size="mini" icon="el-icon-edit" type="primary">编辑</el-button>
                <el-button
                  size="mini"
                  icon="el-icon-delete"
                  type="danger"
                  @click="del(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 配置管理tab栏 -->
        <el-tab-pane label="配置管理" name="only">
          <el-button type="primary" :disabled="btnDisable" @click="adddialogVisible = true">添加属性</el-button>
          <!-- 静态属性的表格 -->
          <el-table :data="onlyParamsData" style="width: 100%" border>
            <!-- 折叠行 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  closable
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  @close="tabclose(i, scope.row)"
                >{{ item }}</el-tag>
                <el-input
                  class="input"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="70"></el-table-column>
            <el-table-column prop="attr_name" label="动态参数"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button size="mini" icon="el-icon-edit" type="primary">编辑</el-button>
                <el-button
                  size="mini"
                  icon="el-icon-delete"
                  type="danger"
                  @click="del(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 这是添加动态参数和静态属性弹出框 -->
    <el-dialog
      :title="'添加' + showDialogVisibletext"
      :visible.sync="adddialogVisible"
      width="50%"
      @close="hideDialog"
    >
      <el-form :model="addruleForm" :rules="addrules" ref="addruleFormRef" label-width="100px">
        <el-form-item :label="showDialogVisibletext" prop="attr_name">
          <el-input v-model="addruleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      /*  */
      valuebtn: [],
      /* 绑定的最初的事件源所以的商品分类 */
      /* 存储商品列表分类 */
      cateList: [],
      /* 默认选中的first */
      activeName: 'many',
      prop: {
        /* 选中的id */
        value: 'cat_id',
        /* 分类嵌套的属性 */
        children: 'children',
        /* 分类名 */
        label: 'cat_name',
        expandTrigger: 'hover'
      },
      /* 选中的最后一项的id */
      id: '',
      /* 获取动态参数列表 */
      manyParamsData: [],
      /* 获取静态属性列表 */
      onlyParamsData: [],
      /* 控制动态参数和静态属性弹出框的显示与隐藏 */
      adddialogVisible: false,
      /* 校验对象 */
      addrules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数',
            trigger: ['blur', 'change']
          },
          {
            min: 2,
            max: 5,
            message: '长度在 3 到 5 个字符',
            trigger: ['blur', 'change']
          }
        ]
      },
      /* form表单绑定的数据 */
      addruleForm: {
        /* 添加的动态参数名 */
        attr_name: ''
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    /* 进入页面获取商品分类列表 */
    async getCateList() {
      const res = await this.axios.get('categories')

      if (res.data.meta.status === 200) {
        this.cateList = res.data.data
      }
    },
    /* 分类被选中的时候触发 */
    handleChange() {
      this.getParamsData()
    },
    /* tab 被选中时触发 */
    handleClick() {
      this.getParamsData()
    },
    /* 获取选中项的数据 和静态属性的数据 */
    async getParamsData() {
      /* 判断如果选中的长度不是为3就代表没有选中第三项 就要清空数组之前被选中的id */
      if (this.valuebtn.length !== 3) {
        this.valuebtn = []
        /* 选中的长度没有3的话 就代表没有选中三级分类  就不能显示列表的数据 */
        this.onlyParamsData = []
        this.manyParamsData = []
        return
      }
      /* 获取选中的第三季分类的id */
      this.id = this.valuebtn[this.valuebtn.length - 1]
      /* 获取选中的第三级分类参数的列表 */
      const res = await this.axios.get(`categories/${this.id}/attributes`, {
        params: {
          sel: this.activeName
        }
      })
      res.data.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        /* 给返回在每一项数据添加属性控制每一项input框显示与隐藏 不自动添加的话 所有的input会同时显示与隐藏 */
        item.inputVisible = false
        /*  给返回在每一项添加属性绑定input的框的数据 */
        item.inputValue = ''
      })
      /* 判断获取的数据到底是动态参数的还是静态属性的 many为动态参数 */
      if (this.activeName === 'many') {
        this.manyParamsData = res.data.data
      } else {
        this.onlyParamsData = res.data.data
      }
    },
    /* 对话框关闭 重置表单 */
    hideDialog() {
      this.$refs.addruleFormRef.resetFields()
    },
    /* 发生请求添加动态参数或者静态属性 */
    async addParams() {
      /* 校验表单是否正确 */
      await this.$refs.addruleFormRef.validate()
      const res = await this.axios.post(`categories/${this.id}/attributes`, {
        attr_name: this.addruleForm.attr_name,
        attr_sel: this.activeName
      })
      console.log(res)
      if (res.data.meta.status === 201) {
        this.$message.success('添加成功')
        /* 更新列表 */
        this.getParamsData()
        /* 隐藏对话框 */
        this.adddialogVisible = false
      }
    },
    /* 点击按钮删除对应的参数列表 */
    async del(row) {
      try {
        await this.$confirm('您确定要删除此项分类嘛?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await this.axios.delete(
          `categories/${this.id}/attributes/${row.attr_id}`
        )
        console.log(res)
        if (res.data.meta.status === 200) {
          this.$message.success('删除成功')
          this.getParamsData()
        }
      } catch {}
    },
    /* 失去焦点隐藏input的框 */
    async handleInputConfirm(row) {
      /* 如果input等于空 隐藏input的框 */
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false
        /* 请求input框数据 */
        row.inputValue = ''
        return
      }
      /* 把数据先存到数组中然后 发送请求 存到服务器 */
      row.attr_vals.push(row.inputValue.trim())
      const res = await this.axios.put(
        `categories/${this.id}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          /* 注意点 数据库只能接受字符串类型的数据 */
          attr_vals: row.attr_vals.join(' ')
        }
      )
      console.log(res)
      if (res.data.meta.status === 200) {
        this.$message.success('数据更新成功')
        this.getParamsData()
      }
    },
    /* 点击tab栏 new按钮 显示input框 让input框自动获取焦点 */
    async showInput(row) {
      row.inputVisible = true
      await this.$nextTick()
      this.$refs.saveTagInput.focus()
    },
    /* 点击tab标签的删除按钮 删除数组中对应下标的数据 发送ajax请求 */
    async tabclose(i, row) {
      /* 从对应下标删 删一位 */
      row.attr_vals.splice(i, 1)
      const res = await this.axios.put(
        `categories/${this.id}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.data.meta.status === 200) {
        this.$message.success('删除成功')
        this.getParamsData()
      }
    }
  },
  computed: {
    /* 定义计算属性 根据选中数组的长度来禁用按钮 */
    btnDisable() {
      if (this.valuebtn.length !== 3) {
        return true
      }
      return false
    },
    /* 控制弹出框的显示标题 */
    showDialogVisibletext() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin: 15px 0;
  span {
    margin-right: 10px;
  }
}
.el-input {
  width: 150px;
}
</style>
