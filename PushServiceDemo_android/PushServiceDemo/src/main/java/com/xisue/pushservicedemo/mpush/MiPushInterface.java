package com.xisue.pushservicedemo.mpush;

import com.xiaomi.mipush.sdk.MiPushMessage;

/**
 * Created by yinxiaoliu on 14-7-28.
 */
public interface MiPushInterface {

    public void onPush(MiPushMessage miPushMessage);

}
