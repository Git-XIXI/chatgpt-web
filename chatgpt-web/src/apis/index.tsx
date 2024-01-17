const host = 'https://console-mock.apipost.cn/mock/072fa474-ab36-4650-a798-a57e8223e6e6'

export const getRoleList = async () => {
    // 从本地 json 文件获取
    const res = await fetch(`/prompts.json`);
    return await res.json();
}

