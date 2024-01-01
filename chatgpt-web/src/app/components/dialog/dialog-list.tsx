import {DialogType} from "@/type/chat";
import {useState} from "react";
import {DialogItem} from "@/app/components/dialog/dialog-item";
// import {DialogResizableSidebar} from "@/app/components/dialog/dialog-resizable-sidebar";
import styles from "./dialog-list.module.scss"
import {Resizable} from "re-resizable";
import {useNavigate} from "react-router-dom";

/**
 * 对话框列表
 */
export function DialogList() {
    const [dialogs, setDialogs] = useState<DialogType[]>([]);
    const [selected, setSelected] = useState<DialogType>();
    const navigate = useNavigate();

    // 测试数据
    const dialog01: DialogType = {
        avatar: '/role/bugstack.png',
        dialogId: 123,
        read: true,
        subTitle: '写个java冒泡排序?',
        timestamp: Date.now(),
        title: '普通对话',
        count: 1
    };

    // 测试数据
    const dialog02: DialogType = {
        avatar: '/role/interview.png',
        dialogId: 124,
        read: true,
        subTitle: 'Hello, how are you?',
        timestamp: Date.now(),
        title: '面试官',
        count: 5
    };

    dialogs.push(dialog01);
    dialogs.push(dialog02);

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
            <div className={styles["dialog-head"]}>
                <div className={styles["dialog-search-box"]}><input type="text" placeholder="搜索"/></div>
                <div className={styles["dialog-search-add"]} onClick={() => {

                    // 心里咨询
                    const dialog01: DialogType = {
                        avatar: '/role/bugstack.png',
                        dialogId: Math.floor(Math.random() * 900) + 100,
                        read: true,
                        subTitle: '有什么可以帮你的吗？',
                        timestamp: Date.now(),
                        title: '直接对话',
                        count: Math.floor(Math.random() * 90)
                    };

                    const dialog02: DialogType = {
                        avatar: '/role/interview.png',
                        dialogId: Math.floor(Math.random() * 900) + 100,
                        read: true,
                        subTitle: '请回答一下Java的基础类型有哪些？',
                        timestamp: Date.now(),
                        title: '面试官',
                        count: Math.floor(Math.random() * 90)
                    };

                    const dialog03: DialogType = {
                        avatar: '/role/psychological.png',
                        dialogId: Math.floor(Math.random() * 900) + 100,
                        read: true,
                        subTitle: '吹灭别人的灯，不能照亮自己',
                        timestamp: Date.now(),
                        title: '心里咨询',
                        count: Math.floor(Math.random() * 90)
                    };

                    const idx = Math.floor(Math.random() * 3) + 1;
                    if (1 === idx) {
                        dialogs.unshift(dialog01);
                        setSelected(dialog01);
                    }

                    if (2 === idx) {
                        dialogs.unshift(dialog02);
                        setSelected(dialog02);
                    }

                    if (3 === idx) {
                        dialogs.unshift(dialog03);
                        setSelected(dialog03);
                    }

                }}></div>
            </div>
            {/*对话列表*/}
            <div className={styles["dialog-list"]}>
                {dialogs.map((dialog) => (
                    <DialogItem
                        key={dialog.dialogId}
                        dialog={dialog}
                        selected={selected?.dialogId === dialog.dialogId}
                        onClick={() => {
                            // 点击时跳转到对应的界面，并传递必要参数信息
                            navigate(`/chat/${dialog.dialogId}`, {state: {title: dialog.title}})
                            setSelected(dialog)
                        }}
                    />
                ))}
            </div>
        </Resizable>
    );
}