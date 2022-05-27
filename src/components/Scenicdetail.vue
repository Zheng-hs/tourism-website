<template>
  <div>
    <div class="container">
      <img :src="scenicList.imgPath" alt="" />
      <div class="scenicmsg">
        <div class="title">
          {{ scenicList.scenicName }}
          <div class="weatherbtn">
            <el-button @click="getWeather">爬取天气</el-button>
            <el-button @click="getWeatherList">查看天气</el-button>
          </div>
        </div>
        <div class="block">
          <el-rate
            v-model="scenicList.scenicStar"
            disabled
            disabled-void-color
            show-score
            text-color="#ff9900"
          >
          </el-rate>
          <div @click="evaluate">查看评价</div>
        </div>
        <p>${{ scenicList.scenicPrice }}</p>
        <div class="text">简介：{{ scenicList.scenicCharacteristic }}</div>
        <span>地址：{{ scenicList.scenicAddress }}</span>
        <div class="text">{{ scenicList.scenicComment }}</div>

        <div class="btn">
          <el-input-number
            v-model="goodsCnt"
            @change="handleChange"
            :min="1"
          ></el-input-number>
          <div>
            <el-button @click="addShopcar">加入购物车</el-button>
            <el-button @click="buy">立即下单</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="天气信息"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-table :data="weatherList" border stripe>
        <el-table-column label="日期" prop="date"></el-table-column>
        <el-table-column label="地区" prop="city"></el-table-column>
        <el-table-column label="天气状况" prop="status"></el-table-column>
        <el-table-column label="温度" prop="wendu"></el-table-column>
        <el-table-column label="湿度" prop="shidu"></el-table-column>
        <el-table-column label="上午风向" prop="fengxiangS"></el-table-column>
        <el-table-column label="下午风向" prop="fengxiangX"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      scenicList: [],
      goodsCnt: 1,
      weatherList: [],
      dialogVisible: false
    }
  },
  methods: {
    async getDetail () {
      const { data: res } = await this.$http.post(
        `/api1/getScenicByScenicId?scenicId=${JSON.parse(
          sessionStorage.getItem('scenicId')
        )}`
      )
      this.scenicList = res.data
    },
    handleChange (value) {
      this.goodsCnt = value
      console.log(this.goodsCnt)
    },
    async addShopcar () {
      // 哪些需要验证
      if (!sessionStorage.getItem('token')) {
        // token存在条件
        this.$confirm('请先登录')
          .then(() => {
            this.$router.push('/login')
          })
          .catch(() => {})
      } else {
        const { data: res } = await this.$http.post('/api1/saveCart', {
          goodsCnt: this.goodsCnt,
          goodsId: this.scenicList.scenicId,
          goodsName: this.scenicList.scenicName,
          goodsPrice: this.scenicList.scenicPrice,
          goodsStar: this.scenicList.scenicStar,
          imgPath: this.scenicList.imgPath,
          updateUser: JSON.parse(sessionStorage.getItem('userInfo')).username,
          userName: JSON.parse(sessionStorage.getItem('userInfo')).username
        })
        if (res.code === 0) {
          this.$message.success('加入购物车成功！')
        } else {
          this.$message.error(res.msg)
        }
      }
    },
    buy () {
      // 哪些需要验证
      if (!sessionStorage.getItem('token')) {
        // token存在条件
        this.$confirm('请先登录')
          .then(() => {
            this.$router.push('/login')
          })
          .catch(() => {})
      } else {
        this.$confirm('确定进行该操作吗?')
          .then(async () => {
            const { data: res } = await this.$http.post('/api1/saveOrder', {
              goodsCnt: this.goodsCnt,
              goodsId: this.scenicList.scenicId,
              goodsName: this.scenicList.scenicName,
              goodsPrice: this.scenicList.scenicPrice,
              goodsStar: this.scenicList.scenicStar,
              imgPath: this.scenicList.imgPath,
              userId: JSON.parse(sessionStorage.getItem('userInfo')).username,
              createUser: JSON.parse(sessionStorage.getItem('userInfo'))
                .username
            })

            if (res.code === 0) {
              this.$message.success('下单成功！')
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch(() => {})
      }
    },
    evaluate () {
      sessionStorage.setItem(
        'goodsId',
        JSON.stringify(this.scenicList.scenicId)
      )
      this.$router.push('/evaluate')
    },
    async getWeather () {
      const { data: res } = await this.$http.post(
        `/api1/getWeather?City=${this.scenicList.cityId}`
      )
      if (res.code === 0) {
        this.$message.success('爬取成功！')
      } else {
        this.$message.error(res.msg)
      }
    },
    async getWeatherList () {
      const { data: res } = await this.$http.post('/api1/getWeatherInfo')
      this.weatherList = res.data
      this.dialogVisible = true
    },
    handleClose () {
      this.dialogVisible = false
    }
  },
  created () {
    this.getDetail()
  }
}
</script>

<style lang="less" scoped>
.container {
  display: flex;
  justify-content: space-around;
  img {
    width: 40%;
    height: 500px;
  }
  .scenicmsg {
    width: 50%;
    .title {
      border-bottom: 5px solid rgb(46, 120, 166);
      width: 80%;
      height: 55px;
      font-size: 40px;
      font-weight: bolder;
      color: rgb(50, 50, 100);
      padding: 5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .el-button {
        margin: 15px;
      }
    }
    .block {
      padding: 20px;
      display: flex;
      justify-content: space-around;
      align-items: baseline;
      width: 50%;
      :nth-child(2) {
        color: rgb(233, 32, 101);
        cursor: pointer;
        text-decoration: underline;
        font-weight: bold;
      }
    }
    p {
      font-size: 40px;
      font-weight: bolder;
      padding: 10px;
      margin: 0;
      font-family: fangsong;
      color: rgb(50, 50, 100);
    }
    .text {
      padding: 20px;
    }
    span {
      padding: 20px;
    }
    .btn {
      display: flex;
      justify-content: space-between;
      padding: 20px;
      .el-button {
        background-color: rgb(233, 32, 101);
        border-color: rgb(233, 32, 101);
        color: #fff;
        width: 120px;
      }
    }
  }
}
</style>
