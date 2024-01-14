import ReactMarkdown from "react-markdown";
import "katex/dist/katex.min.css";
import RemarkMath from "remark-math";
import RemarkBreaks from "remark-breaks";
import RehypeKatex from "rehype-katex";
import RemarkGfm from "remark-gfm";
import RehypeHighlight from "rehype-highlight";
import { useRef, useState, RefObject, useEffect } from "react";

import mermaid from "mermaid";

import {LoadingOutlined} from '@ant-design/icons'
import React from "react";
import { useDebouncedCallback } from "use-debounce";

// Mermaid组件
export function Mermaid(props: { code: string }) {
    // 使用useRef钩子函数创建一个ref对象，用于保存DOM节点
    const ref = useRef<HTMLDivElement>(null);
    // 使用useState钩子函数创建一个state变量hasError，用于表示是否出错
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        // 当props.code变化时，执行以下函数
        if (props.code && ref.current) {
            // 使用mermaid.run方法运行mermaid图表
            mermaid
                .run({
                    nodes: [ref.current],
                    suppressErrors: true,
                })
                // 捕获错误
                .catch((e) => {
                    setHasError(true);
                    console.error("[Mermaid] ", e.message);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.code]);

    // 点击组件时查看SVG in new window
    function viewSvgInNewWindow() {
        const svg = ref.current?.querySelector("svg");
        if (!svg) return;
        const text = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([text], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const win = window.open(url);
        if (win) {
            win.onload = () => URL.revokeObjectURL(url);
        }
    }

    if (hasError) {
        return null;
    }

    return (
        // 使用类名"no-dark mermaid"和样式对象
        <div
            className="no-dark mermaid"
            style={{
                cursor: "pointer",
                overflow: "auto",
            }}
            ref={ref}
            // 点击组件时调用viewSvgInNewWindow函数
            onClick={() => viewSvgInNewWindow()}
        >
            {props.code}
        </div>
    );
}

// PreCode组件
export function PreCode(props: { children: any }) {
    // 使用useRef钩子函数创建一个ref对象，用于保存pre元素
    const ref = useRef<HTMLPreElement>(null);
    // 使用useRef钩子函数创建一个ref对象，保存innerText
    const refText = ref.current?.innerText;
    // 使用useState钩子函数创建一个state变量mermaidCode，用于保存转换后的Mermaid代码
    const [mermaidCode, setMermaidCode] = useState("");

    // 使用useDebouncedCallback钩子函数创建一个debounce函数renderMermaid，延迟执行
    const renderMermaid = useDebouncedCallback(() => {
        if (!ref.current) return;
        const mermaidDom = ref.current.querySelector("code.language-mermaid");
        if (mermaidDom) {
            setMermaidCode((mermaidDom as HTMLElement).innerText);
        }
    }, 600);

    useEffect(() => {
        setTimeout(renderMermaid, 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refText]);

    return (
        <>
            {mermaidCode.length > 0 && (
                // 使用相同的props.code作为参数创建Mermaid组件
                <Mermaid code={mermaidCode} key={mermaidCode} />
            )}
            <pre ref={ref}>
        <span
            className="copy-code-button"
        ></span>
                {props.children}
      </pre>
        </>
    );
}

// _MarkDownContent组件
function _MarkDownContent(props: { content: string }) {
    return (
        // 使用ReactMarkdown组件渲染Markdown内容
        <ReactMarkdown
            remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
            rehypePlugins={[RehypeKatex, [RehypeHighlight, { detect: false, ignoreMissing: true }]]}
            components={{
                // PreCode组件用于渲染代码
                pre: PreCode,
                // a组件用于处理链接
                a: (aProps) => {
                    const href = aProps.href || "";
                    const isInternal = /^\/#/i.test(href);
                    const target = isInternal ? "_self" : aProps.target ?? "_blank";
                    return <a {...aProps} target={target} />;
                },
            }}
        >
            {props.content}
        </ReactMarkdown>
    );
}

// React.memo组件去记忆化_MarkDownContent组件
export const MarkdownContent = React.memo(_MarkDownContent);

// Markdown组件
export function Markdown(
    props: {
        content: string;
        loading?: boolean;
        fontSize?: number;
        parentRef?: RefObject<HTMLDivElement>;
        defaultShow?: boolean;
    } & React.DOMAttributes<HTMLDivElement>,
) {

    return (
        <div
            className="markdown-body"
            style={{
                fontSize: `${props.fontSize ?? 14}px`,
                direction: /[\u0600-\u06FF]/.test(props.content) ? "rtl" : "ltr",
            }}
        >
            {
                props.loading ?
                    // 如果props.loading为true，则渲染LoadingOutlined图标
                    <LoadingOutlined />
                    :
                    // 否则渲染_MarkdownContent组件
                    <MarkdownContent content={props.content} />
            }
        </div>
    );
}
