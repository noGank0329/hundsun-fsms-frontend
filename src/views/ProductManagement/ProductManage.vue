<template>
    <div class="product-management-container">
        <h3>产品管理</h3>
        <h-card :border="false" style="margin-bottom:20px" dis-hover>
            <h-form :inline="true" label-width="100px">
                <!-- 搜索表单 -->
                <h-form-item label="产品ID">
                    <h-input v-model="searchParams.fund_id" />
                </h-form-item>
                <h-form-item label="产品名称">
                    <h-input v-model="searchParams.fund_name" />
                </h-form-item>
                <h-form-item label="产品类型">
                    <h-input v-model="searchParams.fund_type" />
                </h-form-item>
                <h-form-item label="风险等级">
                    <h-select v-model="searchParams.fund_risk_level">
                        <h-option label="低风险" value="0"></h-option>
                        <h-option label="中低风险" value="1"></h-option>
                        <h-option label="中风险" value="2"></h-option>
                        <h-option label="中高风险" value="3"></h-option>
                        <h-option label="高风险" value="4"></h-option>
                    </h-select>
                </h-form-item>
                <h-form-item label="产品状态">
                    <h-select v-model="searchParams.fund_state">
                        <h-option label="正常" value="0"></h-option>
                        <h-option label="暂停" value="1"></h-option>
                        <h-option label="已关闭" value="2"></h-option>
                    </h-select>
                </h-form-item>
                <h-form-item style="margin-top:33px">
                    <h-button type="primary" @click="onSearch">查询</h-button>
                    <h-button @click="onReset">重置</h-button>
                </h-form-item>
            </h-form>
        </h-card>
        <!-- 表格显示 -->
        <h-table class="product-table" :columns="columns" :data="currentData">
        </h-table>
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
                fund_id: '',      
                fund_name: '',
                fund_type: '',
                fund_risk_level: '',
                fund_state: '',
            },
            columns: [
                { title: "产品ID", key: "fund_id" },
                { title: "产品名称", key: "fund_name" },
                { title: "产品类型", key: "fund_type" },
                {
                    title: "风险等级",
                    key: "fund_risk_level",
                    render: (h, params) => {
                        const riskLevelMap = {
                            0: "低风险",
                            1: "中低风险",
                            2: "中风险",
                            3: "中高风险",
                            4: "高风险",
                        };
                        return h("span", riskLevelMap[params.row.fund_risk_level]);
                    },
                },
                {
                    title: "产品状态",
                    key: "fund_state",
                    render: (h, params) => {
                        const stateMap = {
                            0: "正常",
                            1: "暂停",
                            2: "已关闭",
                        };
                        return h("span", stateMap[params.row.fund_state]);
                    },
                },
                {
                    title: "操作",
                    key: "action",
                    width: 200,
                    fixed: "right",
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "Button",
                                {
                                    props: {
                                        type: "primary",
                                        size: "small",
                                    },
                                    on: {
                                        click: () => {
                                            this.viewDetails(params.row);
                                        },
                                    },
                                },
                                "查看/编辑详细信息"
                            ),
                            h(
                                "Button",
                                {
                                    props: {
                                        type: "error",
                                        size: "small",
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
                                "删除"
                            ),
                        ]);
                    },
                },
            ],
            products: [],
            filteredProducts: [],
            pageSize: 9,
            currentPage: 1,
        };
    },
    created() {
        this.loadProducts();
    },
    methods: {
        async loadProducts() {
            try {
                const res = await this.$request.get('/fund/fundinfo', {
                    params: {
                        current: this.currentPage,
                        size: 10000,
                        fund_id: this.searchParams.fund_id,
                        fund_name: this.searchParams.fund_name,
                        fund_type: this.searchParams.fund_type,
                        fund_risk_level: this.searchParams.fund_risk_level,
                        fund_state: this.searchParams.fund_state,
                    }
                });
                if (res.data.code === 200) {
                    console.log(res)
                    this.products = res.data.data.records.map(item => ({
                        fund_id: item.fundId,
                        fund_name: item.fundName,
                        fund_type: item.fundType,
                        fund_risk_level: item.fundRiskLevel,
                        fund_state: item.fundState,
                    }));
                    this.filteredProducts = this.products;
                } else {
                    this.$hMessage.error(res.data.message || '加载产品数据失败');
                }
            } catch (error) {
                console.error('Error loading products:', error);
                this.$hMessage.error('加载产品数据时发生错误');
            }
        },
        onSearch() {
            this.filteredProducts = this.products.filter(product => {
                return (
                    (!this.searchParams.fund_id || String(product.fund_id).includes(this.searchParams.fund_id)) &&
                    (!this.searchParams.fund_name || product.fund_name.includes(this.searchParams.fund_name)) &&
                    (!this.searchParams.fund_type || product.fund_type.includes(this.searchParams.fund_type)) &&
                    (!this.searchParams.fund_risk_level || String(product.fund_risk_level).includes(this.searchParams.fund_risk_level)) &&
                    (!this.searchParams.fund_state || String(product.fund_state).includes(this.searchParams.fund_state))
                );
            });
            this.currentPage = 1; // 查询后从第一页开始显示
        },

        onReset() {
            this.searchParams = {
                fund_id: '',
                fund_name: '',
                fund_type: '',
                fund_risk_level: '',
                fund_state: '',
            };
            this.filteredProducts = this.products; // 重置时显示所有数据
        },
        viewDetails(product) {
            // 实现查看详细信息逻辑
            console.log("查看/编辑产品详细信息:", product);
            this.$router.push({ name: 'ProductManagement-ProductDetails', query: { fund_id: product.fund_id } });
        },
        confirmDelete(product) {
            this.$hMsgBox.confirm({
                title: "删除确认",
                content: `<p>确定要删除产品 <b>${product.fund_name}</b> 吗？</p>`,
                onOk: () => {
                this.deleteProduct(product);
                },
                onCancel: () => {
                this.$hMessage.info("已取消删除操作");
                },
            });
        },

        deleteProduct(product) {
            // 发送 DELETE 请求到后端
            this.$request.delete('/fund/modify_fund', {
                params: { id: product.fund_id }
            })
            .then(response => {
                if (response.data.code === 200) {
                this.$hMessage.success(`产品 ${product.fund_name} 已成功删除`);
                // 从前端列表中移除已删除的产品
                this.products = this.products.filter(p => p.fund_id !== product.fund_id);
                this.filteredProducts = this.products; // 更新过滤后的产品列表
                } else {
                this.$hMessage.error(response.data.message || '删除产品失败');
                }
            })
            .catch(error => {
                console.error('删除产品时发生错误:', error);
                this.$hMessage.error('删除产品时发生错误');
            });
        },

        handlePageChange(page) {
            this.currentPage = page;
        },
    },
    mounted() {
        this.filteredProducts = this.products; 
    },
    computed: {
        total() {
            return this.products.length;
        },
        currentData() {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = this.currentPage * this.pageSize;
            return this.filteredProducts.slice(start, end);
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

.product-management-container {
    margin: 10px;
    padding: 20px;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 5px;
    height: 91vh;
}

.product-table {
    margin-top: -60px;  
}
</style>
