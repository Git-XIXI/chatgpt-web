package com.xixi.chatgptapi.domain.validate;

import com.xixi.chatgptapi.application.IWeiXinValidateService;
import com.xixi.chatgptapi.interfaces.util.sdk.SignatureUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * @description: TODO
 * @date 2023/11/20 17:37
 */
@Service
public class WeiXinValidateServiceImpl implements IWeiXinValidateService {

    @Value("${wx.config.token}")
    private String token;
    @Override
    public boolean checkSignature(String signature, String timestamp, String nonce) {
        return SignatureUtil.check(token, signature, timestamp, nonce);
    }
}
