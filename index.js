"use strict";

import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

const {Unionpay} = NativeModules;

let hook = undefined;

const UnionpayEmitter = new NativeEventEmitter(Unionpay)
const subscription = UnionpayEmitter.addListener('UnionPay_Resp', (resp) => {
	if(hook != undefined) hook(resp)
		hook = undefined;
})

export function isPaymentAppInstalled() {
	return new Promise((resolve, reject) => {
		Unionpay.isPaymentAppInstalled((err, result) => {
		if (err) reject("unionpay plugin is not installed")
		else resolve(true)
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