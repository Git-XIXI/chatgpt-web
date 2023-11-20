package com.xixi.chatgptapi.service;

import io.jsonwebtoken.SignatureAlgorithm;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {
    @Test
    public void testJwt(){
        JwtUtil jwtUtil = new JwtUtil("cjc", SignatureAlgorithm.HS256);
        Map<String, Object> map = new HashMap();
        map.put("username", "cjc");
        map.put("password", "123");
        map.put("age", 100);

        String jwtToken = jwtUtil.encode("cjc", 30000, map);

        jwtUtil.decode(jwtToken).forEach((key,value) -> System.out.println(key + ":" + value));
    }
}