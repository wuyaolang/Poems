import GameApp from "../GameApp";

export default class SocketManager {
  private MockNet = true;
  private _webSocket: WebSocket;
  private _retryCount = 5;
  private _retryTimer = 0;

  public _lastAcceptInfoFromServer = 0;

  Initialize() {
    GameApp.Instance.eventManager.on(
      "online",
      () => {
        cc.log("网络恢复");
        if (this._retryCount < 0) {
          cc.log("重连结束，主动连接");
          this.firstConnect();
        }
      },
      this
    );
  }

  connect() {
    this._retryCount--;
    cc.log("-------初始化连接-------");
    clearInterval(this._retryTimer);
    this.initConnect(Consts.WS_SERVERS[Consts.SERVER]);
  }

  //测试
  firstConnect() {
    if (this.MockNet) {
    } else {
      if (!this._webSocket || this._webSocket.readyState === WebSocket.CLOSED) {
        this.connect();
      }
    }
  }

  reconnect() {
    this._retryCount--;
    cc.log("Retry Count：" + this._retryCount);
    if (this._retryCount >= 0) {
      this._retryTimer = setInterval(this.connect.bind(this), 3000);
    }
  }

  resetReconnect() {
    this._retryCount = 5;
  }

  initConnect(server) {
    this._webSocket = new WebSocket(server);

    this._webSocket.onopen = (event) => {
      this._lastAcceptInfoFromServer = Date.now();
      console.log(this._lastAcceptInfoFromServer);
      cc.log("网络open！！！");
      // this.resetReconnect();
    };

    this._webSocket.onmessage = (event) => {
      let data = event.data;
      if (data == "连接成功") {
        return;
      }
      let info = JSON.parse(data);
      if (undefined == info) {
        return;
      }

      // if ("Heart" != data.scmd && "Sys" != data.mcmd) {
      //   cc.log("recieve------<<");
      //   cc.log(data);
      // }
      // if (data.data && data.data.code != 0) {
      //   cc.error(
      //     "服务端处理异常！ code: " +
      //       data.data.code +
      //       "  msg: " +
      //       data.data.message
      //   );
      //   return;
      // }
      // return GameApp.Instance.eventManager.emit(
      //   data.mcmd + data.scmd,
      //   data.data
      // );
    };

    this._webSocket.onclose = (event) => {
      cc.log("网络close！！！ code:" + event.code);
      console.log("====================================================================================onclose");
      // if (Number(event.code) !== 1000) {
      //   GameApp.Instance.uiManagern.showToast("网络已断开，自动重连中。。。");
      //   // if (this._retryCount > 0) {
      //   //   this.firstConnect();
      //   // }
      //   this.reconnect();
      // }
    };
    this._webSocket.onerror = (event) => {
      console.log("====================================================================================onerror");
    };
  }

  close() {
    if (this._webSocket) {
      this._webSocket.onclose = null;
      this._webSocket.close();
      this._webSocket = null;
    }
  }

  send(msg) {
    //   if (this.MockNet) {
    //     GameApp.Instance.eventManager.emit(mcmd + scmd, data);
    //   } else {
    //     if (!this._webSocket || this._webSocket.readyState !== WebSocket.OPEN) {
    //       cc.log("重连结束，主动连接");
    //       this.firstConnect();

    //       // return GameApp.Instance.uiManagern.showToast(
    //       //   "网络连接已中断，正在尝试重新连接！"
    //       // );
    //     }
    //     let msg = {
    //       mcmd: mcmd,
    //       scmd: scmd,
    //       data: null,
    //     };
    //     if (data) {
    //       msg.data = data;
    //     }

    //     let jsonMsg = JSON.stringify(msg);
    //     if ("Heart" != msg.scmd && "Sys" != msg.mcmd) {
    //       cc.log("send------->>");
    //       cc.log(msg);
    //     }
    //     this._webSocket.send(jsonMsg);
    //   }

    let jsonMsg = JSON.stringify(msg);
    if ("Heart" != msg.scmd && "Sys" != msg.mcmd) {
      cc.log("send------->>");
      cc.log(msg);
    }
    this._webSocket.send(jsonMsg);
  }
}
