import { useState } from "react";

import Input from "@/components/Input.jsx";
import Modal from "@/components/Modal.jsx";

function Alert({ size, color }) {
    return <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
    >
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g fill={color} fillRule="nonzero">
                <path d="M12,1.99622391 C16.0499218,1.99622391 19.3566662,5.19096617 19.4958079,9.24527692 L19.5,9.49622391 L19.5,13.5931945 L20.8800025,16.7492056 C20.949058,16.9071328 20.9847056,17.0776351 20.9847056,17.25 C20.9847056,17.9403559 20.4250615,18.5 19.7347056,18.5 L15,18.5014962 C15,20.1583504 13.6568542,21.5014962 12,21.5014962 C10.4023191,21.5014962 9.09633912,20.2525762 9.00509269,18.6777689 L8.99954674,18.4992239 L4.27486429,18.5 C4.10352557,18.5 3.93401618,18.4647755 3.7768624,18.3965139 C3.14366026,18.121475 2.85331154,17.3852002 3.1283504,16.7519981 L4.5,13.594148 L4.50000001,9.4961162 C4.50059668,5.34132493 7.85208744,1.99622391 12,1.99622391 Z M13.4995467,18.4992239 L10.5,18.5014962 C10.5,19.3299233 11.1715729,20.0014962 12,20.0014962 C12.7796961,20.0014962 13.4204487,19.4066081 13.4931334,18.6459562 L13.4995467,18.4992239 Z M12,3.49622391 C8.67983848,3.49622391 6.00047762,6.17047646 6,9.49622391 L6,13.905852 L4.65602014,17 L19.3525351,17 L18,13.9068055 L18.0001102,9.5090803 L17.9963601,9.28387824 C17.8853006,6.05040449 15.2415749,3.49622391 12,3.49622391 Z M21,8.25 L23,8.25 C23.4142136,8.25 23.75,8.58578644 23.75,9 C23.75,9.37969577 23.4678461,9.69349096 23.1017706,9.74315338 L23,9.75 L21,9.75 C20.5857864,9.75 20.25,9.41421356 20.25,9 C20.25,8.62030423 20.5321539,8.30650904 20.8982294,8.25684662 L21,8.25 Z M1,8.25 L3,8.25 C3.41421356,8.25 3.75,8.58578644 3.75,9 C3.75,9.37969577 3.46784612,9.69349096 3.10177056,9.74315338 L3,9.75 L1,9.75 C0.585786438,9.75 0.25,9.41421356 0.25,9 C0.25,8.62030423 0.532153882,8.30650904 0.898229443,8.25684662 L1,8.25 Z M22.6,2.55 C22.8259347,2.85124623 22.7909723,3.26714548 22.5337844,3.52699676 L22.45,3.6 L20.45,5.1 C20.1186292,5.34852814 19.6485281,5.28137085 19.4,4.95 C19.1740653,4.64875377 19.2090277,4.23285452 19.4662156,3.97300324 L19.55,3.9 L21.55,2.4 C21.8813708,2.15147186 22.3514719,2.21862915 22.6,2.55 Z M2.45,2.4 L4.45,3.9 C4.78137085,4.14852814 4.84852814,4.61862915 4.6,4.95 C4.35147186,5.28137085 3.88137085,5.34852814 3.55,5.1 L1.55,3.6 C1.21862915,3.35147186 1.15147186,2.88137085 1.4,2.55 C1.64852814,2.21862915 2.11862915,2.15147186 2.45,2.4 Z">
        </path>
            </g>
        </g>
    </svg>
}

function Alerts({ alerts, set_alerts }) {
    const color = alerts.length > 0 ? "#00CC00" : "#212121";
    const [temp_alerts, set_temp_alerts] = useState([""])
    const [pending_alert, set_pending_alert] = useState("")

    const [is_help_displayed, set_is_help_displayed] = useState(false)
    const exmaple_pattern_classes = "bg-slate-300 rounded-sm p-0.5";

    function reset_state() {
        set_temp_alerts([])
        set_pending_alert("")
        set_is_help_displayed(false)
    }

    return <Modal
        title={
            <div className="flex justify-between items-center w-full">
                <h3 className="text-3xl">Alerts</h3>
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
        button={<Alert size="32px" color={color}></Alert>}
        on_open={() => {
            if (alerts.length > 0) {
                set_temp_alerts(alerts);
            }
        }}
        on_apply={() => {
            let new_alerts;
            if (pending_alert != "") {
                new_alerts = temp_alerts.concat(pending_alert);
            } else {
                new_alerts = temp_alerts;
            }

            // Convert all patterns to uppercase and then remove all duplicated entries
            new_alerts = [...new Set(new_alerts.map(alert => alert.toUpperCase()))];
            new_alerts = new_alerts.filter(alert => alert.length > 0);

            set_alerts(new_alerts)
            reset_state()
            return true;
        }}
        on_cancel={reset_state}
    >
        <div
            className="mx-2 text-wrap w-80 cursor-pointer"
            onClick={() => set_is_help_displayed(!is_help_displayed)}
        >
            {
                is_help_displayed ? <small>
                    You can highlight a pattern of a callsign. For example,<br/>
                    Israeli stations: <code className={exmaple_pattern_classes}>4X*</code>,&nbsp;&nbsp;
                                      <code className={exmaple_pattern_classes}>4Z*</code><br/>
                    Portable stations: <code className={exmaple_pattern_classes}>*/P</code><br/>
                </small> : ""
            }
        </div>
        <button
            className="flex items-center justify-center w-8 h-8 p-0 m-4 text-green-400 text-2xl font-bold leading-none rounded-full bg-slate-200"
            onClick={() => {
                set_temp_alerts(old_state => {
                    const state = structuredClone(old_state);
                    state.push("");
                    return state;
                })
            }}
        >
            +
        </button>
        <div className="my-4 mx-2">
            {temp_alerts.map((alert, index) => {
                return <div key={index}>
                    <Input value={alert} className="mb-2 mr-2" onChange={event => {
                        set_temp_alerts(old_state => {
                            const state = structuredClone(old_state);
                            state[index] = event.target.value;
                            return state;
                        })
                    }}></Input>
                    <button
                        onClick={() => {
                            set_temp_alerts(old_state => {
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
