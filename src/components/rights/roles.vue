<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" class="addBtn" @click="addDialogVisible = true">添加角色</el-button>
    <!-- 表格 -->
    <el-table
      :data="rolesList"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
        <el-row v-if="scope.row.children.length === 0">
          <el-col>没有设置权限</el-col>
        </el-row>
        <!-- 一级权限 -->
        <el-row class="level1" v-for="level1 in scope.row.children" :key="level1.id">
          <el-col :span="4">
            <el-tag closable @close="deleteRight(scope.row, level1.id)">{{level1.authName}}</el-tag>
            <i class="el-icon-arrow-right"></i>
          </el-col>
          <el-col :span="20">
            <!-- 二级权限 -->
            <el-row class="level2" v-for="level2 in level1.children" :key="level2.id">
              <el-col :span="4">
                <el-tag closable type="success" @close="deleteRight(scope.row, level2.id)">{{level2.authName}}</el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <el-col :span="20">
                <!-- 三级权限 -->
                <el-tag class="level3" @close="deleteRight(scope.row, level3.id)" closable type="warning" v-for="level3 in level2.children" :key="level3.id">{{level3.authName}}</el-tag>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="roleName" label="角色名称"></el-table-column>
      <el-table-column label="描述" property="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="showEditDialog(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="deleteRole(scope.row)"></el-button>
          <el-button type="success" icon="el-icon-check" @click="showRightsDialog(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="40%">
      <el-form :model="addForm" ref="addForm" label-width="80px" :rules="addRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改角色对话框 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="40%">
      <el-form :model="editForm" ref="editForm" label-width="80px" :rules="addRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="assignRightsDialog"
      width="40%">
      <!-- 树形控件 -->
      <el-tree
        :data="rightList"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignRightsDialog = false">取 消</el-button>
        <el-button type="primary" @click="assignRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [], // 存储角色数据
      // 添加角色信息
      addForm: {
        roleDesc: '',
        roleName: ''
      },
      addDialogVisible: false, // 控制添加对话的显示隐藏
      // 检验规则
      addRules: {
        roleName: {required: true, message: '角色名称不能为空', trigger: 'blur'}
      },
      editDialogVisible: false, // 控制修改对话的显示隐藏
      // 存储修改后的角色信息
      editForm: {
        roleId: '',
        roleName: '',
        roleDesc: ''
      },
      assignRightsDialog: false, // 控制权限的显示隐藏
      rightList: [], // 树形权限列表
      // 控制树形权限中的数据
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      assignRoleId: ''// 记录要分配权限的角色的id
    }
  },
  methods: {
    // 获取角色数据
    async getRolesList () {
      let res = await this.axios.get('roles')
      let {meta: {status}, data} = res.data
      if (status === 200) {
        this.rolesList = data
      }
    },
    // 删除角色
    async deleteRole (msg) {
      try {
        await this.$confirm('你确定要删除该角色吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.axios.delete(`roles/${msg.id}`)
        if (res.data.meta.status === 200) {
          // 重新渲染
          this.getRolesList()
          this.$message.success('删除成功')
        }
      } catch (error) {
        this.$message.info('已取消删除')
      }
    },
    // 增加角色
    addRole () {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          let res = await this.axios.post('roles', this.addForm)
          if (res.data.meta.status === 201) {
            // 重新渲染列表
            this.getRolesList()
            // 重置表单
            this.$refs.addForm.resetFields()
            // 隐藏对话框
            this.addDialogVisible = false
          }
        } else {
          return false
        }
      })
    },
    // 显示修改角色对话框
    async showEditDialog (msg) {
      this.editDialogVisible = true
      this.editForm.roleId = msg.id
      this.editForm.roleName = msg.roleName
      this.editForm.roleDesc = msg.roleDesc
    },
    // 修改角色
    editRole () {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          let res = await this.axios.put(`roles/${this.editForm.roleId}`, this.editForm)
          if (res.data.meta.status === 200) {
            // 重新渲染
            this.getRolesList()
            // 重置表单
            this.$refs.editForm.resetFields()
            // 隐藏对话框
            this.editDialogVisible = false
            this.$message.success('修改成功')
          }
        } else {
          return false
        }
      })
    },
    // 删除角色权限
    async deleteRight (role, id) {
      // 获取角色id
      let roleId = role.id
      // 获取权限id
      let rightId = id
      // 发送ajax
      let res = await this.axios.delete(`roles/${roleId}/rights/${rightId}`)
      let {meta: {status}, data} = res.data
      if (status === 200) {
        // 根据返回的数据改变当前角色的权限
        role.children = data
        // 弹出提示信息
        this.$message.success('取消权限成功')
      }
    },
    // 显示权限对话框
    async showRightsDialog (role) {
      // 获取到角色id
      this.assignRoleId = role.id
      this.assignRightsDialog = true
      let res = await this.axios.get('rights/tree')
      let {meta: {status}, data} = res.data
      if (status === 200) {
        this.rightList = data
      }
      // 获取所有的三级权限
      let checkedKeys = []
      role.children.forEach(level1 => {
        level1.children.forEach(level2 => {
          level2.children.forEach(level3 => {
            checkedKeys.push(level3.id)
          })
        })
      })
      // 显示角色已有的权限
      this.$refs.tree.setCheckedKeys(checkedKeys)
    },
    // 分配权限
    async assignRights () {
      // 获取选中的权限
      let checkedKeys = this.$refs.tree.getCheckedKeys()
      let halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      let rights = [...checkedKeys, ...halfCheckedKeys].join()
      let res = await this.axios.post(`roles/${this.assignRoleId}/rights`, {
        rids: rights
      })
      if (res.data.meta.status === 200) {
        // 重新渲染数据
        this.getRolesList()
        // 隐藏对话框
        this.assignRightsDialog = false
        // 提示信息
        this.$message.success('权限分配成功')
      }
    }
  },
  created () {
    this.getRolesList()
  }
}
</script>

<style>
.addBtn {
  margin: 5px 0 15px ;
}
.level1 {
  margin-bottom: 15px;
  border-bottom: 1px dotted #ccc;
}
.level2 {
  margin-bottom: 15px;
}
.level3 {
  margin-right: 10px;
}
.el-dialog {
  border-radius: 20px;
}
</style>
