export interface DialogType {
    // 头像
    avatar: string;
    // 对话ID
    dialogId: number;
    // 是否已读
    read: boolean;
    // 小标题
    subTitle: string;
    // 对话的最后时间
    timestamp: number;
    // 聊天头
    title: string;
    // 消息数
    count: number;
}

export interface Message {
    avatar: string;
    message: string;
    message_type: MessageType;
    time: number;
    // 方向 发送者，接收者
    direction?: MessageDirection;
}

export enum MessageType {
    Link = "link",
    Pic = "pic",
    Text = "text",
}

export enum MessageDirection{
    Send = 0,
    Receive = 1,
}