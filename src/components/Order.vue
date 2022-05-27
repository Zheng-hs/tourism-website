<template>
  <div class="container">
    <div class="order-item" v-for="(item, index) of list" :key="index">
      <div class="item-top">
        <span>{{ item.orderId }}</span>
        <span>
          {{
            item.orderState === "1"
              ? "已下单"
              : item.orderState === "2"
              ? "已发货"
              : item.orderState === "3"
              ? "已到货"
              : item.orderState === "4"
              ? "已取货未评价"
              : item.orderState === "5"
              ? "已取货已评价"
              : "已取消"
          }}
        </span>
      </div>
      <div
        class="item-center"
        v-for="(childItem, index) in item.orderDetails"
        :key="index"
      >
        <div class="text">
          <div class="text-con">
            {{ childItem.goodsName1 }}
          </div>
          <div class="props-con">
            {{ childItem.orderDetailId }}
          </div>
          <div class="img-con">
              <img :src="childItem.imgPath" alt="">
          </div>
          <div class="price-con">
            <span>￥</span>
            <span>{{ childItem.goodsPrice1 }} &nbsp;</span>
            <span>x{{ childItem.goodsCnt1 }}</span>
          </div>
        </div>
      </div>
      <div class="item-bottom">
        <span>共{{ item.allCnt }}件商品，合计￥</span>
        <span>{{ item.orderPrice }}</span>
      </div>
      <!-- 客户 -->
      <div class="item-more">
        <div
          class="btn"
          @click.stop="changeOrderStatus(item, '6')"
          v-show="
            item.orderState === '1' ||
            item.orderState === '2' ||
            item.orderState === '3'
          "
        >
          <span>取消订单</span>
        </div>
        <div
          class="btn"
          @click.stop="evaluate(item)"
          v-show="item.orderState === '4'"
        >
          <span>评价</span>
        </div>
        <div
          class="btn"
          @click.stop="changeOrderStatus(item, '4')"
          v-show="item.orderState === '3'"
        >
          <span>确认收货</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: []
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    //   用户获取订单
    async getOrderList () {
      const { data: res } = await this.$http.post('/api1/listOrder', {
        userId: JSON.parse(sessionStorage.getItem('userInfo')).username
      })
      this.list = res.data.data
    },
    changeOrderStatus (item, changeStatus) {
      this.$confirm('确定进行该操作吗?').then(async () => {
        const { data: res } = await this.$http.post('/api1/updateOrderState', {
          orderId: item.orderId,
          orderState: changeStatus,
          goodsCnt: item.goodsCnt,
          goodsId: item.goodsId,
          updateUser: JSON.parse(sessionStorage.getItem('userInfo')).username,
          version: item.version
        })
        if (res.code === 0) {
          this.$message.success(res.msg)
          this.getOrderList()
        } else {
          this.$message.error(res.msg)
        }
      }).catch(() => {
      })
    },
    evaluate (data) {
      console.log(data)
      this.$router.push({ path: '/orderevaluate', query: data })
    }
  }
}
</script>

<style lang="less" scoped>
.leader {
  height: 64px;
  width: 100%;
  ul {
    height: 100%;
    padding: 0 0 0 2.5%;
    margin: 0;
    display: flex;
    li {
      line-height: 64px;
      padding: 0;
      margin: 0;
      list-style: none;
      padding: 0 13px;
      font-size: 15px;
    }
    .active {
      font-size: 17px;
      color: #26bbb4;
    }
  }
}
.order-item {
  width: 95%;
  margin: 0 auto;
  background-color: rgb(248, 248, 248);
  border-radius: 8px;
  padding: 10px 15px;
  box-sizing: border-box;
  margin-bottom: 20px;
  .item-top {
    width: 100%;
    display: flex;
    align-items: center;
    position: relative;
    span:first-child {
      font-size: 16px;
      flex: 1;
      line-height: 38px;
      position: relative;
      left: 8px;
    }
    span:nth-child(2) {
      position: absolute;
      right: 0;
      font-size: 13px;
      color: #26bbb4;
      padding-right: 10px;
    }
  }
  .item-center {
    width: 100%;
    display: flex;
    box-sizing: border-box;
    padding-top: 5px;
    background-color: rgb(255, 255, 255);
    border-radius: 10px;
    margin: 10px 0;
    .img-con {
      flex: 1;
    margin: 10px;
      img {
        width: 150px;
      }
    }
    .text {
      flex: 2.2;
      .text-con {
        line-height: 22px;
        padding-left: 10px;
      }
      .props-con {
        font-size: 13.5px;
        line-height: 26px;
        color: rgb(168, 168, 168);
        padding-left: 10px;
      }
      .price-con {
        text-align: right;
        line-height: 26px;
        padding-right: 20px;

        span:nth-child(1) {
          font-size: 11px;
          color: rgb(242, 0, 0);
        }
        span:nth-child(2) {
          font-size: 16px;
          color: rgb(242, 0, 0);
        }
        span:nth-child(3) {
          font-size: 11px;
          color: rgb(168, 168, 168);
        }
      }
    }
  }
  .item-bottom {
    width: 100%;
    line-height: 40px;
    text-align: right;
    padding-top: 5px;
    span:nth-child(1) {
      font-size: 15px;
    }
    span:nth-child(2) {
      font-size: 20px;
    }
  }
  .item-more {
    width: 100%;
    display: flex;
    justify-content: flex-end;

    .btn {
      width: 92px;
      height: 28px;
      border-radius: 20px;
      position: relative;
      border: 1.5px solid #26bbb4;
      margin-left: 5px;
      margin-top: 10px;
      margin-bottom: 6px;
      cursor: pointer;
      span {
        font-size: 15px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        //   margin-top: -10.4px;
        //   margin-left: -16px;
        width: 100%;
        text-align: center;
        color: #26bbb4;
      }
    }
  }
}
</style>
