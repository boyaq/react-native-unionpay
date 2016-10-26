"use strict";

import { NativeAppEventEmitter, DeviceEventEmitter, NativeModules, Platform } from 'react-native';
import promisify from 'es6-promisify';
import { EventEmitter } from 'events';


const {Unionpay} = NativeModules;

// Event emitter to dispatch request and response from WeChat.
const emitter = new EventEmitter();

// NativeAppEventEmitter.addListener('UnionPay_Resp', resp => {
//   console.warn(resp, "UnionPay_Resp")
//   emitter.emit("UnionPay_Resp", resp);
// });
DeviceEventEmitter.addListener('UnionPay_Resp', resp => {
  console.warn(resp, "UnionPay_Resp")
  emitter.emit("UnionPay_Resp", resp);
});
// Used only with promisify. Transform callback to promise result.
function translateError(err, result) {
  if (!err) {
    return this.resolve(result);
  }
  if (typeof err === 'string') {
    return this.reject(new Error(err));
  }
  this.reject(err);
}
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
    if(Platform.OS == 'ios') {
      Unionpay.startPay(tn, mode, (result) => {
        if (result) reject({code: result});
      });
    }
    Unionpay.startPay(tn, mode, (err, result) => {
      if (err) reject(err);
    });
    emitter.on('UnionPay_Resp', (resp) => {
      if(resp.code === 'success') {
        resolve(resp)
      } else {
        reject(resp)
      }
    });
  });
}