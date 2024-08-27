<template>
  <div style="overflow: hidden;">
    <h-card :border="false" class="fund-details-card">
      <h3>新增基金产品</h3>
      <h-row type="flex" justify="start">
        <!-- 基金信息输入 -->
        <h-col :span="24">
          <h-form label-width="120px">
            <h-form-item label="产品名" class="compact-form-item">
              <h-input v-model="newFund.fund_name" placeholder="输入产品名" />
            </h-form-item>
            <h-form-item label="产品ID" class="compact-form-item">
              <h-input v-model="newFund.fund_id" placeholder="输入产品ID" />
            </h-form-item>
            <h-form-item label="产品类型" class="compact-form-item">
              <h-input v-model="newFund.fund_type" placeholder="输入产品类型" />
            </h-form-item>
            <h-form-item label="初始净值" class="compact-form-item">
              <h-input v-model="newFund.fund_nav" placeholder="输入初始净值" />
            </h-form-item>
            <h-form-item label="产品发布时间" class="compact-form-item">
              <h-date-picker 
                v-model="newFund.fund_est_date" 
                type="date" 
                placeholder="选择发布日期" 
              />
            </h-form-item>
            <h-form-item label="风险等级" class="compact-form-item">
              <h-select v-model="newFund.fund_risk_level" placeholder="选择风险等级">
                <h-option v-for="option in riskLevels" :key="option.value" :value="option.value">{{ option.label }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item label="基金经理姓名" class="compact-form-item">
              <h-input v-model="newFund.fund_manager_name" placeholder="输入基金经理姓名" />
            </h-form-item>
            <h-form-item label="产品状态" class="compact-form-item">
              <h-select v-model="newFund.fund_state" placeholder="选择产品状态">
                <h-option v-for="option in fundStates" :key="option.value" :value="option.value">{{ option.label }}</h-option>
              </h-select>
            </h-form-item>
          </h-form>
        </h-col>
      </h-row>

      <div class="action-buttons">
        <h-button type="default" @click="goBack">返回</h-button>
        <h-button type="primary" @click="showConfirmation">保存</h-button>
      </div>
    </h-card>
  </div>
</template>

  
  <script>
  export default {
    data() {
      return {
        riskLevels: [
        { label: '低风险', value: 0 },
        { label: '中低风险', value: 1 },
        { label: '中风险', value: 2 },
        { label: '中高风险', value: 3 },
        { label: '高风险', value: 4 },
      ],
      fundStates: [
        { label: '正常', value: 0 },
        { label: '暂停', value: 1 },
        { label: '已关闭', value: 2 },
      ],
        newFund: {
          fund_id: '',
          fund_name: '',
          fund_type: '',
          fund_nav: '',
          fund_est_date: '',
          fund_risk_level: '',
          fund_manager_name: '',
          fund_state: '',
        },
      };
    },
    methods: {
      showConfirmation() {
        // 检查必填信息是否完整
        if (!this.newFund.fund_name || !this.newFund.fund_id) {
          this.$hMessage.info('请填写所有必填信息');
          return;
        }
  
        // 弹出确认对话框
        this.$hMsgBox.confirm({
          title: "确认新增",
          content: "<p>你确定要新增这个产品吗？</p>",
          onOk: () => {
            this.confirmCreate();
          },
          onCancel: () => {
            this.$hMessage.info("已取消新增");
          },
        });
      },
      confirmCreate() {
        // 确保所有字段都存在并正确格式化
        const formattedFund = {
          fundId: this.newFund.fund_id,  // 产品ID
          fundName: this.newFund.fund_name,  // 产品名称
          fundType: this.newFund.fund_type,  // 产品类型
          fundNav: this.newFund.fund_nav,  // 初始净值
          fundEstDate: this.newFund.fund_est_date ? 
                          (typeof this.newFund.fund_est_date === 'string' ? this.newFund.fund_est_date : this.newFund.fund_est_date.toISOString().split('T')[0]) : '',  // 产品发布时间，格式为 YYYY-MM-DD
          fundRiskLevel: this.newFund.fund_risk_level,  // 风险等级
          fundManagerName: this.newFund.fund_manager_name,  // 基金经理姓名
          fundState: this.newFund.fund_state,  // 产品状态
        };

        console.log('即将发送的数据:', formattedFund); // 打印所有字段以确认是否正确

        this.$request.post('/fund/generateNewProduct', formattedFund)
          .then(response => {
            if (response.data.code === 200) {
              this.$hMessage.info('新增成功');
              this.$router.push({ name: 'ProductManagement-ProductManage' });
            } else {
              this.$hMessage.error(response.data.message || '新增失败');
            }
          })
          .catch(error => {
            console.error('Create failed', error);
            this.$hMessage.error('新增失败');
          });
      },


      goBack() {
        this.$router.push({ name: 'ProductManagement-ProductManage'});
      },
    },
  };
  </script>
  
  <style scoped>
  .fund-details-card {
    position: relative;
    margin: 10px;
    padding-bottom: 50px;
  }
  
  .compact-form-item {
    margin-bottom: 8px;
  }
  
  .action-buttons {
    text-align: right;
    margin-top: 20px;
    padding-right: 5px;
    padding-bottom: 10px;
  }
  </style>
  