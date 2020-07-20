<template>
  <div class="users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 输入框区域 -->
      <!--gutter 盒子之前的间距  -->
      <el-row :gutter="20">
        <!--:span 设置宽度  -->
        <el-col :span="9">
          <!-- v-model="query"  query是搜索的关键字-->
          <el-input
            :clearable="true"
            placeholder="请输入内容"
            class="input-with-select"
            v-model="query"
            @clear="clear"
          >
            <!-- 给按钮注册事件 发送ajax请求获取关键字的数据 -->
            <el-button slot="append" icon="el-icon-search" @click="Uesrlist"></el-button>
          </el-input>
        </el-col>
        <el-button type="primary" @click="dialogVisible =true">添加用户</el-button>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column align="center" label="序号" type="index" :index="indexMethod"></el-table-column>
        <el-table-column align="center" prop="username" label="姓名"></el-table-column>
        <el-table-column align="center" prop="email" label="邮箱"></el-table-column>
        <el-table-column align="center" prop="mobile" label="电话"></el-table-column>
        <el-table-column align="center" prop="role_name" label="角色"></el-table-column>
        <el-table-column align="center" label="状态">
          <template v-slot="scope">
            <!-- @change="state(scope.row) 按钮发生变化的事件  -->
            <el-switch v-model="scope.row.mg_state" @change="state(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="300">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editUser(scope.row.id)"
            ></el-button>
            <!-- 按钮设置提示信息 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-star-off"
                @click="showRolse(scope.row)"
              ></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deluser(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 启动分页 区域 -->
      <!--  @size-change 选中的条数发生变化的事件
           @current-change 页码值发生变化的事件
           :current-page  显示的当前页
           :page-size  每页显示的条数
           :total 总条数
      -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[1, 2, 4, 6]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>
    <!-- 这是添加用户 弹出框区域 -->
    <!-- :visible.sync绑定弹出的框的显示与隐藏 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="close">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="emit">
          <el-input v-model="ruleForm.emit"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="number">
          <el-input v-model="ruleForm.number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 这是修改用户弹出框 -->
    <el-dialog title="修改用户" :visible.sync="emitdialogVisible" width="50%" @close="emitclose">
      <el-form
        :model="editForm"
        :rules="rules"
        ref="editrule"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="emitdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="emiteUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="setdialogVisible" width="50%" @close="cancelId">
      <div>
        <p>分配的名字:{{userinfo.username}}</p>
        <p>分配的角色: {{userinfo.role_name}}</p>
        <el-select v-model="relosId" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRelos">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: '',
      /* 当前页 */
      pagenum: 1,
      /* 每页获取多少条 */
      pagesize: 2,
      /* 存储请求回来的数据的 */
      userlist: [],
      total: 0,
      /* 控制弹出框的显示隐藏 */
      dialogVisible: false,
      /* 弹出框绑定的数据 */
      ruleForm: {
        username: '',
        password: '',
        emit: '',
        number: ''
      },
      /* 获取对应id项的个人信息数据 */
      editForm: {},
      /* 控制修改弹出的显示与隐藏 */
      emitdialogVisible: false,
      /* 分配角色对话框的显示与隐藏 */
      setdialogVisible: false,
      /* 存储分配角色的信息 */
      userinfo: {},
      /* 获取角色列表 */
      rolesList: [],
      /* 下拉列表被选中项的id */
      relosId: '',
      /* 输入框的校验 */
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: ['blur', 'change']
          },
          {
            min: 5,
            max: 10,
            message: '长度在 5 到 10 个字符',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['blur', 'change']
          },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: ['blur', 'change']
          }
        ],
        emit: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: ['blur', 'change']
          },
          {
            min: 8,
            max: 20,
            message: '邮箱格式 admin@qq.com',
            trigger: ['blur', 'change']
          }
        ],
        number: [
          {
            required: true,
            message: '请输入手机号',
            trigger: ['blur', 'change']
          },
          {
            min: 11,
            max: 11,
            message: '请输入11位手机号',
            trigger: ['blur', 'change']
          }
        ]
      }
      /* 修改用户弹出框的校验规则 */
    }
  },
  created() {
    this.Uesrlist()
  },
  methods: {
    /* 获取用户列表 */
    async Uesrlist() {
      const res = await this.axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (res.data.meta.status === 200) {
        this.userlist = res.data.data.users

        this.total = res.data.data.total
      }
    },
    /* 选中的条数发生变化就会触发的事件 */
    handleSizeChange(value) {
      this.pagesize = value
      this.Uesrlist()
    },
    /* 页码值发生变化就会触发 */
    handleCurrentChange(value) {
      this.pagenum = value
      this.Uesrlist()
    },
    /* 点击更新按钮 更新状态 */
    async state(state) {
      const res = await this.axios.put(
        `users/${state.id}/state/${state.mg_state}`
      )
      if (res.data.meta.status === 200) {
        this.$message.success('状态更新成功')
      }
    },
    /* 让序号按加载的数据排列 */
    indexMethod(index) {
      /* index+1 从1开始排列 在加上 前页面 显示的数据 =当页面显示的数据序号 */
      return index + 1 + (this.pagenum - 1) * this.pagesize
    },
    /* 当点击input的框的清除按钮时重新获取数据 */
    clear() {
      this.Uesrlist()
    },
    /* 弹出框关闭重置表单close事件 */
    close() {
      this.$refs.ruleForm.resetFields()
    },
    /* 给弹出框的确定按钮注册添加用户事件 */
    async addUser() {
      try {
        await this.$refs.ruleForm.validate()
        const res = await this.axios.post('users', {
          username: this.ruleForm.username,
          password: this.ruleForm.password,
          email: this.ruleForm.emit,
          mobile: this.ruleForm.number
        })
        if (res.data.meta.status === 201) {
          this.$message.success('创建成功')
          /* 添加成功关闭弹出框 */
          this.dialogVisible = false
          /* 刷新页面 */
          this.Uesrlist()
        }
      } catch {}
    },
    /* 点击修改按钮的事件 让数据回显 */
    async editUser(id) {
      this.emitdialogVisible = true
      const res = await this.axios.get(`users/${id}`)
      if (res.data.meta.status === 200) {
        this.editForm = res.data.data
        console.log(this.editForm)
      }
    },
    /* 修改弹出框的确定按钮事件 */
    async emiteUser() {
      try {
        await this.$refs.editrule.validate()
        const res = await this.axios.put(`users/${this.editForm.id}`, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.data.meta.status === 200) {
          this.$message.success('更新成功')
          this.emitdialogVisible = false
          this.Uesrlist()
        }
      } catch {}
    },
    /* 重置修改表单 */
    emitclose() {
      this.$refs.editrule.resetFields()
    },
    /* 给删除按钮注册的事件 */
    async deluser(id) {
      try {
        /* 弹出框是一个promise对象 */
        await this.$confirm('你确定要删除该用户吗', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await this.axios.delete(`users/${id}`)
        if (res.data.meta.status === 200) {
          this.$message.success('删除成功')
          /* 删除成功要让当前页向前进一 */
          this.pagenum = this.pagenum - 1
          this.Uesrlist()
        }
      } catch {}
    },
    /* 点击分配角色 弹出对话框 */
    async showRolse(userinfo) {
      this.userinfo = userinfo
      this.setdialogVisible = true
      const res = await this.axios.get('roles')

      if (res.data.meta.status === 200) {
        this.rolesList = res.data.data
      }
    },

    /* 给分配角色的弹出框的确定按钮注册事件 */
    async updateRelos() {
      const res = await this.axios.put(`users/${this.userinfo.id}/role`, {
        /* 分配角色的id */
        rid: this.relosId
      })
      if (res.data.meta.status === 200) {
        this.$message.success('分配成功')
        /* 刷新页面 */
        this.Uesrlist()
        /* 隐藏弹出框 */
        this.setdialogVisible = false
      }
    },
    /* 监听弹出框关闭的事件 */
    cancelId() {
      /* 清空获取的角色列表 */
      this.rolesList = []
      /* 弹出框关闭之后清空之前选中的id */
      this.relosId = ''
    }
  }
}
</script>

<style lang="less">
.el-row {
  margin-bottom: 20px;
}
.el-table {
  .el-button {
    width: 50px;
  }
}
.el-pagination {
  margin-top: 20px;
}
p {
  margin: 15px 0;
}
</style>
