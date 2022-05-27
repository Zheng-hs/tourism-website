<template>
  <div>
    <el-container>
      <el-header style="height: 170px">
        <div class="title">
          <div class="text">
            <!-- <div class="logo">
              <img src="../assets/keyi.png" alt="">
            </div> -->
            <div class="email">
              <i class="el-icon-message"></i> 824247231@qq.com
            </div>
            <div class="phone"><i class="el-icon-phone"></i> 185</div>
          </div>
          <div :class="{ btn: role === 0, btn2: role === 1 }">
            <el-button type="success" size="mini" @click="login"
              >登录</el-button
            >
            <el-button type="success" size="mini" @click="register"
              >注册</el-button
            >
            <el-dropdown>
              <el-avatar><img :src="userInfo.imgPath" /></el-avatar>
              <span class="el-dropdown-link">
                <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  icon="el-icon-switch-button"
                  @click.native="logout"
                  >退出</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
            <div class="username">你好，{{ userInfo.username }}</div>
          </div>
        </div>
        <div class="head">
          <img src="../assets/keyi.png" alt="" />
          <el-menu
            :router="true"
            :default-active="activePath"
            active-text-color="#26bbb4"
          >
            <el-menu-item index="/home">首页</el-menu-item>
            <el-menu-item index="/hotel">酒店住宿</el-menu-item>
            <el-menu-item index="/scenic">景点推荐</el-menu-item>
            <el-menu-item index="/shopcar">购物车</el-menu-item>
            <el-menu-item index="/order">我的订单</el-menu-item>
            <el-menu-item index="/evaluate">评价</el-menu-item>
            <el-menu-item index="7">关于我们</el-menu-item>
          </el-menu>
        </div>
      </el-header>
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 被激活的链接地址
      activePath: '',
      userInfo: {},
      role: 0
    }
  },
  methods: {
    login () {
      this.$router.push('/login')
      window.sessionStorage.clear()
    },
    register () {
      this.$router.push('/register')
    },
    async getUserInfo () {
      const { data: ret } = await this.$http.post('/login/current')
      sessionStorage.setItem('userInfo', JSON.stringify(ret.data))
      if (ret.data.username !== null) {
        this.role += 1
        console.log(this.role)
      }
      this.userInfo = ret.data
      console.log(1)
    },
    logout () {
      window.sessionStorage.clear()
      this.role = 0
      if (this.$router.currentRoute.fullPath === '/welcome') {
        this.$router.go(0)
      } else {
        this.$router.push('/welcome')
      }
    }
  },
  created () {
    this.getUserInfo()
  }
}
</script>

<style lang="less" scoped>
.title {
  width: 100%;
  height: 50px;
  background-color: rgb(250, 250, 250);
  display: flex;
  justify-content: space-between;
  align-items: center;
  .text {
    padding-left: 50px;
    display: flex;
    color: rgb(217, 217, 217);
    .email {
      padding: 0 20px;
      border-right: 1px solid rgb(217, 217, 217);
    }
    .phone {
      padding: 0 20px;
    }
  }
  .btn {
    padding-right: 50px;
    .el-button {
      background-color: #26bbb4;
      border-color: #26bbb4;
      z-index: 1;
    }
    .el-dropdown {
      display: none;
    }
    .username {
      display: none;
    }
  }
  .btn2 {
    padding-right: 50px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    color: rgb(180, 180, 180);
    .el-avatar {
      width: 45px;
      height: 45px;
      margin-right: 10px;
    }
    img {
      width: 45px;
      height: 45px;
      padding-right: 10px;
    }

    .el-button {
      display: none;
    }
  }
}
.head {
  display: flex;
  justify-content: space-between;
  img {
    margin-left: 50px;
  }
  .el-menu {
    margin-right: 50px;
  }
}
</style>
