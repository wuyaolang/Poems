const { ccclass, property } = cc._decorator;

export enum FlyCurrencyType {
    RedPack = 0,
    Gold = 1,
}

@ccclass
export default class FlyCurrency extends cc.Component {
    @property(cc.Node)
    redPackLogo: cc.Node = null;
    @property(cc.Node)
    gold: cc.Node = null;

    onLoad() {

    }

    start() {

    }

    initUI(flyType) {
        this.redPackLogo.active = flyType == FlyCurrencyType.RedPack;
        this.gold.active = flyType == FlyCurrencyType.Gold;
    }
}
