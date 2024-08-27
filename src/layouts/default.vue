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
        <h-button type="primary" @click="logout">退出登录</h-button>
      </div>
      <h-row>
        <h-col :span=3>
          <h-menu ref="menus" theme="dark" active-name="activeName" :open-names=openNames
            :collapse="isCollapse === 'true'" style="width:100%;height:calc(100vh - 60px);overflow-y: hidden;"
            @on-select="handleSelect" :accordion="true">
            <h-menu-item name="1-1">
              <h-icon name="home"></h-icon>
              <span>平台主页</span>
            </h-menu-item>
            <h-submenu name="1-2">
              <template slot="title">
                <h-icon name="t-b-account"></h-icon>
                <span>账户管理</span>
              </template>
              <h-menu-item name="1-2-1"> <h-icon name="ios-paper-outline"></h-icon>用户列表</h-menu-item>
              <h-menu-item name="1-2-2"> <h-icon name="addition_fill"></h-icon>开户</h-menu-item>
              <h-menu-item name="1-2-3"> <h-icon name="card"></h-icon>银行卡管理</h-menu-item>
            </h-submenu>
            <h-submenu name="1-3">
              <template slot="title">
                <h-icon name="ios-list"></h-icon>
                <span>产品管理</span>
              </template>
              <h-menu-item name="1-3-1"> <h-icon name="ios-paper-outline"></h-icon>管理已有产品</h-menu-item>
              <h-menu-item name="1-3-2"> <h-icon name="addition_fill"></h-icon>新增产品</h-menu-item>
            </h-submenu>
            <h-submenu name="1-4">
              <template slot="title">
                <h-icon name="financial_fill"></h-icon>
                <span>产品交易</span>
              </template>
              <h-menu-item name="1-4-1"> <h-icon name="addition_fill"></h-icon>申购</h-menu-item>
              <h-menu-item name="1-4-2"> <h-icon name="ios-minus"></h-icon>赎回</h-menu-item>
            </h-submenu>
            <h-submenu name="1-5">
              <template slot="title">
                <h-icon name="cash"></h-icon>
                <span>账户清算</span>
              </template>
              <h-menu-item name="1-5-1"> <h-icon name="refresh"></h-icon>日初始化</h-menu-item>
              <h-menu-item name="1-5-2"> <h-icon name="android-done"></h-icon>交易确认</h-menu-item>
              <h-menu-item name="1-5-3"> <h-icon name="printer"></h-icon>数据导出</h-menu-item>
            </h-submenu>
            <h-submenu name="1-6">
              <template slot="title">
                <h-icon name="search"></h-icon>
                <span>业务查询</span>
              </template>
              <h-menu-item name="1-6-1"> <h-icon name="searchfill"></h-icon>交易查询</h-menu-item>
              <h-menu-item name="1-6-2"> <h-icon name="android-cancel"></h-icon>撤单申请</h-menu-item>
            </h-submenu>
            <h-menu-item name="1-7">
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
import minilogo from "@/assets/mini-logo.png";
export default {
  data() {
    return {
      openNames: ['1'],
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
      } else if (name === '1-2-1') {
        this.openNames = ['1-2']
        this.$router.push({ name: 'AccountManagement-CustomerList' });
      } else if (name === '1-2-2') {
        this.openNames = ['1-2']
        this.$router.push({ name: 'AccountManagement-AccountSettlement' });
      } else if (name === '1-2-3') {
        this.openNames = ['1-2']
        this.$router.push({ name: 'AccountManagement-BankCardManagement' });
      } else if (name === '1-3-1') {
        this.openNames = ['1-3']
        this.$router.push({ name: 'ProductManagement-ProductManage' });
      } else if (name === '1-3-2') {
        this.openNames = ['1-3']
        this.$router.push({ name: 'ProductManagement-ProductAdd' });
      } else if (name === '1-4-1') {
        this.openNames = ['1-4']
        this.$router.push({ name: 'Purchase' });
      } else if (name === '1-4-2') {
        this.openNames = ['1-4']
        this.$router.push({ name: 'Redemption' });
      } else if (name === '1-5-1') {
        this.openNames = ['1-5']
        this.$router.push({ name: 'Settlement-DailyInitiate' });
      } else if (name === '1-5-2') {
        this.openNames = ['1-5']
        this.$router.push({ name: 'Settlement-TransactionConfirm' });
      } else if (name === '1-5-3') {
        this.openNames = ['1-5']
        this.$router.push({ name: 'Settlement-DataOutput' });
      } else if (name === '1-5-4') {
        this.openNames = ['1-5']
        this.$router.push({ name: 'Settlement-SettlementLog' });
      } else if (name === '1-6-1') {
        this.openNames = ['1-6']
        this.$router.push({ name: 'BusinessQuery-TransactionQuery' });
      } else if (name === '1-6-2') {
        this.openNames = ['1-6']
        this.$router.push({ name: 'BusinessQuery-CancelOrder' });
      } else if (name === '1-7') {
        this.$router.push({ name: 'TeamIntroduction' });
      }
    },
    updateLayout() {
      const noLayoutRoutes = ['index', 'Register'];
      const currentRouteName = this.$route.name;
      this.showLayout = !noLayoutRoutes.includes(currentRouteName);
    },
    logout() {
      this.$router.push({ name: 'index' });
    }
  },
  mounted() {
    this.updateLayout();
    this.$router.afterEach((to) => {
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
  margin-right: 1300px;
}

.logout-button {
  background-color: #f5222d;
  color: white;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 14px;
  border-radius: 4px;
}
</style>