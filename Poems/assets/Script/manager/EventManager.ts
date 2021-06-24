export default class EventManager {
  private event_list;
  constructor() {
    this.event_list = [];
  }

  on(eventName, callback, target) {
    if (!eventName || !callback || !target) {
      console.log("注册事件格式错误", eventName);
      return;
    }
    this.event_list.push({ eventName: eventName, cb: callback, target: target });
    //console.log(`添加事件监听${eventName}成功`);
  }
  emit(eventName, params?) {
    for (let i = 0; i < this.event_list.length; i++) {
      // cc.log(this.event_list[i]["eventName"]);
      if (this.event_list[i]["eventName"] == eventName) {
        this.event_list[i]["cb"].call(this.event_list[i]["target"], params);
        console.log(`发射事件${eventName}=`, params);
      }
    }
  }
  off(eventName, obj) {
    for (let i = this.event_list.length - 1; i >= 0; i--) {
      if (
        this.event_list[i]["eventName"] == eventName &&
        this.event_list[i]["target"] == obj
      ) {
        this.event_list.splice(i, 1);
        //console.log(`移除事件${eventName}成功`);
      }
    }
  }
}
