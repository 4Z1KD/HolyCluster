import Modal from "@/components/Modal.jsx";
import { useColors } from "../hooks/useColors";

function Info({ size }) {
    const { colors } = useColors();

    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <title>About us!</title>
            <path
                d="M12 9H12.01M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 9.61305 20.0518 7.32387 18.364 5.63604C16.6761 3.94821 14.3869 3 12 3C9.61305 3 7.32387 3.94821 5.63604 5.63604C3.94821 7.32387 3 9.61305 3 12Z"
                stroke={colors.buttons.utility}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M11 12H12V16H13"
                stroke={colors.buttons.utility}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function About() {
    const { colors } = useColors();

    return (
        <Modal
            title={<h3
                className="text-3xl"
                style={{ color: colors.theme.text }}
            >About</h3>}
            button={<Info size="36"></Info>}
            on_cancel={() => true}
            cancel_text="close"
        >
            <div
                className="p-3 text-left"
                style={{ color: colors.theme.text }}
            >
                <p>
                    The Holy Cluster is being developed by a group of Israeli amateur radio enthusiasts,<br />
                    with the support of the Israeli Association of Radio Communication ({}
                    <a
                        className="text-blue-500 underline"
                        href="https://www.iarc.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        IARC
                    </a>).<br/><br/>
                    We hope this platform will serve as a valuable tool for radio operators worldwide,<br />
                    fostering collaboration and enhancing the global radio communication experience.<br />
                </p>
                <br />
                Contact us at: <strong>holycluster@iarc.org</strong>
            </div>
        </Modal>
    );
}

export default About;
