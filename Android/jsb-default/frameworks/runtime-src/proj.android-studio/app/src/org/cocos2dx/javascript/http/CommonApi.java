package org.cocos2dx.javascript.http;

import io.reactivex.Observable;
import retrofit2.http.GET;
import retrofit2.http.Query;

public interface CommonApi {

    @GET("funny/list.do")
    Observable<String> getTopLivePhoto(
            @Query("pageSize") int pageSize,
            @Query("page") int page);

//    @GET("mine/info.do")
//    Observable<UserInfoBean> getUserInfo();

//    @GET("gold/welfare/newcome.do")
//    Observable<NewComeBean> newCome();

//    @POST("gold/welfare/receive.do")
//    Observable<NewComeGetBean> receiveReward(@Query("type") int type);

//    @POST("subject/add/times/start.do")
//    Observable<TimeStartBean> timeStart(@Query("type") int type);

//    @POST("wechat/login.do")
//    Observable<LoginWxBean> getWxData(
//            @Query("nickName") String nickName,
//            @Query("avatar") String avatar,
//            @Query("openId") String openId,
//            @Query("unionId") String unionId,
//            @Query("gender") String gender,
//            @Query("country") String country,
//            @Query("province") String province,
//            @Query("city") String city);

//    @POST("wechat/logout.do")
//    Observable<NormalBooleanBean> logout();

//    @POST("view/advert/start.do")
//    Observable<NormalAdBean> advertStart();
//
//    @POST("checkpoint/receive.do")
//    Observable<NormalBooleanBean> checkpointReceive(@Query("checkpoint") int checkpoint,
//                                                    @Query("gold") int gold, @Query("identifier") String identifier);

//    @POST("bubble/receive.do")
//    Observable<NormalBean> bubbleReceive(@Query("bubbleId") String bubbleId, @Query("identifier") String identifier);

//    @POST("checkpoint/randGold/receive.do")
//    Observable<NormalIntBean> randGoldeceive(@Query("id") String id, @Query("checkpoint") String checkpoint, @Query("identifier") String identifier);
}
