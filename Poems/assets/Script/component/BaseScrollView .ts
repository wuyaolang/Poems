const { ccclass, property } = cc._decorator;
@ccclass
export default class BaseScrollView extends cc.ScrollView {

    @property(cc.Prefab)
    cellItemPrefab: cc.Prefab = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Float)
    spacing: number = 10;

    /** 存放 cell 的列表 */
    cellItemList: cc.Node[] = [];

    /** cell 大小 */
    cellItemTempSize: cc.Size = null;

    /** 滑动之前的 content 的位置 */
    lastContentPosition: cc.Vec2 = cc.v2(0, 0);

    cellDatalist: any[] = [];

    isUpdateFrame: boolean = true;
    start() {
        //在滑动ScrollView的时候进行刷新cellItem;
        this.scrollView.content.on("position-changed", this._updateContentView.bind(this));
        this.initUI();
    }

    /** 初始化UI */
    initUI() {
        // TODO 由子类继承，并实现
    }

    /** 初始化cellData的数据 */
    initCellDataList(cellDataList: any[]) {
        this.cellDatalist = cellDataList;
    }

    /** 创建cell List列表 */
    createCellList() {
        if (this.vertical) {
            this._createVerticalCellList();
        } else {
            this._createHorizontalCellList();
        }
    }

    _createVerticalCellList() {
        let count = 10;
        for (var i = 0; i < this.cellDatalist.length; i++) {
            if (i > count - 1) {
                return;
            }
            var node = cc.instantiate(this.cellItemPrefab);
            if (i == 0) {
                this.cellItemTempSize = node.getContentSize();
                count = Math.ceil(this.node.height / node.height) * 2;
                let height = this.cellDatalist.length * (this.cellItemTempSize.height + this.spacing);
                this.scrollView.content.setContentSize(cc.size(this.scrollView.content.width, height));
            }

            node["cellID"] = i;

            this.scrollView.content.addChild(node);
            this.cellItemList.push(node);
            let logicComponent = this.cellItemList[i].getComponent(this.cellItemPrefab.name);
            if (logicComponent && logicComponent.updateView) {
                logicComponent.updateView(i, this.cellDatalist[i]);
            }

            node.y = - i * (this.cellItemTempSize.height + this.spacing);
        }
    }

    _createHorizontalCellList() {
        let count = 10;
        for (var i = 0; i < this.cellDatalist.length; i++) {
            if (i > count - 1) {
                return;
            }
            var node = cc.instantiate(this.cellItemPrefab);
            if (i == 0) {
                this.cellItemTempSize = node.getContentSize();
                count = Math.ceil(this.node.width / node.width) * 2;
                let width = this.cellDatalist.length * (this.cellItemTempSize.width + this.spacing);
                this.scrollView.content.setContentSize(cc.size(width, this.scrollView.content.height));
            }

            node["cellID"] = i;

            this.scrollView.content.addChild(node);
            this.cellItemList.push(node);

            let logicComponent = this.cellItemList[i].getComponent(this.cellItemPrefab.name);
            if (logicComponent && logicComponent.updateView) {
                logicComponent.updateView(i, this.cellDatalist[i]);
            }
            node.x = (this.cellItemTempSize.width + this.spacing) * i;
        }
    }


    _getPositionInView(item: cc.Node) {
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);//有AR的是以参照物的锚点作为新建坐标系的原点，没有AR的是以参照物的左下角作为新建坐标系的原点。
        let viewPos = this.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    }

    _updateContentView() {
        if (this.vertical) {
            if (this.isUpdateFrame) {
                this.isUpdateFrame = false;
                this.scheduleOnce(this._updateVerticalContentView.bind(this), 0);
            }

        } else {
            if (this.isUpdateFrame) {
                this.isUpdateFrame = false;
                this.scheduleOnce(this._updateHorizontalContentView.bind(this), 0);
            }
        }
    }

    _updateVerticalContentView() {
        let isDown = this.scrollView.content.y < this.lastContentPosition.y;//判断ScrollView的滑动方向。（实际ScrollView滑动的过程就是content节点在上下移动）
        let offsetY = (this.cellItemTempSize.height + this.spacing) * this.cellItemList.length;
        let offset = offsetY / 4;
        let newY = 0;

        for (var i = 0; i < this.cellItemList.length; i++) {
            let viewPos = this._getPositionInView(this.cellItemList[i]);
            if (isDown) {
                newY = this.cellItemList[i].y + offsetY;
                if (viewPos.y < -(offset * 3) && newY <= 0) {
                    this.cellItemList[i].y = newY;
                    let idx = this.cellItemList[i]["cellID"] - this.cellItemList.length;
                    let logicComponent = this.cellItemList[i].getComponent(this.cellItemPrefab.name);
                    if (logicComponent && logicComponent.updateView) {
                        logicComponent.updateView(idx, this.cellDatalist[idx]);
                    }
                    this.cellItemList[i]["cellID"] = idx;
                }
            } else {
                newY = this.cellItemList[i].y - offsetY;
                if (viewPos.y > offset && newY > -this.scrollView.content.height) {

                    this.cellItemList[i].y = newY;
                    let idx = this.cellItemList[i]["cellID"] + this.cellItemList.length;
                    let logicComponent = this.cellItemList[i].getComponent(this.cellItemPrefab.name);
                    if (logicComponent && logicComponent.updateView) {
                        logicComponent.updateView(idx, this.cellDatalist[idx]);
                    }
                    this.cellItemList[i]["cellID"] = idx;
                }
            }
        }

        this.lastContentPosition = this.scrollView.content.position;
        this.isUpdateFrame = true;
    }

    _updateHorizontalContentView() {
        let isLeft = this.scrollView.content.x < this.lastContentPosition.x;
        let offsetX = (this.cellItemTempSize.width + this.spacing) * this.cellItemList.length;
        let offset = offsetX / 4;
        let newX = 0;

        for (var i = 0; i < this.cellItemList.length; i++) {
            let viewPos = this._getPositionInView(this.cellItemList[i]);
            if (isLeft) {
                newX = this.cellItemList[i].x + offsetX;
                if (viewPos.x < -offset && newX < this.scrollView.content.width) {
                    this.cellItemList[i].x = newX;
                    let idx = this.cellItemList[i]["cellID"] + this.cellItemList.length;
                    let logicComponent = this.cellItemList[i].getComponent(this.cellItemPrefab.name);
                    if (logicComponent && logicComponent.updateView) {
                        logicComponent.updateView(idx, this.cellDatalist[idx]);
                    }
                    this.cellItemList[i]["cellID"] = idx;
                }
            } else {
                newX = this.cellItemList[i].x - offsetX;
                if (viewPos.x > offset * 3 && newX >= 0) {

                    this.cellItemList[i].x = newX;
                    let idx = this.cellItemList[i]["cellID"] - this.cellItemList.length;
                    let logicComponent = this.cellItemList[i].getComponent(this.cellItemPrefab.name);
                    if (logicComponent && logicComponent.updateView) {
                        logicComponent.updateView(idx, this.cellDatalist[idx]);
                    }
                    this.cellItemList[i]["cellID"] = idx;
                }
            }
        }

        this.lastContentPosition = this.scrollView.content.position;
        this.isUpdateFrame = true;
    }
}

