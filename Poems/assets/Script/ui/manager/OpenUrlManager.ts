import GameApp from "../../GameApp";
import { ActionNet } from "../../manager/httpTools/Action";
import Dictionary from "../../manager/httpTools/Dictionary";
import { IDictionary } from "../../manager/httpTools/IDictionary";
import CocosSDK from "../../sdk/CocosSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class OpenUrlManager {
    private static _ins: OpenUrlManager;

    public static get Instance(): OpenUrlManager {
        if (!this._ins) {
            this._ins = new OpenUrlManager();
        }
        return this._ins;
    }

    private DomainName = "http://pcom.changliuabc.com/smba-poems-api";

    private doActionJson(url: string, action?: ActionNet, data?: IDictionary<string, any>, method: string = "POST") {
        return;
        cc.log("请求接口url:===========" + url);
        if (CocosSDK.getUserToken()) {
            cc.log("当前是否拿到对应的token值 ===========" + CocosSDK.getUserToken())
            GameApp.Instance.httpManager.LoadJson(url, action, data, method);
        } else {
            cc.log("当前是否拿到对应的token值 ===========" + CocosSDK.getUserToken())
        }
    }

    /**
     * 获取一个上传用的结构体
     */
    private DefaultData() {
        const dic = new Dictionary<string, any>();
        if (!cc.sys.isNative) {
            dic.Add("channel", "test1");
            dic.Add("vestId", "d1be01ee-2fcd-441a-93af-a414d288374d");
            dic.Add("productId", '0815f5b5-923a-4688-856b-bcedad80c2df');
            dic.Add("version", '1');
            dic.Add("osType", 'android');
            dic.Add("udid", "baedf5db-137f-0aa6-f4fe-ffff7dab9388");
            dic.Add("token", "416d9d78-5f68-4006-a930-c63fc0666acb");
        }
        return dic;
    }

    /**
     * 绑定前校验
     * @param action 
     */
    public haveBind(action?: ActionNet) {
        let data = this.DefaultData();
        this.doActionJson(`http://pay.wsljf.xyz/pay-api/withdraw/haveBind.do`, action, data, "GET");
    }

    /**
     * 滑块验证开始
     * @param action 
     * @param chain 
     * @param position 
     */
    public startSlide(action?: ActionNet, chain?: string, position?: string) {
        let data = this.DefaultData();
        data.Add("chain", String(chain));
        data.Add("position", String(position));
        this.doActionJson(`http://pay.wsljf.xyz/pay-api/withdraw/slider/start.do`, action, data, "POST");
    }

    /**
     * 滑块验证结束
     * @param action 
     * @param chain 
     * @param position 
     */
    public endSlide(action?: ActionNet, chain?: string, position?: string) {
        let data = this.DefaultData();
        data.Add("chain", String(chain));
        data.Add("position", String(position));
        this.doActionJson(`http://pay.wsljf.xyz/pay-api/withdraw/slider/end.do`, action, data, "POST");
    }

    /**
     * 绑定手机并发送验证码
     * @param action 
     * @param chain 
     * @param phone 
     */
    public bindSendValidateCode(action?: ActionNet, chain?: string, phone?: string) {
        let data = this.DefaultData();
        data.Add("chain", String(chain));
        data.Add("phone", String(phone));
        this.doActionJson(`http://pay.wsljf.xyz/pay-api/withdraw/bindPhone/sendValidateCode.do`, action, data, "POST");
    }

    /**
     * 提现发送验证码
     * @param action 
     * @param chain 
     */
    public cashSendValidateCode(action?: ActionNet, chain?: string) {
        let data = this.DefaultData();
        data.Add("chain", String(chain));
        this.doActionJson(`http://pay.wsljf.xyz/pay-api/withdraw/sendValidateCode.do`, action, data, "POST");
    }

    /**
     * 验证验证码
     * @param action 
     * @param chain 
     * @param validateCode 
     */
    public validateSmsCode(action: ActionNet, chain: string, validateCode: string, phone: string = "") {
        let data = this.DefaultData();
        data.Add("chain", String(chain));
        data.Add("validateCode", String(validateCode));
        if (phone != "") {
            data.Add("phone", String(phone));
        }
        this.doActionJson(`http://pay.wsljf.xyz/pay-api/withdraw/validateSmsCode.do`, action, data, "POST");
    }

    /**
     * 提现前校验
     * @param action 
     * @param chain 
     */
    public cashValidate(action?: ActionNet, chain?: string) {
        let data = this.DefaultData();
        data.Add("chain", String(chain));
        this.doActionJson(`http://pay.wsljf.xyz/pay-api/withdraw/before/apply/validate.do`, action, data, "POST");
    }


    public UserGameInfo(action?: ActionNet) {
        let data = this.DefaultData();
        this.doActionJson(`${this.DomainName}/api/guess/getUserGuessInfoAndGuessLevel.do`, action, data, "POST");
    }

    /**
     * 微信登录
     * @param action
     * @param gender
     * @param thirdType
     * @param platformType
     * @param city
     * @param province
     * @param country
     * @param uniqueId
     */
    public userLogin(action?: ActionNet, nickName?: string, openId?: string, unionId?: string, avatar?: string) {
        let data = this.DefaultData();
        data.Add("nickName", String(nickName));
        data.Add("openId", String(openId));
        data.Add("unionId", String(unionId));
        data.Add("avatar", String(avatar));
        this.doActionJson(`${this.DomainName}/wechat/login.do`, action, data, "POST");
    }


    /**
     * app 退出
     * @param action
     */
    public logout(action?: ActionNet) {
        let data = this.DefaultData();
        this.doActionJson(`${this.DomainName}/wechat/logout.do`, action, data, "POST");
    }

    /**
     * 用户账号注销：
     * @param action 
     */
    userLogoff(action?: ActionNet) {
        let data = this.DefaultData();
        this.doActionJson(`${this.DomainName}/wechat/logoff.do`, action, data, "POST");
    }

    /**
     * 获取用户信息：
     * @param action 
     */
    getUserInfo(action?: ActionNet) {
        let data = this.DefaultData();
        this.doActionJson(`${this.DomainName}/user/info.do`, action, data, "POST");
    }

    /**
     * 加载答题信息：
     * @param action 
     */
    loadAnswerInfo(action?: ActionNet) {
        let data = this.DefaultData();
        this.doActionJson(`${this.DomainName}/answer/load.do`, action, data, "POST");
    }

    /**
     * 校验答题结果：
     * @param action 
     * @param id 
     * @param index 
     */
    checkAnswerResult(action?: ActionNet, id?: string, index?: string) {
        let data = this.DefaultData();
        data.Add("id", String(id));
        data.Add("index", String(index));
        this.doActionJson(`${this.DomainName}/answer/checkAnswer.do`, action, data, "POST");
    }

    /**
     * 不中断连对
     * @param action 
     */
    nonStopCombo(action?: ActionNet) {
        let data = this.DefaultData();
        this.doActionJson(`${this.DomainName}/answer/uninterruptPaired.do`, action, data, "POST");
    }

    /**
     * 获取气泡红包列表：
     * @param action 
     */
    getPopRedList(action?: ActionNet) {
        let data = this.DefaultData();
        this.doActionJson(`${this.DomainName}/bubble/loadBubble.do`, action, data, "POST");
    }

    /**
     * 领取气泡红包：
     * @param action 
     */
    recievePopRed(action?: ActionNet, id?: string) {
        let data = this.DefaultData();
        data.Add("id", String(id));
        this.doActionJson(`${this.DomainName}/bubble/receiveBubble.do`, action, data, "POST");
    }

    /**
     * 获取红包：
     * @param action 
     * @param type 
     */
    gainRedPack(action?: ActionNet, type?: string) {
        let data = this.DefaultData();
        data.Add("type", String(type));
        this.doActionJson(`${this.DomainName}/golds/redEnvelopes.do`, action, data, "POST");
    }

    /**
     * 领取红包：
     * @param action 
     */
    recieveRedPack(action?: ActionNet, type?: string, id?: string, doubleReceive?: string) {
        let data = this.DefaultData();
        data.Add("type", String(type));
        data.Add("id", String(id));
        data.Add("doubleReceive", Number(doubleReceive));
        this.doActionJson(`${this.DomainName}/golds/receiveGolds.do`, action, data, "POST");
    }

    /**     
   * 道具列表
   * @param action 
   * @param id 
   * @param type 
   */
    getPropList(action: ActionNet, type?: string, id?: string) {
        let data = this.DefaultData();
        data.Add("type", Number(type));
        data.Add("id", Number(id));
        this.doActionJson(`${this.DomainName}/props/getProp.do`, action, data, "POST");
    }

    /**
     * 使用道具
     * @param action 
     * @param id 
     * @param number 
     */
    useProp(action?: ActionNet, id?: string, number?: string) {
        let data = this.DefaultData();
        data.Add("id", Number(id));
        data.Add("number", Number(number));
        this.doActionJson(`${this.DomainName}/props/useProp.do`, action, data, "POST");
    }

    /**
     * 新增道具
     * @param action 
     * @param id 
     * @param number 
     */
    addProp(action?: ActionNet, id?: string, number?: string) {
        let data = this.DefaultData();
        data.Add("id", Number(id));
        data.Add("number", Number(number));
        this.doActionJson(`${this.DomainName}/props/addProp.do`, action, data, "POST");
    }

    /**
    * 提现列表
    * @param action
    */
    exchangeList(action?: ActionNet) {
        let data = this.DefaultData();
        this.doActionJson(`${this.DomainName}/withdrawal/load.do`, action, data, "POST");
    }

    /**
     * 提现接口
     * @param action 
     * @param id 
     * @param chain 
     * @param deviceToken 
     */
    cashOutExchange(action?: ActionNet, id?: string, chain?: string, deviceToken?: string) {
        let data = this.DefaultData();
        data.Add("id", String(id));
        data.Add("chain", String(chain));
        data.Add("deviceToken", String(deviceToken));
        this.doActionJson(`${this.DomainName}/withdrawal/exchange.do`, action, data, "POST");
    }

    /**
     * 提现记录
     * @param action 
     */
    exchangeRecord(action?: ActionNet, type?: string) {
        let data = this.DefaultData();
        data.Add("type", Number(type));
        this.doActionJson(`${this.DomainName}/withdrawal/exchangeRecord.do`, action, data, "POST");
    }

    /**
     * 获取提现列表：
     * @param action 
     */
    getTaskList(action?: ActionNet) {
        let data = this.DefaultData();
        this.doActionJson(`${this.DomainName}/tasks/taskLoad.do`, action, data, "POST");
    }

    /**
     * 领取任务奖励：
     * @param action 
     * @param taskId 
     */
    recieveTaskReward(action?: ActionNet, taskId?: string, doubleReceive?: string) {
        let data = this.DefaultData();
        data.Add("taskId", String(taskId));
        data.Add("doubleReceive", String(doubleReceive));
        this.doActionJson(`${this.DomainName}/tasks/taskRewardReceive.do`, action, data, "POST");
    }

    /**
     * 获取每日打卡列表：
     * @param action 
     */
    getDailySignList(action?: ActionNet) {
        let data = this.DefaultData();
        this.doActionJson(`${this.DomainName}/activity/clockInDayLoad.do`, action, data, "POST");
    }

    /**
     * 领取每日打卡奖励：
     * @param action 
     * @param id 
     */
    recieveDailySignReward(action?: ActionNet, id?: string, doubleReceive?: string) {
        let data = this.DefaultData();
        data.Add("id", String(id));
        data.Add("doubleReceive", String(doubleReceive));
        this.doActionJson(`${this.DomainName}/activity/receiveClockInDay.do`, action, data, "POST");
    }
    /**
     * 兑换金币：
     * @param action 
     */
    exchangeGold(action?: ActionNet) {
        let data = this.DefaultData();
        this.doActionJson(`${this.DomainName}/golds/moneyToGolds.do`, action, data, "POST");
    }

    /**
     * 看视频记录
     * @param action 
     * @param source 
     */
    addVideo(action?: ActionNet, source?: string) {
        let data = this.DefaultData();
        data.Add("source", String(source));
        this.doActionJson(`${this.DomainName}/adVideo/addAdVideo.do`, action, data, "POST");
    }
}
