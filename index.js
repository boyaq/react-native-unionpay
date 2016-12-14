"use strict";

import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

// import { EventEmitter } from 'events';


const {Unionpay} = NativeModules;

// Event emitter to dispatch request and response from WeChat.
// const emitter = new EventEmitter();

// DeviceEventEmitter.addListener('UnionPay_Resp', resp => {
//   emitter.emit("UnionPay_Resp", resp);
// });
let hook = undefined;

const UnionpayEmitter = new NativeEventEmitter(Unionpay)
const subscription = UnionpayEmitter.addListener('UnionPay_Resp', (resp) => {
	if(hook != undefined) hook(resp)
	hook = undefined;
	// emitter.emit("UnionPay_Resp", resp);
})

export function isPaymentAppInstalled() {
	return new Promise((resolve, reject) => {
		Unionpay.isPaymentAppInstalled(result => {
			if(result === 'true') {
				resolve(true)
			} else {
				reject("unionpay plugin is not installed")
			}
		})
	})
}
export function startPay(tn, mode) {
	return new Promise((resolve, reject) => {
		Unionpay.startPay(tn, mode, (err, result) => {
			if (err) reject(err);
		});
		hook =  (resp) => {
			if(resp.code === 'success') {
				resolve(resp)
			} else {
				reject(resp)
			}
		};
  });
}