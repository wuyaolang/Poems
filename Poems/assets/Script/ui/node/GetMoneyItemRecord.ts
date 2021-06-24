/**
 * 提现 兑换红包Item页面
 */
const { ccclass, property } = cc._decorator;
@ccclass
export default class GetMoneyItemRecord extends cc.Component {
    @property(cc.RichText)
    applyDate: cc.RichText = null;
    @property(cc.RichText)
    deliverDate: cc.RichText = null;
    @property(cc.RichText)
    paymentDate: cc.RichText = null;
    @property(cc.RichText)
    money: cc.RichText = null;
    @property(cc.RichText)
    status: cc.RichText = null;

    private Information;
    start() {

    }
    setInforMation(obj) {
        this.Information = obj;
        this.applyDate.string = "<color=#666666> <size=30>" +
            "申请提现时间：" + this.Information.applyDate + "</size></c>"
        this.money.string = "<color=#FF4921> <size=30>" + this.Information.money + "元红包</size></c>"
        this.deliverDate.node.active = false;
        this.status.node.active = false;
        if (this.Information.status == 0 || this.Information.status == 2) {//审核中
            this.status.node.active = true;
            this.status.string = "<color=#666666> <size=30>提现状态：</size></c>" + "<color=#FF4921> <size=30>" + this.Information.msg + "</size></c>"
            this.paymentDate.string = "<color=#FF4921> <size=30>" + this.Information.paymentDate + "</size></c>"
        } else {
            this.deliverDate.node.active = true;
            this.deliverDate.string = "<color=#666666> <size=30>发货时间：</size></c>" + "<color=#FF4921> <size=30>" + this.Information.deliverDate + "</size></c></br>"
            this.paymentDate.string = "<color=#FF4921> <size=30>" + this.Information.msg + "</size></c>"
        }

    }
}
