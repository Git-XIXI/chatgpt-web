import {MessageRole} from "@/types/chat";
import {GlmModel} from "@/app/constants";
import {useAccessStore} from "@/app/store/access";

const host = "http://localhost:8080";

/**
 * Header 信息
 */
function getHeaders() {
    const accessState = useAccessStore.getState()

    const headers = {
        Authorization: accessState.token,
        'Content-Type': 'application/json;charset=utf-8'
    }

    return headers
}

/**
 * Role 角色获取接口
 */
export const getRoleList = async () => {
    // 从本地 json 文件获取
    const res = await fetch(`/prompts.json`);
    return await res.json();
}

/**
 * 流式应答接口
 * @param data
 */
export const completions = (data: {
    messages: { content: string; role: MessageRole }[],
    model: GlmModel
}) => {
    return fetch(`${host}/api/chatgpt/chat/completions`, {
        method: 'post',
        headers: getHeaders(),
        body: JSON.stringify(data)
    })
}

/**
 * 登录鉴权接口
 * @param token
 */
export const login = (token: string) => {
    const accessState = useAccessStore.getState()
    return fetch(`${host}/api/auth/login`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `code=${accessState.accessCode}`
    });
}

