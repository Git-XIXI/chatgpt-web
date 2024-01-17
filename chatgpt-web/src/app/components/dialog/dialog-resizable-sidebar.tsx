import { PropsWithChildren } from "react";
import { Resizable } from "re-resizable";
interface Props {
    minWidth?: number;
}

/**
 * 可伸缩组件
 * @param props
 * @constructor
 */
export function DialogResizableSidebar(props: PropsWithChildren<Props>) {
    const {minWidth = 200, children} = props;
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
            {children}
        </Resizable>

    );
}
