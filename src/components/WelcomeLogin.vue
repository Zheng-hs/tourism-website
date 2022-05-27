<template>
  <div class="container">
      <div class="text">
          <img src="../assets/flights_hover.png" alt="">
          景点查询
      </div>
      <el-card>
          <p>请输入景点名称</p>
          <div class="search">
            <el-input placeholder="请输入景点名称"></el-input>
            <el-button type="success">查询</el-button>
          </div>  
      </el-card>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.container {
    height: 767px;
    background-image: url('../assets/slider.png');
    background-size:100% 100%;
    display: flex;
    justify-content: center;
    .el-card {
        position: fixed;
        bottom: 0;
        width: 60%;
        font-size:14px;
        border: 0;
        p {
            margin-left: 10px;
        }
        .search {
            display: flex;
            justify-content: space-between;
            padding: 10px;
            .el-button {
                margin-left: 10px;
                padding:0 40px;
            }
        }
    }
    .text {
        background-color: #fff;
        width: 150px;
        height: 50px;
        left: 20%;
        position: fixed;
        bottom: 145px;
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
}
</style>>
