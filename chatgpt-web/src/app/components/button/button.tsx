import styles from "./button.module.scss"

export function IconButton(props: {
    onClick?: () => void;
    icon?: JSX.Element;
    className?: string;
    title?: string;
    text?: string;
    backgroundColor?: string;
}) {
    const {backgroundColor} = props;

    const buttonStyle = {
        backgroundColor: backgroundColor,
    };

    return (
        <button className={styles["icon-button"]} style={buttonStyle} onClick={props.onClick}>
            {props.icon && <div className={styles["icon-button-icon"]}>{props.icon}</div>}
            {props.text && <div className={styles["icon-button-text"]}>{props.text}</div>}
        </button>
    );

}