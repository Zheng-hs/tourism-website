<template>
  <div class="container">
    <div class="head">
      <div><i class="el-icon-back" @click="back"></i>发表评论</div>
      <el-button @click="addEvaluate">发表评论</el-button>
    </div>
    <div class="comm" v-for="(item, index) in evaluateList" :key="index">
      <div class="pic-info">
        <img :src="item.imgPath" alt="" />

        <div class="star">
          <el-rate v-model="item.level"></el-rate>
        </div>
      </div>

      <div class="eva-box">
        <div class="title">分享你的使用体验吧</div>

        <el-input
          v-model="item.content"
          style="display: block; width: 95%; margin: 0 auto"
          type="textarea"
          :rows="5"
        ></el-input>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      evaluateList: []
    }
  },
  mounted () {
    console.log(this.$route.query.orderDetails)
    this.getEvaluate()
  },
  methods: {
    getEvaluate () {
      this.evaluateList = this.$route.query.orderDetails
      console.log(this.evaluateList)
    },
    async addEvaluate () {
      const goodsIds = this.evaluateList
        .map(item => {
          console.log(item)
          return item.goodsId1
        })
        .toString()

      const contents = this.evaluateList
        .map(item => {
          return item.content
        })
        .toString()

      const levels = this.evaluateList
        .map(item => {
          return item.level
        })
        .toString()

      const { data: res } = await this.$http.post('/api1/saveGoodsEva', {
        orderId: this.$route.query.orderId,
        userName: JSON.parse(sessionStorage.getItem('userInfo')).username,
        createUser: JSON.parse(sessionStorage.getItem('userInfo')).username,
        goodsId: goodsIds,
        content: contents,
        level: levels
      })
      if (res.code === 0) {
        const { data: ret } = await this.$http.post('/api1/updateOrderState', {
          orderId: this.$route.query.orderId,
          orderState: 5,
          goodsCnt: this.$route.query.goodsCnt,
          goodsId: this.$route.query.goodsId,
          updateUser: JSON.parse(sessionStorage.getItem('userInfo')).username,
          version: this.$route.query.version
        })
        this.$message.success('发表成功')
        console.log(ret)
        this.$router.push('/order')
      }
    },
    back () {
      this.$router.push('/order')
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  background: rgb(245, 245, 245);
  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
    :first-child {
      i {
        padding: 10px;
        cursor: pointer;
      }
    }
    :nth-child(2) {
      margin-right: 20px;
      background: #26bbb4;
      border-color: #26bbb4;
      color: #fff;
    }
  }

  .comm {
    width: 98%;
    padding: 20px 0 0;
    box-sizing: border-box;
    background: #fff;
    margin-bottom: 20px;
    margin-left: 20px;
    border-radius: 10px;

    .pic-info {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      img {
        width: 450px;
        height: 300px;
        padding-left: 40px;
      }

      .star {
        width: 180px;
        height: 36px;
        position: relative;
        left: -20px;
        // background: url('../../assets/stars.png');
        // background-repeat: no-repeat;
        // background-size: 100% 100%;

        /deep/ .el-rate__item {
          .el-rate__icon {
            font-size: 25px;
          }
        }
      }
    }

    .eva-box {
      width: 100%;
      padding: 10px;
      .title {
        padding-left: 35px;
        line-height: 40px;
      }
    }
  }
}
</style>
