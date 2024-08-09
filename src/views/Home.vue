<template>
    <div class="home-main">

        <h-carousel v-model="value3" :autoplay="setting.autoplay" :autoplay-speed="setting.autoplaySpeed"
            :dots="setting.dots" :trigger="setting.trigger" :arrow="setting.arrow">
            <h-carouselitem>
                <div class="demo-carousel">1</div>
            </h-carouselitem>
            <h-carouselitem>
                <div class="demo-carousel">2</div>
            </h-carouselitem>
            <h-carouselitem>
                <div class="demo-carousel">3</div>
            </h-carouselitem>
            <h-carouselitem>
                <div class="demo-carousel">4</div>
            </h-carouselitem>
        </h-carousel>

        <h-row>
            <h-col :span=18>
                <h-card class="welcome-card" :bordered="true" dis-hover>
                    <p slot="title">欢迎回到理财销售交易系统，现在是北京时间{{ currentTime }}</p>
                    <span>当前登入员工为：员工A</span>
                </h-card>
                <h-col :span=7>
                    <h-card :bordered="true" style="border-radius: 10px" dis-hover>
                        <p slot="title">新闻</p>
                        <h-timeline>
                            <h-timeline-item>
                                <p class="time">2024年7月</p>
                                <p class="content">
                                    公司举办了首届理财创新论坛，邀请了行业内的顶尖专家和学者共同探讨金融科技的发展趋势。此次论坛不仅加强了我们与业内同行的交流合作，还为公司未来的创新发展提供了宝贵的思路和灵感。
                                </p>
                            </h-timeline-item>
                            <h-timeline-item>
                                <p class="time">2024年6月</p>
                                <p class="content">
                                    公司新成立了“绿色金融团队”，致力于开发和推广绿色金融产品。
                                </p>
                            </h-timeline-item>
                            <h-timeline-item>
                                <p class="time">2024年5月</p>
                                <p class="content">
                                    公司在全国范围内新增了50个服务网点，使更多客户能够享受到我们的专业理财服务。
                                </p>
                            </h-timeline-item>
                            <h-timeline-item>
                                <p class="time">2024年3月</p>
                                <p class="content">
                                    理财销售交易系统已正式上线。新系统将为客户提供更加便捷和高效的理财服务体验。
                                </p>
                            </h-timeline-item>
                        </h-timeline>
                    </h-card>
                </h-col>
                <h-col :span=1>
                    <br />
                </h-col>
                <h-col :span=7>
                    <h-card :bordered="true" style="border-radius: 10px" dis-hover>
                        <h-card>
                            <p slot="title">工作</p>
                            <ul class="quick-links">
                                <li><a href="#">员工门户</a></li>
                                <li><a href="#">邮件系统</a></li>
                                <li><a href="#">工作报告</a></li>
                                <li><a href="#">系统反馈</a></li>
                            </ul>
                        </h-card>
                        <h-card style="margin-top: 3px;">
                            <p slot="title">宣传</p>
                            <ul class="quick-links">
                                <li><a href="#">公司主页</a></li>
                                <li><a href="#">团队介绍</a></li>
                                <li><a href="#">项目说明</a></li>
                                <li><a href="#">HUI文档</a></li>
                            </ul>
                        </h-card>
                    </h-card>
                </h-col>
            </h-col>
            <h-col :span=6>
                <h-card :bordered="true" style="margin-top:10px;border-radius: 10px;margin-left:10px" dis-hover>
                    <p slot="title">日历</p>
                    <Calender />
                </h-card>
                <h-card :bordered="true" style="margin-top:10px;border-radius: 10px;margin-left:10px" dis-hover>
                    <router-link to="/Consult">
                        <h-icon name="help"></h-icon><span>系统机器人</span>
                    </router-link>
                </h-card>
            </h-col>
        </h-row>
    </div>
</template>

<script>
import Calender from '../components/Calender.vue';

export default {
    components: {
        Calender: () => import("@/components/Calender")
    },
    data() {
        return {
            value3: 0,
            setting: {
                autoplay: true,
                autoplaySpeed: 3000,
                dots: "inside",
                trigger: "click",
                arrow: "hover",
            },
            currentTime: new Date().toLocaleString(),
        };
    },
    mounted() {
        this.updateTime();
        setInterval(this.updateTime, 1000);
    },
    methods: {
        updateTime() {
            this.currentTime = new Date().toLocaleString();
        },
    },
};
</script>

<style>
.demo-carousel {
    height: 200px;
    line-height: 200px;
    text-align: center;
    color: #fff;
    font-size: 20px;
    background: #506b9e;
}

.home-main {
    margin: 10px;
    padding: 20px;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 5px;
    height: 91vh;
}

.welcome-card {
    margin-bottom: 10px;
    margin-top: 10px;
    border-radius: 10px
}

.time {
    font-size: 14px;
    font-weight: bold;
}

.content {
    padding-left: 5px;
}

.quick-links {
    list-style-type: none;
    padding: 0;
}

.quick-links li {
    margin: 10px 0;
}

.quick-links a {
    text-decoration: none;
    color: #506b9e;
}

.quick-links a:hover {
    text-decoration: underline;
}
</style>
