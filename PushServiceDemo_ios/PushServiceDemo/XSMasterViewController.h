//
//  XSMasterViewController.h
//  PushServiceDemo
//
//  Created by YinxiaoLiu on 14-6-19.
//  Copyright (c) 2014年 YinxiaoLiu. All rights reserved.
//

#import <UIKit/UIKit.h>

@class XSDetailViewController;

@interface XSMasterViewController : UITableViewController

@property IBOutlet UITextView *textView;

@property (strong, nonatomic) XSDetailViewController *detailViewController;

@end
