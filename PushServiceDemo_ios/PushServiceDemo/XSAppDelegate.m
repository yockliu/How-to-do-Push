//
//  XSAppDelegate.m
//  PushServiceDemo
//
//  Created by YinxiaoLiu on 14-6-19.
//  Copyright (c) 2014年 YinxiaoLiu. All rights reserved.
//

#import "XSAppDelegate.h"
#import <AVOSCloud/AVOSCloud.h>
#import "APService.h"
#import "BPush.h"
#import "MiPushSDK.h"

@interface XSAppDelegate() <BPushDelegate, MiPushSDKDelegate>

@end

@implementation XSAppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    // Override point for customization after application launch.
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        UISplitViewController *splitViewController = (UISplitViewController *)self.window.rootViewController;
        UINavigationController *navigationController = [splitViewController.viewControllers lastObject];
        splitViewController.delegate = (id)navigationController.topViewController;
    }
    
	[AVOSCloud setApplicationId:@"jp2thdg0xv8c4war9b3rwyf0na6tttemwxnfh7qxkbspk7q8"
					  clientKey:@"zz6d9hd9tu6hmjc1yorajw7uxz15y8immde1q9bifua05556"];
	
	
	[MiPushSDK registerMiPush:self];
	
//    // Required
//    [APService registerForRemoteNotificationTypes:(UIRemoteNotificationTypeBadge |
//												   UIRemoteNotificationTypeSound |
//												   UIRemoteNotificationTypeAlert)];
//    // Required
//    [APService setupWithOption:launchOptions];
	
//	// 必须
//	[BPush setupChannel:launchOptions];
//	// 必须。参数对象必须实现(void)onMethod:(NSString*)method response:(NSDictionary*)data 方法,本示例中为 self
//	[BPush setDelegate:self];
	
//    [application registerForRemoteNotificationTypes:
//	 UIRemoteNotificationTypeBadge |
//	 UIRemoteNotificationTypeAlert |
//	 UIRemoteNotificationTypeSound];
	
    return YES;
}

- (void)applicationWillResignActive:(UIApplication *)application
{
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later. 
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{
    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}

- (void)applicationWillTerminate:(UIApplication *)application
{
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
    AVInstallation *currentInstallation = [AVInstallation currentInstallation];
    [currentInstallation setDeviceTokenFromData:deviceToken];
	[currentInstallation addUniqueObject:@"ios" forKey:@"channels"];
    [currentInstallation saveInBackground];
	
	// Required
//	[APService registerDeviceToken:deviceToken];

	//
	[MiPushSDK bindDeviceToken:deviceToken];
//	[MiPushSDK setAlias:@"40000000060"];
	[MiPushSDK subscribe:@"all"];
	[MiPushSDK subscribe:@"ios"];
	
	// 必须
//	[BPush registerDeviceToken:deviceToken];
	// 必须。可以在其它时机调用,只有在该方法返回(通过 onMethod:response: 回调)绑定成功时,app 才能接收到 Push 消息。一个 app 绑定成功至少一次即可(如 果 access token 变更请重新绑定)。
//	[BPush bindChannel];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult result))completionHandler
{
	NSLog(@"%@", userInfo);
	
	[[NSNotificationCenter defaultCenter] postNotificationName:@"push" object:userInfo];
	
	NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults]'
	
    completionHandler(UIBackgroundFetchResultNoData);
}

// 必须,如果正确调用了 setDelegate,在 bindChannel 之后,结果在这个回调中返回。 若绑定失败,请进行重新绑定,确保至少绑定成功一次
- (void) onMethod:(NSString*)method response:(NSDictionary*)data {
//	if ([BpushRequestMethod_Bind isEqualToString:method]) {
//		NSDictionary* res = [[NSDictionary alloc] initWithDictionary:data]; NSString *appid = [res valueForKey:BPushRequestAppIdKey];
//		NSString *userid = [res valueForKey:BPushRequestUserIdKey];
//		NSString *channelid = [res valueForKey:BPushRequestChannelIdKey];
//		int returnCode = [[res valueForKey:BPushRequestErrorCodeKey] intValue]; NSString *requestid = [res valueForKey:BPushRequestRequestIdKey];
//	}
}

#pragma mark MiPushSDKDelegate

- (void)miPushRequestSuccWithSelector:(NSString *)selector data:(NSDictionary *)data
{
	NSLog(@"s ======== ");
	NSLog(@"selector = %@", selector);
	NSLog(@"data = %@", data);
	// 请求成功

}

- (void)miPushRequestErrWithSelector:(NSString *)selector error:(int)error data:(NSDictionary *)data
{
	NSLog(@"f ======== ");
	NSLog(@"selector = %@", selector);
	NSLog(@"data = %@", data);
	// 请求失败

}

@end
