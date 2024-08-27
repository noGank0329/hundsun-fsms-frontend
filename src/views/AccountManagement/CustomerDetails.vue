<template>
    <div class="customer-details-container">
      <h3>用户详细信息</h3>
      <h-form :model="editableCustomer" label-width="120px">
        <h-row :gutter="16">
          <h-col :span="12">
            <h-form-item label="用户ID">
              <h-input v-model="editableCustomer.customer_id" disabled />
            </h-form-item>
          </h-col>
          <h-col :span="12">
            <h-form-item label="用户姓名">
              <h-input v-model="editableCustomer.customer_name" :disabled="!isEditing" />
            </h-form-item>
          </h-col>
        </h-row>
        <h-row :gutter="16">
          <h-col :span="12">
            <h-form-item label="用户类型">
              <h-select v-model="editableCustomer.customer_type" :disabled="!isEditing">
                <h-option label="个人" value= '0'></h-option>
                <h-option label="机构" value= '1'></h-option>
              </h-select>
            </h-form-item>
          </h-col>
          <h-col :span="12">
            <h-form-item label="手机号">
              <h-input v-model="editableCustomer.customer_phone" :disabled="!isEditing" />
            </h-form-item>
          </h-col>
        </h-row>
        <h-row :gutter="16">
          <h-col :span="12">
            <h-form-item label="身份证号">
              <h-input v-model="editableCustomer.customer_idcard" :disabled="!isEditing" />
            </h-form-item>
          </h-col>
          <h-col :span="12">
            <h-form-item label="身份证类型">
              <h-select v-model="editableCustomer.customer_idtype" :disabled="!isEditing">
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
      accountRiskLevelMap: {
        0: "谨慎型",
        1: "稳健型",
        2: "平衡型",
        3: "进取型",
        4: "激进型"
      },
      editableCustomer: {},  // 用于存储编辑时的用户信息
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
    this.loadCustomerAccounts(); // 加载用户账户信息
  },
  methods: {
    handlePageChange(page) {
      this.currentPage = page;
      this.loadCustomerAccounts(); // 页码改变时重新加载账户信息
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
                this.editableCustomer = { ...this.customer }; // 将原始数据复制到可编辑对象
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

    async loadCustomerAccounts() {
      try {
        const customerId = this.$route.query.customer_id;
        const res = await this.$request.get('/user/queryAccountByCustomerId', {
          params: {
            current: this.currentPage,
            size: this.pageSize,
            customerId: customerId
          }
        });

        if (res.data.code === 200) {
          // 使用 map 方法将后端返回的数据字段名映射到前端表格需要的字段名
          this.customerAccounts = res.data.data.records.map(account => {
            return {
              account_id: account.accountId, // 将 accountId 映射到 account_id
              status: account.status,        // 直接使用 status
              create_date: account.createDate, // 将 createDate 映射到 create_date
              account_risk_level: this.accountRiskLevelMap[account.accountRiskLevel], // 将 accountRiskLevel 映射到 account_risk_level
            };
          });
          this.total = res.data.data.total; // 设置总账户数
        } else {
          this.$hMessage.error(res.data.message || '加载账户信息失败');
        }
      } catch (error) {
        console.error('加载账户信息时发生错误:', error);
        this.$hMessage.error('加载账户信息时发生错误');
      }
    },


    enableEditing() {
      this.isEditing = true;
      this.editableCustomer = { ...this.customer }; // 进入编辑模式时，复制原始数据到可编辑对象
    },
    saveCustomer() {
      console.log('保存用户信息:', this.editableCustomer);

      // 创建要提交的完整用户数据对象
      const customerToSave = {
        customerId: this.editableCustomer.customer_id,
        customerName: this.editableCustomer.customer_name,
        customerType: parseInt(this.editableCustomer.customer_type),  // 用户类型转换为 int
        customerIdcard: this.editableCustomer.customer_idcard,
        customerIdcardType: parseInt(this.editableCustomer.customer_idtype),  // 身份证类型转换为 int
        customerPhone: this.editableCustomer.customer_phone,
      };

      console.log('提交到后端的用户信息:', customerToSave);

      // 调用后端接口保存数据
      this.$request.post('/customer/update_customer', customerToSave)
        .then(response => {
          console.log('后端响应:', response); // 打印后端响应
          if (response.data.code === 200) {
            this.$hMessage.success('用户信息保存成功');
            this.customer = { ...this.editableCustomer }; // 保存成功后，将编辑内容覆盖原始数据
            this.isEditing = false; // 退出编辑模式
          } else {
            this.$hMessage.error(response.data.message || '保存用户信息失败');
          }
        })
        .catch(error => {
          console.error('保存用户信息时发生错误:', error);
          this.$hMessage.error('保存用户信息时发生错误');
        });
    },

    cancelEdit() {
      this.isEditing = false;
      this.editableCustomer = { ...this.customer };
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
    async deleteAccount(account) {
      try {
        // 调用后端接口删除账户
        const res = await this.$request.delete('/account/delete', {
          params: {
            id: account.account_id
          }
        });
        if (res.data.code === 200) {
          // 如果删除成功，从前端的账户列表中移除该账户
          this.customerAccounts = this.customerAccounts.filter(a => a.account_id !== account.account_id);
          this.$hMessage.success(`账户 ${account.account_id} 已成功删除`);
          console.log("删除账户:", account.account_id);
        } else {
          // 如果删除失败，显示错误信息
          this.$hMessage.error(res.data.message || '删除账户失败');
        }
      } catch (error) {
        console.error('删除账户时发生错误:', error);
        this.$hMessage.error('删除账户时发生错误');
      }
    },
    async viewBankCards(account) {
      try {
        console.log("账户ID:", account.account_id);  // 添加调试信息
        const res = await this.$request.get('/creditcard/queryAccountByID', {
          params: {
            accountId: account.account_id
          }
        });
        console.log(res);
        if (res.data.code === 200) {
          console.log(res);
          this.currentBankCards = res.data.data.map(card => ({
            creditcard_id: card.creditcardId,
            bank_name: card.bankName,
            balance: card.balance,
          }));
          this.showBankCardsDialog = true; // 显示对话框
        } else {
          this.$hMessage.error(res.data.message || '加载银行卡信息失败');
        }
      } catch (error) {
        console.error('加载银行卡信息时发生错误:', error);
        this.$hMessage.error('加载银行卡信息时发生错误');
      }
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

