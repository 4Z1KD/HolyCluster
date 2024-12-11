import { useState } from "react";
import Maidenhead from "maidenhead";

import Input from "@/components/Input.jsx";
import Modal from "@/components/Modal.jsx";

function SettingsIcon({ size }) {
    return <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path stroke="#484848" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.723 1.723 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37 1 .608 2.296.07 2.572-1.065Z" />
        <path stroke="#484848" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z" />
    </svg>;
}

function Settings({
    settings,
    set_settings,
    set_map_controls,
    set_radius_in_km,
}) {
    const [temp_settings, set_temp_settings] = useState({ locator: "", default_radius: 0 })
    const is_locator_valid = Maidenhead.valid(temp_settings.locator);
    const is_default_radius_valid = (
        temp_settings.default_radius >= 1000 &&
        temp_settings.default_radius <= 20000 &&
        temp_settings.default_radius % 1000 == 0
    );
    const is_settings_valid = is_locator_valid && is_default_radius_valid;

    return <Modal
        title={<h3 className="text-3xl">Settings</h3>}
        button={<SettingsIcon size="40"></SettingsIcon>}
        on_open={() => {
            set_temp_settings(settings)
        }}
        on_apply={() => {
            if (is_settings_valid) {
                set_temp_settings({ locator: "", default_radius: 0 });
                set_map_controls(map_controls => {
                    const [lat, lon] = Maidenhead.toLatLon(temp_settings.locator);
                    map_controls.location.displayed_locator = temp_settings.locator;
                    map_controls.location.location = [lon, lat];
                    if (settings.default_radius != temp_settings.default_radius) {
                        set_radius_in_km(temp_settings.default_radius);
                    }
                })
                set_settings(settings => {
                    settings.locator = temp_settings.locator;
                    settings.default_radius = temp_settings.default_radius;
                });
            }

            return is_settings_valid;
        }}
        on_cancel={() => set_temp_settings({ locator: "", default_radius: 0 })}
    >
        <table className="my-3 mx-2">
            <tbody>
                <tr>
                    <td>My locator:&nbsp;&nbsp;</td>
                    <td>
                        <Input
                            value={temp_settings.locator}
                            className={is_locator_valid ? "" : "bg-red-200"}
                            onChange={event => {
                                set_temp_settings({ ...temp_settings, locator: event.target.value });
                            }
                            } />
                    </td>
                </tr>
                <tr>
                    <td>Default map radius:&nbsp;&nbsp;</td>
                    <td>
                        <Input
                            value={temp_settings.default_radius}
                            className={is_default_radius_valid ? "" : "bg-red-200"}
                            type="number"
                            step="1000"
                            min="1000"
                            max="20000"
                            onChange={event => {
                                set_temp_settings({ ...temp_settings, default_radius: event.target.value });
                            }
                            } />
                    </td>
                </tr>
            </tbody>
        </table>
    </Modal>
};
export default Settings;
