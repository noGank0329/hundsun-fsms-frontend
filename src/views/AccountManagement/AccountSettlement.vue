<template>
  <div style="padding: 20px;">

    <div
      style="background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); min-height: 86vh; ">
      <div v-if="!hasStarted">
        <h2 style="margin-bottom: 10px;">欢迎使用本理财销售交易系统进行开户</h2>
        <p style="margin-bottom: 10px;">是否要开始开户流程？</p>
        <h-button type="primary" @click="startProcess">开始开户</h-button>
      </div>

      <div v-else>
        <p>当前正在进行第 {{ current + 1 }} 步</p>
        <h-steps :current="current" style="margin-bottom: 12px;">
          <h-step title="填写基本信息"></h-step>
          <h-step title="添加银行卡"></h-step>
          <h-step title="完成风险测评问卷"></h-step>
          <h-step title="完成"></h-step>
        </h-steps>

        <!-- 第一步：填写基本信息 -->
        <div v-if="current === 0">
          <h2>填写基本信息</h2>
          <h-form ref="form" :model="form" label-width="120px">
            <h-row :gutter="16">
              <h-col :span="12">
                <h-form-item label="用户姓名" prop="userName"
                  :rules="[{ required: true, message: '请输入用户姓名', trigger: 'blur' }]">
                  <h-input v-model="form.userName" type="text" placeholder="请输入用户姓名" />
                </h-form-item>
              </h-col>
              <h-col :span="12">
                <h-form-item label="用户类型" prop="userType"
                  :rules="[{ required: true, message: '请选择用户类型', trigger: 'change' }]">
                  <h-select v-model="form.userType">
                    <h-option label="个人" value="个人"></h-option>
                    <h-option label="机构" value="机构"></h-option>
                  </h-select>
                </h-form-item>
              </h-col>
            </h-row>
            <h-row :gutter="16">
              <h-col :span="12">
                <h-form-item label="手机号" prop="phone" :rules="[{ required: true, message: '请输入手机号', trigger: 'blur' }]">
                  <h-input v-model="form.phone" type="text" placeholder="请输入手机号" />
                </h-form-item>
              </h-col>
              <h-col :span="12">
                <h-form-item label="身份证类型" prop="idType"
                  :rules="[{ required: true, message: '请选择身份证类型', trigger: 'change' }]">
                  <h-select v-model="form.idType">
                    <h-option label="身份证" value="身份证"></h-option>
                    <h-option label="护照" value="护照"></h-option>
                    <h-option label="港澳居民居住证/通行证" value="港澳居民居住证/通行证"></h-option>
                  </h-select>
                </h-form-item>
              </h-col>
            </h-row>
            <h-row :gutter="16">
              <h-col :span="12">
                <h-form-item label="身份证号码(8位)" prop="idNumber"
                  :rules="[{ required: true, message: '请输入正确的身份证号码', validator: validateIdNumber, trigger: 'blur' }]">
                  <h-input v-model="form.idNumber" type="text" placeholder="请输入身份证号码" />
                </h-form-item>
              </h-col>
              <h-col :span="12">
                <h-form-item label="性别" prop="gender">
                  <h-select v-model="form.gender" placeholder="请选择性别">
                    <h-option label="男" value="男"></h-option>
                    <h-option label="女" value="女"></h-option>
                  </h-select>
                </h-form-item>
              </h-col>
            </h-row>
            <div style="text-align: right; margin-top: 20px;">
              <h-button type="primary" @click="submitBasicInfo">保存并下一步</h-button>
            </div>
          </h-form>
        </div>

        <!-- 第二步：添加银行卡 -->
        <div v-if="current === 1" class="add-bank-card">
          <h2>添加银行卡</h2>
          <h-card :border="false" class="form-container" dis-hover>
            <div class="form-section">
              <label for="creditcard_id">银行卡号</label>
              <h-input id="creditcard_id" v-model="bankForm.creditcard_id" placeholder="请输入银行卡号"
                @blur="validateCardNumber" />

              <label for="bank_name">开户行</label>
              <h-input id="bank_name" v-model="bankForm.bank_name" placeholder="请输入开户行名称" />

              <label for="balance">初始金额</label>
              <h-input id="balance" v-model="bankForm.balance" type="number" placeholder="请输入初始金额"
                @blur="validateBalance" />

              <label for="password">密码</label>
              <h-input id="password" v-model="bankForm.password" type="password" placeholder="请输入密码" />

              <label for="confirm_password">确认密码</label>
              <h-input id="confirm_password" v-model="bankForm.confirm_password" type="password" placeholder="请再次输入密码"
                @blur="validatePassword" />
            </div>
          </h-card>
          <div class="button-section">
            <h-button type="primary" @click="submitBankCard">保存并下一步</h-button>
          </div>
        </div>

        <!-- 第三步：完成风险测评问卷 -->
        <div v-if="current === 2" class="risk-assessment-container">
          <h3>风险等级测试问卷</h3>
          <h-card :border="false" style="margin-bottom:20px" dis-hover>
            <h-form ref="riskForm" label-width="120px">
              <!-- 问卷题目 -->
              <h-form-item label="您的投资经验">
                <h-radio-group v-model="formData.experience">
                  <h-radio label="newbie">新手</h-radio>
                  <h-radio label="intermediate">有一定经验</h-radio>
                  <h-radio label="expert">专家</h-radio>
                </h-radio-group>
              </h-form-item>

              <h-form-item label="您的投资目标 (可多选)">
                <h-checkbox-group v-model="formData.goals">
                  <h-checkbox label="preservation">资产保值</h-checkbox>
                  <h-checkbox label="growth">资产增值</h-checkbox>
                  <h-checkbox label="income">产生收入</h-checkbox>
                </h-checkbox-group>
              </h-form-item>

              <h-form-item label="您能接受的最大投资损失">
                <h-radio-group v-model="formData.lossTolerance">
                  <h-radio label="5">5% 以下</h-radio>
                  <h-radio label="10">5%-10%</h-radio>
                  <h-radio label="20">10%-20%</h-radio>
                  <h-radio label="more">20% 以上</h-radio>
                </h-radio-group>
              </h-form-item>

              <h-form-item label="您的投资时间范围">
                <h-radio-group v-model="formData.investmentHorizon">
                  <h-radio label="short-term">1 年以下</h-radio>
                  <h-radio label="medium-term">1-3 年</h-radio>
                  <h-radio label="long-term">3 年以上</h-radio>
                </h-radio-group>
              </h-form-item>

              <h-form-item label="您愿意承担的风险">
                <h-radio-group v-model="formData.riskTolerance">
                  <h-radio label="low">较低风险，较低收益</h-radio>
                  <h-radio label="moderate">中等风险，中等收益</h-radio>
                  <h-radio label="high">高风险，高收益</h-radio>
                </h-radio-group>
              </h-form-item>

              <h-form-item label="您的流动性需求">
                <h-radio-group v-model="formData.liquidityNeeds">
                  <h-radio label="high">高，随时可能需要用到这笔资金</h-radio>
                  <h-radio label="medium">中，可能在未来1-3年内需要部分资金</h-radio>
                  <h-radio label="low">低，长期不需要动用这笔资金</h-radio>
                </h-radio-group>
              </h-form-item>

              <h-form-item label="您对市场波动的反应">
                <h-radio-group v-model="formData.marketReaction">
                  <h-radio label="panic">恐慌，会立刻卖出资产</h-radio>
                  <h-radio label="concerned">担忧，会考虑调整部分投资</h-radio>
                  <h-radio label="calm">冷静，愿意等待市场恢复</h-radio>
                </h-radio-group>
              </h-form-item>

              <h-form-item>
                <h-button type="primary" @click="submitForm">提交问卷</h-button>
              </h-form-item>
            </h-form>
          </h-card>

          <!-- 显示风险等级结果 -->
          <h-alert v-if="riskLevel" type="info" show-icon>
            您的风险等级为：{{ riskLevel }}
          </h-alert>
        </div>

        <!-- 第四步：开户完成 -->
        <div v-if="current === 3">
          <h2>开户完成</h2>
          <p>恭喜您，开户流程已完成！</p>
          <h-button type="primary" @click="goToUserList">返回用户列表</h-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      current: 0,  // 进度条步骤
      hasStarted: false,  // 标志是否已经开始开户流程
      form: {
        userName: '',  // 用户姓名
        userType: '个人',  // 用户类型，默认为个人
        phone: '',  // 手机号码
        idType: '身份证',  // 身份证类型，默认为身份证
        idNumber: '',  // 身份证号码
        gender: '',  // 性别（非必填项）
      },
      bankForm: {
        creditcard_id: '',
        bank_name: '',
        balance: '',
        password: '',
        confirm_password: ''
      },
      formData: {
        experience: '',
        goals: [],
        lossTolerance: '',
        investmentHorizon: '',
        riskTolerance: '',
        liquidityNeeds: '',
        marketReaction: '',
      },
      riskLevel: '',
      accountId: '', // 用于存储生成的 accountId
      isAccountCreated: false, // 标记账户是否已经创建
    };
  },
  methods: {
    goToUserList() {
      this.$router.push({ name: 'AccountManagement-CustomerList' });
    },
    startProcess() {
      this.hasStarted = true;
    },
    nextStep() {
      if (this.current < 3) {
        this.current += 1;
      }
    },
    validateIdNumber(rule, value, callback) {
      const regex = /^[a-zA-Z0-9]{8}$/;
      if (!regex.test(value)) {
        callback(new Error('身份证号码格式不正确，应为8位字母或数字'));
      } else {
        callback();
      }
    },
    submitBasicInfo() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$hMsgBox.confirm({
            title: "确认信息",
            content: "<p>你确定要提交基本信息吗？</p>",
            onOk: () => {
              this.createAccount();
            },
            onCancel: () => {
              this.$hMessage.info("已取消提交");
            },
          });
        } else {
          this.$hMessage.warning('请完整填写所有必填信息');
        }
      });
    },
    createAccount() {
      // 进行类型映射
      const userTypeMapping = {
        '个人': 0,
        '机构': 1,
      };

      const idTypeMapping = {
        '身份证': 0,
        '护照': 1,
        '港澳台居民居住证/通行证': 2,
      };

      // 默认设置 RiskId
      const defaultRiskId = 2;  // 设定为 "平衡型" 的默认值

      // 打印调试信息，确保表单数据正确
      console.log('Form Data:', this.form);

      const createAccountVo = {
        customerName: this.form.userName,
        customerType: userTypeMapping[this.form.userType],  // 映射到整数
        customerPhone: this.form.phone,
        customerIdCardType: idTypeMapping[this.form.idType],  // 映射到整数
        customerIdCard: this.form.idNumber,
        riskId: defaultRiskId,  // 设置默认的 RiskId
      };

      // 打印请求前的数据结构
      console.log('Create Account VO:', createAccountVo);

      this.$request.post('/user/create_account', createAccountVo)
        .then(response => {
          console.log('Response:', response); // 调试日志，查看响应
          if (response.data.code === 200) {
            this.$hMessage.info('账户创建成功');
              // 添加延迟
              setTimeout(() => {
                this.fetchAccountId(createAccountVo.customerIdCard); // 使用身份证号码查询 accountId
              }, 3000); // 3秒延迟
            this.isAccountCreated = true,
            this.nextStep();
          } else {
            this.$hMessage.error(response.data.message || '账户创建失败');
          }
        })
        .catch(error => {
          console.error('Create account failed', error);
          this.$hMessage.error('账户创建失败');
        });
    },

    fetchAccountId(customerIdCard) {
      console.log('Querying account with customerIdCard:', customerIdCard); // 打印出传递的参数，确认是否正确
      this.$request.get('/creditcard/queryAccountByID', {
        params: {
          id: customerIdCard, // 使用身份证号码查询账户
        }
      })
      .then(response => {
        console.log('Response from /queryAccountByID:', response); // 打印完整的响应，帮助调试
        if (response.data.code === 200) {
          const accounts = response.data.data;
          if (accounts && accounts.length > 0) {
            this.accountId = accounts[0].accountId; // 获取第一个账户的 accountId
            this.$hMessage.info('获取 accountId 成功');
          } else {
            this.$hMessage.error('未找到关联的账户');
          }
        } else {
          this.$hMessage.error(response.data.message || '获取 accountId 失败');
        }
      })
      .catch(error => {
        console.error('Fetch accountId failed', error); // 打印错误信息
        this.$hMessage.error('获取 accountId 失败');
      });
    },

    validateCardNumber() {
      const regex = /^[0-9]{16}$/;
      if (!regex.test(this.bankForm.creditcard_id)) {
        this.$hMessage.error("银行卡号格式不正确，应为16位数字");
        return false;
      }
      return true;
    },
    validateBalance() {
      if (this.bankForm.balance < 0) {
        this.$hMessage.error("初始金额不能为负数");
        return false;
      }
      return true;
    },
    validatePassword() {
      if (this.bankForm.password && this.bankForm.password !== this.bankForm.confirm_password) {
        this.$hMessage.error("密码和确认密码不一致");
        return false;
      }
      return true;
    },
    submitBankCard() {
      if (!this.validateCardNumber() || !this.validateBalance() || !this.validatePassword()) {
        return;
      }
      if (!this.bankForm.creditcard_id || !this.bankForm.bank_name || !this.bankForm.balance || !this.bankForm.password) {
        this.$hMessage.error("请填写所有字段");
        return;
      }

      // 将银行卡信息与 accountId 关联
      this.addBankCard().then(() => {
        this.$hMessage.success("银行卡添加成功");
        this.nextStep(); // 添加成功后进入下一步
      }).catch(error => {
        this.$hMessage.error("添加银行卡失败，请重试");
        console.error(error);
      });
    },
    addBankCard() {
      // 验证银行卡号、余额和密码
      if (!this.validateCardNumber() || !this.validateBalance() || !this.validatePassword()) {
        return;
      }
      if (!this.bankForm.creditcard_id || !this.bankForm.bank_name || !this.bankForm.balance || !this.bankForm.password) {
        this.$hMessage.error("请填写所有字段");
        return;
      }
      console.log(this.accountId);
      // 构建 Creditcard 对象
      const creditcard = {
        creditcardId: this.bankForm.creditcard_id,  // 假设后端使用的是驼峰命名法
        bank: this.bankForm.bank_name,
        balance: this.bankForm.balance,
        password: this.bankForm.password,
        accountId: this.accountId // 将银行卡与账户关联
      };

      // 调用API更新或添加银行卡信息
      this.$request.post('/creditcard/update', creditcard)
        .then(response => {
          if (response.data.code === 200) {
            this.$hMessage.success("银行卡添加成功");
            this.nextStep(); // 添加成功后进入下一步
          } else {
            this.$hMessage.error(response.data.message || "添加银行卡失败");
          }
        })
        .catch(error => {
          console.error('Update credit card failed', error);
          this.$hMessage.error("添加银行卡失败，请重试");
        });
    },
    goBack() {
      if (this.isAccountCreated) {
        this.$hMessage.warning('您已创建账户，强制退出可能会丢失未完成的开户流程。');
      }
      this.$router.go(-1);
    },
    submitForm() {
      let valid = true;
      const requiredFields = [
        'experience',
        'goals',
        'lossTolerance',
        'investmentHorizon',
        'riskTolerance',
        'liquidityNeeds',
        'marketReaction'
      ];

      requiredFields.forEach(field => {
        if (!this.formData[field] || (Array.isArray(this.formData[field]) && this.formData[field].length === 0)) {
          valid = false;
          this.$hMessage.error(`请完成所有题目再提交`);
        }
      });

      if (valid) {
        // 所有题目都已完成，进行风险等级判断
        const { experience, goals, lossTolerance, investmentHorizon, riskTolerance, liquidityNeeds, marketReaction } = this.formData;

        if (riskTolerance === 'high' || lossTolerance === 'more') {
          this.riskLevel = '激进型';
        } else if (riskTolerance === 'moderate' || lossTolerance === '10') {
          this.riskLevel = '进取型';
        } else if (riskTolerance === 'low' && investmentHorizon !== 'short-term') {
          this.riskLevel = '稳健型';
        } else if (riskTolerance === 'low' && investmentHorizon === 'short-term') {
          this.riskLevel = '谨慎型';
        } else {
          this.riskLevel = '平衡型';
        }

        // 保存风险等级结果到后台
        this.saveRiskLevel().then(() => {
          this.$hMessage.success('风险等级已保存');
          this.nextStep();
        }).catch(error => {
          this.$hMessage.error('保存风险等级失败，请重试');
          console.error(error);
        });
      }
    },
    async saveRiskLevel() {
            try {
                let riskLevelInt;

                // 将风险等级转换为相应的整数
                switch (this.riskLevel) {
                    case '谨慎型':
                        riskLevelInt = 0;
                        break;
                    case '稳健型':
                        riskLevelInt = 1;
                        break;
                    case '平衡型':
                        riskLevelInt = 2;
                        break;
                    case '进取型':
                        riskLevelInt = 3;
                        break;
                    case '激进型':
                        riskLevelInt = 4;
                        break;
                    default:
                        riskLevelInt = 2; // 默认使用平衡型
                }

                // 通过已有的更新接口将账户信息发送到后端
                const response = await this.$request.post('/account/update_account', {
                    accountId: this.accountId,
                    accountRiskLevel: riskLevelInt
                });

                if (response.data.code === 200) {
                    this.$hMessage.success('风险等级已保存');
                } else {
                    this.$hMessage.error('保存风险等级失败');
                }
            } catch (error) {
                console.error('保存风险等级时发生错误:', error);
                this.$hMessage.error('保存风险等级时发生错误');
            }
        }
  },
  beforeRouteLeave(to, from, next) {
    if (this.isAccountCreated && this.current < 3) {
      this.$hMessage.warning('您正在开户过程中，离开可能导致数据丢失。');
      const answer = window.confirm('确定要离开吗？未完成的开户流程可能导致数据不准确。');
      if (answer) {
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  }
};
</script>


<style scoped>
.add-bank-card {
  margin: 5px;
  padding: 10px;
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 5px;
  height: 60vh;
}

.form-container {
  margin-bottom: 2px;
  margin-top: 20px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 10px;
}

.form-section label {
  font-weight: bold;
  margin-bottom: 5px;
}

.button-section {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}

.risk-assessment-container {
  margin: 10px;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
