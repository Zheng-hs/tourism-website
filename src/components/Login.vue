<template>
  <div class="login_container">
    <!-- 头像区域 -->
    <div class="login_box">
      <div class="avatar_box">
        <div>
          <h1>LOG IN TO YOUR ACCOUNT</h1>
          <h4>
            Welcome to Landing page.Hope our service can make you satisfied.hope
            you have a pieasnal trip!
          </h4>
        </div>
      </div>
      <!-- 登录表单区域 -->
      <div class="login_form">
        <div class="title">账号登录</div>
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginFormRule"
          label-width="0px"
          class="user_form"
        >
          <!-- 用户名 -->
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              prefix-icon="iconfont icon-user"
              placeholder="用户名"
            ></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              prefix-icon="iconfont icon-3702mima"
              type="password"
              placeholder="密码"
            ></el-input>
          </el-form-item>
          <!-- 按钮区域 -->
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登 录</el-button>
            <el-button type="info" @click="resetLoginForm">重 置</el-button>
          </el-form-item>
        </el-form>
        <div class="login-style">
          <p>使用以下方式登录</p>
          <img src="../assets/wechat.png" />
          <img src="../assets/qq.png" />
        </div>
        <span class="register" @click="register">立即注册</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      loginFormRule: {
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在3到10个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在6到15个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;

        const { data: res } = await this.$http.post(
          "login/auth",
          this.loginForm
        );
        if (res.code !== 0) return this.$message.error(res.msg);
        this.$message.success("登录成功");
        // 1.将登录成功之后的token，保存到客户端的sessionStorage 中
        //   1.1 项目中除了登录之外的其他API接口，必须在登录之后才能访问
        //   1.2 token只应在当前网站打开期间生效，所以将token保存在sessionStorage中
        window.sessionStorage.setItem("token", res.data);
        // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push("/home");
      });
    },
    register() {
      this.$router.push("/register");
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background-image: url("../assets/back2.jpg");
  background-size: 100% 100%;
}
.login_box {
  width: 1800px;
  border-radius: 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: #fff;

  .avatar_box {
    height: 350px;
    h1 {
      margin: 50;
    }
    h4 {
      width: 360px;
      margin-top: 125px;
    }
  }

  .login_form {
    padding: 0 20px;
    box-sizing: border-box;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    height: 400px;
    width: 350px;
    box-shadow: 0 0 10px rgb(255, 255, 244);
    .btns {
      display: flex;
      justify-content: space-around;
      padding-top: 20px;
      .el-button {
        margin-right: 20px;
        margin-left: 12px;
        width: 90px;
      }
    }
    .title {
      position: absolute;
      top: 33px;
      font-size: 25px;
      font-weight: bold;
      text-align: center;
    }
  }
  .user_form {
    width: 100%;
  }
  .login-style {
    width: 350px;
    position: fixed;
    bottom: 0;
    p {
      margin: 0;
      margin-left: 10px;
    }
    img {
      width: 40px;
      height: 40px;
      margin: 10px;
      border-radius: 50%;
      cursor: pointer;
    }
  }
  .register {
    cursor: pointer;
    position: absolute;
    bottom: 65px;
    right: 270px;
  }
}
</style>
