package com.xisue.pushservicedemo.baidu;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.baidu.frontia.api.FrontiaPushMessageReceiver;

import java.util.List;

/**
 * Created by yinxiaoliu on 14-6-25.
 */
public class MyReceiver extends FrontiaPushMessageReceiver {

    public static final String TAG = "MyReceiver";

    @Override
    public void onBind(Context context, int errorCode, String appid, String userId, String channelId, String requestId) {
        Log.v(TAG, "================================");
    }

    @Override
    public void onUnbind(Context context, int i, String s) {

    }

    @Override
    public void onSetTags(Context context, int i, List<String> strings, List<String> strings2, String s) {

    }

    @Override
    public void onDelTags(Context context, int i, List<String> strings, List<String> strings2, String s) {

    }

    @Override
    public void onListTags(Context context, int i, List<String> strings, String s) {

    }

    @Override
    public void onMessage(Context context, String message, String customContentString) {

    }

    @Override
    public void onNotificationClicked(Context context, String title, String description, String customContentString) {

    }

}
