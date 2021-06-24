const { ccclass, property, inspector } = cc._decorator;

@ccclass
@inspector("packages://custom-component/label/inspector.js")
export default class UILabel extends cc.Label {
    @property(cc.Boolean)
    isScrollLabel = false;//是否开启数组滚动
    @property(cc.Boolean)
    onlyScrollOnLoad = true;//是否第一次不开启数字滚动，之后一直开启数字滚动
    @property({ type: cc.Integer, range: [0, 100] })
    scrollFrame = 20;//数字滚动的持续时间（单位：帧）

    public isOnLoad = true;//是否是第一次加载该组件

    onLoad() {

    }

    start() {

    }

    /**
     * 给Label设置内容
     * @param endStr 目标内容
     * @param startStr 现有内容
     * @param unit 单位
     */
    setString(endStr: string, startStr: string = "", unit: string = "") {
        if (!this.isScrollLabel || !this.scrollFrame || (this.onlyScrollOnLoad && this.isOnLoad)) {
            this.string = endStr + unit;
            this.isOnLoad = false;
        } else {
            let currentNum = Number(startStr);
            let finalNum = Number(endStr);
            if (currentNum == finalNum) {
                this.isOnLoad = false;
                return;
            }
            let dis = finalNum - currentNum;
            let perDis = Number(Tools.toFloat(Tools.toFloat(dis) / Math.ceil(this.scrollFrame), 5));
            if (perDis == 0) {
                perDis = 0.001;
            }
            let func = () => {
                if (currentNum >= finalNum) {
                    this.unschedule(func);
                    this.string = String(Tools.toFloat(finalNum, 2)) + unit;
                    return;
                }
                if (dis >= 0) {
                    currentNum += perDis;
                } else {
                    currentNum -= perDis;
                }
                this.string = String(Tools.toFloat(currentNum, 2)) + unit;
            };
            this.schedule(func, 1.0 / 60, cc.macro.REPEAT_FOREVER, 0);
        }
    }
}
