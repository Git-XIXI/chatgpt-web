package com.xixi.chatgptapi.domain.security.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.JwtBuilder;
import org.apache.commons.codec.binary.Base64;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 *
 获取JwtToken，获取JwtToken中封装的信息，判断JwtToken是否存在 1. encode()，参数是=签发人，存在时间，一些其他的信息。返回值是JwtToken对应的字符串 2. decode()，参数是=JwtToken=。返回值是荷载部分的键值对 3. isVerify()，参数是=JwtToken=。返回值是这个JwtToken是否存在
 */
public class JwtUtil {

    private static final String defaultBase64EncodedSecrekKey = "B*B";
    private static final SignatureAlgorithm defaultSignatureAlgorithm = SignatureAlgorithm.HS256;

    public JwtUtil() {
        this(defaultBase64EncodedSecrekKey, defaultSignatureAlgorithm);
    }

    private final String base64EncodedSecretKey;
    private final SignatureAlgorithm signatureAlgorithm;

    public JwtUtil(String base64EncodedSecretKey, SignatureAlgorithm signatureAlgorithm) {
        this.base64EncodedSecretKey = Base64.encodeBase64String(base64EncodedSecretKey.getBytes());
        this.signatureAlgorithm = signatureAlgorithm;
    }

    /**
     * @param issuer    签发人
     * @param ttlMillis 存活时间
     * @param claims    载荷
     * @return
     */
    public String encode(String issuer, long ttlMillis, Map<String, Object> claims) {
        if (claims == null) {
            claims = new HashMap<>();
        }
        long nowMillis = System.currentTimeMillis();

        JwtBuilder builder = Jwts.builder()
                // 载荷
                .setClaims(claims)
                // JWT的唯一标识
                .setId(UUID.randomUUID().toString())
                // 签发时间
                .setIssuedAt(new Date(nowMillis))
                // 签发人
                .setSubject(issuer)
                // 生成jwt使用的算法和密钥
                .signWith(signatureAlgorithm, base64EncodedSecretKey);
        if(ttlMillis>=0){
            long expMills = nowMillis + ttlMillis;
            Date exp = new Date(expMills);
            builder.setExpiration(exp);
        }
        return builder.compact();
    }

    /**
     * 拿到载荷部份所有的键值对
     * @param jwtTocken
     * @return
     */
    public Claims decode(String jwtTocken){
        return Jwts.parser()
                // 设置签名的密钥
                .setSigningKey(base64EncodedSecretKey)
                // 设置需要解析的jwt
                .parseClaimsJws(jwtTocken)
                .getBody();
    }
}
