import {create} from "zustand";
import {persist} from "zustand/middleware";
import {state} from "sucrase/dist/types/parser/traverser/base";
import {login} from "@/apis";

/**
 * 保存用户登录信息
 */
export interface AccessControlStore {
    accessCode: string;
    token: string;
    accessCodeErrorMsgs: string;

    updateToken: (_: string) => void;
    updateCode: (_: string) => void;
    isAuthorized: () => boolean;
    login: () => Promise<string>;
    goToLogin: () => void;
}

export const useAccessStore: any = create<AccessControlStore>()(
    persist(
        (set, get) => ({
                accessCode: "",
                token: "",
                accessCodeErrorMsgs: "",

                updateToken(token: string) {
                    set(() => ({token}));
                },
                updateCode(code: string) {
                    set(() => ({accessCode: code}));
                },
                isAuthorized() {
                    return !!get().token;
                },
                goToLogin() {
                    get().updateCode("");
                    get().updateToken("");
                },
                async login() {
                    const res = await login(get().accessCode);
                    const { data, code} = await res.json();
                    // 根据返回结果设置
                    if (code === "0000") {
                        console.log("登陆成功");
                        get().updateToken(data);
                        set(() => ({ accessCodeErrorMsgs: "" }));
                    }
                    if (code === "0002") {
                        set(() => ({ accessCodeErrorMsgs: "验证码已过期,请获取最新验证码" }));
                    }
                    if (code === "0003") {
                        set(() => ({ accessCodeErrorMsgs: "验证码不存在,请确认最新验证码" }));
                    }
                    return data;
                },
            }
        ),
        {
            name: "chat-access",
            version: 1,
        }
    )
);