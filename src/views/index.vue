<template>
  <div style="overflow-y: auto;">
    <vue-particles color="#409EFF" :particleOpacity="0.7" :particlesNumber="150" shapeType="circle" :particleSize="4"
      linesColor="#409EFF" :linesWidth="1" :lineLinked="true" :lineOpacity="0.4" :linesDistance="150" :moveSpeed="3"
      :hoverEffect="true" hoverMode="grab" :clickEffect="true" clickMode="push">
    </vue-particles>
    <img alt="Hundsun Design" :src="logo" />
    <div class="container">
      <div style="width: 400px; padding: 30px; background-color: white; border-radius: 5px;">
        <div
          style="text-align: center; font-size: 28px; margin-bottom: 20px; color: #333;font-family:'SimHei;user-select: none;">
          恒生理财销售交易系统</div>
        <h-form :model="form" :rules="rules" ref="formRef">
          <h-form-item prop="username">
            <h-input icon="t-b-userallocation" placeholder="请输入账号" v-model="form.username" size="large"></h-input>
          </h-form-item>
          <h-form-item prop="password">
            <h-input icon="t-b-password" placeholder="请输入密码" show-password v-model="form.password"
              size="large"></h-input>
          </h-form-item>
          <h-form-item>
            <h-button type="ghost" shape="circle"
              style="width: 100%; background-color: #7eb488; border-color: #7eb488; color: white" @click="login">登
              录</h-button>
          </h-form-item>
        </h-form>
      </div>
    </div>
  </div>
</template>

<script>
import logo from "@/assets/logo.png";
export default {
  name: "Login",
  data() {
    return {
      logo,
      form: {},
      rules: {
        username: [
          { required: false, message: '请输入账号', trigger: 'blur' },
        ],
        password: [
          { required: false, message: '请输入密码', trigger: 'blur' },
        ]
      }
    }
  },
  created() {

  },
  methods: {
    login() {
      this.$router.push({ name: 'Home' });
      /*             this.$refs['formRef'].validate((valid) => {
                      if (valid) {
                          this.$request.post('/user/login', this.form).then(res => {
                              if (res.code === '200') {
                                  this.$router.push('/')
                                  this.$message.success('登录成功')
                              } else {
                                  this.$message.error(res.msg)
                              }
                          })
                      }
                  }) */
    }
  }
};
</script>

<style scoped>
#particles-js {
  width: 100%;

  position: fixed;
  top: 10px;
  z-index: -1;
}

.container {
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

a {
  color: #2a60c9;
}

img {
  margin: 0 auto;
  margin-top: 10%;
}
</style>