import {DialogType} from "@/type/chat";
import {useState} from "react";
import {DialogItem} from "@/app/components/dialog/dialog-item";
// import {DialogResizableSidebar} from "@/app/components/dialog/dialog-resizable-sidebar";
import styles from "./dialog-list.module.scss"
import { Resizable } from "re-resizable";

/**
 * 对话框列表
 */
export function DialogList() {
    const [dialogs, setDialogs] = useState<DialogType[]>([]);
    const [selected, setSelected] = useState<DialogType>();

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
                    alert("创建会话");

                    // 心里咨询
                    const dialog03: DialogType = {
                        avatar: '/role/psychological.png',
                        dialogId: 125,
                        read: true,
                        subTitle: '吹灭别人的灯，不能照亮自己',
                        timestamp: Date.now(),
                        title: '心里咨询',
                        count: 100
                    };

                    dialogs.unshift(dialog03);

                    // 设置选中刷新数据
                    setSelected(dialog03);
                }}></div>
            </div>

            {/*对话列表*/}
            <div>
                {/*循环遍历数据，当有数据变更时会自动刷新到页面*/}
                {dialogs.map((dialog, index) => (
                    <DialogItem
                        key={dialog.dialogId}
                        dialog={dialog}
                        selected={selected?.dialogId === dialog.dialogId}
                        onClick={() => {
                            setSelected(dialog)
                            alert("选中对话" + dialog.title)
                        }}
                    />
                ))}
            </div>
        </Resizable>
    );
}