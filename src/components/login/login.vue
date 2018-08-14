<template>
  <div class="login">
    <el-form class="loginForm" :model="form" status-icon :rules="rules" label-position="left" ref="form" label-width="100px">
      <img src="../../assets/images/girl.jpg">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="活动名称" prop="password">
        <el-input type="password" v-model="form.password" @keyup.enter.native="login"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="reset" class="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>

export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let res = await this.axios.post('login', this.form)
          let {meta: {status}, data: {token, username}} = res.data
          if (status === 200) {
            // 一定要先存token, 在进行跳转, 否则会出现第一次登录无效情况
            localStorage.setItem('userToken', token)
            localStorage.setItem('username', username)
            // 配置axios默认发送的token
            this.axios.defaults.headers.common['Authorization'] = localStorage.getItem('userToken')
            // 跳转到首页
            this.$router.push('/home')
          } else {
            this.$message.error('用户名或密码错误')
          }
        } else {
          return false
        }
      })
    },
    reset () {
      this.$refs.form.resetFields()
    }
  }
}

</script>
<style lang="less">
.login {
  width: 100%;
  height: 100%;
  background: url('../../assets/images/bg.jpg') no-repeat center center;
  background-size: cover;
}
.loginForm {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 480px;
  height: 300px;
  padding: 70px 40px;
  box-sizing: border-box;
  border-radius: 20px;
  background-color: #fff;
  img {
    position: absolute;
    top: -100px;
    left: 50%;
    transform: translateX(-50%);
    width: 150px;
    border-radius: 50%;
  }
  .reset {
    margin-left: 50px;
  }
}
</style>
