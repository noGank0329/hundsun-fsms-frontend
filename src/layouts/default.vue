<template>
  <div>
    <div v-if="!showLayout">
      <router-view></router-view>
    </div>
    <div v-if="showLayout" style="background-color:ivory;">
      <div class="my-header">
        <div class="logo-placeholder">
          <img alt="" :src="minilogo" style="width: 100%;">
        </div>
        <span class="title">理财销售交易系统</span>
      </div>
      <h-row>
        <h-col :span=3>
          <h-menu ref="menu" theme="dark" active-name="activeName" :open-names="['1']" :collapse="isCollapse === 'true'"
            style="width:100%;height:calc(100vh - 60px);" @on-select="handleSelect">
            <h-menu-item name="1-1">
              <h-icon name="home"></h-icon>
              <span>平台主页</span>
            </h-menu-item>
            <h-menu-item name="1-2">
              <h-icon name="t-b-account"></h-icon>
              <span>账户开户</span>
            </h-menu-item>
            <h-menu-item name="1-3">
              <h-icon name="ios-list"></h-icon>
              <span>产品管理</span>
            </h-menu-item>
            <h-submenu name="1-4">
              <template slot="title">
                <h-icon name="financial_fill"></h-icon>
                <span>产品交易</span>
              </template>
              <h-menu-item name="1-4-1"> <h-icon name="addition_fill"></h-icon>申购</h-menu-item>
              <h-menu-item name="1-4-2"> <h-icon name="ios-minus"></h-icon>赎回</h-menu-item>
            </h-submenu>
            <h-menu-item name="1-5">
              <h-icon name="cash"></h-icon>
              <span>账户清算</span>
            </h-menu-item>
            <h-menu-item name="1-6">
              <h-icon name="card"></h-icon>
              <span>银行卡管理</span>
            </h-menu-item>
            <h-submenu name="1-7">
              <template slot="title">
                <h-icon name="search"></h-icon>
                <span>业务查询</span>
              </template>
              <h-menu-item name="1-7-1"> <h-icon name="searchfill"></h-icon>交易查询</h-menu-item>
              <h-menu-item name="1-7-2"> <h-icon name="android-cancel"></h-icon>撤单</h-menu-item>
            </h-submenu>
            <h-menu-item name="1-8">
              <h-icon name="android-people"></h-icon>
              <span>团队介绍</span>
            </h-menu-item>

          </h-menu>
        </h-col>
        <h-col :span=21>
          <router-view></router-view>
        </h-col>
      </h-row>
    </div>
  </div>
</template>

<script>
import minilogo from "@/assets/mini-logo.png"
export default {
  data() {
    return {
      isCollapse: "false",
      minilogo,
      activeName: '1-1',
      showLayout: true
    };
  },
  methods: {
    handleSelect(name) {
      if (name === '1-1') {
        this.$router.push({ name: 'Home' });
      } else if (name === '1-2') {
        this.$router.push({ name: 'CreateAccount' });
      } else if (name === '1-3') {
        this.$router.push({ name: 'ProductManagement' });
      } else if (name === '1-4-1') {
        this.$router.push({ name: 'Purchase' });
      } else if (name === '1-4-2') {
        this.$router.push({ name: 'Redemption' });
      } else if (name === '1-5') {
        this.$router.push({ name: 'AccountSettlement' });
      } else if (name === '1-6') {
        this.$router.push({ name: 'BankCardManagement' });
      } else if (name === '1-7-1') {
        this.$router.push({ name: 'TransactionQuery' });
      } else if (name === '1-7-2') {
        this.$router.push({ name: 'CancelOrder' });
      } else if (name === '1-8') {
        this.$router.push({ name: 'TeamIntroduction' });
      }
    },
    updateLayout() {
      const noLayoutRoutes = ['index']; // 不需要布局的路由名称
      const currentRouteName = this.$route.name;
      this.showLayout = !noLayoutRoutes.includes(currentRouteName);
    }
  },
  mounted() {
    this.updateLayout();
    this.$router.afterEach(() => {
      this.updateLayout();
    });
  },

};
</script>

<style scoped>
.my-header {
  background-color: #001529;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  font-weight: bold;
}

.logo-placeholder {
  width: 40px;
  height: 40px;
  margin-right: 20px;
}

.title {
  font-family: "黑体";
  font-size: 20px;
  user-select: none;
}
</style>