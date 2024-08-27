<template>
    <div class="transaction-confirmation">
        <h3>交易确认</h3>
        <h-card :border="false" style="margin-bottom: 20px" dis-hover>
            <div class="info-section">
                <Alert type="info" show-icon>
                    <p style="font-family:黑体;font-weight: bolder">
                        系统自动处理前一交易日的交易申请，确认申购和赎回请求。
                    </p>
                </Alert>
            </div>

            <div class="button-section">
                <Button v-if="activeTab === 'purchaseOrders'" type="primary" @click="confirmPurchaseTransactions"
                    :disabled="purchaseConfirmed" :loading="loading">
                    启动申购确认
                </Button>
                <Button v-if="activeTab === 'redemptionOrders'" type="primary" @click="confirmRedemptionTransactions"
                    :disabled="redemptionConfirmed" :loading="loading">
                    启动赎回确认
                </Button>
            </div>

            <h-tabs v-model="activeTab">
                <h-tab-pane label="申购订单" name="purchaseOrders">
                    <Table :columns="columns" :data="currentData1"></Table>
                </h-tab-pane>
                <h-tab-pane label="赎回订单" name="redemptionOrders">
                    <Table :columns="columns" :data="currentData2"></Table>
                </h-tab-pane>
            </h-tabs>
            <div v-if="activeTab === 'purchaseOrders'" :key="redemptionKey" style="position: fixed;bottom: 5%;">
                <h-page :total="total1" :page-size="pageSize" @on-change="handlePageChange1" show-total></h-page>
            </div>
            <div v-if="activeTab === 'redemptionOrders'" :key="redemptionKey" style="position: fixed;bottom: 5%;">
                <h-page :total="total2" :page-size="pageSize" @on-change="handlePageChange2" show-total></h-page>
            </div>

        </h-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            bankcardid: '',
            redemptionKey: 0,
            pageSize: 10,
            currentPage1: 1,
            currentPage2: 1,
            activeTab: "purchaseOrders",
            loading: false,
            purchaseConfirmed: false,
            redemptionConfirmed: false,
            purchaseOrders: [],
            redemptionOrders: [],
            columns: [
                { title: "交易ID", key: "transactionId" },
                { title: "账户ID", key: "accountId" },
                { title: "基金ID", key: "fundId" },
                { title: "交易金额", key: "transactionAmount" },
                { title: "交易份额", key: "transactionShare" },
                { title: "交易日期", key: "transactionDate" },
                { title: "客户ID", key: "customerId" },
                {
                    title: "订单状态",
                    key: "transactionState",
                    render: (h, params) => {
                        const state = params.row.transactionState;
                        const displayText = state === 0 ? '未完成' : '已撤单';
                        return h('span', displayText);
                    }
                },
            ],
        };
    },
    watch: {
        activeTab(newVal) {
            if (newVal === 'redemptionOrders') {
                this.currentPage1 = 1;
                this.currentPage2 = 1;
                this.redemptionKey += 1;
            } else if (newVal === 'purchaseOrders') {
                this.currentPage1 = 1;
                this.currentPage2 = 1;
                this.redemptionKey += 1;
            }
        }
    }
    ,
    methods: {
        confirmPurchaseTransactions() {
            this.loading = true;
            setTimeout(() => {
                this.updateTransactionState(this.purchaseOrders)
                this.purchaseConfirmed = true;
                this.loading = false;
            }, 2000);
        },
        async updateTransactionState(purchaseOrders) {
            try {
                const ids = purchaseOrders.map(order => order.transactionId);
                console.log(ids)
                const response = await this.$request.post('/settlement/updateTransactionStateById', ids);
                console.log('更新成功:', response.data);
                this.loadTransactionData()
            } catch (error) {
                console.error('更新失败:', error);
            }
        },

        confirmRedemptionTransactions() {
            this.loading = true;
            setTimeout(() => {
                this.updateTransactionState(this.redemptionOrders)
                this.redemptionOrders.forEach(order => {
                    this.chargeCreditCard(order.accountId, order.transactionAmount);
                });
                this.redemptionConfirmed = true;
                this.loading = false;
            }, 2000);
        },
        chargeCreditCard(myid, amount) {
            const params = {
                current: 1,
                size: 1,
                accountId: myid
            }
            this.$request.get('/creditcard/queryCreditcardById', {
                params
            }).then(response => {
                const mycharge = {
                    id: response.data.data.records[0].creditcardId,  // 确保这个值正确
                    mount: amount  // 确保这个值正确
                };

                console.log(mycharge);

                this.$request.post('/creditcard/Charge', null, { params: mycharge })
                    .then(response => {
                        console.log('Charge successful:', response.data);
                    })
                    .catch(error => {
                        console.error('Error charging credit card:', error);
                    });

            })
        },
        handlePageChange1(page1) {
            this.currentPage1 = page1;
        },
        handlePageChange2(page2) {
            this.currentPage2 = page2;
        },
        loadTransactionData() {
            // 发起请求获取订单数据
            const params1 = {
                current: this.currentPage1,
                size: 10000,
                transactionId: '',
                transactionState: 0,
                transactionType: 1,
            };
            const params2 = {
                current: this.currentPage2,
                size: 10000,
                transactionId: '',
                transactionState: 0,
                transactionType: 0,
            };
            console.log(params1)
            this.$request.get('/transaction/query', { params: params1 })
                .then(res => {
                    if (res.data.code === 200) {
                        this.purchaseOrders = res.data.data.records;
                        console.log('Purchase Orders:', this.purchaseOrders);
                    } else {
                        this.$hMessage.error(res.data.message);
                    }
                })
                .catch(err => {
                    this.$hMessage.error('请求失败：' + err);
                });
            this.$request.get('/transaction/query', { params: params2 })
                .then(res => {
                    if (res.data.code === 200) {
                        this.redemptionOrders = res.data.data.records;
                        console.log('Redemption Orders:', this.redemptionOrders);
                    } else {
                        this.$hMessage.error(res.data.message);
                    }
                })
                .catch(err => {
                    this.$hMessage.error('请求失败：' + err);
                });
        }

    },
    created() {
        this.loadTransactionData();
    },
    computed: {
        total1() {
            return this.purchaseOrders.length;
        },
        total2() {
            return this.redemptionOrders.length;
        },
        currentData1() {
            const start = (this.currentPage1 - 1) * this.pageSize;
            const end = this.currentPage1 * this.pageSize;
            return this.purchaseOrders.slice(start, end);
        },
        currentData2() {
            const start = (this.currentPage2 - 1) * this.pageSize;
            const end = this.currentPage2 * this.pageSize;
            return this.redemptionOrders.slice(start, end);
        },
    }
};
</script>

<style scoped>
.transaction-confirmation {
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
    margin-bottom: 30px;
}

.button-section {
    margin-bottom: 20px;
}

h-tabs {
    margin-top: 20px;
}

h-tab-pane {
    padding: 10px;
}

.table {
    margin-top: 20px;
}
</style>
