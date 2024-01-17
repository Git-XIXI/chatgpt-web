import styles from "./dialog-list.module.scss";
import {DialogListItem} from "./dialog-list-item";
import {useNavigate} from "react-router-dom";
import {userChatStore} from "@/app/store/chat-store";
import {Resizable} from "re-resizable";
import {DialogHead} from "@/app/components/dialog/dialog-head";

/**
 * 对话框列表
 */
export function DialogList() {
    const navigate = useNavigate();
    const chatStore = userChatStore();
    const [sessions, currentSessionIndex, selectSession] = userChatStore(
        (state) => [
            state.sessions,
            state.currentSessionIndex,
            state.selectSession]
    );

    return (
        <Resizable
            minWidth={220}
            maxWidth={320}
            defaultSize={{
                width: 260,
                height: "100%",
            }}
            style={{
                borderRight: '1px solid #f5f5f5'
            }}
        >
            <DialogHead/>
            {/*对话列表*/}
            <div className={styles["dialog-list"]}>
                {sessions.map((session, index) => (
                    <DialogListItem
                        key={session.id}
                        session={session}
                        selected={currentSessionIndex === index}
                        onClick={() => {
                            // 点击时跳转到对应的界面，并传递必要参数信息
                            selectSession(index);
                            navigate(`/chat/${session.id}`, {state: {title: session.dialog.title}})
                        }}
                        onClickDelete={() => {
                            chatStore.deleteSession(index);
                        }}
                    />
                ))}
            </div>
        </Resizable>
    );
}