
cc.Class({
    extends: cc.Component,

    properties: {
        //精灵帧数组
        spriteframes: {
            type: cc.SpriteFrame,
            default: [],
            dispalyName: "精灵帧数组"
        },
        frame_time: 0.1, //帧动画切换图片的时间,即间隔时间
        loop: false,     //是否循环播放
        playload: false, //是否Playonload
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        this.isPlaying = false;  //是否在播放
        this.time = 0;   //播放时间控制
        this.sprite = this.getComponent(cc.Sprite);//获取组件
        if (!this.sprite)       //若组件为空则为其添加组件
        {
            this.sprite = this.addComponent(cc.Sprite);
            this.sprite.sizeMode = cc.Sprite.SizeMode.RAW;
            this.sprite.trim = false;
        }
        if (this.playload) {  //如果用户选择playload属性则在场景开始时播放动画
            if (this.loop) {   //判断是否循环，调用相关函数
                this.Playloop();
            }
            else {
                this.PlayOnce();
            }
        }
    },
    Playloop: function () {
        if (this.spriteframes.length < 0) { //判断精灵帧长度是否合法
            return;
        }
        this.time = 0;
        this.loop = true;
        this.end_fun = null; //回调函数指向空
        this.isPlaying = true;
        this.sprite.spriteFrame = this.spriteframes[0]; //初始化帧动画
    },
    PlayOnce: function (callback) { //传入回调方法
        if (this.spriteframes.length < 0) {
            return;
        }
        this.end_fun = callback;
        this.loop = false;
        this.isPlaying = true;
        this.time = 0;
        this.sprite.spriteFrame = this.spriteframes[0];
    },
    start() {

    },

    update(dt) {
        if (!this.isPlaying) { //判断是否正在播放，不在播放可以直接返回
            return;
        }
        this.time += dt; //获取播放时间
        var index = Math.floor(this.time / this.frame_time); //取整获得图片位置
        if (!this.loop) {//非循环播放
            if (index >= this.spriteframes.length) { //播放完毕
                this.isPlaying = false;
                if (this.end_fun) { //执行回调函数
                    this.end_fun();
                }
            }
            else {//动画正在播放
                this.sprite.spriteFrame = this.spriteframes[index];
            }
        }
        else {//循环播放
            while (index >= this.spriteframes.length) {
                //使索引回到之前对应的索引
                index -= this.spriteframes.length;
                //数组长度 *间隔时间 = 一段时间段
                this.time -= (this.spriteframes.length * this.frame_time);//使时间段回到之前对应的时间段
            }
            this.sprite.spriteFrame = this.spriteframes[index];//更新索引
        }
    },
});
