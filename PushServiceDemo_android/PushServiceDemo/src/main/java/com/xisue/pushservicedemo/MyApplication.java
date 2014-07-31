package com.xisue.pushservicedemo;

import android.app.ActivityManager;
import android.app.Application;
import android.content.Context;
import android.util.Log;
import android.os.Process;

import com.xiaomi.channel.commonutils.logger.LoggerInterface;
import com.xiaomi.mipush.sdk.Constants;
import com.xiaomi.mipush.sdk.Logger;
import com.xiaomi.mipush.sdk.MiPushClient;

import java.util.List;

import cn.jpush.android.api.JPushInterface;

/**
 * Created by yinxiaoliu on 14-6-26.
 */
public class MyApplication extends Application {

    public static final String APP_ID = "2882303761517229295";
    public static final String APP_KEY = "5781722996295";
    public static final String TAG = "com.xisue.pushservicedemo";

    @Override
    public void onCreate() {
        super.onCreate();
//        JPushInterface.setDebugMode(true);
//        JPushInterface.init(this);

        //将push服务切换到正式服务器
        Constants.useOfficial();
        //初始化push推送服务
        if(shouldInit()) {
            MiPushClient.registerPush(this, APP_ID, APP_KEY);
            MiPushClient.subscribe(this, "all", null);
            MiPushClient.subscribe(this, "android", null);
        }
        //打开Log
        LoggerInterface newLogger = new LoggerInterface() {

            @Override
            public void setTag(String tag) {
                // ignore
            }

            @Override
            public void log(String content, Throwable t) {
                Log.d(TAG, content, t);
            }

            @Override
            public void log(String content) {
                Log.d(TAG, content);
            }
        };
        Logger.setLogger(this, newLogger);
    }

    private boolean shouldInit() {
        ActivityManager am = ((ActivityManager) getSystemService(Context.ACTIVITY_SERVICE));
        List<ActivityManager.RunningAppProcessInfo> processInfos = am.getRunningAppProcesses();
        String mainProcessName = getPackageName();
        int myPid = Process.myPid();
        for (ActivityManager.RunningAppProcessInfo info : processInfos) {
            if (info.pid == myPid && mainProcessName.equals(info.processName)) {
                return true;
            }
        }
        return false;
    }

}
