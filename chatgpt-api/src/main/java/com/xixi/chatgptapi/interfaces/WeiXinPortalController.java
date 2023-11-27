package com.xixi.chatgptapi.interfaces;

import cn.bugstack.chatglm.model.*;
import cn.bugstack.chatglm.session.Configuration;
import cn.bugstack.chatglm.session.OpenAiSession;
import cn.bugstack.chatglm.session.OpenAiSessionFactory;
import cn.bugstack.chatglm.session.defaults.DefaultOpenAiSessionFactory;
import cn.bugstack.chatglm.utils.BearerTokenUtils;
import com.xixi.chatgptapi.application.IWeiXinValidateService;
import com.xixi.chatgptapi.domain.receive.model.MessageTextEntity;
import com.xixi.chatgptapi.interfaces.util.XmlUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ThreadPoolExecutor;

/**
 * @description: 微信公众号，请求处理服务
 * @date 2023/11/20 17:27
 */
@RestController
@RequestMapping("/wx/portal/{appid}")
public class WeiXinPortalController {

    @Value("${wx.config.originalid:gh_d2218bf190e7}")
    private String originalId;
    @Autowired(required = false)
    private OpenAiSession openAiSession;
    @Resource
    private IWeiXinValidateService weiXinValidateService;
    @Resource
    private ThreadPoolTaskExecutor taskExecutor;
    private Map<String, String> chatGPTMap = new ConcurrentHashMap<>();
    private Logger logger = LoggerFactory.getLogger(WeiXinPortalController.class);

    /**
     * 处理微信服务器发来的get请求，进行签名认证
     *
     * @param appid     微信端AppID
     * @param signature 微信发来的签名
     * @param timestamp 微信发来的时间戳
     * @param nonce     微信发来的随机字符串
     * @param echostr   微信发来的验证字符串
     * @return
     */
    @GetMapping(produces = "text/plain;charset=utf-8")
    public String validate(@PathVariable String appid,
                           @RequestParam(value = "signature", required = false) String signature,
                           @RequestParam(value = "timestamp", required = false) String timestamp,
                           @RequestParam(value = "nonce", required = false) String nonce,
                           @RequestParam(value = "echostr", required = false) String echostr) {
        logger.info("微信公众号验签信息{}开始 [{}, {}, {}, {}]", appid, signature, timestamp, nonce, echostr);
        try {
            if (StringUtils.isAnyBlank(signature, timestamp, nonce, echostr)) {
                throw new IllegalArgumentException("请求参数非法");
            }
            boolean check = weiXinValidateService.checkSignature(signature, timestamp, nonce);
            logger.info("微信公众号验签信息{}完成 check:{}", appid, check);
            if (!check) {
                return null;
            }
            return echostr;
        } catch (Exception e) {
            logger.error("微信公众号验签信息{}失败 [{}, {}, {}, {}]", appid, signature, timestamp, nonce, echostr, e);
            return null;
        }
    }


    /**
     * 处理微信服务器的消息转发
     */
    @PostMapping(produces = "application/xml; charset=UTF-8")
    public String post(@PathVariable String appid,
                       @RequestBody String requestBody,
                       @RequestParam("signature") String signature,
                       @RequestParam("timestamp") String timestamp,
                       @RequestParam("nonce") String nonce,
                       @RequestParam("openid") String openid,
                       @RequestParam(name = "encrypt_type", required = false) String encType,
                       @RequestParam(name = "msg_signature", required = false) String msgSignature) {
        try {
            logger.info("接受微信公众号消息请求{}开始{}", openid, requestBody);
            MessageTextEntity message = XmlUtil.xmlToBean(requestBody, MessageTextEntity.class);
            // 异步任务
            if (chatGPTMap.get(message.getContent().trim()) == null ||
                    "NULL".equals(chatGPTMap.get(message.getContent().trim()))) {
                MessageTextEntity res = new MessageTextEntity();
                res.setToUserName(openid);
                res.setFromUserName(originalId);
                res.setCreateTime(String.valueOf(System.currentTimeMillis() / 1000L));
                res.setMsgType("Text");
                res.setContent("消息处理中，请再回复我一句【" + message.getContent().trim() + "】");
                if (chatGPTMap.get(message.getContent().trim()) == null) {
                    // doChatGPTTask(message.getContent().trim());
                    doChatGLMTask(message.getContent().trim());
                }
                return XmlUtil.beanToXml(res);
            }
            // 反馈消息[文本]
            MessageTextEntity res = new MessageTextEntity();
            res.setToUserName(openid);
            res.setFromUserName(originalId);
            res.setCreateTime(String.valueOf(System.currentTimeMillis() / 1000L));
            res.setMsgType("text");
            res.setContent(chatGPTMap.get(message.getContent().trim()));
            String result = XmlUtil.beanToXml(res);
            logger.info("接受微信公众号消息请求{}完成{}", openid, result);
            chatGPTMap.remove(message.getContent().trim());
            return result;
        } catch (Exception e) {
            logger.error("接收微信公众号信息请求{}失败 {}", openid, requestBody, e);
            return "";
        }
    }

    /**
     * http://f274qq.natappfree.cc/wx/portal/wx075b27b863cf8caa/test
     */
    @GetMapping("/test")
    public void test() {
        logger.error("内网穿透成功");
    }

    public void doChatGLMTask(String content) {
        Set set = new HashSet();
        chatGPTMap.put(content, "NULL");
        taskExecutor.execute(() -> {
            ChatCompletionRequest request = new ChatCompletionRequest();
            request.setModel(Model.CHATGLM_LITE);
            request.setPrompt(new ArrayList<ChatCompletionRequest.Prompt>() {
                private static final long serialVersionUID = -7944151926241837899L;

                {
                    add(ChatCompletionRequest.Prompt.builder()
                            .role(Role.user.getCode())
                            .content(content)
                            .build());
                }
            });

            try {
                CompletableFuture<String> future = openAiSession.completions(request);
                String response = future.get();
                chatGPTMap.put(content, response);
                logger.info("AI生成内容：{}", response);
            } catch (Exception e) {
                logger.error("AI生成失败");
                throw new RuntimeException(e);
            }
        });
    }
}

