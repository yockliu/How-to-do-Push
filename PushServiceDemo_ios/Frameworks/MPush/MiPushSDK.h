//
//  MiPushSDK.h
//  MiPushSDK
//
//  Created by shen yang on 14-3-6.
//  Copyright (c) 2014年 Xiaomi. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@protocol MiPushSDKDelegate <NSObject>

@optional

/**
 * MiPushSDK 请求结果回调
 *
 * MiPushSDK的所有请求的为异步操作, 用户需监听此方法.
 *
 * @param
 *     selector: 请求的方法
 *     data: 返回结果字典
 */
- (void)miPushRequestSuccWithSelector:(NSString *)selector data:(NSDictionary *)data;
- (void)miPushRequestErrWithSelector:(NSString *)selector error:(int)error data:(NSDictionary *)data;

@end


@interface MiPushSDK : NSObject

/**
 * 客户端注册设备
 */
+ (void)registerMiPush:(id<MiPushSDKDelegate>)delegate;


/**
 * 客户端设备注销
 */
+ (void)unregisterMiPush;


/**
 * 绑定 PushDeviceToken
 *
 * NOTE: 有时Apple会重新分配token, 所以为保证消息可达,
 * 必须在系统application:didRegisterForRemoteNotificationsWithDeviceToken:回调中,
 * 重复调用此方法. SDK内部会处理是否重新上传服务器.
 *
 * @param 
 *     deviceToken: AppDelegate中,PUSH注册成功后,
 *                  系统回调didRegisterForRemoteNotificationsWithDeviceToken
 */
+ (void)bindDeviceToken:(NSData *)deviceToken;


/**
 * 客户端设置别名
 *
 * @param
 *     alias: 别名 (length:128)
 */
+ (void)setAlias:(NSString *)alias;

/**
 * 客户端取消别名
 *
 * @param
 *     alias: 别名 (length:128)
 */
+ (void)unsetAlias:(NSString *)alias;


/**
 * 客户端设置主题
 *
 * @param
 *     subscribe: 主题类型描述
 */
+ (void)subscribe:(NSString *)topic;

/**
 * 客户端取消主题
 *
 * @param
 *     subscribe: 主题类型描述
 */
+ (void)unsubscribe:(NSString *)topic;


/**
 * 统计客户端 通过push开启app行为
 * 如果, 你想使用服务器帮你统计你app的点击率请自行调用此方法
 * 方法放到:application:didReceiveRemoteNotification:回调中.
 * @param 
 *      messageId:Payload里面对应的miid参数
 */
+ (void)openAppNotify:(NSString *)messageId;

@end
