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
    NSArray *urlTypes = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleURLTypes"];
    NSArray *urlSchemes = [urlTypes.firstObject objectForKey:@"CFBundleURLSchemes"];
    NSInteger size = [urlSchemes count];
    if(size == 0 ) {
        self.schemeStr = nil;
    } else {
        self.schemeStr = [urlSchemes firstObject];
    }
    return self;
}
- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"UnionPay_Resp"];
}

- (BOOL)handleOpenURL:(NSNotification *)notification
{
    NSDictionary *userInfo = notification.userInfo;
    NSString *strUrl = userInfo[@"url"];
    NSURL* url = [NSURL URLWithString:strUrl];
    
    [[UPPaymentControl defaultControl] handlePaymentResult:url completeBlock:^(NSString *code, NSDictionary *data) {
        

        NSMutableDictionary *body = [NSMutableDictionary new];
        //当支付成功
        if([code isEqualToString:@"success"]) {
            if(data != nil) {
                body = [data mutableCopy];
            }
        }
        //当支付失败
        else if([code isEqualToString:@"fail"]) {
            
            //交易失败
        }
        //当用户取消支付
        else if([code isEqualToString:@"cancel"]) {
            //交易取消
        } else {
            //其他情况终止函数
            return ;
        }

        body[@"code"] = code;

        [self sendEventWithName:@"UnionPay_Resp" body: body];
        
    }];
    return YES;
}

RCT_EXPORT_METHOD(startPay:(NSString *)tn mode:(NSString*)mode callback:(RCTResponseSenderBlock)callback)
{
    if(self.schemeStr == nil) {
        callback(@[URL_SCHEMES_NOT_DEFINED]);
    }
    
    UIWindow *window = [UIApplication sharedApplication].keyWindow;
    UIViewController *rootViewController = window.rootViewController;
    Boolean result = [[UPPaymentControl defaultControl] startPay:tn fromScheme:self.schemeStr mode:mode viewController:rootViewController];

    callback(result ? @[[NSNull null]] : @[@"failed"]);
}
RCT_EXPORT_METHOD(isPaymentAppInstalled:(RCTResponseSenderBlock)callback)
{
    Boolean result = [[UPPaymentControl defaultControl] isPaymentAppInstalled];
    
    callback(result ? @[[NSNull null]]: @[@"fail"]);
}
@end
