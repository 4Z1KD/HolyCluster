import { useState } from "react";

import Button from "@/components/Button.jsx";
import { useColors } from "../hooks/useColors";

function Modal({
    title,
    button,
    on_open = null,
    on_apply = null,
    on_cancel = null,
    apply_text = "Apply",
    cancel_text = "Cancel",
    children,
}) {
    const [show_modal, set_show_modal] = useState(false);
    const { colors } = useColors();

    return (
        <>
            <button
                onClick={() => {
                    if (on_open != null) {
                        on_open();
                    }
                    set_show_modal(true);
                }}
            >
                {button}
            </button>
            {show_modal ? (
                <div className="flex justify-center pt-24 overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="relative min-w-80 my-6 mx-auto max-w-3xl">
                        <div
                            className="rounded-lg shadow-xl relative flex flex-col w-full outline-none focus:outline-none border"
                            style={{
                                backgroundColor: colors.theme.modals,
                                borderColor: colors.theme.borders,
                            }}
                        >
                            <div className="flex items-start items-center p-5 border-b border-solid border-gray-300 rounded-t gap-3">
                                {title}
                            </div>
                            <div>{children}</div>
                            <div className="flex items-center justify-around p-3 border-t border-solid border-blueGray-200 rounded-b">
                                {on_cancel != null ? (
                                    <Button
                                        color="red"
                                        on_click={() => {
                                            on_cancel();
                                            set_show_modal(false);
                                        }}
                                    >
                                        {cancel_text}
                                    </Button>
                                ) : (
                                    ""
                                )}
                                {on_apply != null ? (
                                    <Button
                                        color="blue"
                                        on_click={() => set_show_modal(!on_apply())}
                                    >
                                        {apply_text}
                                    </Button>
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                ""
            )}
        </>
    );
}

export default Modal;
