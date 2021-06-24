import GameApp from "../../GameApp";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Poet extends cc.Component {
    @property(dragonBones.ArmatureDisplay)
    myselfDragonBone: dragonBones.ArmatureDisplay = null;

    private slotData = null;

    onLoad() {

    }

    start() {

    }

    initUI(dradoneName, armatureName, animationName, slotName, displayIndex, loopTimes) {
        let myData = GameApp.Instance.uiManager.getDragonBonesByName(dradoneName);
        this.myselfDragonBone.dragonAsset = myData[0];
        this.myselfDragonBone.dragonAtlasAsset = myData[1];
        this.myselfDragonBone.armatureName = armatureName;
        this.slotData = this.myselfDragonBone.armature().getSlot(slotName);
        this.slotData.displayIndex = displayIndex;
        this.myselfDragonBone.playAnimation(animationName, loopTimes);
    }

    refreshExpressionByIndex(displayIndex) {
        this.slotData.displayIndex = displayIndex;
    }
}
