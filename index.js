"use strict";

import { NativeAppEventEmitter, DeviceEventEmitter, NativeModules, Platform } from 'react-native';
import promisify from 'es6-promisify';
import { EventEmitter } from 'events';


const {Unionpay} = NativeModules;

// Event emitter to dispatch request and response from WeChat.
const emitter = new EventEmitter();

DeviceEventEmitter.addListener('UnionPay_Resp', resp => {
  emitter.emit("UnionPay_Resp", resp);
});


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