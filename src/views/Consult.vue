<template>
    <div class="consult-main">
        <div class="box">
            <router-link to="/home">
                <h-button type="primary"><span style="vertical-align: 4px;font-weight: bold;">返 回</span></h-button>
            </router-link>
            <div class="title" style="margin-top:30px">
                <img src="" alt class="logo" />
                <span class="title-hn" style="font-weight:bold">系统机器人</span><br /><br />
            </div>
            <div id="content" class="content">
                <div v-for="(item, index) in info" :key="index">
                    <div class="info_r info_default" v-if="item.type == 'leftinfo'">
                        <span class="circle circle_r"></span>
                        <div class="con_r con_text">
                            <div>{{ item.content }}</div>
                            <div v-for="(item2, index) in item.question" :key="index">
                                <div class="con_que" @click="clickRobot(item2.content, item2.id)">
                                    <div class="czkj-question-msg">
                                        {{ item2.index }}
                                        {{ item2.content }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="time_r">{{ item.time }}</div>
                    </div>

                    <div class="info_l" v-if="item.type == 'rightinfo'">
                        <div class="con_r con_text">
                            <span class="con_l">{{ item.content }}</span>
                            <span class="circle circle_l">
                            </span>
                        </div>
                        <div class="time_l">{{ item.time }}</div>
                    </div>
                </div>
            </div>

            <div class="setproblem">
                <textarea placeholder="请输入您的问题..."
                    style="height: 68px;width: 100%;resize:none;padding-right:80px;outline: none;border-color:#ccc;border-radius:5px;"
                    id="text" v-model="customerText" @keyup.enter="sentMsg()"></textarea>
                <button @click="sentMsg()" class="setproblems">
                    <span style="vertical-align: 4px;">发 送</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "onlineCustomer",
    components: {},
    computed: {},
    data() {
        return {
            customerText: "",
            info: [
                {
                    type: "leftinfo",
                    time: this.getTodayTime(),
                    name: "robot",
                    content:
                        "您好，欢迎使用资讯小助手",
                    question: [],
                },
            ],
            timer: null,
            robotQuestion: [

            ],
            robotAnswer: [

            ],
        };
    },
    created() {
    },
    watch: {},
    methods: {
        // 用户发送消息
        async sentMsg() {
            clearTimeout(this.timer);
            let text = this.customerText.trim();
            if (text != "") {
                var obj = {
                    type: "rightinfo",
                    time: this.getTodayTime(),
                    content: text,
                };
                this.info.push(obj);
                await this.appendRobotMsg(this.customerText);
                this.customerText = "";
                this.$nextTick(() => {
                    var contentHeight = document.getElementById("content");
                    contentHeight.scrollTop = contentHeight.scrollHeight;
                });
            }
        },
        // 机器人回答消息
        async appendRobotMsg(text) {
            clearTimeout(this.timer);
            text = text.trim();

            try {
                const response = await axios.post('https://luckycola.com.cn/ai/wxChatV2', {
                    ques: text,
                    appKey: '667e3ebfd15529d0adaba579',
                    uid: '3GnH6y1719549618694XlViHcqTGJ',
                    isLongChat: 0
                });
                const answerData = response.data;
                const answerText = answerData.data.result;

                let obj = {
                    type: "leftinfo",
                    time: this.getTodayTime(),
                    name: "robot",
                    content: answerText,
                    question: [],
                };
                this.info.push(obj);
            } catch (error) {
                console.error(error);
                let obj = {
                    type: "leftinfo",
                    time: this.getTodayTime(),
                    name: "robot",
                    content: "对不起，我无法回答这个问题，请稍后再试。",
                    question: this.robotQuestion,
                };
                this.info.push(obj);
            }

            this.$nextTick(() => {
                var contentHeight = document.getElementById("content");
                contentHeight.scrollTop = contentHeight.scrollHeight;
            });
        },
        sentMsgById(val, id) {
            clearTimeout(this.timer);

            let robotById = this.robotAnswer.filter((item) => {
                return item.id == id;
            });
            let obj_l = {
                type: "leftinfo",
                time: this.getTodayTime(),
                name: "robot",
                content: robotById[0].content,
                question: [],
            };
            let obj_r = {
                type: "rightinfo",
                time: this.getTodayTime(),
                name: "robot",
                content: val,
                question: [],
            };
            this.info.push(obj_r);
            this.info.push(obj_l);
            this.$nextTick(() => {
                var contentHeight = document.getElementById("content");
                contentHeight.scrollTop = contentHeight.scrollHeight;
            });
        },
        // 点击机器人的单个问题
        clickRobot(val, id) {
            this.sentMsgById(val, id);
        },
        // 结束语
        endMsg() {
            let happyEnding = {
                type: "leftinfo",
                time: this.getTodayTime(),
                content: "对话结束，请在页面上方点击返回按钮返回系统首页",
                question: [],
            };
            this.info.push(happyEnding);
            this.$nextTick(() => {
                var contentHeight = document.getElementById("content");
                contentHeight.scrollTop = contentHeight.scrollHeight;
            });
        },
        getTodayTime() {
            // 获取当前时间
            var day = new Date();
            let seconds = day.getSeconds();
            if (seconds < 10) {
                seconds = "0" + seconds;
            } else {
                seconds = "" + seconds;
            }
            let minutes = day.getMinutes();
            if (minutes < 10) {
                minutes = "0" + minutes;
            } else {
                minutes = "" + minutes;
            }
            let time =
                day.getFullYear() +
                "-" +
                (day.getMonth() + 1) +
                "-" +
                day.getDate() +
                " " +
                day.getHours() +
                ":" +
                minutes +
                ":" +
                seconds;
            return time;
        },
    },
    mounted() { },
    props: {},
    destroyed() { },
};
</script>
<style>
.box {
    margin-left: 100px;
    margin-right: 100px;
    margin-top: 30px;
    border-radius: 10px;
    border: 1px solid #ccc;

    background-color: #fafafa;
    position: relative;
    padding: 1.25rem;

    #content {
        height: 480px;
        overflow-y: scroll;
        font-size: 14px;
        width: 100%;

        .circle {
            display: inline-block;
            width: 34px;
            height: 34px;
            border-radius: 50%;
            background-color: #000000;
        }

        .con_text {
            color: #333;
            margin-bottom: 5px;
        }

        .con_que {
            color: #1c88ff;
            height: 30px;
            line-height: 30px;
            cursor: pointer;
        }

        .info_r {
            position: relative;

            .circle_r {
                position: absolute;
                left: 0%;
            }

            .pic_r {
                width: 17px;
                height: 17px;
                margin: 8px;
            }

            .con_r {
                display: inline-block;
                width: 55%;
                min-height: 55px;
                background-color: #e2e2e2;
                border-radius: 6px;
                padding: 10px;
                margin-left: 40px;
            }

            .time_r {
                margin-left: 45px;
                color: #999999;
                font-size: 12px;
            }
        }

        .info_l {
            text-align: right;
            color: #ffffff;
            color: #3163C5;
            margin-top: 10px;

            .pic_l {
                width: 13px;
                height: 17px;
                margin: 8px 10px;
            }

            .time_l {
                margin-right: 45px;
                color: #999999;
                font-size: 12px;
                margin-top: 5px;
            }

            .con_l {
                display: inline-block;
                width: 220px;
                min-height: 51px;
                background-color: #3163C5;
                border-radius: 6px;
                padding: 10px;
                text-align: left;
                color: #fff;
                margin-right: 5px;
            }
        }

        #question {
            cursor: pointer;
        }
    }
}


.setproblem {
    width: 100%;
    height: 68px;
    background-color: #ffffff;
    position: relative;
    margin-top: 3.75rem;

}

.setproblem textarea {
    color: #999999;
    padding: 10px;
    box-sizing: border-box;
}

.setproblem button {
    width: 5.875rem;
    height: 2.5rem;
    line-height: 2.5rem;
    background: #3163C5;
    opacity: 1;
    border-radius: 4px;
    font-size: 10px;
    color: #ffffff;
    position: absolute;
    right: 5%;
    top: 30%;
    cursor: pointer;
    border: none;
}

.czkj-item-title {
    line-height: 25px;
    border-bottom: 1px solid #ccc;
    padding-bottom: 5px;
    margin-bottom: 5px;
}

.czkj-item-question {
    cursor: pointer;
    display: block;
    padding: 8px;
    position: relative;
    border-bottom: 1px dashed #ccc;
    line-height: 20px;
    min-height: 20px;
    overflow: hidden;
}

.czkj-question-msg {
    float: left;
    font-size: 14px;
    color: #3163C5;
}

.consult-main {
    margin: 10px;
    padding: 20px;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 5px;
    height: 91vh;
}
</style>