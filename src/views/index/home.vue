<template>
  <div class="pt60">
    <img alt="Hundsun Design" :src="logo" />
    <hello-world class="mt20"></hello-world>
    <button @click="goToLogin">登录</button>
  </div>
</template>

<script>
import logo from "@/assets/logo.png";
export default {
  components: {
    HelloWorld: () => import(/* webpackChunkName: "components/HelloWorld" */ "@/components/HelloWorld")
  },
  data() {
    return {
      logo
    };
  },
  methods: {
    goToLogin() {
      this.$router.push({ name: 'Login' }); // 确保路由配置中定义了name为'Login'的路由
    }
  }
};
</script>

<style lang="less" scoped>
.pt60 {
  padding-top: 60px;
}

.mt20 {
  margin-top: 20px;
}

img {
  margin: 0 auto;
}
</style>
