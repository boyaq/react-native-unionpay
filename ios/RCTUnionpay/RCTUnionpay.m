//
//  RCTUnionpay.m
//  RCTUnionpay
//
//  Created by Alim on 10/25/16.
//  Copyright © 2016 Alim. All rights reserved. 
//

#import "RCTUnionpay.h"

@implementation RCTUnionpay

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();


- (instancetype)init
{
    self = [super init];
    if (self) {
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleOpenURL:) name:@"RCTOpenURLNotification" object:nil];
    }
    self.schemeStr = nil;
    NSArray *list = [[[NSBundle mainBundle] infoDictionary] valueForKey:@"CFBundleURLTypes"];
    for (NSDictionary *item in list) {
        NSString *name = item[@"CFBundleURLName"];
        if ([name isEqualToString:@"unionpay"]) {
            NSArray *schemes = item[@"CFBundleURLSchemes"];
            if (schemes.count > 0)
            {
                self.schemeStr = [schemes firstObject];
                break;
            }
        }
    }
    return self;
}
- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (BOOL)handleOpenURL:(NSNotification *)notification
{
    NSString * aURLString =  [notification userInfo][@"url"];
    NSURL * url = [NSURL URLWithString:aURLString];
    NSArray *schemes = [NSArray arrayWithObjects:@"uppaysdk", @"uppaywallet", @"uppayx1", @"uppayx2", @"uppayx3", self.schemeStr, nil];
    BOOL canOpen = false;
    for (NSString *scheme in schemes) {
        canOpen = [aURLString hasPrefix:scheme];
        if (canOpen) break;
    }
    if (canOpen) {
        [[UPPaymentControl defaultControl] handlePaymentResult:url completeBlock:^(NSString *code, NSDictionary *data) {

            NSMutableDictionary *body;
            if(data != nil) {
                body = [data mutableCopy];
            }
            body = @{@"code" : code};
            
            [self.bridge.eventDispatcher sendDeviceEventWithName:@"UnionPay_Resp"
                                                            body:body];
            
        }];
    }
    return canOpen;
}

RCT_EXPORT_METHOD(startPay:(NSString *)tn mode:(NSString*)mode callback:(RCTResponseSenderBlock)callback)
{
    if(self.schemeStr == nil) {
        callback(URL_SCHEMES_NOT_DEFINED);
    }
    
    UIWindow *window = [UIApplication sharedApplication].keyWindow;
    UIViewController *rootViewController = window.rootViewController;
    Boolean result = [[UPPaymentControl defaultControl] startPay:tn fromScheme:self.schemeStr mode:mode viewController:rootViewController];
    callback(result ?  @[[NSNull null]] : @"fail");
}
RCT_EXPORT_METHOD(isPaymentAppInstalled:(RCTResponseSenderBlock)callback)
{
    Boolean result = [[UPPaymentControl defaultControl] isPaymentAppInstalled];
    
    callback(result ? @"true" : @"false");
}
@end
