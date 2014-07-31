package com.xisue.pushservicedemo.mpush;

import com.xiaomi.mipush.sdk.MiPushMessage;

/**
 * Created by yinxiaoliu on 14-7-28.
 */
public class MiPushCenter {

    public static MiPushInterface pushInterface;

    public static void onPush(MiPushMessage miPushMessage) {
        if (pushInterface != null) {
            pushInterface.onPush(miPushMessage);
        }
    }

}
