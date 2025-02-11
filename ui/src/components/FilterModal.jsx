import Modal from "@/components/Modal.jsx";
import Select from "@/components/Select.jsx";
import Input from "@/components/Input.jsx";
import { useColors } from "../hooks/useColors";

import { default as SearchSelect } from "react-select";
import { useState } from "react";

const dxcc_entities = [
    { value: "Israel", label: "Israel" },
    { value: "Italy", label: "Italy" },
];

function EditSymbol({ size }) {
    const { colors } = useColors();

    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path
                d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                stroke={colors.buttons.utility}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                stroke={colors.buttons.utility}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

const empty_temp_data = {
    type: "prefix",
    value: "",
    spotter_or_dx: "dx",
    action: "",
};

function FilterModal({}) {
    const [temp_data, set_temp_data] = useState(empty_temp_data);
    const { colors } = useColors();

    return (
        <Modal title="filter" button={<EditSymbol size="24"></EditSymbol>}>
            <table
                className="mt-3 mx-2 w-full border-separate border-spacing-y-2"
                style={{ color: colors.theme.text }}
            >
                <tbody>
                    <tr>
                        <td>Type:</td>
                        <td>
                            <Select
                                value={temp_data.type}
                                onChange={event => {
                                    let result = {
                                        ...temp_data,
                                        type: event.target.value,
                                    };
                                    if (
                                        event.target.value == "entity" ||
                                        temp_data.type == "entity"
                                    ) {
                                        result.value = "";
                                    }
                                    set_temp_data(result);
                                }}
                            >
                                <option value="prefix">Prefix</option>
                                <option value="suffix">Suffix</option>
                                <option value="entity">Entity</option>
                            </Select>
                        </td>
                    </tr>
                    <tr>
                        <td>{temp_data.type}:</td>
                        <td>
                            {temp_data.type == "entity" ? (
                                <SearchSelect
                                    value={temp_data.value}
                                    onChange={option => {
                                        console.log("OPTION:", option);
                                        set_temp_data({
                                            ...temp_data,
                                            value: option,
                                        });
                                    }}
                                    options={dxcc_entities}
                                />
                            ) : (
                                <Input
                                    value={temp_data.value}
                                    onChange={event => {
                                        set_temp_data({
                                            ...temp_data,
                                            value: event.target.value,
                                        });
                                    }}
                                />
                            )}
                        </td>
                    </tr>
                    {temp_data.type == "entity" ? (
                        ""
                    ) : (
                        <tr>
                            <td>Selection:</td>
                            <td>
                                <Select
                                    value={temp_data.dx_or_de}
                                    onChange={event => {
                                        set_temp_data({
                                            ...temp_data,
                                            spotter_or_dx: event.target.value,
                                        });
                                    }}
                                >
                                    <option value="dx">DX</option>
                                    <option value="spotter">Spotter</option>
                                </Select>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </Modal>
    );
}

export default FilterModal;
