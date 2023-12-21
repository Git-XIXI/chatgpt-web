import {DialogType} from "@/type/chat";
import {Avatar, Badge, Space} from 'antd';
import styles from './dialog-item.module.scss';


interface Props {
    dialog: DialogType;
    selected: boolean;
    onClick: (dialog: DialogType) => void;
}

/**
 * 对话框列表对象元素
 */

export function DialogItem(props: Props) {
    const {dialog, selected, onClick} = props;
    const date = new Date(dialog.timestamp);
    const timeString = date.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
    return (
        <div className={`${styles.wrapper} ${selected ? styles.selected : ''}`} onClick={() => onClick(dialog)}>
            <div className={styles.left}>
                <Space size={24}>
                    <Badge count={props.selected ? dialog.count : 0} size={"small"} color={"#fca7a7"}>
                        <Avatar shape={"square"} src={dialog.avatar} size={40}/>
                    </Badge>
                </Space>
            </div>
            <div className={styles.right}>
                <div className={styles.line1}>
                    <p className={styles.title}>{dialog.title}</p>
                    <p className={styles.time}>{timeString}</p>
                </div>
                <div className={styles.line2}>
                    {dialog.subTitle}
                </div>
            </div>
        </div>
    )
}
















