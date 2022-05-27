<template>
  <div class="container">
    <ul class="shop-list">
      <li class="shop-list-item" v-for="(item, index) in list" :key="index">
        <!-- 选择按钮 -->
        <div class="select-btn-box">
          <div>
            <input type="checkbox" @change="inputChange(item)" />
            <div
              class="action"
              :style="{ display: item.checked ? 'block' : 'none' }"
            ></div>
          </div>
        </div>
        <!-- 书本信息 -->
        <div class="shop-count-info">
          <img :src="item.imgPath" alt="" />
          <div class="count-info-box">
            <div>{{ item.hotelName }}</div>
            <div>{{ item.goodsName }}</div>
            <div>
              <span>￥{{ item.goodsPrice }}</span>
              <div class="change-count-box">
                <el-input-number
                  v-model="item.goodsCnt"
                  @change="handleChange"
                  :min="1"
                ></el-input-number>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <div class="close-count">
      <div>
        <div>
          <input type="checkbox" @change="allInputChange" />
          <div
            class="action"
            :style="{ display: allChecked ? 'block' : 'none' }"
          ></div>
        </div>
        <span>全选</span>
      </div>

      <div>
        <div>
          <b>合计:</b>
          <span>{{ totalPrice.toFixed(2) }}元</span>
        </div>

        <button @click="addShopCar">结算</button>
        <button @click="deleteShopCar">删除</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      allChecked: false,
      totalPrice: 0,
      list: [],
      cartInfo: {},
    };
  },
  mounted() {
    this.getShopCarList();
  },
  methods: {
    async getShopCarList() {
      const { data: res } = await this.$http.post("/api1/listCart", {
        userName: JSON.parse(sessionStorage.getItem("userInfo")).username,
      });
      if (res.data.total === 0) {
        this.$message.info("暂无数据");
      }
      //   this.list = res.data
      this.list = res.data.data.map((item) => {
        return Object.assign({}, item, { checked: false });
      });
      console.log(this.list);

      this.allChecked = false;
      this.totalPrice = this.getTotal();
    },
    addShopCar() {
      let payCommList = this.list.filter((item) => {
        return item.checked === true;
      });

      if (!payCommList.length) {
        this.$message.info("请先选择需要购买的商品");

        return;
      }

      let goodsIds = this.list
        .filter((item) => {
          return item.checked === true;
        })
        .map((item) => {
          return item.goodsId;
        })
        .toString();

      let goodsPrices = this.list
        .filter((item) => {
          return item.checked === true;
        })
        .map((item) => {
          return item.goodsPrice;
        })
        .toString();

      let goodsNames = this.list
        .filter((item) => {
          return item.checked === true;
        })
        .map((item) => {
          return item.goodsName;
        })
        .toString();

      let goodsCnts = this.list
        .filter((item) => {
          return item.checked === true;
        })
        .map((item) => {
          return item.goodsCnt;
        })
        .toString();

      let goodsStars = this.list
        .filter((item) => {
          return item.checked === true;
        })
        .map((item) => {
          return item.goodsStar;
        })
        .toString();

      let cartIds = this.list
        .filter((item) => {
          return item.checked === true;
        })
        .map((item) => {
          return item.cartId;
        })
        .toString();

      let imgPaths = this.list
        .filter((item) => {
          return item.checked === true;
        })
        .map((item) => {
          return item.imgPath;
        })
        .toString();
      console.log(cartIds);
      console.log(goodsIds);

      this.$confirm("确定进行结算吗?")
        .then(async () => {
          const { data: res } = await this.$http.post("/api1/saveOrder", {
            cartId: cartIds,
            goodsId: goodsIds,
            goodsPrice: goodsPrices,
            goodsCnt: goodsCnts,
            goodsStar: goodsStars,
            goodsName: goodsNames,
            imgPath: imgPaths,
            userId: JSON.parse(sessionStorage.getItem("userInfo")).username,
            createUser: JSON.parse(sessionStorage.getItem("userInfo")).username,
          });
          if (res.code === 0) {
            this.$message.success("结算成功！");
            this.getShopCarList();
            setTimeout(() => {
              // this.$router.push({ path: "/order-list" });
            });
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {});
    },
    async deleteShopCar() {
      let payCommList = this.list.filter((item) => {
        return item.checked === true;
      });

      if (!payCommList.length) {
        this.$message.info("请先选择需要删除的商品");

        return;
      }

      let shopCartIds = this.list
        .filter((item) => {
          return item.checked === true;
        })
        .map((item) => {
          return item.goodsId;
        })
        .toString();

      const { data: res } = await this.$http.post(
        `/api1/deleteCart?goodsId=${shopCartIds}&userName=${
          JSON.parse(sessionStorage.getItem("userInfo")).username
        }`
      );
      if (res.code === 0) {
        this.$message.success(res.msg);

        this.getShopCarList();
      } else {
        this.$message.error(res.msg);
      }
    },
    // 全选按钮
    allInputChange() {
      this.allChecked = !this.allChecked;

      this.list.forEach((item) => {
        item.checked = this.allChecked;
      });

      this.totalPrice = this.getTotal();
    },
    // 单选按钮
    inputChange(item) {
      item.checked = !item.checked;
      console.log(item.checked);

      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].checked === false) {
          this.allChecked = false;
          break;
        } else {
          this.allChecked = true;
        }
      }

      this.totalPrice = this.getTotal();
    },
    handleChange(value) {
      this.list.goodsCnt = value;
      this.totalPrice = this.getTotal();
    },
    getTotal() {
      let total = 0;

      this.list.forEach((item) => {
        if (item.checked) {
          total = total + parseFloat(item.goodsCnt * item.goodsPrice);
        }
      });

      return parseFloat(total.toFixed(2));
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  padding-bottom: 110px;
}
.shop-list {
  width: 100%;
  // position: absolute;
  // left: 50%;
  // bottom: 55px;
  overflow: auto;
  // transform: translate(-50%, 0);

  li {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    //   height: 150px;
    background: #fff;
    border-radius: 10px;
    padding: 10px 10px;
    box-sizing: border-box;
    margin-bottom: 10px;

    .select-btn-box {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 100%;
      padding-right: 20px;

      > div {
        position: relative;
        width: 20px;
        height: 20px;
        border: 2px solid #ddd;
        border-radius: 50%;

        input {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          padding: 0;
          margin: 0;
          width: 15px;
          height: 15px;
          z-index: 1;
          opacity: 0;
        }

        .action {
          display: none;
          position: absolute;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: #26bbb4;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 0;
        }
      }
    }

    .shop-count-info {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex: 1;
      height: 100%;
      .count-info-box {
        width: 80%;
      }
      > img {
        width: 500px;
        height: 300px;
        vertical-align: middle;
        align-self: center;
      }

      > div {
        > div:first-child {
          font-size: 24px;
          padding: 10px;
        }
        > div:nth-child(2) {
          font-size: 20px;
          width: 100%;
          height: 135px;
          padding-left: 30px;
          box-sizing: border-box;
        }

        > div:nth-child(3) {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 20px;
          width: 90%;
          height: 30px;
          padding-left: 30px;
          box-sizing: border-box;
          span {
            color: red;
          }
        }
      }
    }
  }
}

.close-count {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 70px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 60px;
  box-sizing: border-box;
  z-index: 2;

  div:first-child {
    display: flex;
    height: 50px;
    align-items: center;

    div {
      position: relative;
      width: 20px;
      height: 20px;
      border: 2px solid #ddd;
      border-radius: 50%;
      margin-right: 10px;
      font-size: 16px;

      input {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        padding: 0;
        margin: 0;
        width: 15px;
        height: 15px;
        z-index: 1;
        opacity: 0;
      }

      .action {
        display: none;
        position: absolute;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: #26bbb4;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 0;
      }
    }
  }

  div:nth-child(2) {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 50px;
    flex: 1;

    > div:first-child {
      height: 50px;
      line-height: 50px;
      font-size: 16px;
      flex: 1;
      margin-left: 10px;

      span {
        font-size: 18px;
        color: red;
        padding-left: 20px;
      }
    }

    button {
      width: 80px;
      height: 40px;
      background: #26bbb4;
      color: #fff;
      outline: none;
      line-height: 40px;
      text-align: center;
      border: none;
      border-radius: 10px;
      margin-left: 20px;
    }

    button:nth-child(3) {
      background: rgb(233, 32, 101);
    }
  }
}
</style>
