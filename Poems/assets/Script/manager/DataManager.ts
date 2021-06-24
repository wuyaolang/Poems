export default class DataManager {
  private _jsonData = [];
  get jsonData() {
    return this._jsonData;
  }
  set jsonData(value) {
    this._jsonData = value;
  }
  private _MD5Code;
  get MD5Code() {
    return this._MD5Code;
  }
  set MD5Code(value) {
    this._MD5Code = value;
  }
  private _musicVolume;
  get musicVolume() {
    return this._musicVolume;
  }
  set musicVolume(value) {
    this._musicVolume = value;
  }
  private _effectVolume;
  get effectVolume() {
    return this._effectVolume;
  }
  set effectVolume(value) {
    this._effectVolume = value;
  }

  private _isShowAgereement;//是否弹出Assignment预制体界面
  get isShowAgereement() {
    return this._isShowAgereement;
  }
  set isShowAgereement(value) {
    this._isShowAgereement = value;
  }

  private _userGameInfo;//服务端获取到的当前答题信息存在这个对象中：
  get userGameInfo() {
    return this._userGameInfo;
  }
  set userGameInfo(value) {
    this._userGameInfo = value;
  }

  private _answerInfo;//服务端获取到的当前歌曲信息存在这个对象中：
  get answerInfo() {
    return this._answerInfo;
  }
  set answerInfo(value) {
    this._answerInfo = value;
  }

  private _cashInfo = null;
  get cashInfo() {
    return this._cashInfo;
  }
  set cashInfo(value) {
    this._cashInfo = value;
  }

  private _goldInfo = null;
  get goldInfo() {
    return this._goldInfo;
  }
  set goldInfo(value) {
    this._goldInfo = value;
  }

  private _isAuditStatus = false;
  get isAuditStatus() {
    return this._isAuditStatus;
  }
  set isAuditStatus(value) {
    this._isAuditStatus = value;
  }

  /**
   * 游戏切到后台的时间戳
   */
  private _enterBackGroundStamps = 0;
  get enterBackGroundStamps() {
    return this._enterBackGroundStamps;
  }
  set enterBackGroundStamps(value) {
    this._enterBackGroundStamps = value;
  }

  /**
   * 当前点击的气泡红包Index：
   */
  private _popRedPackIndex = 0;
  get popRedPackIndex() {
    return this._popRedPackIndex;
  }
  set popRedPackIndex(value) {
    this._popRedPackIndex = value;
  }

  /**
   * 是否微信登陆过：
   */
  private _isLoginSuccess = 0;
  get isLoginSuccess() {
    return this._isLoginSuccess;
  }
  set isLoginSuccess(value) {
    this._isLoginSuccess = value;
  }

  /**
   * 提现列表信息：
   */
  private _exchangeList = null;
  get exchangeList() {
    return this._exchangeList;
  }
  set exchangeList(value) {
    this._exchangeList = value;
  }

  private _isCashOutFinguerShow = 1;
  get isCashOutFinguerShow() {
    return this._isCashOutFinguerShow;
  }
  set isCashOutFinguerShow(value) {
    this._isCashOutFinguerShow = value;
  }

  /**
   * 每日任务信息
   */
  private _dailyTaskInfo = [];
  get dailyTaskInfo() {
    return this._dailyTaskInfo;
  }
  set dailyTaskInfo(value) {
    this._dailyTaskInfo = value;
  }

  /**
   * 答题任务信息：
   */
  private _answerTaskInfo = [];
  get answerTaskInfo() {
    return this._answerTaskInfo;
  }
  set answerTaskInfo(value) {
    this._answerTaskInfo = value;
  }

  /**
   * 每日打卡任务信息：
   */
  private _dailySignTaskInfo = [];
  get dailySignTaskInfo() {
    return this._dailySignTaskInfo;
  }
  set dailySignTaskInfo(value) {
    this._dailySignTaskInfo = value;
  }

  private _videoTaskItem = null;
  get videoTaskItem() {
    return this._videoTaskItem;
  }
  set videoTaskItem(value) {
    this._videoTaskItem = value;
  }

  private _interstitialStamps = 0;
  get interstitialStamps() {
    return this._interstitialStamps;
  }
  set interstitialStamps(value) {
    this._interstitialStamps = value;
  }

  private _redPointAllInfo = null;
  get redPointAllInfo() {
    return this._redPointAllInfo;
  }
  set redPointAllInfo(value) {
    this._redPointAllInfo = value;
  }

  private _redPointSubTaskInfo = null;
  get redPointSubTaskInfo() {
    return this._redPointSubTaskInfo;
  }
  set redPointSubTaskInfo(value) {
    this._redPointSubTaskInfo = value;
  }

  /**
   * 当前关卡数：（暂时存放在本地）
   */
  private _currentLevel = 1;
  get currentLevel() {
    return this._currentLevel;
  }
  set currentLevel(value) {
    this._currentLevel = value;
  }

  /**
   * 累计答对题目数：
   */
  private _accumulateRightNums = 0;
  get accumulateRightNums() {
    return this._accumulateRightNums;
  }
  set accumulateRightNums(value) {
    this._accumulateRightNums = value;
  }

  constructor() {
    this.musicVolume = cc.sys.localStorage.getItem("musicVolume") == null ? 0.6 : cc.sys.localStorage.getItem("musicVolume");
    this.effectVolume = cc.sys.localStorage.getItem("effectVolume") == null ? 1 : cc.sys.localStorage.getItem("effectVolume");
    this.isShowAgereement = cc.sys.localStorage.getItem("isShowAgereement") == null ? true : false;
    this.isLoginSuccess = cc.sys.localStorage.getItem("isLoginSuccess") == null ? 0 : cc.sys.localStorage.getItem("isLoginSuccess");
    this.isCashOutFinguerShow = cc.sys.localStorage.getItem("isCashOutFinguerShow") == null ? 1 : cc.sys.localStorage.getItem("isCashOutFinguerShow");

    this.currentLevel = cc.sys.localStorage.getItem("currentLevel") == null ? 1 : cc.sys.localStorage.getItem("currentLevel");
    this.accumulateRightNums = cc.sys.localStorage.getItem("accumulateRightNums") == null ? 0 : cc.sys.localStorage.getItem("accumulateRightNums");
  }

  save() {
    cc.sys.localStorage.setItem("musicVolume", this.musicVolume);
    cc.sys.localStorage.setItem("effectVolume", this.effectVolume);
    cc.sys.localStorage.setItem("isShowAgereement", this.isShowAgereement);
    cc.sys.localStorage.setItem("isLoginSuccess", this.isLoginSuccess);
    cc.sys.localStorage.setItem("isCashOutFinguerShow", this.isCashOutFinguerShow);

    cc.sys.localStorage.setItem("currentLevel", this.currentLevel);
    cc.sys.localStorage.setItem("accumulateRightNums", this.accumulateRightNums);
  }

  removeStorage(name) {
    cc.sys.localStorage.removeItem(name);
  }

  removeAllData() {
    this.removeStorage("musicVolume");
    this.removeStorage("effectVolume");
    this.removeStorage("isShowAgereement");
    this.removeStorage("isLoginSuccess");
    this.removeStorage("isCashOutFinguerShow");

    this.removeStorage("currentLevel");
    this.removeStorage("accumulateRightNums");
  }

  /**
   * 根据json文件名称获取json数据：
   * @param name 
   */
  getJsonDataByFileName(name) {
    return this.jsonData[name];
  }
}
