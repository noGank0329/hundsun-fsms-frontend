<template>
    <div class="risk-assessment-container">
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
                    <h-button type="default" @click="goBack">返回</h-button>
                </h-form-item>
            </h-form>
        </h-card>

        <!-- 显示风险等级结果 -->
        <h-alert v-if="riskLevel" type="info" show-icon>
            您的风险等级为：{{ riskLevel }}
        </h-alert>
    </div>
</template>

<script>
export default {
    data() {
        return {
            formData: {
                experience: '',
                goals: [],
                lossTolerance: '',
                investmentHorizon: '',
                riskTolerance: '',
                liquidityNeeds: '',
                marketReaction: '',
                accountId: this.$route.query.account_id, // 从路由参数中获取用户ID
            },
            riskLevel: '',
        };
    },
    methods: {
        goBack(){
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

                // 保存结果到后台
                this.saveRiskLevel();
            }
        },
        async saveRiskLevel() {
            try {
                const accountId = this.formData.accountId;
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
                    accountId: accountId,
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
        },
    },
};
</script>

<style scoped>
.risk-assessment-container {
    margin: 10px;
    padding: 20px;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 5px;
}
</style>
