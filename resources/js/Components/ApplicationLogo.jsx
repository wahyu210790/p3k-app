export default function ApplicationLogo(props) {
    return (
        <img
            {...props}
            src="/images/logo.png"
            alt="WARMINDO P3K Logo"
            className={props.className || "w-12 h-12 object-contain"}
        />
    );
}
