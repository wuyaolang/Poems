import CocosSDK from "../sdk/CocosSDK";
import { ActionNet } from "./httpTools/Action";
import { IDictionary } from "./httpTools/IDictionary";

export default class HttpManager {
  LoadJson(url: string, action: ActionNet, data?: IDictionary<string, any>, method: string = "GET"): void {
    let datastr;
    if (!cc.sys.isNative) {
      if (data) {
        datastr = data.ToUrl();
      }
    } else {
      if (data) {
        datastr = CocosSDK.getEncryptParams(data.ToUrl());
      } else {
        datastr = CocosSDK.getEncryptParams("");
      }
    }
    cc.log("准备发送请求------->" + datastr);
    var client = cc.loader.getXMLHttpRequest();//
    if (method === "GET") {
      client.open(method, url + "?" + datastr, true);
    } else if (method === "POST") {
      client.open(method, url, true);
      client.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      client.setRequestHeader("Cache-Control", "no-cache");
      client.setRequestHeader("uuid", Tools.getRandomStr32());
    }
    client.responseType = "text";
    client.onreadystatechange = (ev: Event) => {
      if (client.readyState == 4 && client.status == 200) {
        let res = JSON.parse(client.response);
        cc.log("返回结果", client.response)
        action.RunOK([res]);

      }
    };
    client.send(datastr);
  }
}
