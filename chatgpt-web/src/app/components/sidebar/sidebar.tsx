import styles from "./sidebar.module.scss";

import Home from "../../icons/home.svg"
import ChatGPTIcon from "../../icons/chatgpt.svg";
import RoleIcon from "../../icons/role.svg";

import {useNavigate} from "react-router-dom";
import {Path} from "@/app/constants";
import MaxIcon from "../../icons/max.svg";
import MinIcon from "../../icons/min.svg";
import ExitIcon from "../../icons/exit.svg";
import {IconButton} from "../button/button"
import {create} from "zustand";
import {persist} from "zustand/middleware";
import {useAppConfig} from "@/app/store/config";

export function SideBar() {

    const navigate = useNavigate();
    const config =useAppConfig();

    return (
        <div className={styles.sidebar}>

            <div className={styles["action-button"]}>
                <IconButton icon={<ExitIcon/>} backgroundColor={"#ff4e4e"} onClick={()=>{
                    alert("尚未实现");
                }}/>
                <IconButton icon={<MinIcon/>} backgroundColor={"#f3c910"} onClick={()=>{
                    config.update(
                        (config) => (config.tightBorder = false),
                    );
                }}/>
                <IconButton icon={<MaxIcon/>} backgroundColor={"#04c204"} onClick={()=>{
                    config.update(
                        (config) => (config.tightBorder = true),
                    );
                }}/>
            </div>

            <div className={styles["sidebar-header"]}>
                <Home/>
            </div>

            <div className={styles["sidebar-chat"]}
                 onClick={() => {
                     navigate(Path.Chat)
                 }}>
                <ChatGPTIcon/>
            </div>

            <div className={styles["sidebar-role"]}
                 onClick={() => {
                     navigate(Path.Role)
                 }}>
                <RoleIcon/>
            </div>

        </div>
    )
}