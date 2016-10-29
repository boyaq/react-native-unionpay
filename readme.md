# react-native银联插件
[银联官方](https://open.unionpay.com/ajweb/product/detail?id=3)
## 安装
```
npm i -S react-native-unionpay
react-native link react-native-unionpay
```

## IOS 配置

- 在工程info.plist设置中添加一个URL Types回调协议(在UPPayDemo工程中使用“UPPayDemo”作为协议)，用于在支付完成后返回商户客户端。
- http请求设置: 在Xcode7.0之后的版本中进行http请求时，需要在工程对应的plist文件中添加NSAppTransportSecurity  Dictionary 并同时设置里面NSAllowsArbitraryLoads 属性值为 YES
- 添加协议白名单: 在Xcode7.0之后的版本中进行开发，需要在工程对应的plist文件中，添加LSApplicationQueriesSchemes  Array并加入uppaysdk、uppaywallet、uppayx1、uppayx2、uppayx3五个item

## 	调用插件

```
import * as Unionpay from 'react-native-unionpay'
/*
* tn 交易流水号，商户后台向银联后台提交订单信息后，由银联后台生成并下发给商户后台的交易凭证；
* mode 接入模式，标识商户以何种方式调用支付控件，该参数提供以下两个可选值："00"代表接入生产环境（正式版本需要）；"01"代表接入开发测试环境（测试版本需要）；
*/
Unionpay.startPay(tn, mode)
.then(res => {
	console.log(res, 'see payment res');
})
catch(err => {
	//检查返回的对象有code属性
	if(typeof err == 'object' && err.code) {
		//code 当失败的时候值有：fail,cancel
	}
	console.warn(err, 'payment failed ');
})
```

# 测试账号
以下是测试用卡号、手机号等信息（此类信息仅供测试使用，不会发生真实交易）
[银联官方](https://open.unionpay.com/ajweb/product/detail?id=3)
```
招商银行借记卡：6226090000000048  
手机号：18100000000  
密码：111101
短信验证码：123456（先点获取验证码之后再输入）  
证件类型：01身份证  
证件号：510265790128303  
姓名：张三
```
```
华夏银行贷记卡：6226388000000095
手机号：18100000000
CVN2：248
有效期：1219
短信验证码：123456（先点获取验证码之后再输入）
证件类型：01身份证
证件号：510265790128303
姓名：张三
```

