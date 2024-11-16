import { useState } from "react";

import Button from "@/components/Button.jsx";
import Input from "@/components/Input.jsx";

function CallsignsList({ callsigns, set_callsigns, title, help_text }) {
    const [temp_callsigns, set_temp_callsigns] = useState(callsigns)

    const [is_help_displayed, set_is_help_displayed] = useState(false)

    function reset_state() {
        set_temp_callsigns(callsigns)
    }

    return <div className="p-2">
        <div className="flex justify-between items-center w-full">
            <h3 className="text-3xl">{title}</h3>
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
                state.push("");
                return state;
            })}
        >
            +
        </button>
        <div className="my-4 mx-2">
            {temp_callsigns.map((callsign, index) => {
                return <div key={index}>
                    <Input value={callsign} className="mb-2 mr-2" onChange={event => {
                        set_temp_callsigns(old_state => {
                            const state = structuredClone(old_state);
                            state[index] = event.target.value;
                            return state;
                        })
                    }}></Input>
                    <button
                        onClick={() => {
                            set_temp_callsigns(old_state => {
                                const state = structuredClone(old_state);
                                state.splice(index, 1);
                                return state;
                            })
                        }}
                    >❌</button>
                    <br/>
                </div>
            })}
        </div>


        <div className="flex items-center justify-around p-3">
            <Button color="red" on_click={reset_state}>
                Cancel
            </Button>
            <Button color="blue" on_click={() => {
                // Convert all patterns to uppercase and then remove all duplicated entries
                let new_callsigns = [...new Set(temp_callsigns.map(callsign => callsign.toUpperCase()))];
                new_callsigns = new_callsigns.filter(callsign => callsign.length > 0);
                set_callsigns(new_callsigns);
            }}>
                Apply
            </Button>
        </div>
    </div>;
}

export default CallsignsList;
