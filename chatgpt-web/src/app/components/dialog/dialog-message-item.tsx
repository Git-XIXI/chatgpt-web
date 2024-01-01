import {Message, MessageDirection} from "@/type/chat";
import {Avatar, Space} from "antd";
import styles from "./dialog-message.module.scss"

// 使用对象封装属性，方便拓展
interface Props {
    message: Message;
}

export function DialogMessageItem(props: Props) {
    const {message} = props;
    // true：左；false：右
    const isReceive = message.direction === MessageDirection.Receive;
    return (
        <Space className={`${styles.messageWrapper} ${isReceive ? styles.receive : styles.send}`}>
            {isReceive ? (
                <>
                    <Avatar shape="square"
                            src={message.avatar}
                            size={40}
                            style={{borderRadius: '4px', backgroundColor: '#f6f6f6'}}/>
                    <p className={styles.message}>{message.message}</p>
                </>
            ) : (
                <>
                    <p className={styles.message}>{message.message}</p>
                    <Avatar shape="square"
                            src={message.avatar}
                            size={40}
                            style={{borderRadius: '4px', backgroundColor: '#f6f6f6'}}/>
                </>)}
        </Space>
    )
}