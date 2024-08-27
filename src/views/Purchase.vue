<template>
  <div class="purchase-container">
    <!-- 上半部分：查询客户信息 -->
    <div class="query-section">
      <h-form :model="searchForm" ref="searchForm" inline>
        <h-row :gutter="0" class="query-row">
          <h-col :span="6">
            <h-form-item class="query-form-item">
              <div class="form-item-content">
                <span class="query-label">委托方式</span>
                <h-select v-model="searchForm.delegateType" placeholder="请选择委托方式" class="query-select">
                  <h-option label="柜台委托" value="1"></h-option>
                  <h-option label="在线委托" value="2"></h-option>
                </h-select>
              </div>
            </h-form-item>
          </h-col>
          <h-col :span="6">
            <h-form-item class="query-form-item">
              <div class="form-item-content">
                <span class="query-label">用户账号</span>
                <h-input v-model="searchForm.customer_id_card" type="text" class="query-input" placeholder="请输入客户账号">
                </h-input>
              </div>
            </h-form-item>
          </h-col>
          <h-col :span="3">
            <h-form-item class="query-form-item">
              <div class="form-item-content">
                <h-button type="primary" @mousedown.native="handleMouseDown" @mouseup.native="handleMouseUp"
                  @click="searchCustomer" class="query-button">查询</h-button>
              </div>
            </h-form-item>
          </h-col>
        </h-row>
      </h-form>
    </div>

    <transition name="fade">
      <!-- 中间部分：显示客户信息 -->
      <h-card class="info-card" style="margin-top: -30px;">
        <h-form :model="customerInfo" ref="customerForm" :label-width="120" class="info-form">
          <h-row :gutter="20">
            <h-col :span="24" :md="12">
              <h-form-item label="客户姓名">
                <h-input v-model="customerInfo.customerName" :style="getDynamicStyle('customer_name')" placeholder="——"
                  readonly></h-input>
              </h-form-item>
              <h-form-item label="客户邮箱">
                <h-input v-model="customerInfo.email" :style="getDynamicStyle('email')" placeholder="——"
                  readonly></h-input>
              </h-form-item>
              <h-form-item label="证件号码">
                <h-input v-model="customerInfo.customerIdcard" :style="getDynamicStyle('customer_idcard')"
                  placeholder="——" readonly></h-input>
              </h-form-item>
            </h-col>
            <h-col :span="24" :md="12">
              <h-form-item label="客户电话">
                <h-input v-model="customerInfo.customerPhone" :style="getDynamicStyle('customer_phone')"
                  placeholder="——" readonly></h-input>
              </h-form-item>
              <h-form-item label="证件类型">
                <h-input v-model="idcardTypeText" :style="getDynamicStyle('customer_idcard_type')" placeholder="——"
                  readonly></h-input>
              </h-form-item>
              <h-form-item label="客户类别">
                <h-input v-model="customerTypeText" :style="getDynamicStyle('customer_type')" placeholder="——"
                  readonly></h-input>
              </h-form-item>
            </h-col>
            <h-col :span="24">
              <h-row :gutter="20">
                <h-col :span="12">
                  <h-form-item label="风险等级">
                    <h-input v-model="customerInfo.riskLevel" :style="getDynamicStyle('riskLevel')" placeholder="——"
                      readonly></h-input>
                  </h-form-item>
                </h-col>
                <h-col :span="12">
                  <h-form-item label="客户账号">
                    <h-input v-model="customerInfo.customerId" :style="getDynamicStyle('customerId')" placeholder="——"
                      readonly></h-input>
                  </h-form-item>
                </h-col>
              </h-row>
            </h-col>
          </h-row>
        </h-form>
      </h-card>
    </transition>
    <!-- 下半部分：基金申购表单 -->
    <h-card class="purchase-card">
      <h-form :model="purchaseForm" class="purchase-form" @submit.prevent="submitForm">
        <h-row :gutter="290">
          <!-- 第一行 -->
          <h-col :span="12">
            <h-form-item class="form-item-inline">
              <div class="form-item-content">
                <span class="form-label">基金代码</span>
                <h-input v-model="purchaseForm.fundCode" placeholder="请输入基金代码"
                  :class="{ 'input-error': errors.fundCode }"></h-input>
                <p v-if="errors.fundCode" class="error-message">{{ errors.fundCode }}</p>
              </div>
            </h-form-item>
          </h-col>
          <h-col :span="12">
            <h-form-item class="form-item-inline">
              <div class="form-item-content">
                <span class="form-label">购买金额</span>
                <h-input v-model="purchaseForm.amount" placeholder="请输入购买金额" type="text"
                  :class="{ 'input-error': errors.amount }"></h-input>
                <p v-if="errors.amount" class="error-message">{{ errors.amount }}</p>
              </div>
            </h-form-item>
          </h-col>
        </h-row>
        <h-row :gutter="290">
          <!-- 第二行 -->
          <h-col :span="12">
            <h-form-item class="form-item-inline">
              <div class="form-item-content">
                <span class="form-label">银行卡号</span>
                <h-input v-model="purchaseForm.bankCardNumber" placeholder="请输入银行卡号"
                  :class="{ 'input-error': errors.bankCardNumber }"></h-input>
                <p v-if="errors.bankCardNumber" class="error-message">{{ errors.bankCardNumber }}</p>
              </div>
            </h-form-item>
          </h-col>
          <h-col :span="12">
            <h-form-item class="form-item-inline">
              <div class="form-item-content">
                <span class="form-label">支持币种</span>
                <h-select v-model="purchaseForm.currency" placeholder="请选择币种" class="uniform-width-select"
                  :class="{ 'select-error': errors.currency }">
                  <h-option label="人民币" value="CNY"></h-option>
                  <h-option label="美元" value="USD"></h-option>
                </h-select>
                <p v-if="errors.currency" class="error-message">{{ errors.currency }}</p>
              </div>
            </h-form-item>
          </h-col>
        </h-row>
        <h-row :gutter="290">
          <!-- 第三行 -->
          <h-col :span="12">
            <h-form-item class="form-item-inline">
              <div class="form-item-content">
                <span class="form-label">可用金额</span>
                <h-input v-model="purchaseForm.availableAmount" placeholder="可用金额" disabled></h-input>
              </div>
            </h-form-item>
          </h-col>
          <h-col :span="12">
            <h-form-item class="form-item-inline">
              <div class="form-item-content">
                <span class="form-label">用户账号</span>
                <h-input v-model="customerInfo.customerId" placeholder="请输入用户账号" disabled></h-input>
              </div>
            </h-form-item>
          </h-col>
        </h-row>
        <h-form-item class="submit-button">
          <h-button type="primary" @mousedown.native="handleMouseDown" @mouseup.native="handleMouseUp"
            @click="submitPurchase" class="purchase-button">申购</h-button>
        </h-form-item>
      </h-form>
    </h-card>



  </div>

</template>

<script>
export default {

  data() {
    return {
      // 映射对象
      customerTypeMap: {
        0: '个人',
        1: '机构'
      },
      idcardTypeMap: {
        0: '身份证',
        1: '护照',
        2: '港澳台居民居住证/通行证'
      },
      searchForm: {
        delegateType: '',
        customer_id_card: '', // 确保这里的键名和 v-model 使用的一致
      },
      searchParams: {
        customer_id_card: '',
      },
      customerInfo: {
        customerId: '',         // 客户ID
        customerName: '',       // 客户姓名
        customerType: '',       // 客户类型
        customerIdcard: '',     // 证件号码
        customerIdcardType: '',// 证件类型
        customerPhone: '',      // 客户电话
        riskLevel: '',
        email: ''
        // 添加其他字段
      },
      purchaseForm: {
        fundCode: '',
        amount: '',
        bankCardNumber: '',
        currency: 'CNY',
        availableAmount: '',
        accountNumber: '',
      },
      errors: {},
    };
  },

  computed: {
    customerTypeText() {
      return this.customerTypeMap[this.customerInfo.customerType] || '——';
    },
    idcardTypeText() {
      return this.idcardTypeMap[this.customerInfo.customerIdcardType] || '——';
    }
  },

  watch: {
    customerInfo: {
      deep: true,
      immediate: true,
      handler(newVal) {
        if (newVal.customerId) {
          this.purchaseForm.accountNumber = newVal.customerId;
          console.log('Account Number set to:', this.purchaseForm.accountNumber);
        } else {
          console.log('Customer ID is missing.');
        }
      }
    }
  },

  methods: {

    submitPurchase() {
      console.log('Purchase Form:', this.purchaseForm);
      // 确保所有字段都存在并正确格式化
      const formattedPurchase = {
        accountId: this.purchaseForm.accountNumber,  // 账户ID
        cardNumber: this.purchaseForm.bankCardNumber, // 银行卡号
        fundId: this.purchaseForm.fundCode, // 基金代码
        purchaseAmount: parseFloat(this.purchaseForm.amount) // 申购金额
      };

      console.log('即将发送的数据:', formattedPurchase); // 打印所有字段以确认是否正确

      this.$request.post('/purchase/create', formattedPurchase)
        .then(response => {
          if (response.data.code === 200) {
            this.$hMessage.info('申购成功');
            // 你可以在这里进行页面跳转或其他操作
          } else {
            this.$hMessage.error(response.data.message || '申购失败');
          }
        })
        .catch(error => {
          console.error('申购失败', error);
          this.$hMessage.error('申购失败');
        });
    },


    async searchCustomer() {
      if (!this.searchForm.customer_id_card.trim()) {
        this.showMessage('客户账号不能为空', 'error');
        return;
      }

      try {
        const response = await this.$request.get('/customer/customerfullinfo', {
          params: { id: this.searchForm.customer_id_card.trim() }
        });

        console.log('API 返回的数据:', response);

        // 确保 data 存在并且包含客户信息
        if (response.data && response.data.data) {
          this.customerInfo = {
            customerId: response.data.data.customerId || '',
            customerName: response.data.data.customerName || '',
            customerType: response.data.data.customerType,
            customerIdcard: response.data.data.customerIdcard || '',
            customerIdcardType: response.data.data.customerIdcardType,
            customerPhone: response.data.data.customerPhone || '',
            riskLevel: '中低风险',
            email: '243831jau@gmail.com'
            // 添加其他字段
          };
          this.purchaseForm = {
            availableAmount: '19700'
          }
          console.log('Updated customerInfo:', this.customerInfo);
          this.showMessage('查询成功', 'success');
        } else {
          this.showMessage('未找到客户信息', 'warning');
        }
      } catch (error) {
        console.error('查询失败:', error);
        this.showMessage('查询失败: ' + error.message, 'error');
      }
    }
    ,

    showMessage(message, type) {
      console.log('显示消息:', message, type); // 调试信息
      if (this.$hMessage) {
        this.$hMessage[type]({
          message: message || '默认消息',
          type: type || 'info',
        });
      } else {
        console.error('this.$hMessage 不是一个函数');
      }
    },

    handleMouseDown(event) {
      event.target.style.backgroundColor = '#ccc'; // 按下时变灰
    },

    handleMouseUp(event) {
      event.target.style.backgroundColor = ''; // 恢复原样
    },

    submitForm() {
      if (this.validateForm()) {
        console.log('表单数据:', this.purchaseForm);
        // 提交表单逻辑
      }
    },

    validatePurchaseForm() {
      this.errors = {};
      let isValid = true;

      if (!this.purchaseForm.fundCode) {
        this.errors.fundCode = '基金代码不能为空';
        isValid = false;
      }
      if (!this.purchaseForm.amount) {
        this.errors.amount = '购买金额不能为空';
        isValid = false;
      }
      if (!this.purchaseForm.bankCardNumber) {
        this.errors.bankCardNumber = '银行卡号不能为空';
        isValid = false;
      }
      if (!this.purchaseForm.currency) {
        this.errors.currency = '支持币种不能为空';
        isValid = false;
      }
      if (!this.purchaseForm.accountNumber) {
        this.errors.accountNumber = '用户账号不能为空';
        isValid = false;
      }
      return isValid;
    },

    getDynamicStyle(field) {
      return this.customerInfo[field] ? { 'info-filled': true } : { 'info-empty': true };
    },
  },

};
</script>

<style scoped>
/* 基本容器样式 */
.purchase-container {
  margin: 10px;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 5px;
  height: 91vh;
}

/* 上半部分：查询客户信息 */
.query-section {
  margin-bottom: 20px;
  margin-left: 20px;
}

.query-row {
  display: flex;
  align-items: center;
}

.query-form-item {
  display: flex;
  align-items: center;
}

.form-item-content {
  display: flex;
  align-items: center;
}

.query-label,
.form-label {
  margin-right: 10px;
  white-space: nowrap;
}

.query-select,
.query-input {
  flex: 1;
  width: 200px;
}

.query-button {
  width: 100%;
}

/* 中间部分：显示客户信息 */
.info-card,
.purchase-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 垂直居中 */
  margin: 0 auto;
  margin-bottom: 20px;
  transition: opacity 0.5s ease;
}


.purchase-form {
  width: 100%;
  max-width: 600px;
  /* 设置一个合适的最大宽度，防止表单过宽 */
  margin: 0 auto;
  /* 水平居中 */
}


.info-card.fade-enter-active,
.info-card.fade-leave-active {
  opacity: 1;
}

.info-card.fade-enter,
.info-card.fade-leave-to {
  opacity: 0;
}

.info-form {
  padding: 10px;
}

.info-form .h-form-item__label {
  width: 120px;
}

.info-form .h-input {
  width: 100%;
}

/* 下半部分：基金申购表单 */
.purchase-form {
  padding: 10px;
  max-width: 3000px;
  /* 设置一个合适的最大宽度，防止表单过宽 */
  flex-direction: column;
  margin: 0 auto;
  /* 水平居中 */
}

.purchase-form .h-form-item {
  margin-bottom: 16px;
  /* 行与行之间的间距 */
}

.purchase-form .form-label {
  display: block;
  /* 确保标签在单独一行 */
  line-height: 32px;
  /* 确保与选择框的行高一致 */
}

.select-wrapper {
  margin-left: -64px;
  /* 向左移动选择框，调整具体值以匹配对齐 */
}

.uniform-width-select {
  width: 100%;
  /* 使选择框宽度填充父容器 */
  min-width: 150px;
  /* 设置最小宽度，防止选择框过窄 */
  box-sizing: border-box;
  /* 包括内边距和边框 */
}

.submit-button {
  text-align: center;
  /* 居中对齐 */
  margin-top: 20px;
}

.purchase-button,
.query-button {
  transition: background-color 0.3s ease;
}

.clicked {
  background-color: #ccc !important;
}

.h-button:hover {
  background-color: #1d84e7;
}

.input-error {
  border-color: red;
  /* 错误输入框的边框颜色 */
}

.select-error {
  border-color: red;
  /* 错误选择框的边框颜色 */
}

.error-message {
  color: red;
  /* 错误消息的颜色 */
  font-size: 12px;
  /* 错误消息的字体大小 */
  margin-top: 5px;
  /* 错误消息与输入框的距离 */
  white-space: nowrap;
}
</style>
