package com.xixi.chatgptapi.interfaces;


import com.sun.org.slf4j.internal.Logger;
import com.sun.org.slf4j.internal.LoggerFactory;
import com.xixi.chatgptapi.domain.security.service.JwtUtil;

import java.util.HashMap;
import java.util.Map;

/**
 *  API访问准入管理；当访问 OpenAI 接口时，需要进行准入验证。
 */
@RestController
public class ApiAccessController {
    private Logger logger = LoggerFactory.getLogger(ApiAccessController.class);

    /**
     * http://localhost:8080/authorize?username=cjc&password=123
     */
    @RequestMapping("/authorize")
    public ResponseEntity<Map<String, String>> authorize(String username, String password) {
        HashMap<String, String> map = new HashMap<>();

        if(!"cjc".equals(username) || !"123".equals(password)){
            map.put("msg", "用户名或密码错误");
            return ResponseEntity.ok(map);
        }

        // 检验通过生成tocken
        JwtUtil jwtUtil = new JwtUtil();
        HashMap<String, Object> claim = new HashMap<>();
        claim.put("username", username);
        String token = jwtUtil.encode(username, 5*60*1000,claim);
        map.put("msg","授权成功");
        map.put("tocken",token);
        return ResponseEntity.ok(map);
    }

    /**
     * http://localhost:8080/verify?token=
     */
    @RequestMapping("/verify")
    public ResponseEntity<String> verify(String token) {
        logger.info("验证 token：{}", token);
        return ResponseEntity.status(HttpStatus.OK).body("verify success!");
    }

    @RequestMapping("/success")
    public String success(){
        return "test success by xfg";
    }
}
