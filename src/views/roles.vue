<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 响应式布局  添加角色板块-->
      <el-row>
        <el-col :span="24">
          <div class="button">
            <el-button type="primary" @click="showupdateRoles">添加角色</el-button>
          </div>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border>
        <!-- 折叠显示权限 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row v-for="item in scope.row.children" :key="item.id" :class="['dbbottm','active']">
              <!-- 一级权限 响应式布局 一行分为24个小模块 一级权限占5个-->
              <el-col :span="5">
                <el-tag closable @close="handleClose(scope.row,item.id)">
                  {{
                  item.authName
                  }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限 和三级权限的渲染-->
              <el-col :span="19">
                <el-row
                  v-for="item2 in item.children"
                  :key="item2.id"
                  :class="['dbbottm','active']"
                >
                  <!-- 渲染二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="handleClose(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="handleClose(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="70"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300">
          <template v-slot="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editRoles(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-setting"
              @click="showrights(scope.row)"
            >权限分配</el-button>
            <el-button
              size="mini"
              type="info"
              icon="el-icon-delete"
              @click="delrights(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 权限分配弹出框 dialog弹出框 -->
    <el-dialog title="权限分配" :visible.sync="showrightsVisible" width="50%" @close="updialog">
      <el-tree
        show-checkbox
        node-key="id"
        :data="rightslist"
        :props="defaultProps"
        default-expand-all
        :default-checked-keys="listkey"
        ref="treeref"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showrightsVisible = false">取 消</el-button>
        <el-button type="primary" @click="addrights">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色 弹出框 -->
    <el-dialog title="添加角色" :visible.sync="updatedialogVisible" width="50%">
      <div>
        <el-input v-model="roleName" placeholder="请输入角色名称"></el-input>
        <el-input v-model="roleDesc" placeholder="请输入角色描述"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRolse">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色 弹出框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editdialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <div>
        <el-input v-model="editinfo.roleId" disabled></el-input>
        <el-input v-model="editinfo.roleName"></el-input>
        <el-input v-model="editinfo.roleDesc"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editdialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      /*  页面获取角色信息 */
      rolesList: [],
      /* dialog框的隐藏 */
      showrightsVisible: false,
      /* 存储dialog框显示出来的数据 */
      rightslist: [],
      /* 存储默认被选中的id */
      listkey: [],
      /* 树状绑定子属性数据 和名字 */
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      /* 存储dlalog弹出框选中的角色分配的id */
      keys: [],
      /* 存储角色的id */
      rolesId: '',
      /* 添加角色弹出框的显示与隐藏 */
      updatedialogVisible: false,
      /* 角色名称 */
      roleName: '',
      /* 角色描述 */
      roleDesc: '',
      /* 控制编辑弹出框的显示与隐藏 */
      editdialogVisible: false,
      /* 存储编辑角色的数据 */
      editinfo: {},
      /* 存储点击编辑对应角色的id */
      editId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    /* 进入页面获取角色信息 */
    async getRolesList() {
      const res = await this.axios.get('roles')
      if (res.data.meta.status === 200) {
        this.rolesList = res.data.data
      }
    },
    /* 触发close事件 删除对应id角色管理的列表权限  参数1为 角色id 参数2为权限id */
    async handleClose(roles, id) {
      try {
        await this.$confirm('你确认删除该项权限嘛?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await this.axios.delete(`roles/${roles.id}/rights/${id}`)
        if (res.data.meta.status === 200) {
          this.$message.success('删除成功')
          /* 删除成功之后会获取到最新的更新的权限 所以把最新的权限 赋值给roles.children 这样页面就不会闭合 */
          roles.children = res.data.data
        }
      } catch {}
    },
    /* 显示dialog框 */
    async showrights(roles) {
      /* 存储当前角色的id 用于后续发送ajax请求 */
      this.rolesId = roles.id
      const res = await this.axios.get('rights/tree')
      if (res.data.meta.status === 200) {
        this.rightslist = res.data.data
        /* 调用递归函数 把当前角色权限分配传进去 */
        this.children(roles, this.listkey)
      }

      this.showrightsVisible = true
    },
    /* 递归函数 获取默认选中的id的id */
    children(node, arr) {
      /* 判断节点下面有没有children 如果没有 就直接拿到当前节点的id */
      if (!node.children) {
        return arr.push(node.id)
      }
      /* 如果还有children属性 就继续继续调用递归函数 */
      node.children.forEach(item => {
        this.children(item, arr)
      })
    },
    /* 当dialog 对话框关闭时 要删除之前keylist数组中的数据 */
    updialog() {
      this.listkey = []
    },
    /* 点击dialog 对话框的确定按钮事件 */
    async addrights() {
      /* 获取被选中节点的id 和半选中节点的id */
      this.keys = [
        /* 获取选中的id  返回值是数组 */
        ...this.$refs.treeref.getCheckedKeys(),
        /* 获取半选中的id 返回值是数组 */
        ...this.$refs.treeref.getHalfCheckedKeys()
      ]
      /* 把获取的数组转为字符串 用逗号分隔 */
      const keyStr = this.keys.join(',')
      const res = await this.axios.post(`roles/${this.rolesId}/rights`, {
        rids: keyStr
      })
      if (res.data.meta.status === 200) {
        this.$message.success('更新成功')
        /* 更新页面 */
        this.getRolesList()
        /* 隐藏dialog框 */
        this.showrightsVisible = false
      }
    },
    /* 点击删除按钮 删除对应id的角色 */
    async delrights(userid) {
      try {
        await this.$confirm('您是否要删除此项角色', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await this.axios.delete(`roles/${userid.id}`)
        if (res.data.meta.status === 200) {
          this.$message.success('删除成功')
          this.getRolesList()
        }
      } catch {}
    },
    /* 点击添加角色 弹出对话框 */
    showupdateRoles() {
      this.updatedialogVisible = true
    },
    /* 添加角色确定按钮注册的事件 */
    async updateRolse() {
      const res = await this.axios.post('roles', {
        roleName: this.roleName,
        roleDesc: this.roleDesc
      })
      console.log(res)
      if (res.data.meta.status === 201) {
        this.$message.success('添加角色成功')
        /* 隐藏弹出框 */
        this.updatedialogVisible = false
        /* 更新页面 */
        this.getRolesList()
      }
    },
    /* 点击编辑按钮 显示模态框 获取对应编辑的角色的id 获取数据 让数据回显 */
    async editRoles(edit) {
      /* 存储点击的对应项的id */
      this.editId = edit.id
      /* 显示模态框 */
      this.editdialogVisible = true
      const res = await this.axios.get(`roles/${this.editId}`)
      if (res.data.meta.status === 200) {
        this.editinfo = res.data.data
      }
    },
    /* 给编辑弹出框的确定按钮注册 编辑事件  */
    async editdialog() {
      const res = await this.axios.put(`roles/${this.editId}`, {
        id: this.editinfo.roleId,
        roleName: this.editinfo.roleName,
        roleDesc: this.editinfo.roleDesc
      })
      if (res.data.meta.status === 200) {
        this.$message.success('编辑成功')
        this.editdialogVisible = false
        this.getRolesList()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.active {
  display: flex;
  align-content: center;
}
.el-input {
  width: 70%;
  margin-bottom: 20px;
  margin-left: 70px;
}
.button {
  margin-bottom: 15px;
}
</style>
