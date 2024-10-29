import Button from "@/components/Button.jsx";

import { useState } from "react";

function Modal({
    title,
    button,
    on_open = null,
    on_apply = null,
    on_cancel = null,
    children,
}) {
    const [show_modal, set_show_modal] = useState(false);

    return <>
        <button onClick={() => {
            if (on_open != null) {
                on_open()
            }
            set_show_modal(true)
        }}>{button}</button>
        {(show_modal ? (
            <div className="flex justify-center pt-24 overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative min-w-80 my-6 mx-auto max-w-3xl">
                  <div className="rounded-lg shadow-xl relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <div className="flex items-start items-center p-5 border-b border-solid border-gray-300 rounded-t gap-3">
                      {title}
                    </div>
                    <div>
                        {children}
                    </div>
                    <div className="flex items-center justify-around p-3 border-t border-solid border-blueGray-200 rounded-b">
                        <Button color="red" on_click={() => {
                            if (on_cancel != null) {
                                on_cancel()
                            }
                            set_show_modal(false)
                        }}>
                            Cancel
                        </Button>
                        <Button color="blue" on_click={() => {
                            let should_close = true;
                            if (on_apply != null) {
                                should_close = on_apply();
                            }
                            set_show_modal(!should_close);
                        }}>
                            Apply
                        </Button>
                    </div>
                  </div>
                </div>
              </div>
        ) : "")}
    </>;
}

export default Modal;
