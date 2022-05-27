<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>酒店住宿</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <div class="text">
      <img src="../assets/hotels_hover.png" alt="" />
      酒店住宿
    </div>
    <el-card>
      <p>请输入酒店名称</p>
      <div class="search">
        <el-form :inline="true" :gutter="20">
          <el-form-item :span="8" prop="hotelName">
            <el-input
              v-model="hotelInfo.hotelName"
              placeholder="请输入酒店名称"
            ></el-input>
          </el-form-item>
          <el-form-item :span="10" prop="star">
            <el-select
              v-model="hotelInfo.hotelStar"
              placeholder="请选择酒店星级"
            >
              <el-option label="1" value="1"></el-option>
              <el-option label="2" value="2"></el-option>
              <el-option label="3" value="3"></el-option>
              <el-option label="4" value="4"></el-option>
              <el-option label="5" value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所在省份" prop="provinceId">
            <el-select
              v-model="hotelInfo.provinceId"
              placeholder="请选择"
              @change="province"
            >
              <el-option
                v-for="item in provinceList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所在城市" prop="cityId">
            <el-select
              v-model="hotelInfo.cityId"
              placeholder="请选择"
              @change="city"
            >
              <el-option
                v-for="item in cityList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所在区" prop="areaId">
            <el-select v-model="hotelInfo.areaId" placeholder="请选择">
              <el-option
                v-for="item in areaList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-button type="success" @click="search">查询</el-button>
      </div>
    </el-card>

    <div class="container-box">
      <div class="leftmenu">
        <div class="classify-text">
          <p>精选分类</p>
        </div>
        <div
          class="menutext"
          v-for="item in classifyList"
          :key="item.classifyId"
          @click="searchClassify(item.classifyId)"
        >
          <p>{{ item.classifyName }}</p>
          <div class="icon"><i class="el-icon-arrow-right"></i></div>
        </div>
      </div>
      <ul>
        <li v-for="item in hotelList" :key="item.hotelId">
          <img :src="item.imgPath" />
          <div class="container">
            <div class="message">
              <div class="name">{{ item.hotelName }}</div>
              <div class="block">
                <el-rate v-model="item.hotelStar" disabled disabled-void-color>
                </el-rate>
              </div>
            </div>
            <div class="btn">
              <el-button size="small" @click="getDetail(item.hotelId)"
                >DETAILS</el-button
              >
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      classifyInfo: { belongTo: 2 },
      classifyList: [],
      hotelInfo: {},
      hotelList: [],
      provinceList: [],
      cityList: [],
      areaList: []
    }
  },
  methods: {
    async getDetail (hotelId) {
      sessionStorage.setItem('hotelId', JSON.stringify(hotelId))
      this.$router.push('./hoteldetail')
    },
    async getHotelClassify () {
      const { data: res } = await this.$http.post(
        '/api1/getClassify',
        this.classifyInfo
      )
      if (res.code !== 0) {
        return this.$message.error(res.msg)
      }
      this.classifyList = res.data.data
      // console.log(this.classifyList);
    },
    async searchClassify (classifyId) {
      this.classifyId = classifyId
      const { data: res } = await this.$http.post('/api1/listHotel', {
        classifyId: this.classifyId
      })
      if (res.data.total === 0) {
        this.$message.info('暂无数据')
      }
      this.hotelList = res.data.data
    },
    async search () {
      const { data: ret } = await this.$http.post(`/api1/getArea?id=${0}`)
      this.provinceList = ret.data
      const { data: res } = await this.$http.post(
        '/api1/listHotel',
        this.hotelInfo
      )
      if (res.code !== 0) {
        return this.$message.error(res.msg)
      }
      this.hotelList = res.data.data
      this.hotelInfo = {}
    },
    async province (value) {
      // console.log(value);
      const { data: res } = await this.$http.post(`/api1/getArea?id=${value}`)
      this.cityList = res.data
    },
    async city (value) {
      const { data: res } = await this.$http.post(`/api1/getArea?id=${value}`)
      this.areaList = res.data
    }
  },
  created () {
    this.getHotelClassify()
    this.search()
  }
}
</script>

<style lang="less" scoped>
.text {
  background-color: rgb(250, 250, 250);
  width: 150px;
  height: 50px;
  left: 20%;
  text-align: center;
  color: #26bbb4;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    padding-right: 10px;
  }
}
.el-card {
  width: 100%;
  font-size: 14px;
  border-bottom: 4px solid #26bbb4;
  border-top: 0;
  background-color: rgb(250, 250, 250);
  p {
    margin-left: 10px;
    color: rgb(120, 120, 120);
    font-weight: bold;
  }
  .search {
    display: flex;
    // justify-content: space-between;
    // padding: 10px;
    .el-button {
      margin-left: 10px;
      padding: 0 40px;
      height: 40px;
      background-color: #26bbb4;
      border-color: #26bbb4;
    }
  }
}
ul {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 0;
  li {
    padding: 10px;
    img {
      width: 400px;
      height: 250px;
    }
    .container {
      width: 400px;
      height: 100px;
      background-color: rgb(250, 250, 250);
      display: flex;
      justify-content: space-between;
      .message {
        text-align: center;
        width: 2450px;
        padding: 15px;
        .name {
          font-size: 18px;
          margin-bottom: 18px;
        }
        :last-child {
          font-size: 18px;
          // color: #eee;
        }
      }
      .btn {
        padding-right: 20px;
        padding-top: 50px;
        .el-button {
          background-color: #26bbb4;
          border-color: #26bbb4;
          color: #fff;
        }
      }
    }
  }
}

.container-box {
  display: flex;
  .leftmenu {
    .classify-text {
      border-bottom: 4px solid #26bbb4;
      height: 150px;
      font-size: 25px;
      font-weight: bold;
      color: rgb(120, 120, 120);
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .menutext {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 200px;
      height: 70px;
      background-color: rgb(245, 245, 245);
      padding: 0 10px;
      margin: 5px 0;
      font-weight: bold;
      color: rgb(120, 120, 120);
      cursor: pointer;
      .icon {
        border-radius: 50%;
        width: 20px;
        height: 20px;
        background-color: rgb(225, 225, 225);
        text-align: center;
        // margin-top: 18px;
        i {
          color: #fff;
        }
      }
    }
  }
}
</style>>
