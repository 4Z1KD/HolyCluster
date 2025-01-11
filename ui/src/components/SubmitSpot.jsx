import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

import Input from "@/components/Input.jsx";
import Button from "@/components/Button.jsx";
import Modal from "@/components/Modal.jsx";
import { useColors } from "@/hooks/useColors";

function SubmitIcon({ size }) {
    const { colors } = useColors();
    return (
        <svg fill={colors.buttons.utility} width={size} height={size} viewBox="0 0 32 32">
            <title>Submit new spot</title>
            <path d="M24 12h-16v-4h16v4zM16.001 16.52l-8.485 8.485 2.828 2.828 5.657-5.657 5.657 5.657 2.828-2.828-8.485-8.485z" />
        </svg>
    );
}

const empty_temp_data = {
    callsign: "",
    freq: 0,
};

function connect_to_submit_spot_endpoint(on_successful_submit) {
    const host = window.location.host;
    const protocol = window.location.protocol;
    const websocket_url = (protocol == "https:" ? "wss:" : "ws:") + "//" + host + "/submit_spot";

    const { sendJsonMessage, readyState, lastJsonMessage } = useWebSocket(websocket_url);

    useEffect(() => {
        console.log(lastJsonMessage);
        if (lastJsonMessage != null) {
            if ("status" in lastJsonMessage) {
                if (lastJsonMessage.status == "success") {
                    on_successful_submit(lastJsonMessage);
                } else {
                    console.log("Failed to submit spot:", lastJsonMessage);
                }
            }
        }
    }, [lastJsonMessage]);

    function submit_spot(spotter_callsign, dx_callsign, freq) {
        if (readyState == ReadyState.OPEN) {
            sendJsonMessage({ spotter_callsign, dx_callsign, freq });
        }
    }
    return { submit_spot };
}

function SubmitSpot({ current_callsign }) {
    const [temp_data, set_temp_data] = useState(empty_temp_data);
    const [submit_status, set_submit_status] = useState(null);
    const { colors, setTheme } = useColors();

    function on_successful_submit(response) {
        console.log("Success!", response);
    }
    let { submit_spot } = connect_to_submit_spot_endpoint(on_successful_submit);

    function reset_temp_data() {
        set_temp_data(empty_temp_data);
    }

    return (
        <Modal
            title={
                <h3 className="text-3xl" style={{ color: colors.theme.text }}>
                    Submit new spot
                </h3>
            }
            button={<SubmitIcon size="40"></SubmitIcon>}
            on_open={() => reset_temp_data()}
        >
            <table
                className="my-3 mx-2 w-full border-separate border-spacing-y-2"
                style={{ color: colors.theme.text }}
            >
                <tbody>
                    <tr>
                        <td>Callsign:</td>
                        <td>
                            <Input
                                value={temp_data.callsign}
                                maxLength={11}
                                className="uppercase"
                                onChange={event => {
                                    set_temp_data({
                                        ...temp_data,
                                        callsign: event.target.value.toUpperCase(),
                                    });
                                }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Frequency:</td>
                        <td>
                            <Input
                                value={temp_data.freq}
                                type="number"
                                onChange={event => {
                                    set_temp_data({
                                        ...temp_data,
                                        freq: event.target.value,
                                    });
                                }}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="flex justify-center pb-5">
                <Button
                    on_click={() =>
                        submit_spot(current_callsign, temp_data.callsign, temp_data.freq)
                    }
                >
                    Submit
                </Button>
            </div>
        </Modal>
    );
}

export default SubmitSpot;
