<template>
  <div>
    <div class="container">
      <img :src="hotelList.imgPath" alt="" />
      <div class="scenicmsg">
        <div class="title">
          {{ hotelList.hotelName }}
          <div class="weatherbtn">
            <el-button @click="getWeather">爬取天气</el-button>
            <el-button @click="getWeatherList">查看天气</el-button>
          </div>
        </div>
        <div class="block">
          <el-rate
            v-model="hotelList.hotelStar"
            disabled
            disabled-void-color
            show-score
            text-color="#ff9900"
          >
          </el-rate>
          <div @click="evaluate">查看评价</div>
        </div>
        <div class="text">简介：{{ hotelList.hotelComment }}</div>
        <div class="text">酒店特色：{{ hotelList.hotelCharacteristic }}</div>
        <span>地址：{{ hotelList.hotelAddress }}</span>

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
    <div class="footer">
      <div class="hotelbox" v-for="(item, index) in hoteltypeList" :key="index">
        <div class="box">
          <img :src="item.imgId" />
          <div>
            <div class="roomname">{{ item.hotelTypeName }}</div>
            <p>${{ item.hotelTypePrice }}</p>
            <div>剩余房间：{{ item.hotelTypeStock }}</div>
          </div>
        </div>

        <input type="checkbox" @change="onChange(item)" class="check" />
        <div
          class="action"
          :style="{ display: item.checked ? 'block' : 'none' }"
        >
          <div class="triangle"></div>
          <i>✓</i>
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
      hotelList: [],
      goodsCnt: 1,
      hoteltypeList: [],
      checkedList: [],
      list: [],
      weatherList: [],
      dialogVisible: false
    }
  },
  methods: {
    async getDetail () {
      const { data: res } = await this.$http.post(
        `/api1/getHotel?hotelId=${JSON.parse(
          sessionStorage.getItem('hotelId')
        )}`
      )
      this.hotelList = res.data
      this.hoteltypeList = res.data.hotelDetailInfos.map((item) => {
        return Object.assign({}, item, { checked: false })
      })
      // console.log(this.hotelTypeId);
    },
    handleChange (value) {
      this.goodsCnt = value
    },
    onChange (item) {
      item.checked = !item.checked
      this.hotelTypeId = item.hotelTypeId
      this.hotelTypeName = item.hotelTypeName
      this.hotelTypePrice = item.hotelTypePrice
      this.imgId = item.imgId
      this.hotelTypeStock = item.hotelTypeStock
      console.log(item)
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
        if (this.hotelTypeId === undefined) {
          this.$message.info('请选择酒店房型')
        } else if (this.hotelTypeStock <= 0) {
          this.$message.info('此房型已满')
        } else {
          const { data: res } = await this.$http.post('/api1/saveCart', {
            goodsCnt: this.goodsCnt,
            goodsId: this.hotelTypeId,
            goodsName: this.hotelTypeName,
            goodsPrice: this.hotelTypePrice,
            goodsStar: this.hotelList.hotelStar,
            imgPath: this.imgId,
            hotelName: this.hotelList.hotelName,
            updateUser: JSON.parse(sessionStorage.getItem('userInfo')).username,
            userName: JSON.parse(sessionStorage.getItem('userInfo')).username
          })
          if (res.code === 0) {
            this.$message.success('加入购物车成功！')
            this.getDetail()
          } else {
            this.$message.error(res.msg)
          }
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
        if (this.hotelTypeId === undefined) {
          this.$message.info('请选择酒店房型')
        } else if (this.hotelTypeStock <= 0) {
          this.$message.info('此房型已满')
        } else {
          this.$confirm('确定立即下单吗?')
            .then(async () => {
              const { data: res } = await this.$http.post('/api1/saveOrder', {
                goodsCnt: this.goodsCnt,
                goodsId: this.hotelTypeId,
                goodsName: this.hotelTypeName,
                goodsPrice: this.hotelTypePrice,
                goodsStar: this.hotelList.hotelStar,
                imgPath: this.imgId,
                userId: JSON.parse(sessionStorage.getItem('userInfo')).username,
                createUser: JSON.parse(sessionStorage.getItem('userInfo'))
                  .username
              })

              if (res.code === 0) {
                this.$message.success('下单成功！')
                this.getDetail()
              } else {
                this.$message.error(res.msg)
              }
            })
            .catch(() => {})
        }
      }
    },
    evaluate () {
      sessionStorage.setItem('goodsId', JSON.stringify(this.hotelList.hotelId))
      this.$router.push('/evaluate')
    },
    async getWeather () {
      const { data: res } = await this.$http.post(
        `/api1/getWeather?City=${this.hotelList.cityId}`
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
    height: 450px;
  }
  .scenicmsg {
    width: 50%;
    .title {
      border-bottom: 5px solid rgb(46, 120, 166);
      width: 90%;
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
.footer {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  .hotelbox {
    position: relative;
    height: 250px;
    width: 450px;
    margin: 10px;
  }
  .check {
    width: 450px;
    height: 250px;
    position: absolute;
    opacity: 0;
    margin: 10px;
    z-index: 1;
  }
  .action {
    display: none;
    width: 450px;
    height: 250px;
    border: 1px solid rgb(228, 106, 98);
    margin: 10px;
    z-index: 0;
    position: absolute;
    i {
      opacity: 1;
      // position: absolute;
      color: #fff;
      font-size: 20px;
      position: absolute;
      bottom: 3px;
      right: 10px;
      z-index: 1;
    }
    .triangle {
      width: 0;
      height: 0px;
      border-color: rgb(228, 106, 98) transparent;
      border-width: 0px 0px 50px 50px;
      border-style: solid;
      position: absolute;
      bottom: -1px;
      left: 400px;
      z-index: 1;
    }
  }
  .box {
    position: absolute;
    height: 250px;
    width: 450px;
    background-color: rgb(248, 248, 248);
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-radius: 10px;
    top: 11px;
    left: 11px;
    cursor: pointer;
    img {
      width: 280px;
      height: 200px;
    }
    p {
      color: red;
      font-weight: bolder;
    }
    .roomname {
      font-size: 24px;
      font-weight: bolder;
      color: rgb(50, 50, 100);
    }
    :last-child {
      color: rgb(148, 148, 148);
    }
  }
}
</style>
