<template>
  <div style="overflow: hidden;">
    <h-card :border="false" class="fund-details-card">
      <h3>基金详情</h3>
      <h-row type="flex" justify="space-between">
        <!-- 左侧基金详情信息 -->
        <h-col :span="11">
          <h-form label-width="120px">
            <h-form-item label="产品名" class="compact-form-item">
              <h-input v-model="editableFund.fund_name" :disabled="!isEditing" />
            </h-form-item>
            <h-form-item label="产品ID" class="compact-form-item">
              <h-input v-model="editableFund.fund_id" disabled />
            </h-form-item>
            <h-form-item label="产品类型" class="compact-form-item">
              <h-input v-model="editableFund.fund_type" :disabled="!isEditing" />
            </h-form-item>
            <h-form-item label="产品当天净值" class="compact-form-item">
              <h-input v-model="editableFund.fund_nav" :disabled="!isEditing" />
            </h-form-item>
            <h-form-item label="产品发布时间" class="compact-form-item">
              <h-date-picker 
                v-model="editableFund.fund_est_date"
                type="date" 
                placeholder="选择日期"
                :disabled="!isEditing" 
              />
            </h-form-item>
            <h-form-item label="风险等级" class="compact-form-item">
              <h-select v-model="editableFund.fund_risk_level" :disabled="!isEditing">
                <h-option v-for="(label, value) in riskLevels" :key="value" :value="label">{{ label }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item label="基金经理姓名" class="compact-form-item">
              <h-input v-model="editableFund.fund_manager_name" :disabled="!isEditing" />
            </h-form-item>
            <h-form-item label="产品状态" class="compact-form-item">
              <h-select v-model="editableFund.fund_state" :disabled="!isEditing">
                <h-option v-for="(label, value) in fundStates" :key="value" :value="label">{{ label }}</h-option>
              </h-select>
            </h-form-item>
          </h-form>
        </h-col>

        <!-- 右侧净值走势图 -->
        <h-col :span="12">
          <div class="chart-placeholder">
            <!-- ECharts图表容器 -->
            <div id="echarts-main" style="width: 100%; height: 500px;"></div>
          </div>
        </h-col>
      </h-row>

      <div class="action-buttons">
        <h-button type="default" @click="goBack">返回</h-button>
        <h-button type="primary" v-if="!isEditing" @click="enableEditing">编辑</h-button>
        <h-button type="primary" v-if="isEditing" @click="saveFundDetails">保存</h-button>
        <h-button type="default" v-if="isEditing" @click="cancelEditing">取消</h-button>
      </div>
    </h-card>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return {
      isEditing: false,
      riskLevels: {
        0: '低风险',
        1: '中低风险',
        2: '中风险',
        3: '中高风险',
        4: '高风险',
      },
      fundStates: {
        0: '正常',
        1: '暂停',
        2: '已关闭',
      },
      originalFund: {},
      editableFund: {},
    };
  },
  created() {
    this.loadFundDetails();
  },
  mounted() {
    this.initChart();
  },
  methods: {
    async loadFundDetails() {
      try {
        const fundId = Number(this.$route.query.fund_id);

        // 使用 this.$request.get 发送请求
        const res = await this.$request.get('/fund/fullinfo', {
          params: {
            id: fundId,
          },
        });
        console.log(fundId);
        console.log(res);
        // 检查返回的状态码
        if (res.data.code === 200) {
          // 将返回的数据映射到 originalFund 对象中
          this.originalFund = {
            fund_id: res.data.data.fundId,
            fund_name: res.data.data.fundName,
            fund_type: res.data.data.fundType,
            fund_nav: res.data.data.fundNav,
            fund_est_date: res.data.data.fundEstDate,
            fund_risk_level: this.riskLevels[res.data.data.fundRiskLevel],
            fund_manager_name: res.data.data.fundManagerName,
            fund_state: this.fundStates[res.data.data.fundState],
          };
          this.editableFund = { ...this.originalFund };
        } else {
          this.$hMessage.error(res.data.message || '加载基金详情失败');
        }
      } catch (error) {
        console.error('加载基金详情时发生错误:', error);
        this.$hMessage.error('加载基金详情时发生错误');
      }
    },
    initChart() {
      const chartDom = document.getElementById('echarts-main');
      const myChart = echarts.init(chartDom);
      let base = +new Date(1988, 9, 3);
      const oneDay = 24 * 3600 * 1000;
      let data = [[base, Math.random() * 300]];
      for (let i = 1; i < 20000; i++) {
        let now = new Date((base += oneDay));
        data.push([+now, Math.round((Math.random() - 0.5) * 20 + data[i - 1][1])]);
      }
      
      const option = {
        tooltip: {
          trigger: 'axis',
          position: function (pt) {
            return [pt[0], '10%'];
          }
        },
        title: {
          left: 'center',
          text: '净值走势图'
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'time',
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%']
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 20
          },
          {
            start: 0,
            end: 20
          }
        ],
        series: [
          {
            name: 'Data',
            type: 'line',
            smooth: true,
            symbol: 'none',
            areaStyle: {},
            data: data
          }
        ]
      };

      myChart.setOption(option);
    },
    enableEditing() {
      this.isEditing = true;
    },
    saveFundDetails() {
      // 将基金风险等级和产品状态从中文映射回 int 类型
      const fundRiskLevelKey = Object.keys(this.riskLevels).find(key => this.riskLevels[key] === this.editableFund.fund_risk_level);
      const fundStateKey = Object.keys(this.fundStates).find(key => this.fundStates[key] === this.editableFund.fund_state);

      // 创建要提交的完整基金数据对象
      const fundToSave = {
        fundId: this.editableFund.fund_id,  // 确保传递基金ID
        fundName: this.editableFund.fund_name,
        fundType: this.editableFund.fund_type,
        fundNav: this.editableFund.fund_nav,
        fundEstDate: this.editableFund.fund_est_date,
        fundRiskLevel: parseInt(fundRiskLevelKey),  // 转换为 int 类型
        fundManagerName: this.editableFund.fund_manager_name,
        fundState: parseInt(fundStateKey),          // 转换为 int 类型
      };

      // 调用后端接口保存数据
      this.$request.post('/fund/update_fund', fundToSave)
        .then(response => {
          if (response.data.code === 200) {
            this.$hMessage.success('基金信息保存成功');
            this.originalFund = { ...this.editableFund }; // 更新原始数据
            this.isEditing = false; // 退出编辑模式
          } else {
            this.$hMessage.error(response.data.message || '保存基金信息失败');
          }
        })
        .catch(error => {
          console.error('保存基金信息时发生错误:', error);
          this.$hMessage.error('保存基金信息时发生错误');
        });
    },


    cancelEditing() {
      this.editableFund = { ...this.originalFund };
      this.isEditing = false;
    },
    goBack() {
      this.$router.go(-1);
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

.chart-placeholder {
  height: 500px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
}

.action-buttons {
  text-align: right;
  margin-top: 20px;
  padding-right: 5px;
  padding-bottom: 10px; 
}
</style>
