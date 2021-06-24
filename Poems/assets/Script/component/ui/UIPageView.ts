const { ccclass, property, inspector } = cc._decorator;

@ccclass
@inspector("packages://custom-component/pageview/inspector.js")
export default class UIPageView extends cc.PageView {

    onLoad() {

    }

    start() {

    }

    //重写父类方法：
    _hasNestedViewGroup(event, captureListeners) {
        if (event.eventPhase !== cc.Event.CAPTURING_PHASE) return;
        if (!event.touch) return;

        const moveDelta = event.touch.getDelta();
        // TODO： 2.如果是上移移动则直接吞噬
        if (captureListeners) {
            for (let i = 0; i < captureListeners.length; ++i) {
                const item = captureListeners[i];
                if (item) {
                    // 自身节点
                    if (this.node === item) {
                        if (moveDelta.y === 0) {
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
