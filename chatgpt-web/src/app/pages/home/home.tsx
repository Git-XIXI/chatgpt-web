"use client";

import styles from "./home.module.scss";
import {SideBar} from "../../components/sidebar/sidebar";

import {HashRouter as Router, Route, Routes, useLocation,} from "react-router-dom";
import dynamic from "next/dynamic";
import {Path} from "@/app/constants";
import {useAppConfig} from "@/app/store/config";
import {DialogMessage} from "@/app/components/dialog/dialog-message";
import {RoleDetail} from "@/app/components/role/role-detail";
import {useAccessStore} from "@/app/store/access";
import {Auth} from "@/app/pages/auth/auth";

const Chat = dynamic(async () => (await import("@/app/pages/chat/chat")).Chat);
const Role = dynamic(async () => (await import("@/app/pages/role/role")).Role);

function Screen() {
    const config = useAppConfig();
    const location = useLocation();
    const isAuthPath = location.pathname === '/auth';
    const access = useAccessStore();
    const isAuthorized = access.isAuthorized()
    return (
        <div className={`${config.tightBorder ? styles["tight-container"] : styles.container}`}>
            {isAuthPath || !isAuthorized ? (
                <Auth />
            ) : (
                <>
                    {/* 工具菜单 */}
                    <SideBar />

                    {/* 路由地址 */}
                    <div className={styles["window-content"]}>
                        <Routes>
                            <Route path={Path.Home} element={<Chat />} />
                            <Route path={Path.Chat} element={<Chat />}>
                                <Route path=":id" element={<DialogMessage />} />
                            </Route>
                            <Route path={Path.Role} element={<Role />}>
                                <Route path=":id" element={<RoleDetail />} />
                            </Route>
                        </Routes>
                    </div>
                </>
            )}
        </div>
    );
}

export function Home() {
    return (
        <Router>
            <Screen/>
        </Router>
    );
}