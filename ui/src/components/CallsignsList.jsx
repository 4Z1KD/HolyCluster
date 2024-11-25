import { useState } from "react";

import Button from "@/components/Button.jsx";
import Input from "@/components/Input.jsx";

function CallsignsList({ callsigns, set_callsigns, title, pre = "" }) {
    const [temp_callsigns, set_temp_callsigns] = useState(callsigns);

    if (temp_callsigns.length == 0 || temp_callsigns[temp_callsigns.length - 1][0].length > 0) {
        temp_callsigns.push(["", false]);
    }

    function reset_state() {
        set_temp_callsigns(callsigns)
    }

    const button_base_classes = "flex items-center justify-center p-2 w-9 h-9 rounded-lg mr-2 ";
    const button_inactive_classes = "border-2 border-slate-700 bg-slate-200";

    return <div className="p-2">
        <h3 className="text-2xl text-center">{title}</h3>
        <div className="my-4 mx-2">
            {pre}
            {temp_callsigns.map(([callsign, is_suffix], index) => {
                return <div className="flex justify-start w-full" key={index}>
                    <Input value={callsign} className="mb-2 mr-2" onChange={event => {
                        set_temp_callsigns(old_state => {
                            let state = structuredClone(old_state);
                            state[index] = [event.target.value, is_suffix];
                            if (state[index][0].length == 0) {
                                const last_non_empty_callsign = state.findLastIndex(
                                    ([callsign, _]) => callsign.length > 0
                                );
                                if (index >= last_non_empty_callsign) {
                                    state.splice(last_non_empty_callsign + 1);
                                }
                            } else if (temp_callsigns.length - 1 == index) {
                                state.push(["", false]);
                            }
                            return state;
                        })
                    }}></Input>
                    <button
                        onClick={() => set_temp_callsigns(old_state => {
                            const state = structuredClone(old_state);
                            state[index][1] = false;
                            return state;
                        })}
                        className={button_base_classes + (!is_suffix ? "bg-green-600 text-white" : button_inactive_classes)}
                        title="Prefix"
                    >
                        Pfx
                    </button>
                    <button
                        onClick={() => set_temp_callsigns(old_state => {
                            const state = structuredClone(old_state);
                            state[index][1] = true;
                            return state;
                        })}
                        className={button_base_classes + (is_suffix ? "bg-green-600 text-white" : button_inactive_classes)}
                        title="Suffix"
                    >
                        Sfx
                    </button>
                    {index != 0 || temp_callsigns.length > 1 ?
                        <div className="ml-auto">
                            <button
                                onClick={() => {
                                    set_temp_callsigns(old_state => {
                                        const state = structuredClone(old_state);
                                        state.splice(index, 1);
                                        return state;
                                    })
                                }}
                            >❌</button>
                        </div>
                        : ""
                    }
                    <br/>
                </div>
            })}
        </div>


        <div className="flex items-center justify-around p-1">
            <Button color="red" on_click={reset_state} className="px-2 py-1">
                Cancel
            </Button>
            <Button color="blue" className="px-2 py-1" on_click={() => {
                // Convert all patterns to uppercase and then remove all duplicated entries
                const new_callsigns = [...new Set(temp_callsigns
                    .map(([callsign, is_suffix]) => [callsign.toUpperCase(), is_suffix])
                    .filter(([callsign, _]) => callsign.length > 0)
                )];
                if (new_callsigns.length > 0) {
                    if (new_callsigns[new_callsigns.length - 1][0].length > 0 || new_callsigns.length == 0) {
                        new_callsigns.push(["", false]);
                    }
                }

                set_temp_callsigns(new_callsigns);
                set_callsigns(new_callsigns);
            }}>
                Apply
            </Button>
        </div>
    </div>;
}

export default CallsignsList;
