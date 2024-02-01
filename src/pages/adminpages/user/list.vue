<template>
  <div
    class="user-box"
    v-loading="fullscreenLoading"
    element-loading-text="拼命加载中"
  >
    <div class="sreach-box">
      <el-form
        :model="queryParams"
        ref="queryForm"
        size="small"
        :inline="true"
        v-show="showSearch"
        label-width="68px"
      >
        <el-form-item label="客户ID" prop="deptId">
          <el-input
            v-model="queryParams.deptId"
            placeholder="请输入客户ID"
            clearable
          />
        </el-form-item>
        <el-form-item label="用户账号" prop="userName">
          <el-input
            v-model="queryParams.userName"
            placeholder="请输入用户账号"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="mini">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="form-tools">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="createUser"
            >新增</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            v-show="false"
            >修改</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            v-show="false"
            >删除</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            v-show="false"
            >导出</el-button
          >
        </el-col>
      </el-row>
    </div>
    <div class="table-box">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="ID" width="100">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户名" width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.nick_name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="账号" width="180">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>手机号: {{ scope.row.phone_num }}</p>
              <p>注册时间: {{ scope.row.create_time }}</p>
              <div slot="reference" class="name-wrapper">
                <span size="medium">{{ scope.row.username }}</span>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="绑定分组" width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.link_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最后编辑" width="180">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.update_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="权限组" width="180">
          <template slot-scope="scope">
            <el-tag
              :type="
                scope.row.rule == 1
                  ? ''
                  : scope.row.rule == 5
                  ? 'warning'
                  : scope.row.rule == 10
                  ? 'danger'
                  : 'info'
              "
              >{{ cando[scope.row.rule] }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="状态" width="180">
          <template slot-scope="scope">
            <el-tag :type="scope.row.state == 1 ? 'success' : 'danger'">{{
              scope.row.state == 1 ? "正常" : "禁用"
            }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" :a="scope" @click="updataUser(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />

      <!-- 添加或修改用户信息对话框 -->
      <el-dialog
        :title="title"
        :visible.sync="open"
        width="500px"
        append-to-body
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="ID" prop="deptId" >
            <el-input v-model="form.id" placeholder="请输入部门ID" :disable="title == '新增客户'"/>
          </el-form-item>
          <el-form-item label="用户账号" prop="userName">
            <el-input v-model="form.username" placeholder="请输入用户账号" />
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickName">
            <el-input v-model="form.nick_name" placeholder="请输入用户昵称" />
          </el-form-item>
          <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入用户邮箱" />
          </el-form-item>
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input v-model="form.phonenumber" placeholder="请输入手机号码" />
          </el-form-item>
          <el-form-item label="头像地址" prop="avatar">
            <el-input v-model="form.avatar" placeholder="请输入头像地址" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              placeholder="请输入内容"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary">确 定</el-button>
          <el-button>取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import axios from "axios";

export default {
  name: "userlist",
  data() {
    return {
      cando: {
        1: "射手",
        5: "教练",
        10: "管理",
      },

      fullscreenLoading: true,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 10,
      // 用户信息表格数据
      userList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deptId: null,
        userName: null,
        nickName: null,
        userType: null,
        email: null,
        phonenumber: null,
        sex: null,
        avatar: null,
        password: null,
        status: null,
        loginIp: null,
        loginDate: null,
      },
      // 表单参数
      form: {},
    };
  },
  components: {},
  created() {
    this.fullscreenLoading = true;
  },
  mounted() {
    this.getList();
    setTimeout(() => {
      this.fullscreenLoading = false;
    }, 1000);
  },
  methods: {
    loaded() {
      console.log("页面加载完毕");
    },
    reset() {
      this.form = {
        userId: null,
        deptId: null,
        userName: null,
        nickName: null,
        userType: null,
        email: null,
        phonenumber: null,
        sex: null,
        avatar: null,
        password: null,
        status: null,
        delFlag: null,
        loginIp: null,
        loginDate: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
      };
      this.resetForm("form");
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      // this.ids = selection.map(item => item.userId)
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加用户信息";
    },
    getList() {
      console.log("getlist");
      axios
        .post("/api/user/getlist.php", {
          token: Cookies.get("token"),
          type: 0,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.tableData = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((err) => {
          console.log(err);
          this.timeLock = false;
          this.$message.error("与射击服务器断开了连接 [" + err.message + "]");
          this.gameoff();
        });
    },
    /** 新增用户 **/
    createUser() {
      this.form = {};
      this.title = "新增客户";
      this.open = true;
    },
    /** 编辑用户 **/
    updataUser(it) {
      this.title = "编辑客户";
      console.log(it);
      this.form = it;
      this.open = true;
    },
  },
};
</script>

<style lang="less" scoped>
.user-box {
  width: 100%;
}
</style>
