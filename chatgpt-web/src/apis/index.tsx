import {MessageRole} from "@/types/chat";
import {GlmModel} from "@/app/constants";

export const getRoleList = async () => {
    // 从本地 json 文件获取
    const res = await fetch(`/prompts.json`);
    return await res.json();
}

export const completions = (data: {
    messages: { content: string; role: MessageRole }[],
    model: GlmModel
}) => {
    return fetch('http://localhost:8080/api/chatgpt/chat/completions', {
        method: 'post',
        headers: {
            Authorization: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvRWFvYTZrTHJlVFVhSTd2R1NEb0xHdThIOXF3Iiwib3BlbklkIjoib0Vhb2E2a0xyZVRVYUk3dkdTRG9MR3U4SDlxdyIsImV4cCI6MTcwOTczMDQzNywiaWF0IjoxNzA5MTI1NjM3LCJqdGkiOiIyNWNkZmI1My1kOGY5LTQxNTgtOGNhNy1kZjI0NmZiNmFmMmEifQ._DLMy6J6jmKBbAgbjCMoB0C09Tg4pJ6mbsSFewj8d9U",
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    })
}

