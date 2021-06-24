import BaseComponent from "../component/BaseComponent";
import GameApp from "../GameApp";
import Toast from "../base/Toast";

export default class UIManager {

    public runningRoot: cc.Node = null;
    public popupRoot: cc.Node = null;
    public toastRoot: cc.Node = null;
    public loadingMask: cc.Node = null;
    public loadingProgress: cc.ProgressBar = null;
    public screenMask: cc.Node = null;

    private _Prefabs;
    private _Sprites;
    private _Animation;
    private _Particle;
    private _dragonBones;

    public runningFormName: string = "";
    public runningForm: cc.Node = null;

    public topPopUpFormName: string = "";
    public popUpFormList;
    public topPopUpForm: cc.Node = null;

    public _uiRefreshByNameFunctionList;
    public toastPrefab = null;

    private peristNode: cc.Node = null;
    public toastNodePool: cc.NodePool = null;

    constructor() {
        this._Prefabs = [];
        this._Sprites = [];
        this._Animation = [];
        this._Particle = [];
        this._dragonBones = {};
        this.popUpFormList = [];
        this._uiRefreshByNameFunctionList = [];
    }

    replaceSceneWithRunningForm(name) {
        this.releaseToastNodePool();
        this.runningFormName = name;
        this.topPopUpForm = null;
        this.popUpFormList = [];
        cc.director.loadScene("GameScene");
    }

    runWithFormByName(name) {
        //runningForm如果已经存在的话，就会删除之前的那个runningForm，替换为新的runningForm：
        if (this.runningFormName != "") {
            console.log("runningRoot exsist");
            if (this.runningRoot != null) this.runningRoot.destroyAllChildren();
        }
        if (!this._Prefabs[name]) {
            this.load(name, () => {
                this.runWithFormByName(name);
            });
            console.log("资源不存在");
            return;
        }
        let node = cc.instantiate(this._Prefabs[name]);
        if (this.runningRoot != null) this.runningRoot.addChild(node);
        <BaseComponent>node.getComponent(name).nodeRunEnterAction();
        this.runningForm = node; this.runningFormName = name;
        console.log("当前runningForm名称:" + name);
    }

    popUpFormByName(name) {
        //未加载
        if (!this._Prefabs[name]) {
            this.load(name, () => {
                this.popUpFormByName(name);
            });
            cc.log("资源不存在");
            return null;
        }

        //检测是否数组中每一歌元素都不是名称为name的界面:
        let isNotExsist = this.popUpFormList.every((element, index, array) => {
            return element["name"] != name;
        });
        if (!isNotExsist) {
            return null;
        }
        //已加载
        let node = cc.instantiate(this._Prefabs[name]);
        if (this.popupRoot != null) this.popupRoot.addChild(node);
        this.topPopUpForm = node; this.topPopUpFormName = name;
        this.popUpFormList.push({ name: name, target: node });
        let comp = <BaseComponent>node.getComponent(name);
        comp.nodeRunEnterAction();
        console.log("pop_uuid:" + node.uuid);
        return node;
    }

    popUpFormByNameTo(name) {
        return this.popUpFormByName(name).getComponent(name);
    }

    getPopUpFormByName(name): cc.Node {
        return this.popupRoot != null ? this.popupRoot.getChildByName(name) : null;
    }

    getPopUpFormCount() {
        return this.popUpFormList.length;
    }

    removeAllPopUpForm() {
        this.popUpFormList.forEach(element => {
            element["target"].destroy();
        });
        this.popUpFormList = [];
    }

    removePopUpFormByName(name) {
        //只删除最上层的name名称下的uiform：
        for (let i = this.popUpFormList.length - 1; i >= 0; i--) {
            if (this.popUpFormList[i]["name"] == name) {
                console.log("remove_uuid:" + this.popUpFormList[i]["target"].uuid);
                this.popUpFormList[i]["target"].destroy();
                this.popUpFormList.splice(i, 1);
                break;
            }
        }
    }

    removePopUpFormByNode(node) {
        for (let i = this.popUpFormList.length - 1; i >= 0; i--) {
            if (this.popUpFormList[i]["target"] == node) {
                console.log("remove_uuid:" + this.popUpFormList[i]["target"].uuid);
                this.popUpFormList.splice(i, 1);
                break;
            }
        }
    }

    refreshPopUpFormListAndTopPopUpForm() {
        if (this.popUpFormList.length != 0) {
            this.topPopUpForm = this.popUpFormList[this.popUpFormList.length - 1]["target"];
            this.topPopUpFormName = this.popUpFormList[this.popUpFormList.length - 1]["name"];
            console.log("top_uuid:" + this.topPopUpForm.uuid);
        } else {
            console.log("top_uuid:暂时没有弹窗");
        }
    }

    startLoading(ProgressingCallback, CompleteCallback) {
        this._Prefabs = {};
        this._Sprites = {};
        this._Animation = {};
        this._Particle = {};
        this._dragonBones = {};
        this.loadAssets(
            0,
            (completedCount, totalCount) => {
                ProgressingCallback(completedCount, totalCount);
            },
            () => {
                CompleteCallback();
            }
        );
    }

    loadAssets(index, cbProgress, cbComplete) {
        let desInfo = [
            "加载配置文件",
            "加载音频文件",
            "加载场景文件",
            "加载图片文件",
            "加载动画资源",
            "加载粒子资源",
            "加载龙骨动画",
        ];
        if (this.loadingProgress != null) this.loadingProgress.node.children[1].getComponent(cc.Label).string = desInfo[index];
        let kind = [cc.JsonAsset, cc.AudioClip, cc.Prefab, cc.SpriteFrame, cc.AnimationClip, cc.ParticleAsset, cc.Asset];
        cc.loader.loadResDir(
            Consts.PreLoadPath[index],
            kind[index],
            (completedCount, totalCount) => {
                cbProgress(completedCount, totalCount);
            },
            (err, assets) => {
                for (let i = 0; i < assets.length; i++) {
                    let asset = assets[i];
                    let assetName = asset.name;
                    if (index == 0) {
                        GameApp.Instance.dataManager.jsonData[assetName] = asset.json;
                    } else if (index == 1) {
                        GameApp.Instance.audioManager.audioClips[assetName] = asset;
                    } else if (index == 2) {
                        this._Prefabs[assetName] = asset;
                    } else if (index == 3) {
                        this._Sprites[assetName] = asset;
                    } else if (index == 4) {
                        this._Animation[assetName] = asset;
                    } else if (index == 5) {
                        this._Particle[assetName] = asset;
                    } else if (index == 6) {
                        if (asset instanceof dragonBones.DragonBonesAsset) {
                            let name = assetName.substring(0, assetName.length - 4);
                            if (this._dragonBones[name]) {
                                this._dragonBones[name][0] = asset;
                            } else {
                                this._dragonBones[name] = [null, null];
                                this._dragonBones[name][0] = asset;
                            }
                        } else if (asset instanceof dragonBones.DragonBonesAtlasAsset) {
                            let name = assetName.substring(0, assetName.length - 4);
                            if (this._dragonBones[name]) {
                                this._dragonBones[name][1] = asset;
                            } else {
                                this._dragonBones[name] = [null, null];
                                this._dragonBones[name][1] = asset;
                            }
                        }
                    }
                }
                ++index;
                if (index < Consts.PreLoadPath.length) {
                    this.loadAssets(index, cbProgress, cbComplete);
                } else {
                    cbComplete();
                }
                // cbComplete();
            }
        );
    }

    load(name, cb) {
        let aa = Consts.PreLoadPath["prefab"] + "/" + name;
        cc.loader.loadRes(
            Consts.PreLoadPath["prefab"] + "/" + name,
            (err, prefab) => {
                if (err) {
                    cc.error(err.message || err);
                    return;
                }
                this._Prefabs[name] = prefab;
                cb && cb(name);
            }
        );
    }

    getPrefabByName(name) {
        return this._Prefabs[name];
    }

    getSpriteByName(name) {
        return this._Sprites[name];
    }

    getAnimationByName(name) {
        return this._Animation[name];
    }

    getParticleByName(name) {
        return this._Particle[name];
    }

    getDragonBonesByName(name) {
        return this._dragonBones[name];
    }

    //注册事件的时候建议一个target对应一个callName。
    registerUIRefreshFunctionWithName(callName, target, callback) {
        if (!callName || !target || !callback) {
            console.log("注册事件格式错误", callName);
            return;
        }
        let isPush = true;
        for (let i = 0; i < this._uiRefreshByNameFunctionList.length; i++) {
            if (this._uiRefreshByNameFunctionList[i]["target"] == target) {
                if (this._uiRefreshByNameFunctionList[i]["callback"] == callback) {
                    isPush = false;
                    this._uiRefreshByNameFunctionList[i] = { callName: callName, target: target, callback: callback };
                    break;
                }
            }
        }
        if (isPush) {
            this._uiRefreshByNameFunctionList.push({ callName: callName, target: target, callback: callback });
        }
    }

    removeInValidUIRefreshFunction() {
        //检测数组中满足满足cc.isValid(element["target"])条件的元素并组成新的数组：
        //界面要在下一帧才会被从内存中释放，所以这里延迟0.1s：
        setTimeout(() => {
            let arr = this._uiRefreshByNameFunctionList.filter((element, index, array) => {
                return cc.isValid(element["target"]);
            });
            this._uiRefreshByNameFunctionList = arr;
        }, 100);
    }

    //这里就体现了一个target对应一个callName的重要性
    removeUIRefreshFunctionByName(callName) {
        //检测数组中满足满足element["callName"] != callName条件的元素并组成新的数组：
        let arr = this._uiRefreshByNameFunctionList.filter((element, index, array) => {
            return element["callName"] != callName;
        });
        this._uiRefreshByNameFunctionList = arr;
    }

    removeUIRefreshFunctionByTarget(target) {
        //检测数组中满足满足element["target"] != target条件的元素并组成新的数组：
        let arr = this._uiRefreshByNameFunctionList.filter((element, index, array) => {
            return element["target"] != target;
        });
        this._uiRefreshByNameFunctionList = arr;
    }

    callUIRefreshFunctionsWithName(callName) {
        this._uiRefreshByNameFunctionList.forEach(element => {
            if (element["callName"] == callName) {
                if (element["target"]) {
                    if (element["callback"]) {
                        element["callback"]();
                    }
                }
            }
        });
    }

    showLoading(callback, desStr = "Loading...") {
        if (this.loadingMask != null && callback != null) {
            if (this.loadingMask.children.length > 2) {
                this.loadingMask.children[2].destroy();
            }
            this.loadingMask.active = true;
            let desComp = this.loadingMask.getChildByName("Label_des").getComponent(cc.Label);
            desComp.string = desStr;
            callback(this.loadingMask);
        }
    }

    hideLoading() {
        if (this.loadingMask != null) {
            this.loadingMask.active = false;
            if (this.loadingMask.children.length > 2) {
                this.loadingMask.children[2].destroy();
            }
        }
    }

    showToast(toast_content) {
        let node: cc.Node = null
        if (!this.toastNodePool) {
            this.toastNodePool = new cc.NodePool();
            node = cc.instantiate(this._Prefabs["Toast"]);
        } else {
            if (this.toastNodePool.size() > 0) {
                node = this.toastNodePool.get();
            } else {
                node = cc.instantiate(this._Prefabs["Toast"]);
            }
        }
        node.opacity = 255;
        this.toastRoot.addChild(node);
        let toastComp = <Toast>node.getComponent("Toast");
        toastComp.initToast(toast_content);
    }

    releaseToastNodePool() {
        if (this.toastNodePool) {
            this.toastNodePool.clear();
        }
    }

    addPersistRootNode() {
        this.peristNode = new cc.Node();
        cc.game.addPersistRootNode(this.peristNode);//添加常驻节点，比如音乐音效的组件可以加在一个常驻节点上，这样就可以在全局播放了。
    }

    getPersistRootNode() {
        return this.peristNode;
    }

    setFunctionWhenEnterBackGround(callback) {
        cc.game.on(cc.game.EVENT_HIDE, () => {
            if (callback) {
                callback();
            }
        });
    }

    setFunctionWhenEnterForeGround(callback) {
        cc.game.on(cc.game.EVENT_SHOW, () => {
            if (callback) {
                callback();
            }
        });
    }

    //设置全屏触摸：
    setTouchEnable(isEnable) {
        this.screenMask.active = !isEnable;
    }
}
