<template>
  <div class="home">
    <el-container>
      <!-- 侧边栏区域 -->
      <!--  如果collapse为true就代表要折叠 宽度为64px 为false 就是200px -->
      <el-aside :width="collapse ? 64 + 'px' : 200 + 'px'">
        <div class="title">
          <img src="../assets/logo.png" alt />
          <span>后台管理系统</span>
        </div>
        <div class="button" @click="showlist">
          <span>| | |</span>
        </div>
        <!--collapse-transition 是否要有折叠动画
        collapse ：是否水平折叠菜单
        unique-opened:只让一个子菜单展开
        router 激活路由模式
        -->
        <el-menu
          :default-active="colorsho"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="blue"
          unique-opened
          :collapse="collapse"
          :collapse-transition="false"
          router
        >
          <el-submenu :index="item.id + ''" v-for="item in list" :key="item.id">
            <template slot="title">
              <!-- 根据对应的id 拿到对应的图标 -->
              <i :class="fonts[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 配置侧边栏路由 送item.path是路径  需要拼接/-->
            <el-menu-item
              :index="'/' + sonitem.path"
              v-for="sonitem in item.children"
              :key="sonitem.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span @click="colorshow('/' + sonitem.path)">
                  {{
                  sonitem.authName
                  }}
                </span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 头部区域 -->
        <el-header></el-header>
        <!-- 右侧侧边栏区域 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      /* 一级菜单图标项 */
      fonts: {
        125: 'el-icon-user-solid',
        103: 'el-icon-suitcase',
        101: 'el-icon-present',
        102: 'el-icon-s-order',
        145: 'el-icon-s-platform'
      },
      collapse: false,
      /* 存页面地址的 */
      colorsho: ''
    }
  },
  created() {
    this.menuList()
    /* 页面进来获取点击的对应的地址 */
    this.colorsho = localStorage.getItem('active')
  },
  methods: {
    async menuList() {
      const res = await this.axios.get('/menus')

      if (res.data.meta.status === 200) {
        this.list = res.data.data
      }
    },
    /* 侧边栏折叠事件 */
    showlist() {
      this.collapse = !this.collapse
    },
    /* 点击二级菜单把对应的地址存到本地事件 */
    colorshow(colorshow) {
      // console.log(colorshow)
      localStorage.setItem('active', colorshow)
      this.colorsho = colorshow
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  .el-container {
    height: 100%;
    .el-aside {
      height: 100%;
      background-color: #545c64;

      .el-menu {
        border: none;
      }
      .button {
        text-align: center;
        span {
          color: #fff;
          margin: 0 auto;
          background-color: #545c64;
          cursor: pointer;
        }
      }
      .title {
        display: flex;
        align-items: center;
        height: 60px;
        background-color: tomato;
        img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 1px solid yellow;
          padding: 5px;
        }
        span {
          font-size: 20px;
          color: #fff;
          margin-left: 20px;
        }
      }
    }
    .el-header {
      background-color: tomato;
    }
    .el-main {
      background-color: hotpink;
    }
  }
}
</style>
