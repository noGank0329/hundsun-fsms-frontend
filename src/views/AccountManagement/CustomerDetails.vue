<template>
    <div class="customer-details-container">
      <h3>用户详细信息</h3>
      <h-form :model="customer" label-width="120px">
        <h-row :gutter="16">
          <h-col :span="12">
            <h-form-item label="用户ID">
              <h-input v-model="customer.customer_id" disabled />
            </h-form-item>
          </h-col>
          <h-col :span="12">
            <h-form-item label="用户姓名">
              <h-input v-model="customer.customer_name" :disabled="!isEditing" />
            </h-form-item>
          </h-col>
        </h-row>
        <h-row :gutter="16">
          <h-col :span="12">
            <h-form-item label="用户类型">
              <h-select v-model="customer.customer_type" :disabled="!isEditing">
                <h-option label="个人" value= '0'></h-option>
                <h-option label="机构" value= '1'></h-option>
              </h-select>
            </h-form-item>
          </h-col>
          <h-col :span="12">
            <h-form-item label="手机号">
              <h-input v-model="customer.customer_phone" :disabled="!isEditing" />
            </h-form-item>
          </h-col>
        </h-row>
        <h-row :gutter="16">
          <h-col :span="12">
            <h-form-item label="身份证号">
              <h-input v-model="customer.customer_idcard" :disabled="!isEditing" />
            </h-form-item>
          </h-col>
          <h-col :span="12">
            <h-form-item label="身份证类型">
              <h-select v-model="customer.customer_idtype" :disabled="!isEditing">
                <h-option label="身份证" value= '0'></h-option>
                <h-option label="护照" value= '1'></h-option>
                <h-option label="港澳台居民居住证/通行证" value= '2'></h-option>
              </h-select>
            </h-form-item>
          </h-col>
        </h-row>
        <h-form-item class="form-actions">
          <h-button type="primary" v-if="!isEditing" @click="enableEditing">编辑</h-button>
          <h-button type="primary" v-else @click="saveCustomer">保存</h-button>
          <h-button type="default" v-if="!isEditing" @click="goBack">返回</h-button>
          <h-button v-if="isEditing" @click="cancelEdit">取消</h-button>
        </h-form-item>
      </h-form>
  
      <!-- 账户列表 -->
      <h3>账户列表</h3>
      <h-table :columns="accountColumns" :data="currentData" stripe />
      <div style="margin-top: 20px; text-align: right;">
        <h-page :total="total" :page-size="pageSize" @on-change="handlePageChange" show-total></h-page>
    </div>

      <!-- 银行卡对话框 -->
    <h-msg-box
      v-model="showBankCardsDialog"
      title="银行卡信息"
      :escClose="true"
      @on-ok="onBankCardDialogOk"
      @on-cancel="onBankCardDialogCancel"
      :footer-hide="true"
    >
      <div v-if="currentBankCards.length">
        <h-table :columns="bankCardColumns" :data="currentBankCards" stripe />
      </div>
      <div v-else>
        <p>该账户下没有银行卡。</p>
      </div>
      <div style="text-align: right; margin-top: 15px;">
        <h-button type="default" @click="onBankCardDialogCancel">返回</h-button>
        <h-button type="primary" @click="goToBankCardManagement">去添加/删除/充值银行卡</h-button>
      </div>
    </h-msg-box>
    </div>
  </template>

<script>
export default {
  data() {
    return {
      customer: {
        customer_id: '',
        customer_name: '',
        customer_type: '',
        customer_idcard: '',
        customer_idtype: '',
        customer_phone: '',
      },
      customerAccounts: [], // 存储用户的账户信息
      currentBankCards: [], // 存储当前账户的银行卡信息
      showBankCardsDialog: false, // 控制银行卡对话框显示与否
      isEditing: false, // 控制是否处于编辑状态
      accountColumns: [
        { title: "账户ID", key: "account_id" },
        { title: "状态", key: "status" },
        { title: "创建日期", key: "create_date" },
        { title: "风险等级", key: "account_risk_level" },
        {
            title: "操作",
            key: "action",
            render: (h, params) => {
            return h('div', [
                h(
                'Button',
                {
                    props: {
                    type: 'primary',
                    size: 'small',
                    },
                    on: {
                    click: () => {
                        this.viewBankCards(params.row);
                    },
                    },
                },
                '查看银行卡'
                ),
                h(
                'Button',
                {
                    props: {
                    type: 'error',
                    size: 'small',
                    },
                    style: {
                    marginLeft: '10px',
                    },
                    on: {
                    click: () => {
                        this.confirmDelete(params.row);
                    },
                    },
                },
                '删除'
                ),
                h(
                'Button',
                {
                    props: {
                    type: 'warning',
                    size: 'small',
                    },
                    style: {
                    marginLeft: '6px',
                    },
                    on: {
                    click: () => {
                        this.$router.push({ name: 'AccountManagement-RisklevelTest', query: { account_id: params.row.account_id } });
                    },
                    },
                },
                '更新风险等级'
                ),
            ]);
            },
        },
        
      ],
      bankCardColumns: [
        { title: "银行卡ID", key: "creditcard_id" },
        { title: "银行名称", key: "bank_name" },
        { title: "余额", key: "balance" },
      ],
      currentPage: 1,
      pageSize: 3, // 每页显示的条目数
    };
  },
  created() {
    this.loadCustomerDetails();
  },
  methods: {
    handlePageChange(page) {
      this.currentPage = page;
    },
    async loadCustomerDetails() {
        try {
            const customerId = this.$route.query.customer_id;

            // 使用 this.$request.get 发送请求
            const res = await this.$request.get('/customer/customerfullinfo', {
                params: {
                    id: customerId
                }
            });

            // 检查返回的状态码
            if (res.data.code === 200) {
                // 将返回的数据映射到 customer 对象中
                console.log(this.customer);
                this.customer = {
                    customer_id: res.data.data.customerId,
                    customer_name: res.data.data.customerName,
                    customer_type: String(res.data.data.customerType),
                    customer_idcard: res.data.data.customerIdcard,
                    customer_idtype: String(res.data.data.customerIdcardType),
                    customer_phone: res.data.data.customerPhone,
                };
            } else {
                // 如果请求失败，显示错误信息
                this.$hMessage.error(res.data.message || '加载用户详细信息失败');
            }
        } catch (error) {
            // 捕获并处理请求错误
            console.error('Error loading customer details:', error);
            this.$hMessage.error('加载用户详细信息时发生错误');
        }
    },

    enableEditing() {
      this.isEditing = true;
    },
    saveCustomer() {
      console.log('保存用户信息:', this.customer);
      this.$hMessage.success('用户信息已保存');
      this.isEditing = false;
      this.$router.push({ name: 'AccountManagement-CustomerDetails', query: { customer_id: this.customer.customer_id } });
    },
    cancelEdit() {
      this.isEditing = false;
      this.loadCustomerDetails(); // 取消编辑时重新加载数据，恢复原始状态
      this.$router.push({ name: 'AccountManagement-CustomerDetails', query: { customer_id: this.customer.customer_id } });
    },
    goBack() {
      this.$router.go(-1);
    },
    confirmDelete(account) {
      this.$hMsgBox.confirm({
        title: "删除确认",
        content: `<p>确定要删除账户 <b>${account.account_id}</b> 吗？</p>`,
        onOk: () => {
          this.deleteAccount(account);
        },
        onCancel: () => {
          this.$hMessage.info("取消删除");
        },
      });
    },
    deleteAccount(account) {
      this.customerAccounts = this.customerAccounts.filter(a => a.account_id !== account.account_id);
      this.$hMessage.info(`账户 ${account.account_id} 已删除`);
      console.log("删除账户:", account.account_id);
    },
    viewBankCards(account) {
      // 模拟从服务器加载当前账户的银行卡信息
      const bankCardsData = account.account_id === "A001"
        ? [
            {
              creditcard_id: "CC001",
              bank_name: "工商银行",
              balance: "5000.00",
            },
            {
              creditcard_id: "CC002",
              bank_name: "建设银行",
              balance: "3000.00",
            },
          ]
        : []; // 如果是其他账户，这里模拟无银行卡

      this.currentBankCards = bankCardsData;
      this.showBankCardsDialog = true; // 显示对话框
    },
    onBankCardDialogOk() {
      this.showBankCardsDialog = false; // 关闭对话框
    },
    onBankCardDialogCancel() {
      this.showBankCardsDialog = false; // 关闭对话框
    },
    goToBankCardManagement() {
      this.$router.push({ name: 'AccountManagement-BankCardManagement'});
    },
  },
  computed: {
        total() {
            return this.customerAccounts.length;
        },
        currentData() {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = this.currentPage * this.pageSize;
            return this.customerAccounts.slice(start, end);
        },
    }
};
</script>

<style scoped>
.customer-details-container {
  margin: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

h3 {
  margin-bottom: 15px;
  color: #333;
}

.h-form-item {
  margin-bottom: 15px;
}

.form-actions {
  text-align: right;
}

.h-table {
  margin-top: 20px;
}
</style>

