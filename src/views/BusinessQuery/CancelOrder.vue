<template>
    <div class="cancel-order-container">
        <h3>撤单申请</h3>
        <h-card :border="false" style="margin-bottom:20px" dis-hover>
            <h-form :inline="true" label-width="100px">
                <h-form-item label="交易单号">
                    <h-input v-model="searchParams.transaction_id" />
                </h-form-item>
                <h-form-item label="用户ID">
                    <h-input v-model="searchParams.customer_id" />
                </h-form-item>
                <h-form-item label="用户证件号码">
                    <h-input v-model="searchParams.customer_creditcard_id" />
                </h-form-item>
                <h-form-item label="账号">
                    <h-input v-model="searchParams.account_id" />
                </h-form-item>
                <h-form-item label="产品ID">
                    <h-input v-model="searchParams.fund_id" />
                </h-form-item>

                <h-form-item label="交易类型">
                    <h-select v-model="searchParams.transaction_type">
                        <h-option label="申购" value="buy"></h-option>
                        <h-option label="赎回" value="sell"></h-option>
                    </h-select>
                </h-form-item>
                <h-form-item label="交易状态">
                    <h-select v-model="searchParams.transaction_state">
                        <h-option label="未确认" value=0></h-option>
                        <h-option label="已撤单" value=2></h-option>
                    </h-select>
                </h-form-item>
                <h-form-item label="交易日期">
                    <h-date-picker v-model="searchParams.transaction_date" @on-change="handleDateChange" type="date"
                        format="yyyy-MM-dd" />
                </h-form-item>
                <h-form-item style="margin-top:33px">
                    <h-button type="primary" @click="onSearch">查询</h-button>
                    <h-button @click="onReset">重置</h-button>
                </h-form-item>
            </h-form>
        </h-card>
        <!-- 表格显示 -->
        <h-table :columns="columns" :data="currentData">
        </h-table>
        <h-msg-box v-model="modal1" :escClose="true" title="交易撤单" @on-cancel="cancel" :loading="true"
            :beforeOkClose="beforeOkClose">
            <p>是否确认撤销该订单</p>
        </h-msg-box>
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
                customer_id: '',
                customer_creditcard_id: '',
                transaction_id: '',
                account_id: '',
                fund_id: '',
                transaction_type: '',
                transaction_date: '',
                creditcard_id: '',
                transaction_state: '',
            },

            columns: [
                {
                    title: "交易单号",
                    key: "transactionId",
                },
                {
                    title: "用户ID",
                    key: "customerId",
                },
                {
                    title: "账号",
                    key: "accountId",
                },
                {
                    title: "产品ID",
                    key: "fundId",
                },
                {
                    title: "交易类型",
                    key: "transactionType",
                    render: (h, params) => {
                        const type = params.row.transactionType;
                        const displayText = type === 1 ? '申购' : '赎回';
                        return h('span', displayText);
                    }
                },
                {
                    title: "交易金额",
                    key: "transactionAmount",
                },
                {
                    title: "交易份额",
                    key: "transactionShare",
                },
                {
                    title: "交易日期",
                    key: "transactionDate",
                    render: (h, params) => {
                        const date = new Date(params.row.transactionDate);
                        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                        return h('span', formattedDate);
                    }
                },
                {
                    title: "订单状态",
                    key: "transactionState",
                    render: (h, params) => {
                        const state = params.row.transactionState;
                        const displayText = state === 0 ? '未完成' : '已撤单';
                        return h('span', displayText);
                    }
                },
                {
                    title: "操作",
                    key: "action",
                    width: 150,
                    fixed: "right",
                    render: (h, params) => {
                        console.log(params.row.transactionState);
                        const isDisabled = params.row.transactionState === 2;
                        return h("div", [
                            h(
                                "Button",
                                {
                                    props: {
                                        type: "warning",
                                        size: "small",
                                        disabled: isDisabled, // 根据状态禁用按钮
                                    },
                                    on: {
                                        click: () => {
                                            if (!isDisabled) { // 只有在按钮未禁用时才执行
                                                this.modal1 = true;
                                                this.selectOrder = params.row;
                                            }
                                        },
                                    },
                                },
                                "撤单"
                            ),
                        ]);
                    },
                },
            ],
            selectOrder: '',
            orders: [],
            modal1: false,
            pageSize: 10,
            currentPage: 1,
        };
    },
    created() {
        this.modal1 = false
        this.onSearch();
    },
    methods: {
        handleDateChange(value) {
            this.searchParams.transaction_date = value;
        },
        beforetest() {
            return true;
        },
        cancel() {
            this.$hMessage.info("订单未撤销");
        },
        onSearch() {
            const params = {
                current: this.currentPage,
                size: 10000,
                transactionId: this.searchParams.transaction_id,
                customerId: this.searchParams.customer_id,
                customerIdCard: this.searchParams.customer_creditcard_id,
                accountId: this.searchParams.account_id,
                fundId: this.searchParams.fund_id,
                transactionType: this.searchParams.transaction_type,
                transactionState: 0,
                transactionDate: this.searchParams.transaction_date ? new Date(this.searchParams.transaction_date).toISOString().split('T')[0] : null,
            };
            console.log(params)
            console.log(params.transactionDate)
            this.$request.get('/transaction/query', { params })
                .then(res => {
                    console.log(res)
                    if (res.data.code === 200) {
                        this.$hMessage.success('查询成功')
                        this.orders = res.data.data.records
                    } else {
                        this.$hMessage.error(res.data.message)
                    }
                })
        },
        beforeOkClose() {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log("撤单请求:", this.selectOrder);
                    //this.selectOrder.transaction_state = 2;
                    //const my1 = {
                    //    transactionId: this.selectOrder.transactionId,
                    //    fundId: this.selectOrder.fundId,
                    //}
                    //const my2 = {
                    //    code: 2,
                    //    name: "已撤单"
                    //}
                    const mywithdrawOrderVo = {
                        transactionId: this.selectOrder.transactionId,
                        fundId: this.selectOrder.fundId,
                        transactionAmount: this.selectOrder.transactionAmount
                    }
                    this.$request.post('/transaction/delete_purchase', mywithdrawOrderVo)
                        .then(res => {
                            console.log(res)
                            if (res.data.code === 200) {
                                this.$hMessage.success('撤单成功')
                                this.onSearch()
                            } else {
                                this.$hMessage.error(res.data.message)
                            }
                        })
                    resolve(true);
                }, 2000);
            })
        },
        handlePageChange(page) {
            this.currentPage = page;
        },
        onReset() {
            this.searchParams = {
                transaction_id: '',
                customer_id: '',
                customer_creditcard_id: '',
                account_id: '',
                fund_id: '',
                transaction_type: '',
                transaction_date: '',
                transaction_state: '',
            };
            this.orders = [];
        },
    },
    computed: {
        total() {
            return this.orders.length;
        },
        currentData() {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = this.currentPage * this.pageSize;
            return this.orders.slice(start, end);
        },
    }
};
</script>

<style scoped>
h3 {
    margin-bottom: 20px;
}

.h-form {
    margin-bottom: 20px;
}

.cancel-order-container {
    margin: 10px;
    padding: 20px;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 5px;
    height: 91vh;
}
</style>