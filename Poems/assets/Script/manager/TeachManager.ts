import GameApp from "../GameApp";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TeachManager {

    /**
     * 显示教学区域：
     * @param rect 需要高亮显示的区域：(rect的位置坐标是相对于世界坐标系的)
     * @param target 教学加载的父节点：
     */
    showTeachRect(rect: cc.Rect, target: cc.Node) {
        let x = rect.x;
        let y = rect.y;
        let w = rect.width;
        let h = rect.height;
        let screenW = cc.winSize.width;
        let screenH = cc.winSize.height;
        if (h <= screenH) {
            //当rect区域的高度小于等于屏幕高度的时候：
            //在高亮区域上面的区域：
            let rectTop = y + h;
            let topWidth = screenW;
            let topHeight = screenH - rectTop;
            if (topHeight > 0) {
                let topPos = cc.v2(topWidth / 2, rectTop + topHeight / 2);
                let usedTopPos = target.convertToNodeSpace(topPos);
                let topNode = <cc.Node>cc.instantiate(GameApp.Instance.uiManager.getPrefabByName("Teach"));
                let topScaleX = topWidth / topNode.width;
                let topScaleY = topHeight / topNode.height;
                topNode.setPosition(usedTopPos);
                target.addChild(topNode);
                topNode.scaleX = topScaleX;
                topNode.scaleY = topScaleY;
            }
            //在高亮区域下面的区域：
            let bottomWidth = screenW;
            let bottomHeight = y;
            if (bottomHeight > 0) {
                let bottomPos = cc.v2(bottomWidth / 2, bottomHeight / 2);
                let usedBottomPos = target.convertToNodeSpace(bottomPos);
                let bottomNode = <cc.Node>cc.instantiate(GameApp.Instance.uiManager.getPrefabByName("Teach"));
                let bottomScaleX = bottomWidth / bottomNode.width;
                let bottomScaleY = bottomHeight / bottomNode.height;
                bottomNode.setPosition(usedBottomPos);
                target.addChild(bottomNode);
                bottomNode.scaleX = bottomScaleX;
                bottomNode.scaleY = bottomScaleY;
            }
        }
        if (w <= screenW) {
            //当rect区域的宽度小于等于屏幕宽度的时候：
            //在高亮区域左边的区域：
            let leftWidth = x;
            let leftHeight = h;
            if (leftWidth > 0) {
                let leftPos = cc.v2(leftWidth / 2, y + leftHeight / 2);
                let usedLeftPos = target.convertToNodeSpace(leftPos);
                let leftNode = <cc.Node>cc.instantiate(GameApp.Instance.uiManager.getPrefabByName("Teach"));
                let leftScaleX = leftWidth / leftNode.width;
                let leftScaleY = leftHeight / leftNode.height;
                leftNode.setPosition(usedLeftPos);
                target.addChild(leftNode);
                leftNode.scaleX = leftScaleX;
                leftNode.scaleY = leftScaleY;
            }
            //在高亮区域右边的区域：
            let rightWidth = screenW - (x + w);
            let rightHeight = h;
            if (rightWidth > 0) {
                let rightPos = cc.v2(x + w + rightWidth / 2, y + leftHeight / 2);
                let usedRightPos = target.convertToNodeSpace(rightPos);
                let rightNode = <cc.Node>cc.instantiate(GameApp.Instance.uiManager.getPrefabByName("Teach"));
                let rightScaleX = rightWidth / rightNode.width;
                let rightScaleY = rightHeight / rightNode.height;
                rightNode.setPosition(usedRightPos);
                target.addChild(rightNode);
                rightNode.scaleX = rightScaleX;
                rightNode.scaleY = rightScaleY;
            }
        }
    }
}
