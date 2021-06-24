package org.cocos2dx.javascript.utils;

import android.util.Log;

import org.cocos2dx.javascript.http.ApiRetrofit;

import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.functions.Consumer;
import io.reactivex.schedulers.Schedulers;

public class NetModel {
//    private static final String TAG = "NetModel";
//    public void getUserInfo(DataListener listener){
//        ApiRetrofit.getInstance().getUserInfo()
//                .subscribeOn(Schedulers.io())
//                .observeOn(AndroidSchedulers.mainThread())
//                .subscribe(new Consumer<UserInfoBean>() {
//                    @Override
//                    public void accept(UserInfoBean bean) throws Exception {
//                        if (listener!=null){
//                            listener.success(bean);
//                        }
//                    }
//                }, new Consumer<Throwable>() {
//                    @Override
//                    public void accept(Throwable throwable) throws Exception {
//                        if (listener!=null){
//                            listener.error();
//                        }
//                    }
//                });
//    }

//    public void newCome(DataListener listener){
//        ApiRetrofit.getInstance().newCome()
//                .subscribeOn(Schedulers.io())
//                .observeOn(AndroidSchedulers.mainThread())
//                .subscribe(new Consumer<NewComeBean>() {
//                    @Override
//                    public void accept(NewComeBean bean) throws Exception {
//                        if (listener!=null){
//                            listener.success(bean);
//                        }
//                    }
//                }, new Consumer<Throwable>() {
//                    @Override
//                    public void accept(Throwable throwable) throws Exception {
//                        if (listener!=null){
//                            listener.error();
//                        }
//                    }
//                });
//    }

//    public void receiveReward(int type,DataListener listener){
//        ApiRetrofit.getInstance().receiveReward(type)
//                .subscribeOn(Schedulers.io())
//                .observeOn(AndroidSchedulers.mainThread())
//                .subscribe(new Consumer<NewComeGetBean>() {
//                    @Override
//                    public void accept(NewComeGetBean bean) throws Exception {
//                        if (listener!=null){
//                            listener.success(bean);
//                        }
//                    }
//                }, new Consumer<Throwable>() {
//                    @Override
//                    public void accept(Throwable throwable) throws Exception {
//                        if (listener!=null){
//                            listener.error();
//                        }
//                    }
//                });
//    }

//    public void timeStart(int type,DataListener listener){
//        ApiRetrofit.getInstance().timeStart(type)
//                .subscribeOn(Schedulers.io())
//                .observeOn(AndroidSchedulers.mainThread())
//                .subscribe(new Consumer<TimeStartBean>() {
//                    @Override
//                    public void accept(TimeStartBean bean) throws Exception {
//                        if (listener!=null){
//                            listener.success(bean);
//                        }
//                    }
//                }, new Consumer<Throwable>() {
//                    @Override
//                    public void accept(Throwable throwable) throws Exception {
//                        if (listener!=null){
//                            listener.error();
//                        }
//                    }
//                });
//    }

//    public void getWxData(String nickName, String avatar, String openId, String unionId, String gender, String country,
//                          String province, String city, DataListener mListener) {
//        ApiRetrofit.getInstance().getWxData(nickName, avatar, openId, unionId, gender, country, province, city)
//                .subscribeOn(Schedulers.io())
//                .observeOn(AndroidSchedulers.mainThread())
//                .subscribe(resultBean -> {
//                    Log.d(TAG, "getWxData: "+resultBean);
//                    if (resultBean!=null){
//                        mListener.success(resultBean);
//                    }else {
//                        mListener.error();
//                    }
//                }, new Consumer<Throwable>() {
//                    @Override
//                    public void accept(Throwable throwable) throws Exception {
//                        Log.d(TAG, "accept: "+throwable);
//                        mListener.error();
//                    }
//                });
//
//    }

//    public void logout(DataListener mListener) {
//        ApiRetrofit.getInstance().logout()
//                .subscribeOn(Schedulers.io())
//                .observeOn(AndroidSchedulers.mainThread())
//                .subscribe(resultBean -> {
//                    if (resultBean!=null &&resultBean.getCode()==0){
//                        mListener.success("0");
//                    }
//                }, new Consumer<Throwable>() {
//                    @Override
//                    public void accept(Throwable throwable) throws Exception {
//                        mListener.error();
//                    }
//                });
//    }

//    public void advertStart(DataListener mListener) {
//        ApiRetrofit.getInstance().advertStart()
//                .subscribeOn(Schedulers.io())
//                .observeOn(AndroidSchedulers.mainThread())
//                .subscribe(resultBean -> {
//                    if (resultBean!=null &&resultBean.getCode()==0){
//                        mListener.success(resultBean);
//                    }else {
//                        mListener.error();
//                    }
//                }, new Consumer<Throwable>() {
//                    @Override
//                    public void accept(Throwable throwable) throws Exception {
//                        mListener.error();
//                    }
//                });
//    }

//    public void checkpointReceive(int checkpoint,int gold,String identifier,DataListener mListener) {
//        ApiRetrofit.getInstance().checkpointReceive(checkpoint,gold,identifier)
//                .subscribeOn(Schedulers.io())
//                .observeOn(AndroidSchedulers.mainThread())
//                .subscribe(resultBean -> {
//                    if (resultBean!=null &&resultBean.getCode()==0){
//                        mListener.success(resultBean);
//                    }else {
//                        mListener.error();
//                    }
//                }, new Consumer<Throwable>() {
//                    @Override
//                    public void accept(Throwable throwable) throws Exception {
//                        mListener.error();
//                    }
//                });
//    }

//    public void bubbleReceive(String bubbleId,String identifier,DataListener mListener) {
//        ApiRetrofit.getInstance().bubbleReceive(bubbleId,identifier)
//                .subscribeOn(Schedulers.io())
//                .observeOn(AndroidSchedulers.mainThread())
//                .subscribe(resultBean -> {
//                    if (resultBean!=null){
//                        mListener.success(resultBean);
//                    }else {
//                        mListener.error();
//                    }
//                }, new Consumer<Throwable>() {
//                    @Override
//                    public void accept(Throwable throwable) throws Exception {
//                        mListener.error();
//                    }
//                });
//    }

//    public void randGoldeceive(String id,String checkpoint,String identifier,DataListener mListener) {
//        ApiRetrofit.getInstance().randGoldeceive(id,checkpoint,identifier)
//                .subscribeOn(Schedulers.io())
//                .observeOn(AndroidSchedulers.mainThread())
//                .subscribe(resultBean -> {
//                    if (resultBean!=null ){
//                        mListener.success(resultBean);
//                    }else {
//                        mListener.error();
//                    }
//                }, new Consumer<Throwable>() {
//                    @Override
//                    public void accept(Throwable throwable) throws Exception {
//                        mListener.error();
//                    }
//                });
//    }

//   public interface DataListener{
//        void success(Object o);
//        void error();
//    }
}
