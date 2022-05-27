<template>
  <div class="register-container">
    <div class="register-box">
      <el-upload
        class="avatar-uploader"
        :action="uploadURL"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <el-form
        :model="userForm"
        :rules="userFormRules"
        ref="userFormRef"
        label-width="65px"
        style="color: #fff"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="userForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="userPassword">
          <el-input type="password" v-model="userForm.userPassword"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="userAge">
          <el-input
            type="age"
            v-model.number="userForm.userAge"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="userPhone">
          <el-input v-model="userForm.userPhone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="userForm.userEmail"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="userSex">
          <el-select v-model="userForm.userSex" placeholder="请选择性别">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="btn">
        <el-button @click="register">注册</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    // 验证邮箱规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        // 合法的手机号
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }
    return {
      userForm: {},
      userFormRules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        userPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码的长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ],
        userAge: [
          { required: true, message: '请输入年龄' },
          { type: 'number', message: '年龄必须为数字值' }
        ],
        userEmail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        userPhone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        userSex: [{ required: true, message: '请选择性别', trigger: 'change' }]
      },
      uploadURL: 'http://localhost:8088/api1/upload',
      imageUrl: ''
    }
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
    register () {
      this.$refs.userFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请将信息填写完整!')
        }
        const userInfo = {
          belongTo: 1,
          userRole: 3,
          userName: this.userForm.userName,
          userPassword: this.userForm.userPassword,
          userAge: this.userForm.userAge,
          userEmail: this.userForm.userEmail,
          userPhone: this.userForm.userPhone,
          userPicture: this.userPicture,
          userSex: parseInt(this.userForm.userSex),
          createUser: 'test'
        }
        const { data: res } = await this.$http.post(
          `/api1/saveUser?${this.params(userInfo)}`
        )
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.$message.success('注册成功!')
        this.$router.push('/login')
      })
    },
    reset () {
      this.$refs.userFormRef.resetFields()
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      // console.log(this.imageUrl)
      // console.log(res)
      this.userPicture = res.path
    }
  }
}
</script>

<style lang="less" scoped>
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 200px;
  line-height: 200px;
  text-align: center;
}
.avatar {
  width: 200px;
  height: 200px;
  display: block;
}
.register-container {
  height: 100%;
  background-image: url("../assets/back1.jpg");
  background-size: 100% 100%;
}
.register-box {
  width: 800px;
  height: 500px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}
.avatar-uploader {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
}
.el-form {
  padding-top: 130px;
  position: relative;
  left: 18%;
  width: 450px;
  .el-select {
    width: 100%;
  }
  .label {
    color: #fff;
  }
}
.btn {
  text-align: center;
  .el-button {
    margin: 10px;
    width: 100px;
  }
}
</style>>
