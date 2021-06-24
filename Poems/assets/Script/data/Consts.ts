class Consts {
  public static WS_SERVERS = {
    TEST: "ws://47.97.158.119:8071/s/imserver/", // lf
    // TEST: "ws://192.168.0.106:80/s/imserver/", // lf
    INSPECT: "",
    RELEASE: "",
  };

  public static HTTP_SERVERS = {
    TEST: "http://api.commom.pangbaoapp.com/diamondmaster-api/game/saveLevel.do",
    // TEST: "http://192.168.0.106:80",
    INSPECT: "",
    RELEASE: "",
  };
  public static servers = {
    TEST: "TEST",
    INSPECT: "INSPECT",
    RELEASE: "RELEASE",
  };

  public static SERVER = Consts.servers.TEST;
  public static VERSION = "1.0.0";
  // 客户端自己定义的协议
  public static EventNames = {
    EVENT_EXAMPLE: "EVENT_EXAMPLE",
  };

  //资源预加载路径
  public static PreLoadPath = ["data", "audio", "prefab", "sprite", "animation", "particle", "dragonbones"];
}
(<any>window).Consts = Consts;
