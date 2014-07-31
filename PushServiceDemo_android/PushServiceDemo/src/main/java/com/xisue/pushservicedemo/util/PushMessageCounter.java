package com.xisue.pushservicedemo.util;

import android.content.Context;
import android.content.SharedPreferences;

/**
 *
 * 这个类用来保存收到的Message的custom id。
 *
 * Created by yinxiaoliu on 14-7-30.
 */
public class PushMessageCounter {

    public static final String SP_NAME = "PushMessageCounter";

    public static final String NO_KEY = "no.";

    public static void saveNo(Context context, int no) {
        SharedPreferences sharedPreferences = context.getSharedPreferences(SP_NAME, Context.MODE_APPEND);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putInt(NO_KEY, no);
        editor.commit();
    }

    public static int readNo(Context context) {
        SharedPreferences sharedPreferences = context.getSharedPreferences(SP_NAME, Context.MODE_APPEND);
        return sharedPreferences.getInt(NO_KEY, 0);
    }

}
