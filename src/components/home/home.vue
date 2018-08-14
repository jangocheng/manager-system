<template>
  <div class="home">
    <el-container>
      <el-header>
        <div class="header__logo"></div>
        <div class="header__user">
          欢迎您
          <span v-text="username"></span>
          <a @click.prevent="logout" class="logout">退出</a>
        </div>
        <div class="header__title">电商后台管理系统</div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <!-- 导航菜单 -->
          <!-- el-menu 菜单组件 -->
          <!-- el-submenu 子菜单 -->
          <!-- el-menu-item 子菜单中的每一项 -->
          <!-- el-menu-item-group 子菜单分组 -->
          <el-menu
            unique-opened
            router
            default-active=""
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>用户管理</span>
              </template>
                <el-menu-item index="/users">
                  <i class="el-icon-location"></i>
                  <span>用户列表</span>
                </el-menu-item>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>权限管理</span>
              </template>
                <el-menu-item index="/roles">
                  <i class="el-icon-location"></i>
                  <span>角色列表</span>
                </el-menu-item>
                <el-menu-item index="/rights">
                  <i class="el-icon-location"></i>
                  <span>权限列表</span>
                </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <!-- 显示home的组件, 子路由的出口 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  data () {
    return {
      username: localStorage.getItem('username')
    }
  },
  methods: {
    async logout () {
      await this.$confirm('确定要退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      localStorage.removeItem('username')
      localStorage.removeItem('userToken')
      this.$router.push('/login')
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  },
  created () {
    this.username = localStorage.getItem('username')
  }
}
</script>

<style lang="less">
.home,
.el-container {
  height: 100%;
}
.el-header {
  height: 60px;
  padding: 0;
  background: #409EFF;
  .header__logo {
    float: left;
    height: 60px;
    width: 200px;
    background: url('../../assets/images/logo.png') no-repeat center center;
    background-size: cover;
    background-color: #fff;
  }
  .header__user {
    float: right;
    line-height: 60px;
    font-size: 20px;
    .logout {
      margin-left: 10px;
      color: darkorange;
      cursor: pointer;
    }
  }
  .header__title {
    height: 60px;
    text-align: center;
    line-height: 60px;
    font-size: 24px;
    font-weight: 600;
    overflow: hidden;
    color: #fff;
  }
}
.el-aside {
  background-color: #545c64;
}
.el-submenu {
  width: 200px;
}
</style>
