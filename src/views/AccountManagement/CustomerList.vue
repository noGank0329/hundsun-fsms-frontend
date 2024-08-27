<template>
    <div class="customer-management-container">
        <h3>用户管理</h3>
        <h-card :border="false" style="margin-bottom:20px" dis-hover>
            <h-form :inline="true" label-width="100px">
                <!-- 搜索表单 -->
                <h-form-item label="用户ID">
                    <h-input v-model="searchParams.customer_id" />
                </h-form-item>
                <h-form-item label="用户姓名">
                    <h-input v-model="searchParams.customer_name" />
                </h-form-item>
                <h-form-item label="手机号">
                    <h-input v-model="searchParams.customer_phone" />
                </h-form-item>
                <h-form-item style="margin-top:33px">
                    <h-button type="primary" @click="onSearch">查询</h-button>
                    <h-button @click="onReset">重置</h-button>
                </h-form-item>
            </h-form>
        </h-card>
        <!-- 表格显示 -->
        <h-table class="customer-table" :columns="columns" :data="currentData">
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
                customer_id: '',
                customer_name: '',
                customer_phone: '',
            },
            columns: [
                { title: "用户ID", key: "customer_id" },
                { title: "用户姓名", key: "customer_name" },
                {
                    title: "用户类型",
                    key: "customer_type",
                    render: (h, params) => {
                        return h('span', params.row.customer_type);
                    }
                },
                { title: "手机号", key: "customer_phone" },
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

                        ]);
                    },
                },
            ],
            customers: [],
            filteredCustomers: [],
            pageSize: 9,
            currentPage: 1,
        };
    },
    created() {
        this.loadCustomers();
    },
    methods: {
        async loadCustomers() {
            try {
                const res = await this.$request.get('/customer/customerinfo', {
                    params: {
                        customer_id: this.searchParams.customer_id,
                        customer_name: this.searchParams.customer_name,
                        customer_phone: this.searchParams.customer_phone,
                    }
                });
                if (res.data.code === 200) {
                    this.customers = res.data.data.map(item => ({
                        customer_id: item.customerId,
                        customer_name: item.customerName,
                        customer_type: item.customerType === 0 ? '个人' : '机构',
                        customer_phone: item.customerPhone,
                    }));
                    this.filteredCustomers = this.customers;
                } else {
                    this.$hMessage.error(res.data.message || '加载用户数据失败');
                }
            } catch (error) {
                console.error('Error loading customers:', error);
                this.$hMessage.error('加载用户数据时发生错误');
            }
        },
        onSearch() {
            this.filteredCustomers = this.customers.filter(customer => {
                return (
                    (!this.searchParams.customer_id || String(customer.customer_id).includes(this.searchParams.customer_id)) &&
                    (!this.searchParams.customer_name || customer.customer_name.includes(this.searchParams.customer_name)) &&
                    (!this.searchParams.customer_phone || customer.customer_phone.includes(this.searchParams.customer_phone))
                );
            });
            this.currentPage = 1; // 查询后从第一页开始显示
        },

        onReset() {
            this.searchParams = {
                customer_id: '',
                customer_name: '',
                customer_phone: '',
            };
            this.filteredCustomers = this.customers; // 重置时显示所有数据
        },
        viewDetails(customer) {
            // 实现查看详细信息逻辑
            console.log("查看/编辑用户详细信息:", customer);
            this.$router.push({ name: 'AccountManagement-CustomerDetails', query: { customer_id: customer.customer_id } });
        },
        confirmDelete(customer) {
            this.$hMsgBox.confirm({
                title: "删除确认",
                content: `<p>确定要删除用户 <b>${customer.customer_name}</b> 吗？</p> <p>此操作将同时删除该用户下的所有账户，请谨慎操作！</p>`,
                onOk: () => {
                    this.deleteCustomer(customer);
                },
                onCancel: () => {
                    this.$hMessage.info("取消删除");
                },
            });
        },
        deleteCustomer(customer) {
            // 调用后端删除接口
            this.$request.delete('/customer/deleteCustomer', {
                params: {
                    customerId: customer.customer_id
                }
            })
                .then(response => {
                    if (response.data.code === 200) {
                        console.log(customer.customer_id);
                        this.$hMessage.info(`用户 ${customer.customer_name} 已删除`);
                        // 从前端数据中移除删除的用户
                        this.customers = this.customers.filter(c => c.customer_id !== customer.customer_id);
                        this.filteredCustomers = this.customers;
                    } else {
                        this.$hMessage.error(response.data.message || '删除用户失败');
                    }
                })
                .catch(error => {
                    console.error('删除用户时发生错误:', error);
                    this.$hMessage.error('删除用户时发生错误');
                });
        },

        handlePageChange(page) {
            this.currentPage = page;
        },
    },
    mounted() {
        this.filteredCustomers = this.customers;
    },
    computed: {
        total() {
            return this.customers.length;
        },
        currentData() {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = this.currentPage * this.pageSize;
            return this.filteredCustomers.slice(start, end);
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

.customer-management-container {
    margin: 10px;
    padding: 20px;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 5px;
    height: 91vh;
}

.customer-table {
    margin-top: -60px;
}
</style>
