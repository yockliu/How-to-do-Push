package com.xisue.pushservicedemo.avos;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.xisue.pushservicedemo.util.PushMessageCounter;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;

/**
 * Created by yinxiaoliu on 14-7-30.
 */
public class MyCustomReceiver extends BroadcastReceiver {

    private static final String TAG = "AVOSCustomReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.v(TAG, "Get Broadcat");
        try {
            String action = intent.getAction();
            String channel = intent.getExtras().getString("com.avos.avoscloud.Channel");
            JSONObject json = new JSONObject(intent.getExtras().getString("com.avos.avoscloud.Data"));

            Log.v(TAG, "got action " + action + " on channel " + channel + " with:");
            Iterator itr = json.keys();
            while (itr.hasNext()) {
                String key = (String) itr.next();
                Log.v(TAG, "..." + key + " => " + json.getString(key));
            }

            // 首先判断静默推送
            // 然后判断custom id是否是新的
            if (action.equals("com.avos.UPDATE_STATUS")) {
                int last_message_no = PushMessageCounter.readNo(context);

                JSONObject custom = json.optJSONObject("custom");
                if (custom != null) {
                    int custom_id = custom.optInt("id");
                    if (custom_id <= last_message_no) {
                        return;
                    } else {
                        PushMessageCounter.saveNo(context, custom_id);
                    }
                }
            }

        } catch (JSONException e) {
            Log.v(TAG, "JSONException: " + e.getMessage());
        }
    }

}
