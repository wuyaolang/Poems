package org.cocos2dx.javascript.ads;

public interface AdCallBack {
    /**
     * 视频初始化成功
     */
    void videoLoadSuccess();
    /**
     * 插屏初始化成功
     */
    void adLoadSuccess();
    /**
     * 视频播放成功
     */
    void videoShowSuccess(String type);
    /**
     * 视频播放失败
     */
    void videoShowFailed(String type);
    /**
     * 插屏播放成功
     */
    void adShowSuccess(String type);

}
