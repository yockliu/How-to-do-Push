//
//  XSDetailViewController.h
//  PushServiceDemo
//
//  Created by YinxiaoLiu on 14-6-19.
//  Copyright (c) 2014年 YinxiaoLiu. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface XSDetailViewController : UIViewController <UISplitViewControllerDelegate>

@property (strong, nonatomic) id detailItem;

@property (weak, nonatomic) IBOutlet UILabel *detailDescriptionLabel;
@end
