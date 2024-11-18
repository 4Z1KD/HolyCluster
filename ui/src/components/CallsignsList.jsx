import { useState } from "react";

import Button from "@/components/Button.jsx";
import Input from "@/components/Input.jsx";

function CallsignsList({ callsigns, set_callsigns, title, help_text }) {
    const to_temp_callsigns = callsigns => callsigns.map(callsign => [callsign, false]);
    const [temp_callsigns, set_temp_callsigns] = useState(to_temp_callsigns(callsigns))

    const [is_help_displayed, set_is_help_displayed] = useState(false)

    function reset_state() {
        set_temp_callsigns(to_temp_callsigns(callsigns))
    }

    return <div className="p-2">
        <div className="flex justify-between items-center w-full">
            <h3 className="text-2xl">{title}</h3>
            <div
                className="cursor-pointer"
                onClick={() => set_is_help_displayed(!is_help_displayed)}
            >
                {
                    !is_help_displayed
                    ? <span className="inline-block text-center rounded-full bg-blue-600 w-6 h-6 font-bold text-white">?</span>
                    : <div>❌</div>
                }
            </div>
        </div>
        <div
            className="mx-2 text-wrap w-80 cursor-pointer"
            onClick={() => set_is_help_displayed(!is_help_displayed)}
        >
            {is_help_displayed ? help_text : ""}
        </div>
        <button
            className="flex items-center justify-center w-8 h-8 p-0 m-4 text-green-400 text-2xl font-bold leading-none rounded-full bg-slate-200"
            onClick={() => set_temp_callsigns(old_state => {
                const state = structuredClone(old_state);
                state.push(["", false]);
                return state;
            })}
        >
            +
        </button>
        <div className="my-4 mx-2">
            {temp_callsigns.map(([callsign, is_suffix], index) => {
                return <div className="flex justify-start w-full" key={index}>
                    <Input value={callsign} className="mb-2 mr-2" onChange={event => {
                        set_temp_callsigns(old_state => {
                            const state = structuredClone(old_state);
                            state[index] = [event.target.value, is_suffix];
                            return state;
                        })
                    }}></Input>
                    <button
                        onClick={() => set_temp_callsigns(old_state => {
                            const state = structuredClone(old_state);
                            state[index][1] = !state[index][1];
                            return state;
                        })}
                        className={(
                            "flex items-center justify-center p-2 w-9 h-9 rounded-lg mr-2 "
                            + (is_suffix ? "bg-indigo-500" : "bg-teal-500")
                        )}
                    >
                        {is_suffix ? "Sx" : "Px"}
                    </button>
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
                let new_callsigns = [...new Set(temp_callsigns.map(([callsign, is_suffix]) => {
                    callsign = callsign.toUpperCase();
                    if (is_suffix) {
                        return "*" + callsign;
                    } else {
                        return callsign + "*";
                    }
                }))];
                new_callsigns = new_callsigns.filter(callsign => callsign.length > 0);
                set_callsigns(new_callsigns);
            }}>
                Apply
            </Button>
        </div>
    </div>;
}

export default CallsignsList;
