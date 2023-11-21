package com.xixi.chatgptapi.application;

/**
 * @description: 微信公众号签验服务
 * @date 2023/11/20 17:40
 */
public interface IWeiXinValidateService {
    boolean checkSignature(String signature, String timestamp, String nonce);
}
