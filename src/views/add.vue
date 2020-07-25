<template>
  <div class="add">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图模块 -->
    <el-card>
      <!-- 警告提示框 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      ></el-alert>
      <!-- 步骤条区域 -->
      <el-steps
        :space="200"
        :active="active - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏切换区域 -->
      <!-- 整个tab栏 都用form表单进行校验  el-tab-pane 只能在tl-tabs之下  -->
      <el-form
        :model="addruleForm"
        :rules="addrules"
        ref="addruleForm"
        label-width="100px"
        label-position="top"
      >
        <!-- :before-leave="beforeLeaveClick" tab栏切换的钩子 -->
        <el-tabs
          @tab-click="handleClick"
          v-model="active"
          tabPosition="left"
          :before-leave="beforeLeaveClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addruleForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addruleForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addruleForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addruleForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!--   v-model="addruleForm.goods_cat" 是选中的id 存到数组里面 -->
              <el-cascader
                v-model="addruleForm.goods_cat"
                :options="getCateList"
                :props="props"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyCateList"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item1"
                  v-for="(item1, index) in item.attr_vals"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyCateList"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!--  :on-preview="handlePreview" 图片预览  -->
            <!-- :on-remove="handleRemove" 图片移出  -->
            <el-upload
              :action="upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="header"
              :on-success="undateUpLoad"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog title="图片预览" :visible.sync="imagedialogVisible" width="50%">
      <img :src="file" alt="" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      /* 判断选中项步骤条和tab栏 */
      active: '0',
      /* 表单的数据 */
      addruleForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        /* 存储文件成功上传的临时路径 */
        pics: []
      },

      /* 表单的校验规则 */
      addrules: {
        goods_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      /* 存储商品分类列表的数据 */
      getCateList: [],
      /* 级联选择器的配置项 value是选中的id  label标题name children 是下一级分类 */
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      /* 存储选中的三级分类的id */
      id: '',
      /* 存储动态参数列表 */
      manyCateList: [],
      /* 静态参数列表 */
      onlyCateList: [],
      /* 要上传的图片路径 */
      upload: 'http://127.0.0.1:8888/api/private/v1/upload',
      header: {
        Authorization: localStorage.getItem('token')
      },
      /* 存储图片的在线地址 达到预览的效果 */
      file: '',
      /* 控制图片预览框的显示与隐藏 */
      imagedialogVisible: false
    }
  },
  created() {
    this.cateList()
  },
  methods: {
    /* 获取全部商品分类列表 */
    async cateList() {
      const res = await this.axios.get('categories')

      if (res.data.meta.status === 200) {
        this.getCateList = res.data.data
      }
    },
    /* tab切换发生变化后执行的函数 */
    async handleClick() {
      console.log(this.active)
      /* 如果active 为1 就代表tab栏为参数列表  获取动态参数列表的数据 */
      if (this.active === '1') {
        const res = await this.axios.get(`categories/${this.id}/attributes`, {
          params: {
            sel: 'many'
          }
        })
        res.data.data.forEach(item => {
          /* 用三元判断是不是字符串 如果不是就给个空数组 是的话以空格切割成为一个新数组 */
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        if (res.data.meta.status === 200) {
          this.manyCateList = res.data.data
          console.log(this.manyCateList)
        }
        /* active===2 获取的是静态参数列表 */
      } else if (this.active === '2') {
        const res = await this.axios.get(`categories/${this.id}/attributes`, {
          params: {
            sel: 'only'
          }
        })
        if (res.data.meta.status === 200) {
          this.onlyCateList = res.data.data
          console.log(this.onlyCateList)
        }
      }
    },
    /* 选中的节点发生变化时 触发的函数 */
    handleChange() {
      if (this.addruleForm.goods_cat.length !== 3) {
        this.addruleForm.goods_cat = []
      }
      this.id = this.addruleForm.goods_cat[
        this.addruleForm.goods_cat.length - 1
      ]
      console.log(this.id)
    },
    /* tab栏 离开和进入执行的钩子函数 */
    beforeLeaveClick(activeName, oldActiveName) {
      /* oldActiveName是要离开那个tab栏 activeName是要进入哪个tab栏   */
      /* 判断只要在基本信息项 并且没有选中第三级分类 就不允许跳转到其他tab栏 */
      if (oldActiveName === '0' && this.addruleForm.goods_cat.length !== 3) {
        this.$message.info('请选中商品分类')
        /* return false 禁止跳转 */
        return false
      }
    },
    /* 删除图片执行的钩子 */
    handleRemove(file, fileList) {
      const filePath = file.response.data.tmp_path
      const i = this.addruleForm.pics.findIndex(item => item === filePath)
      this.addruleForm.pics.slice(i, 1)
      console.log(this.addruleForm)
    },
    /* 图片预览执行的钩子 */
    handlePreview(file) {
      this.file = file.response.data.url
      this.imagedialogVisible = true
    },
    /* 文件上传成功执行的钩子 */
    undateUpLoad(res, file, fileList) {
      const updatePath = {
        pic: res.data.tmp_path
      }
      this.addruleForm.pics.push(updatePath)
      console.log(this.addruleForm)
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 25px 0;
}
.el-checkbox {
  padding-left: 0;
  padding-right: 0;
}
img {
  width: 100%;
}
</style>
