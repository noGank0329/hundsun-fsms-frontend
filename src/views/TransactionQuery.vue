<template>
    <div class="query-main">
        <h3>交易查询</h3>
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
                        <h-option label="已完成" value=1></h-option>
                        <h-option label="未完成" value=0></h-option>
                    </h-select>
                </h-form-item>
                <h-form-item label="交易日期">
                    <h-date-picker v-model="searchParams.transaction_date" type="date" />
                </h-form-item>
                <h-form-item>
                    <h-button type="primary" @click="onSearch">Search</h-button>
                    <h-button @click="onReset">Reset</h-button>
                </h-form-item>
            </h-form>
        </h-card>
        <h-table :columns="columns1" :data="currentData"></h-table>
        <div style="position: fixed;bottom: 5%;">
            <h-page :total="total" :page-size="pageSize" @on-change="handlePageChange" show-total></h-page>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            pageSize: 10,
            currentPage: 1,
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
            columns1: [
                {
                    title: "交易单号",
                    key: "transaction_id",
                },
                {
                    title: "用户ID",
                    key: "customer_id",
                },
                {
                    title: "账号",
                    key: "account_id",
                },
                {
                    title: "产品ID",
                    key: "fund_id",
                },
                {
                    title: "交易类型",
                    key: "transaction_type",
                },
                {
                    title: "交易金额",
                    key: "transaction_amount",
                },
                {
                    title: "交易份额",
                    key: "transaction_share",
                },
                {
                    title: "交易日期",
                    key: "transaction_date",
                },
            ],
            data1: [
                {
                    transaction_id: "000096",
                    account_id: "930000000096",
                    fund_id: "093000",
                    transaction_type: "buy",
                    transaction_amount: "10000.00",
                    transaction_share: "0.00",
                    transaction_date: "2021-11-25",
                    customer_id: "20211117000291",
                },
                {
                    transaction_id: "000096",
                    account_id: "930000000096",
                    fund_id: "093000",
                    transaction_type: "buy",
                    transaction_amount: "10000.00",
                    transaction_share: "0.00",
                    transaction_date: "2021-11-25",
                    customer_id: "20211117000291",
                },
                {
                    transaction_id: "000096",
                    account_id: "930000000096",
                    fund_id: "093000",
                    transaction_type: "buy",
                    transaction_amount: "10000.00",
                    transaction_share: "0.00",
                    transaction_date: "2021-11-25",
                    customer_id: "20211117000291",
                },
                {
                    transaction_id: "000096",
                    account_id: "930000000096",
                    fund_id: "093000",
                    transaction_type: "buy",
                    transaction_amount: "10000.00",
                    transaction_share: "0.00",
                    transaction_date: "2021-11-25",
                    customer_id: "20211117000291",
                },
                {
                    transaction_id: "000096",
                    account_id: "930000000096",
                    fund_id: "093000",
                    transaction_type: "buy",
                    transaction_amount: "10000.00",
                    transaction_share: "0.00",
                    transaction_date: "2021-11-25",
                    customer_id: "20211117000291",
                },
                {
                    transaction_id: "000096",
                    account_id: "930000000096",
                    fund_id: "093000",
                    transaction_type: "buy",
                    transaction_amount: "10000.00",
                    transaction_share: "0.00",
                    transaction_date: "2021-11-25",
                    customer_id: "20211117000291",
                },
                {
                    transaction_id: "000096",
                    account_id: "930000000096",
                    fund_id: "093000",
                    transaction_type: "buy",
                    transaction_amount: "10000.00",
                    transaction_share: "0.00",
                    transaction_date: "2021-11-25",
                    customer_id: "20211117000291",
                },
                {
                    transaction_id: "000096",
                    account_id: "930000000096",
                    fund_id: "093000",
                    transaction_type: "buy",
                    transaction_amount: "10000.00",
                    transaction_share: "0.00",
                    transaction_date: "2021-11-25",
                    customer_id: "20211117000291",
                },
                {
                    transaction_id: "000096",
                    account_id: "930000000096",
                    fund_id: "093000",
                    transaction_type: "buy",
                    transaction_amount: "10000.00",
                    transaction_share: "0.00",
                    transaction_date: "2021-11-25",
                    customer_id: "20211117000291",
                },
                {
                    transaction_id: "000096",
                    account_id: "930000000096",
                    fund_id: "093000",
                    transaction_type: "buy",
                    transaction_amount: "10000.00",
                    transaction_share: "0.00",
                    transaction_date: "2021-11-25",
                    customer_id: "20211117000291",
                },

                {
                    transaction_id: "000096",
                    account_id: "930000000096",
                    fund_id: "093000",
                    transaction_type: "buy",
                    transaction_amount: "10000.00",
                    transaction_share: "0.00",
                    transaction_date: "2021-11-25",
                    customer_id: "20211117000291",
                },
                {
                    transaction_id: "000096",
                    account_id: "930000000096",
                    fund_id: "093000",
                    transaction_type: "buy",
                    transaction_amount: "10000.00",
                    transaction_share: "0.00",
                    transaction_date: "2021-11-25",
                    customer_id: "20211117000291",
                },
                {
                    transaction_id: "000096",
                    account_id: "930000000096",
                    fund_id: "093000",
                    transaction_type: "buy",
                    transaction_amount: "10000.00",
                    transaction_share: "0.00",
                    transaction_date: "2021-11-25",
                    customer_id: "20211117000291",
                },
                {
                    transaction_id: "000096",
                    account_id: "930000000096",
                    fund_id: "093000",
                    transaction_type: "buy",
                    transaction_amount: "10000.00",
                    transaction_share: "0.00",
                    transaction_date: "2021-11-25",
                    customer_id: "20211117000291",
                },
                {
                    transaction_id: "000096",
                    account_id: "930000000096",
                    fund_id: "093000",
                    transaction_type: "buy",
                    transaction_amount: "10000.00",
                    transaction_share: "0.00",
                    transaction_date: "2021-11-25",
                    customer_id: "20211117000291",
                },
            ],
        };
    },
    methods: {
        onSearch() {
        },
        onReset() {
            this.searchParams = {
                transaction_id: '',
                account_id: '',
                fund_id: '',
                transaction_type: '',
                transaction_date: '',
            };
        },
        handleDetail(row) {
            console.log('View details for:', row);
        },
        handlePageChange(page) {
            this.currentPage = page;
        },
    },
    computed: {
        total() {
            return this.data1.length;
        },
        currentData() {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = this.currentPage * this.pageSize;
            return this.data1.slice(start, end);
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

.query-main {
    margin: 10px;
    padding: 20px;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 5px;
    height: 91vh;
}
</style>