package biz.otkur.react;


import android.app.Activity;
import android.app.ActivityManager;
import android.app.Application;
import android.content.Intent;
import android.util.Log;


import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.unionpay.UPPayAssistEx;

import org.json.JSONException;
import org.json.JSONObject;
import android.content.Context;

import java.util.List;


/**
 * Created by tdzl2_000 on 2015-10-10.
 */

public class UnionpayModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    Activity mCurrentActivity;


    public UnionpayModule(ReactApplicationContext context) {
        super(context);
        context.addActivityEventListener(this);


    }

    @Override
    public String getName() {
        return "RCTUnionpay";
    }




    @ReactMethod
    public void startPay(String tn, String mode, Callback callback) {
        int rs = UPPayAssistEx.startPay(this.getCurrentActivity(), null, null, tn, mode);
        if(UPPayAssistEx.PLUGIN_VALID == rs) {
            callback.invoke();
        } else {

        }

    }
    @ReactMethod
    public void checkInstalled (Callback callback) {
        Boolean rs = UPPayAssistEx.checkInstalled(getReactApplicationContext());
        callback.invoke(rs ? "true" : "false");
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        WritableMap params = Arguments.createMap();
        if( data == null ){
            params.putString("code", "fail");
            getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("UnionPay_Resp", params);
        }
        String str =  data.getExtras().getString("pay_result");

        params.putString("code", str.toLowerCase());
        if (str.equalsIgnoreCase("success")) {


            // TODO: 10/25/16
            // 支付成功后，extra中如果存在result_data，取出校验
            // result_data结构见c）result_data参数说明
            if (data.hasExtra("result_data")) {

                String result = data.getExtras().getString("result_data");
                try {
                    JSONObject resultJson = new JSONObject(result);
                    String sign = resultJson.getString("sign");
                    String dataOrg = resultJson.getString("data");
                    params.putString("sign", sign);
                    params.putString("data", dataOrg);

                } catch (JSONException e) {
                }
            } else {
            }

        } else if (str.equalsIgnoreCase("fail")) {
            // TODO: 10/25/16
        } else if (str.equalsIgnoreCase("cancel")) {
            // TODO: 10/25/16
        }
        getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("UnionPay_Resp", params);
    }

    @Override
    public void onNewIntent(Intent intent) {

    }
}
