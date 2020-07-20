<template>
  <div class="login">
    <div class="login_box">
      <div class="img">
        <img src="../assets/logo.png" alt="" />
      </div>
      <div class="input">
        <el-form ref="form" :rules="rules" :model="form">
          <!-- 用户名区域 -->
          <el-form-item prop="username">
            <el-input
              v-model="form.username"
              prefix-icon="el-icon-s-custom"
              clearable
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <!-- 密码区域 -->
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              prefix-icon="el-icon-lock"
              clearable
              show-password
              type="password"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <!-- 登录区域 -->
          <el-form-item>
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="cancel">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      /* 用户名 和密码校验区域 */
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: ['change', 'blur']
          },
          {
            min: 5,
            max: 12,
            message: '长度在 5 到 12 个字符',
            trigger: ['change', 'blur']
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['change', 'blur']
          },
          {
            min: 5,
            max: 9,
            message: '长度在 5 到 9 个字符',
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },
  methods: {
    /* 登录的请求 */
    async login() {
      /* 发送请求之前对整个表单进行校验 */
      try {
        await this.$refs.form.validate()
        const res = await this.axios.post('/login', {
          username: this.form.username,
          password: this.form.password
        })
        if (res.data.meta.status === 200) {
          this.$message.success(res.data.meta.msg)
          this.$router.push('/home')
          localStorage.setItem('token', res.data.data.token)
          localStorage.setItem('userId', res.data.data.id)
        } else {
          this.$message.warning(res.data.meta.msg)
        }
      } catch {}
    },
    /* 重置事件 */
    cancel() {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  .login_box {
    width: 400px;
    height: 300px;
    box-shadow: 7px 6px 8px -6px;
    position: absolute;
    top: 50%;
    left: 50%;
    background-color: #ddd;
    transform: translate(-50%, -50%);
    .img {
      width: 150px;
      height: 150px;
      border: 1px solid red;
      border-radius: 50%;
      padding: 10px;
      box-sizing: border-box;
      box-shadow: 0 0 10px 0;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      img {
        width: 100%;
        border-radius: 50%;
        border: 1px solid #fff;
      }
    }
    .input {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      .el-button {
        margin: 0 50px;
      }
    }
  }
}
</style>
