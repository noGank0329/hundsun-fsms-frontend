<template>
  <div class="bank-card-management-container">
    <h3>银行卡管理</h3>
    <h-card :border="false" style="margin-bottom:20px" dis-hover>
      <h-form :inline="true" label-width="100px">
        <!-- 搜索表单 -->
        <h-form-item label="卡号">
          <h-input v-model="searchParams.cardNumber" />
        </h-form-item>
        <h-form-item label="账户ID">
          <h-input v-model="searchParams.accountId" />
        </h-form-item>
        <h-form-item label="银行名称">
          <h-input v-model="searchParams.bankName" />
        </h-form-item>
        <h-form-item style="margin-top:33px">
          <h-button type="primary" @click="onSearch">查询</h-button>
          <h-button @click="onReset">重置</h-button>
          <h-button type="primary" @click="addCards">添加银行卡</h-button>
        </h-form-item>
      </h-form>
    </h-card>
    <!-- 表格显示 -->
    <h-table class="card-table" :columns="columns" :data="currentData">
    </h-table>
    <div style="position: fixed;bottom: 5%;">
      <h-page :total="total" :page-size="pageSize" @on-change="handlePageChange" show-total></h-page>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchParams: {
        cardNumber: '',
        accountId: '',
        bankName: '',
      },
      columns: [
        { title: "卡号", key: "cardNumber" },
        { title: "账户ID", key: "accountId" },
        { title: "银行名称", key: "bankName" },
        {
          title: "余额",
          key: "balance",
          render: (h, params) => {
            return h('div', [
              h("h-button", {
                props: {
                  type: "primary",
                  size: "small",
                },
                on: {
                  click: () => {
                    params.row.showBalance = !params.row.showBalance;
                  },
                },
              }, "查看"),
              h('span', {
                style: {
                  marginLeft: '10px'
                }
              }, params.row.showBalance ? params.row.balance : '******')
            ]);
          }
        },
        {
          title: "操作",
          key: "actions",
          width: 200,
          fixed: "right",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "default",
                    size: "small",
                  },
                  on: {
                    click: () => {
                      this.recharge(params.row.cardNumber);
                    },
                  },
                },
                "充值"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small",
                  },
                  style: {
                    marginLeft: '10px',
                  },
                  on: {
                    click: () => {
                      this.confirmDelete(params.row.cardNumber);
                    },
                  },
                },
                "删除"
              ),
            ]);
          },
        },
      ],
      cards: [],
      filteredCards: [],
      pageSize: 9,
      currentPage: 1,
      total: 0,
    };
  },
  created() {
    this.loadCards();
  },
  methods: {
    addCards(){
      this.$router.push({ name: 'AccountManagement-AddCreditcard'});
    },
    async loadCards() {
      try {
        const res = await this.$request.get('/creditcard/queryCreditcard', {
          params: {
            current: this.currentPage,
            size: this.pageSize,
            creditcardId: this.searchParams.cardNumber,
            accountId: this.searchParams.accountId,
            bank: this.searchParams.bankName,
          },
        });
        if (res.data.code === 200) {
          this.cards = res.data.data.records.map(item => ({
            cardNumber: item.creditcardId,
            accountId: item.accountId,
            bankName: item.bank,
            balance: item.balance,
            showBalance: false, // 初始化 showBalance 为 false
          }));
          this.filteredCards = this.cards;
          this.total = res.data.data.total;
        } else {
          this.$hMessage.error(res.data.message || '加载银行卡数据失败');
        }
      } catch (error) {
        console.error('Error loading cards:', error);
        this.$hMessage.error('加载银行卡数据时发生错误');
      }
    },
    onSearch() {
      this.currentPage = 1; // 查询后从第一页开始显示
      this.loadCards();
    },
    onReset() {
      this.searchParams = {
        cardNumber: '',
        accountId: '',
        bankName: '',
      };
      this.loadCards(); // 重置后重新加载所有数据
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.loadCards();
    },
    recharge(cardNumber) {
      this.$hMsgBox.confirm({
        title: "输入密码",
        render: (h) => {
          return h('div', [
            h('p', `请输入卡号 ${cardNumber} 的密码`),
            h('Input', {
              props: {
                type: 'password',
                autofocus: true,
                placeholder: "请输入密码...",
              },
              on: {
                input: (val) => {
                  this.password = val;
                },
              },
            }),
          ]);
        },
        onOk: () => {
          if (this.password === "123") {  // 替换成你的密码验证逻辑
            this.$hMsgBox.confirm({
              title: "充值",
              render: (h) => {
                return h('div', [
                  h('p', `为卡号 ${cardNumber} 充值`),
                  h('Input', {
                    props: {
                      value: this.rechargeAmount,
                      autofocus: true,
                      placeholder: "请输入充值金额...",
                    },
                    on: {
                      input: (val) => {
                        this.rechargeAmount = val;
                      },
                    },
                  }),
                ]);
              },
              onOk: () => {
                if (this.rechargeAmount > 0) {
                  this.$hMessage.success(`卡号 ${cardNumber} 充值 ${this.rechargeAmount} 成功`);
                  this.rechargeAmount = 0; // 重置充值金额
                } else {
                  this.$hMessage.error("请输入有效的充值金额");
                }
              },
              onCancel: () => {
                this.$hMessage.info("取消充值");
                this.rechargeAmount = 0; // 重置充值金额
              },
            });
          } else {
            this.$hMessage.error("密码错误，请重试");
          }
          this.password = ''; // 重置密码输入
        },
        onCancel: () => {
          this.$hMessage.info("取消操作");
          this.password = ''; // 重置密码输入
        },
      });
    },
    confirmDelete(cardNumber) {
      // 删除逻辑实现...
    },
  },
  computed: {
    currentData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = this.currentPage * this.pageSize;
      return this.filteredCards.slice(start, end);
    },
  },
};
</script>

<style scoped>
.bank-card-management-container {
  margin: 10px;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 5px;
  height: 91vh;
}

.h-form {
  margin-bottom: 20px;
}

.card-table {
  margin-top: -60px;  
}
</style>
