const { ccclass, property, inspector } = cc._decorator;

@ccclass
@inspector("packages://custom-component/scrollview/inspector.js")
export default class UIScrollView extends cc.ScrollView {
    @property({ override: true, animatable: false, tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.vertical' })//重写父类的horizontal参数
    horizontal = false;
    @property({ override: true, type: cc.Float, range: [0, 1, 0.1], tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.brake' })//重写父类的brake参数
    brake = 0.75;
    @property({ override: true, range: [0, 10], tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.bounceDuration' })//重写父类的bounceDuration参数
    bounceDuration = 0.23;

    public moveDelta = null;

    onLoad() {

    }

    start() {

    }

    /**[注]：底层的组件中只有ScrollView是继承自cc.ViewGroup的
     * 重写父类方法：（在触发该scrollview的触摸事件的时候会触发这个方法
     * @param event 当前触发的事件
     * @param captureListeners 当该scrollview不是嵌套在别的scrollview子节点下的时候，该值为undefined;
     * @returns 返回false的时候可以继续滑动，否者无法继续滑动
     */
    _hasNestedViewGroup(event, captureListeners) {
        this.moveDelta = event.touch.getDelta();//获取当前ScrollView移动的速度（向上滑动速度是正值，向下滑动速度是负值）
        console.log("scrollview========>>>> event.eventPhase == cc.Event.CAPTURING_PHASE");
        console.log("scrollview========>>>> " + this.moveDelta);
        if (event.eventPhase !== cc.Event.CAPTURING_PHASE) return;
        console.log("scrollview========>>>> event.eventPhase != cc.Event.CAPTURING_PHASE");
        if (!event.touch) return;
        console.log("scrollview========>>>> !event.touch");

        // TODO： 2.如果是上移移动则直接吞噬
        if (captureListeners) {
            for (let i = 0; i < captureListeners.length; ++i) {
                const item = captureListeners[i];
                if (item) {
                    // 自身节点
                    if (this.node === item) {
                        if (this.moveDelta.y === 0) {
                            return false;
                        }
                        //屏蔽掉此判断，会导致scrollview没有回弹效果
                        if (event.target.getComponent(cc.ViewGroup)) {
                            return true;
                        }
                    }
                    // 其他节点但有viewGroup
                    if (item.getComponent(cc.ViewGroup)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}
