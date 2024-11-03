import { useState } from "react";

import Input from "@/components/Input.jsx";
import Modal from "@/components/Modal.jsx";

function Alerts({ callsigns, set_callsigns, button, title, help_text }) {
    const [temp_callsigns, set_temp_callsigns] = useState([""])

    const [is_help_displayed, set_is_help_displayed] = useState(false)

    function reset_state() {
        set_temp_callsigns([])
        set_is_help_displayed(false)
    }

    return <Modal
        title={
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

        }
        button={button}
        on_open={() => {
            if (callsigns.length > 0) {
                set_temp_callsigns(callsigns);
            }
        }}
        on_apply={() => {
            // Convert all patterns to uppercase and then remove all duplicated entries
            let new_callsigns = [...new Set(temp_callsigns.map(callsign => callsign.toUpperCase()))];
            new_callsigns = new_callsigns.filter(callsign => callsign.length > 0);

            set_callsigns(new_callsigns)
            reset_state()
            return true;
        }}
        on_cancel={reset_state}
    >
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
    </Modal>
}

export default Alerts;
