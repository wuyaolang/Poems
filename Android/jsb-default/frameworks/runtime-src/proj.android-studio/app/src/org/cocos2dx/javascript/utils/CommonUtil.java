package org.cocos2dx.javascript.utils;

import android.content.Context;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;

public class CommonUtil {
    // post请求
    public static String sendPostServer(String http, String data) {

        String result = "";
        try {
            StringBuffer rval = new StringBuffer();
            /*if (!http.contains("?")) {
                http = http + "?"+data;
            }else{
                http = http + "&"+data;
            }*/
            URL url = new URL(http);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setConnectTimeout(20000);
            conn.setReadTimeout(20000);
            conn.setDoOutput(true);
            conn.setDoInput(true);
            conn.connect();
            // 传送数据
            if (data != null && !"".equals(data)) {
                OutputStream os = conn.getOutputStream();
                OutputStreamWriter out = new OutputStreamWriter(os);
                BufferedWriter bw = new BufferedWriter(out);
                bw.write(data);
                bw.flush();
                bw.close();
                out.close();
                os.close();
            }

            // 接收数据
            if (conn.getResponseCode() == 200) {
                InputStream is = conn.getInputStream();
                InputStreamReader isr = new InputStreamReader(is);
                BufferedReader br = new BufferedReader(isr);
                String line;
                while ((line = br.readLine()) != null) {
                    rval.append(line).append(
                            System.getProperty("line.separator")); // 添加换行符，屏蔽了
                    // Windows和Linux的区别
                    // ,更保险一些
                }

                br.close();
                isr.close();
                is.close();
            }
            conn.disconnect();
            result = rval.toString().trim();
        } catch (Exception e) {
            e.printStackTrace();
        } catch (Error error) {
        }

        return result;
    }






}
