package org.cocos2dx.javascript.http;

import android.util.Log;

import com.common.theone.https.RequestInterceptor;

import com.common.theone.utils.ConfigUtils;

import org.cocos2dx.javascript.utils.SpUtils;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

import okhttp3.HttpUrl;
import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.ResponseBody;

public class BaseApiRetrofit {

    private final OkHttpClient mClient;

    public OkHttpClient getClient() {
        return mClient;
    }

    public BaseApiRetrofit() {
        mClient = new OkHttpClient.Builder()
                .connectTimeout(20, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .writeTimeout(30, TimeUnit.SECONDS)
                .addInterceptor(new HeaderControlInterceptor())
                .addInterceptor(new TokenInterceptord())
                .addInterceptor(new LoggingInterceptor())
                .addInterceptor(new RequestInterceptor())
                .build();
    }

    /**
     * header配置
     */
    class HeaderControlInterceptor implements Interceptor {
        @Override
        public Response intercept(Chain chain) throws IOException {
            Request request = chain.request()
                    .newBuilder()
                    .addHeader("Content-Type", "application/json; charset=utf-8")
                    .build();
            return chain.proceed(request);
        }
    }

    /**
     *
     */
    class LoggingInterceptor implements Interceptor {
        @Override
        public Response intercept(Chain chain) throws IOException {
            //这个chain里面包含了request和response，所以你要什么都可以从这里拿
            Request request = chain.request();
            long t1 = System.currentTimeMillis();//请求发起的时间
            Log.d("发送请求 %s on %s%n%s", request.url()+"***"+chain.connection()+"***"+ request.headers());
            Response response = chain.proceed(request);
            long t2 = System.currentTimeMillis();

            long t3 = t2 - t1;
            Log.e("t3==", t3 + "");
            ResponseBody responseBody = response.peekBody(1024 * 1024);
            Log.d("接收响应:",
                    response.request().url()+"***"+
                            responseBody.string()+"***"+(t2 - t1) / 1e6d+"***"+response.headers());
            return response;
        }
    }

    /**
     * 添加公共参数
     */
    public class TokenInterceptord implements Interceptor {
        private final String TAG = "respond";

        @Override
        public Response intercept(Chain chain) throws IOException {
            Request oldRequest = chain.request();
            Response response = null;

            // 新的请求,添加参数
            Request newRequest = addParam(oldRequest);
            response = chain.proceed(newRequest);

            ResponseBody value = response.body();
            byte[] resp = value.bytes();
            response = response.newBuilder()
                    .body(ResponseBody.create(null, resp))
                    .build();
            return response;
        }

        /**
         * 添加公共参数
         *
         * @param oldRequest
         * @return
         */
        private Request addParam(Request oldRequest) {
            HttpUrl.Builder builder;
            if (oldRequest.url().toString().contains("doupingit")) {
                builder = oldRequest.url()
                        .newBuilder()
                        .setQueryParameter("vestId", ConfigUtils.getVestId())
                        .setQueryParameter("productId", ConfigUtils.getProductId())
                        .setQueryParameter("phoneType", ConfigUtils.getPhoneType())
                        . setQueryParameter("osType", ConfigUtils.getPhoneType())
                        .setQueryParameter("channel", ConfigUtils.getChannel())
                        .setQueryParameter("udid", ConfigUtils.getIMEI())
                        .setQueryParameter("version", ConfigUtils.getVersionCode())
                        .setQueryParameter("uId", ConfigUtils.getIMEI())
                        .setQueryParameter("token", SpUtils.getLoginToken())
                   ;
            }else {
                builder = oldRequest.url()
                        .newBuilder()
                        .setQueryParameter("vestId", ConfigUtils.getVestId())
                        .setQueryParameter("productId", ConfigUtils.getProductId())
//                        .setQueryParameter("tt", ConfigUtils.getTT())
                        . setQueryParameter("osType", ConfigUtils.getPhoneType())
                        .setQueryParameter("channel", ConfigUtils.getChannel())
                        .setQueryParameter("udid", ConfigUtils.getIMEI())
                        .setQueryParameter("version", ConfigUtils.getVersionCode())
                        .setQueryParameter("uId", ConfigUtils.getIMEI())
                        .setQueryParameter("token", SpUtils.getLoginToken())
                       ;
            }
            Request newRequest = oldRequest.newBuilder()
                    .method(oldRequest.method(), oldRequest.body())
                    .url(builder.build())
                    .build();
            return newRequest;
        }
    }


}