<template>
  <div class="user">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索和添加 -->
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select" @keyup.enter.native="searchUser">
      <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
    </el-input>
    <el-button @click="addDialog = true" type="primary">添加用户</el-button>
    <!-- 表格信息 -->
    <el-table
      stripe
      border
      :data="userList"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <!-- 用户状态 -->
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeUserStatus(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="showEditDialog(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="deleteUser(scope.row)"></el-button>
          <el-button type="success" icon="el-icon-check">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 20, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 编辑用户提示框 -->
    <el-dialog title="用户信息" :visible.sync="editDialog" width="40%">
      <el-form :model="editUserForm" ref="editUserForm" label-width="70px" :rules="addRules">
        <el-form-item label="用户名" >
          <el-tag v-text="editUserForm.username"></el-tag>
        </el-form-item>
        <el-form-item label="电话" prop="mobile" >
          <el-input v-model="editUserForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email" auto-complete="off" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 增加用户提示框 -->
    <el-dialog title="添加信息" :visible.sync="addDialog" width="40%">
      <el-form :model="addUserForm" ref="addUserForm" label-width="70px" :rules="addRules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile" >
          <el-input v-model="addUserForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email" auto-complete="off" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      userList: [],
      query: '',
      currentPage: 1,
      pageSize: 5,
      total: 0,
      editUserForm: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editDialog: false,
      addDialog: false,
      addRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          // { required: true, message: '请选择活动区域', trigger: 'change' },
          { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
        ],
        mobile: [
          // { required: true, message: '请选择活动区域', trigger: 'change' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取用户列表
    async getUersList () {
      let res = await this.axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      let {meta, data} = res.data
      if (meta.status === 200) {
        this.total = data.total
        this.userList = data.users
      }
    },
    // 修改用户状态
    changeUserStatus (msg) {
      this.axios.put(`users/${msg.id}/state/${msg.mg_state}`)
    },
    // 显示修改对话框
    showEditDialog (msg) {
      this.editDialog = true
      this.axios.get(`users/${msg.id}`)
        .then(res => {
          if (res.data.meta.status === 200) {
            this.editUserForm = res.data.data
          }
        })
    },
    // 修改用户信息
    editUser () {
      this.axios.put(`users/${this.editUserForm.id}`, {
        email: this.editUserForm.email,
        mobile: this.editUserForm.mobile
      })
      this.editDialog = false
    },
    // 增加用户
    addUser () {
      this.axios.post('users', this.addUserForm)
        .then(res => {
          if (res.data.meta.status === 201) {
            this.currentPage = Math.ceil(++this.total / this.pageSize)
            this.getUersList()
            this.$refs.addUserForm.resetFields()
            this.addDialog = false
          }
        })
    },
    // 删除用户信息
    deleteUser (msg) {
      // 禁止删除admin
      if (msg.username === 'admin') {
        return false
      }
      this.$confirm('你确定要删除该用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete(`users/${msg.id}`)
          .then(res => {
            if (res.status === 200) {
              this.currentPage = Math.ceil(--this.total / this.pageSize)
              if (this.currentPage > 0) {
                this.getUersList()
              }
            }
          })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {})
    },
    // 修改每页条目
    handleSizeChange (val) {
      this.pageSize = val
      this.getUersList()
    },
    // 修改当前页
    handleCurrentChange (val) {
      this.currentPage = val
      this.getUersList()
    },
    // 查询用户信息
    searchUser () {
      this.getUersList()
    }
  },
  created () {
    this.getUersList()
  }
}
</script>
<style lang="less">
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-table {
  text-align: center;
}
.el-table th>.cell {
  text-align: center;
}
.el-pagination {
  margin-top: 15px;
}
.el-dialog {
  border-radius: 20px;
}
.el-form {
  .el-tag {
    vertical-align: middle;
  }
}
.input-with-select {
  width: 300px;
  margin-bottom: 15px;
}
</style>
