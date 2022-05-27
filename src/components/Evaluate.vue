<template>
  <div class="container">
    <div class="evaluate-title">
      <span
        :class="{ active: evaluateBtnType === 'all' }"
        @click="getEvaluate('', 'all')"
        >全部评价</span
      >
      <span
        :class="{ active: evaluateBtnType === 'perfect' }"
        @click="getEvaluate('5', 'perfect')"
        >好评</span
      >
      <span
        :class="{ active: evaluateBtnType === 'good' }"
        @click="getEvaluate('3', 'good')"
        >中评</span
      >
      <span
        :class="{ active: evaluateBtnType === 'differ' }"
        @click="getEvaluate('1', 'differ')"
        >差评</span
      >
    </div>

    <ul class="evaluate-list">
      <li v-for="(item, index) in list" :key="index">
        <!-- <div class="head-pic">
          <img src="../../assets/head_pic.png" alt="">
        </div> -->

        <div class="content">
          <div class="title">
            <div class="user-info">
              <div class="name">{{item.createUser}}</div>
              <div class="date">{{item.createTime | dataFormat}}</div>
            </div>

            <div class="star">
              <el-rate v-model="item.levelDouble" disabled disabled-void-color score-template="{value}">
              </el-rate>
            </div>
          </div>
          <div class="msg">{{ item.content}}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: [],
      // all perfect good differ
      evaluateBtnType: 'all'
    }
  },
  created () {
    this.getEvaluate('', 'all')
  },
  methods: {
    params (obj) {
      let result = ''

      let item

      for (item in obj) {
        if (obj[item] && String(obj[item])) {
          result += `&${item}=${obj[item]}`
        }
      }

      if (result) {
        result = '&' + result.slice(1)
      }

      return result
    },
    async getEvaluate (score = '', type) {
      this.evaluateBtnType = type
      const goodsInfo = {
        goodsId: JSON.parse(sessionStorage.getItem('goodsId')),
        level: score
      }
      if (!score) {
        delete goodsInfo.level
      }
      const { data: res } = await this.$http.post(
        `/api1/getGoodsEva?${this.params(goodsInfo)}`
      )
      if (res.code === 0) {
        this.list = res.data
        if (this.list.length === 0) { this.$message.info('暂无评价') }
      } else {
        this.$message.info('暂无评价')
      }
    }
  },
  mounted () {
    // this.Star()
  }
}
</script>

<style lang="less" scoped>
.container {
  background: rgb(240, 240, 240);
  padding-bottom: 10px;

  .evaluate-title {
    width: 100%;
    height: 50px;
    line-height: 50px;
    padding: 0 10px;
    box-sizing: border-box;

    span {
      padding: 0 10px;
    }

    .active {
      color: #26bbb4;
      font-size: 20px;
    }
  }

  .evaluate-list {
    width: 95%;
    background: #fff;
    margin: 0 auto;
    border-radius: 10px;

    li {
      display: flex;

      // .head-pic {
      //   width: 50px;
      //   height: 50px;
      //   padding: 10px;

      //   img {
      //     width: 100%;
      //     height: 100%;
      //   }
      // }

      .content {
        flex: 1;
        padding: 10px;

        .title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          height: 60px;

          .user-info {
            .date {
              color: #ddd;
              font-size: 14px;
            }
          }

          .star {
            width: 190px;
            height: 18px;
            // background-image: url('../../assets/stars.png');
            background-position: 0 0;
            background-repeat: no-repeat;
          }
        }
      }
    }
  }
}
</style>
