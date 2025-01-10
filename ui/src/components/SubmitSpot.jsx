import { useState } from "react";

import Input from "@/components/Input.jsx";
import Modal from "@/components/Modal.jsx";
import { useColors } from "@/hooks/useColors";

function SubmitIcon({ size }) {
    return (
        <svg fill="#000000" width={size} height={size} viewBox="0 0 32 32">
            <title>Submit new spot</title>
            <path d="M24 12h-16v-4h16v4zM16.001 16.52l-8.485 8.485 2.828 2.828 5.657-5.657 5.657 5.657 2.828-2.828-8.485-8.485z" />
        </svg>
    );
}

const empty_temp_data = {
    callsign: "",
    freq: 0,
};

function SubmitSpot({}) {
    const [temp_data, set_temp_data] = useState(empty_temp_data);
    const { colors, setTheme } = useColors();

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
            on_apply={() => {
                return true;
            }}
            on_cancel={() => reset_temp_data()}
            apply_text="Submit spot"
        >
            <table
                className="my-3 mx-2 border-separate border-spacing-y-2"
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
        </Modal>
    );
}

export default SubmitSpot;
