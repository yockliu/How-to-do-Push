package com.xisue.pushservicedemo.mpush;

import android.content.Context;
import android.text.TextUtils;
import android.util.Log;

import com.xiaomi.mipush.sdk.MiPushClient;
import com.xiaomi.mipush.sdk.MiPushCommandMessage;
import com.xiaomi.mipush.sdk.MiPushMessage;
import com.xiaomi.mipush.sdk.PushMessageReceiver;
import com.xisue.pushservicedemo.util.PushMessageCounter;

import java.util.List;
import java.util.Map;

/**
 * Created by yinxiaoliu on 14-6-26.
 */
public class DemoMessageReceiver extends PushMessageReceiver {

    private static final String TAG = "MiMessageReceiver";

    private String mRegId;
    private long mResultCode = -1;
    private String mReason;
    private String mCommand;
    private String mMessage;
    private String mTopic;
    private String mAlias;
    private String mStartTime;
    private String mEndTime;

    @Override
    public void onCommandResult(Context context, MiPushCommandMessage miPushCommandMessage) {
        String command = miPushCommandMessage.getCommand();
        List<String> arguments = miPushCommandMessage.getCommandArguments();
        if(arguments != null) {
            if(MiPushClient.COMMAND_REGISTER.equals(command)
                    && arguments.size() == 1) {
                mRegId = arguments.get(0);
            } else if((MiPushClient.COMMAND_SET_ALIAS .equals(command)
                    || MiPushClient.COMMAND_UNSET_ALIAS.equals(command))
                    && arguments.size() == 1) {
                mAlias = arguments.get(0);
            } else if((MiPushClient.COMMAND_SUBSCRIBE_TOPIC.equals(command)
                    || MiPushClient.COMMAND_UNSUBSCRIBE_TOPIC.equals(command))
                    && arguments.size() == 1) {
                mTopic = arguments.get(0);
            } else if(MiPushClient.COMMAND_SET_ACCEPT_TIME.equals(command)
                    && arguments.size() == 2) {
                mStartTime = arguments.get(0);
                mEndTime = arguments.get(1);
            }
        }
        mResultCode = miPushCommandMessage.getResultCode();
        mReason = miPushCommandMessage.getReason();
    }

    /**
     * 这里是小米接受消息的关键
     *
     * 如果是显示通知的推送，则在打开通知后调用这里
     * 如果是不现实通知的推送，则在推送消息到达时就调用这里
     *
     * @param context
     * @param miPushMessage
     */
    @Override
    public void onReceiveMessage(Context context, MiPushMessage miPushMessage) {

        Log.v(TAG, "..." + miPushMessage.getTopic());

        Log.v(TAG, "..." + miPushMessage.getTitle());
        Log.v(TAG, "..." + miPushMessage.getDescription());

        Log.v(TAG, "..." + miPushMessage.getContent());

        Log.v(TAG, "..." + miPushMessage.getPassThrough()); // 显示消息 0; 不显示消息 1.
        Log.v(TAG, "..." + miPushMessage.getExtra());

        // 首先判断静默推送
        // 然后判断custom id是否是新的
        if (miPushMessage.getPassThrough() == 1) {
            int last_message_no = PushMessageCounter.readNo(context);

            Map<String, String> extra = miPushMessage.getExtra();
            int custom_id = Integer.parseInt(extra.get("custom_id"));

            if (custom_id <= last_message_no) {
                return;
            } else {
                PushMessageCounter.saveNo(context, custom_id);
            }
        }

        MiPushCenter.onPush(miPushMessage);

        mMessage = miPushMessage.getContent();
        if(!TextUtils.isEmpty(miPushMessage.getTopic())) {
            mTopic=miPushMessage.getTopic();
        } else if(!TextUtils.isEmpty(miPushMessage.getAlias())) {
            mAlias=miPushMessage.getAlias();
        }
    }
}
