package com.xixi.chatgptapi.interfaces;

import cn.bugstack.chatglm.model.ChatCompletionRequest;
import cn.bugstack.chatglm.model.Model;
import cn.bugstack.chatglm.model.Role;
import cn.bugstack.chatglm.session.OpenAiSession;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.annotation.Resource;

import java.util.ArrayList;
import java.util.concurrent.CompletableFuture;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Slf4j
class WeiXinPortalControllerTest {
    @Resource
    private WeiXinPortalController weiXinPortalController;

    @Autowired(required = false)
    private OpenAiSession openAiSession;

    @Test
    public void doChatGLMTest() {

        ChatCompletionRequest request = new ChatCompletionRequest();
        request.setModel(Model.CHATGLM_LITE);
        request.setPrompt(new ArrayList<ChatCompletionRequest.Prompt>() {
            private static final long serialVersionUID = -7944151926241837899L;
            {
                add(ChatCompletionRequest.Prompt.builder()
                        .role(Role.user.getCode())
                        .content("用Java写快速排序")
                        .build());
            }
        });

        try {
            CompletableFuture<String> future = openAiSession.completions(request);
            String response = future.get();
            log.info("AI生成内容：{}", response);
        } catch (Exception e) {
            log.error("AI生成失败");
            throw new RuntimeException(e);
        }
    }
}