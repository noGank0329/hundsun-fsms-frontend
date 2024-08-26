<template>
    <div class="daily-initialization">
        <h3>日初始化</h3>
        <h-card :border="false" style="margin-bottom:20px" dis-hover>
            <div style="margin-bottom:30px">
                <Alert type="info" show-icon>
                    <p style="font-family:黑体;font-weight: bolder">
                        启动日初始化功能，更新系统当前工作日并生成产品净值数据。当前操作员工：员工A；当前日期：<strong>{{
                            currentWorkDay }}</strong></p>
                </Alert>
            </div>
            <div style="margin-bottom: 30px;">
                <Button type="primary" @click="startInitialization" :loading="loading1"
                    :disabled="initializationDone">启动日初始化</Button>
                <Button type="success" @click="confirmInitialization" :loading="loading2"
                    :disabled="confirmDone">确认日初始化</Button>
            </div>
            <div title="日初始化结果" :footer-hide="true">
                <p style="font-family:黑体;font-weight: bolder;margin-bottom: 30px;">新工作日: <strong>{{ newWorkDay
                        }}</strong></p>
                <Table :columns="columns" :data="currentData"></Table>
            </div>
            <div style="position: fixed;bottom: 5%;">
                <h-page :total="total" :page-size="pageSize" @on-change="handlePageChange" show-total></h-page>
            </div>
        </h-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            pageSize: 10,
            currentPage: 1,
            newWorkDay: '',
            loading1: false,
            loading2: false,
            initializationDone: false,
            confirmDone: true,
            currentWorkDay: new Date().toISOString().split('T')[0].replace(/-/g, '/'), // 只取年月日，并替换为斜杠格式
            funddata: [],
            columns: [
                {
                    title: '产品ID',
                    key: 'fundId',
                },
                {
                    title: '产品名称',
                    key: 'fundName'
                },
                {
                    title: '产品类型',
                    key: 'fundType',
                },
                {
                    title: '产品风险等级',
                    key: 'fundRiskLevel'
                },
                {
                    title: '当前净值',
                    key: 'fundNav',
                    render: (h, params) => {
                        return h('span', {}, params.row.fundNav || '未初始化');
                    }
                },
            ],
        };
    },
    methods: {
        startInitialization() {
            this.loading1 = true;
            setTimeout(() => {
                // 模拟初始化逻辑
                this.newWorkDay = this.calculateNewWorkDay(this.currentWorkDay);
                console.log(this.currentWorkDay)
                console.log(this.newWorkDay)
                this.generateNetValues(true);
                this.confirmDone = false;
                this.loading1 = false;
            }, 2000);
        },
        checkinit() {
            this.newWorkDay = this.calculateNewWorkDay(this.currentWorkDay);
            const formatdate = this.newWorkDay.replace(/\//g, '-');
            console.log(formatdate)
            this.$request.get('/dailyfundnav/queryToday', { params: { date: formatdate } })
                .then(res => {
                    if (res.data.code === 200) {
                        console.log(res.data.data)
                        if (res.data.data.length === 0)
                            this.dataExists = false
                        else
                            this.dataExists = true
                        console.log(this.dataExists)
                        if (this.dataExists) {
                            this.initializationDone = true;
                            this.confirmDone = true;
                        } else {
                            this.initializationDone = false;
                            this.confirmDone = true;
                        }
                    } else {
                        this.$hMessage.error(res.data.message);
                    }
                })
                .catch(err => {
                    this.$hMessage.error('请求失败：' + err);
                });
        },
        confirmInitialization() {
            this.loading2 = true;
            this.initializationDone = true;

            setTimeout(() => {
                this.dailynavupdate();
                this.confirmDone = true;
                this.loading2 = false;
            }, 2000);
        },
        calculateNewWorkDay(currentDate) {
            // 假设计算新工作日的逻辑
            let newDate = new Date(currentDate);
            console.log(newDate)
            console.log(newDate.getDay())
            // 如果是周末，跳过到下一个工作日
            while (newDate.getDay() === 0) {
                newDate.setDate(newDate.getDate() + 1);
            }
            while (newDate.getDay() === 6) {
                newDate.setDate(newDate.getDate() + 2);
            }
            console.log(newDate)
            var hour = newDate.getHours() + 8
            newDate.setHours(hour)
            return newDate.toISOString().split('T')[0].replace(/-/g, '/');
        },
        generateNetValues(initialized = false) {
            // 假设生成新的净值数据
            let products = this.funddata
            console.log(products)
            return products.map(product => {
                let newNetValue = initialized ? (0.9 + Math.random() * 0.2).toFixed(2) : '';
                console.log(newNetValue)
                console.log(product.fundId)
                const params = {
                    fundId: product.fundId,
                    fundName: product.fundName,
                    fundType: product.fundType,
                    fundRiskLevel: product.fundRiskLevel,
                    fundState: product.fundState,
                    fundNav: Number(newNetValue)
                }
                this.$request.post('/fund/update_fund', params)
                    .then(res => {
                        console.log(res)
                        if (res.data.code === 200) {
                            this.$hMessage.success('更新成功')
                            this.onSearch()
                        } else {
                            this.$hMessage.error(res.data.message)
                        }
                    })
            });
        },
        dailynavupdate() {
            let dailyfundnavs = this.funddata.map(product => {
                const newWorkDay1 = this.newWorkDay.replace(/\//g, '-');
                return {
                    fundId: product.fundId,
                    navDate: newWorkDay1,
                    fundNav: product.fundNav
                };
            });
            console.log(dailyfundnavs)
            this.$request.post('/dailyfundnav/updateFundNav', dailyfundnavs)
                .then(res => {
                    console.log(res);
                    if (res.data.code === 200) {
                        this.$hMessage.success('更新成功');
                        this.onSearch();
                    } else {
                        this.$hMessage.error(res.data.message);
                    }
                })
                .catch(error => {
                    console.error(error);
                    this.$hMessage.error('更新失败');
                });
        },

        handlePageChange(page) {
            this.currentPage = page;
        },
        onSearch() {
            const params = {
                current: this.currentPage,
                size: 10000,
            };
            console.log(params)
            this.$request.get('/fund/fundinfo', { params })
                .then(res => {
                    console.log(res)
                    if (res.data.code === 200) {
                        this.$hMessage.success('查询成功')
                        this.funddata = res.data.data.records
                    } else {
                        this.$hMessage.error(res.data.message)
                    }
                })
        },
    },
    computed: {
        total() {
            return this.funddata.length;
        },
        currentData() {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = this.currentPage * this.pageSize;
            return this.funddata.slice(start, end);
        },
    },
    created() {
        this.onSearch()
        this.checkinit()
    }
};
</script>

<style scoped>
.daily-initialization {
    margin: 10px;
    padding: 20px;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 5px;
    height: 91vh;
}

h3 {
    margin-bottom: 20px;
}

.info-section {
    margin-bottom: 20px;
    text-align: center;
}

.button-section {
    text-align: center;
}
</style>
