import { useState } from "react";

import X from "@/components/X.jsx";
import Input from "@/components/Input.jsx";

function CallsignsList({ callsigns, set_callsigns, title }) {
    if (callsigns.length == 0 || callsigns[callsigns.length - 1][0].length > 0) {
        callsigns.push(["", false]);
    }

    const button_base_classes =
        "flex border border-gray-700 items-center justify-center p-2 w-7 h-7 rounded-md mr-2 text-xs font-bold ";
    const button_inactive_classes = "border border-gray-400 bg-slate-200";

    return (
        <div className="p-1">
            {title}
            <div className="my-4 mx-2">
                {callsigns.map(([callsign, is_suffix], index) => {
                    return (
                        <div
                            className="flex justify-start items-center mb-1 space-x-2 w-full"
                            key={index}
                        >
                            <Input
                                className="h-7 text-sm"
                                value={callsign}
                                onChange={event => {
                                    let new_callsigns = callsigns.map(
                                        ([callsign, is_suffix], inner_index) => {
                                            if (index == inner_index) {
                                                return [
                                                    event.target.value.toUpperCase(),
                                                    is_suffix,
                                                ];
                                            } else {
                                                return [callsign, is_suffix];
                                            }
                                        },
                                    );

                                    if (new_callsigns[index][0].length == 0) {
                                        const last_non_empty_callsign = new_callsigns.findLastIndex(
                                            ([callsign, _]) => callsign.length > 0,
                                        );
                                        if (index >= last_non_empty_callsign) {
                                            new_callsigns.splice(last_non_empty_callsign + 1);
                                        }
                                    } else if (callsigns.length - 1 == index) {
                                        new_callsigns.push(["", false]);
                                    }

                                    if (new_callsigns.length > 0) {
                                        if (
                                            new_callsigns[new_callsigns.length - 1][0].length > 0 ||
                                            new_callsigns.length == 0
                                        ) {
                                            new_callsigns.push(["", false]);
                                        }
                                    }

                                    set_callsigns(new_callsigns);
                                }}
                            />
                            <button
                                onClick={() => {
                                    let new_callsigns = callsigns.map(
                                        ([callsign, is_suffix], inner_index) => {
                                            if (index == inner_index) {
                                                is_suffix = false;
                                            }
                                            return [callsign, is_suffix];
                                        },
                                    );
                                    set_callsigns(new_callsigns);
                                }}
                                className={
                                    button_base_classes +
                                    (!is_suffix
                                        ? "bg-green-600 text-white"
                                        : button_inactive_classes)
                                }
                                title="Prefix"
                            >
                                Pfx
                            </button>
                            <button
                                onClick={() => {
                                    let new_callsigns = callsigns.map(
                                        ([callsign, is_suffix], inner_index) => {
                                            if (index == inner_index) {
                                                is_suffix = true;
                                            }
                                            return [callsign, is_suffix];
                                        },
                                    );
                                    set_callsigns(new_callsigns);
                                }}
                                className={
                                    button_base_classes +
                                    (is_suffix
                                        ? "bg-green-600 text-white"
                                        : button_inactive_classes)
                                }
                                title="Suffix"
                            >
                                Sfx
                            </button>
                            {index != callsigns.length - 1 ? (
                                <div>
                                    <X
                                        size="24"
                                        on_click={() => {
                                            let new_callsigns = callsigns.filter(
                                                (callsign, inner_index) => inner_index != index,
                                            );
                                            set_callsigns(new_callsigns);
                                        }}
                                    />
                                </div>
                            ) : (
                                ""
                            )}
                            <br />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default CallsignsList;
