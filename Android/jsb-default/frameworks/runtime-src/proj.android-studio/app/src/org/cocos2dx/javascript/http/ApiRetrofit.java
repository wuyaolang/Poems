package org.cocos2dx.javascript.http;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import retrofit2.Retrofit;
import retrofit2.adapter.rxjava2.RxJava2CallAdapterFactory;
import retrofit2.converter.gson.GsonConverterFactory;


public class ApiRetrofit extends BaseApiRetrofit {
    private static ApiRetrofit apiRet;
    private static CommonApi commonApi;
    private static CommonApi gameApi;
    private static CommonApi showApi;

    //本工程
    public static String commonUrl="http://activity.api.pangbaoapp.com/idiom-amu-api/";
    //小游戏
    //http://activity.api.pangbaoapp.com/idiom-amu-api/
    public static String gameUrl="http://h5.manager.wsljf.com/guessing-words-api/";
    private ApiRetrofit() {
        super();
        Gson gson = new GsonBuilder()
                .setLenient()
                .create();

        gameApi = new Retrofit.Builder()
                .baseUrl(gameUrl)
                .client(getClient())
                .addConverterFactory(GsonConverterFactory.create(gson))
                .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
                .build()
                .create(CommonApi.class);

        commonApi = new Retrofit.Builder()
                .baseUrl(commonUrl)
                .client(getClient())
                .addConverterFactory(GsonConverterFactory.create(gson))
                .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
                .build()
                .create(CommonApi.class);

//        showApi = new Retrofit.Builder()
//                .baseUrl(showUrl)
//                .client(getClient())
//                .addConverterFactory(GsonConverterFactory.create(gson))
//                .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
//                .build()
//                .create(CommonApi.class);
    }

    public static ApiRetrofit getInstance() {
        if (apiRet == null) {
            synchronized (ApiRetrofit.class) {
                if (apiRet == null) {
                    apiRet = new ApiRetrofit();
                }
            }
        }
        return apiRet;
    }

//   写死：productId：17058973-2c12-45e2-9594-2b1a98204b7e

//    public Observable<String> getTopLivePhoto(int pageSize, int page) {//String hotType, String dip,
//        return showApi.getTopLivePhoto( pageSize, page);
//    }

//    /**
//     *  用户信息
//     * @return
//     */
//    public Observable<UserInfoBean> getUserInfo() {//String hotType, String dip,
//        return commonApi.getUserInfo();
//    }

//    /**
//     * 加载新人奖励
//     * @return
//     */
//    public Observable<NewComeBean> newCome() {//String hotType, String dip,
//        return commonApi.newCome();
//    }

//    /**
//     * 领取新人奖励
//     * @param type
//     * @return
//     */
//    public Observable<NewComeGetBean> receiveReward(int type) {//String hotType, String dip,
//        return commonApi.receiveReward(type);
//    }

//    /**
//     * 猜成语 获取答题机会
//     * @param type
//     * @return
//     */
//    public Observable<TimeStartBean> timeStart(int type) {//String hotType, String dip,
//        return gameApi.timeStart(type);
//    }

//    /**
//     * 微信登录
//     * @param nickName
//     * @param avatar
//     * @param openId
//     * @param unionId
//     * @param gender
//     * @param country
//     * @param province
//     * @param city
//     * @return
//     */
//    public Observable<LoginWxBean> getWxData(String nickName, String avatar, String openId, String unionId, String gender, String country,
//                                             String province, String city) {
//        return commonApi.getWxData(nickName, avatar, openId, unionId, gender, country, province, city);
//    }

//    /**
//     * 微信退出登录
//     * @return
//     */
//    public Observable<NormalBooleanBean> logout() {
//        return commonApi.logout();
//    }

//    /**
//     * 开始观看广告
//     * @return
//     */
//    public Observable<NormalAdBean> advertStart() {
//        return commonApi.advertStart();
//    }

//    /**
//     * 关卡奖励领取
//     * @return
//     */
//    public Observable<NormalBooleanBean> checkpointReceive(int checkpoint, int gold, String identifier) {
//        return commonApi.checkpointReceive(checkpoint,gold,identifier);
//    }

//    /**
//     * 领取气泡金币
//     * @return
//     */
//    public Observable<NormalBean> bubbleReceive(String bubbleId, String identifier) {
//        return commonApi.bubbleReceive(bubbleId,identifier);
//    }

//    /**
//     * 关卡   红包以及遮挡字体元宝奖励  领取
//     * @return
//     */
//    public Observable<NormalIntBean> randGoldeceive(String id, String checkpoint, String identifier) {
//        return commonApi.randGoldeceive(id,checkpoint,identifier);
//    }

}
