import FilterOptions from "@/components/FilterOptions.jsx";
import FilterButton from "@/components/FilterButton.jsx";
import About from "@/components/About.jsx";
import { bands, modes } from "@/filters_data.js";
import { useFilters } from "../hooks/useFilters";
import { useColors } from "../hooks/useColors";

function Hex(color) {
    return (
        <svg width="16" height="16" viewBox="0 0 256 256">
            <path
                fill={color}
                d="M228,80.668V175.332a16.0255,16.0255,0,0,1-8.12695,13.9292l-84,47.47852a16.08782,16.08782,0,0,1-15.7461,0l-84-47.478A16.02688,16.02688,0,0,1,28,175.332V80.668a16.0255,16.0255,0,0,1,8.127-13.9292l84-47.47852a16.08654,16.08654,0,0,1,15.7461,0l84,47.478A16.02688,16.02688,0,0,1,228,80.668Z"
            />
        </svg>
    );
}

function Triangle(color) {
    return (
        <svg width="16" height="16" viewBox="0 0 512 512">
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="drop" fill={color} transform="translate(32.000000, 42.666667)">
                    <path d="M246.312928,5.62892705 C252.927596,9.40873724 258.409564,14.8907053 262.189374,21.5053731 L444.667042,340.84129 C456.358134,361.300701 449.250007,387.363834 428.790595,399.054926 C422.34376,402.738832 415.04715,404.676552 407.622001,404.676552 L42.6666667,404.676552 C19.1025173,404.676552 7.10542736e-15,385.574034 7.10542736e-15,362.009885 C7.10542736e-15,354.584736 1.93772021,347.288125 5.62162594,340.84129 L188.099293,21.5053731 C199.790385,1.04596203 225.853517,-6.06216498 246.312928,5.62892705 Z" />
                </g>
            </g>
        </svg>
    );
}

function Square(color) {
    return (
        <svg className="ml-1" width="12" height="12" viewBox="0 0 16 16">
            <rect fill={color} width="100" height="100" />
        </svg>
    );
}

const mode_to_symbol = {
    SSB: Square,
    CW: Triangle,
    FT8: Hex,
    FT4: Hex,
    DIGI: Hex,
};

function FeedbackButton({ size }) {
    const { colors } = useColors();

    return (
        <a href="https://forms.gle/jak7KnvwCnBRN6QU7" target="_blank">
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                <title>Feedback form</title>
                <path
                    d="M8 9H16M8 13H14M18 4C18.7956 4 19.5587 4.31607 20.1213 4.87868C20.6839 5.44129 21 6.20435 21 7V15C21 15.7956 20.6839 16.5587 20.1213 17.1213C19.5587 17.6839 18.7956 18 18 18H13L8 21V18H6C5.20435 18 4.44129 17.6839 3.87868 17.1213C3.31607 16.5587 3 15.7956 3 15V7C3 6.20435 3.31607 5.44129 3.87868 4.87868C4.44129 4.31607 5.20435 4 6 4H18Z"
                    stroke={colors.buttons.utility}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </a>
    );
}

function LeftColumn({ spots_per_band_count, toggled_ui }) {
    const { filters, setFilters } = useFilters();

    const filter_group_classes = "p-1 flex flex-col text-center gap-2 ";
    const toggled_classes = toggled_ui.left
        ? "hidden "
        : "max-xl:absolute max-xl:flex z-50 border-r border-slate-300 ";

    const { colors } = useColors();

    return (
        <div
            className={toggled_classes + "xl:flex flex-col h-full items-center"}
            style={{
                backgroundColor: colors.theme.columns,
                borderColor: colors.theme.borders,
            }}
        >
            <div className={filter_group_classes + "pb-4 border-b-2 border-slate-300"}>
                {bands.map(band => {
                    const color = colors.bands[band];
                    return (
                        <FilterOptions
                            key={band}
                            filter_key="bands"
                            filter_value={band}
                            orientation="right"
                        >
                            {spots_per_band_count[band] != 0 ? (
                                <span className="absolute left-12 flex w-5 -translate-y-1 translate-x-1 z-10">
                                    <span className="relative inline-flex border border-gray-900 bg-red-600 text-white font-medium justify-center items-center rounded-full h-5 w-5 text-center text-[12px]">
                                        {spots_per_band_count[band]}
                                    </span>
                                </span>
                            ) : (
                                ""
                            )}
                            <FilterButton
                                text={band + "m"}
                                is_active={filters.bands[band]}
                                color={color}
                                text_color={colors.text[band]}
                                on_click={_ =>
                                    setFilters(_filters => ({
                                        ..._filters,
                                        bands: { ..._filters.bands, [band]: !_filters.bands[band] },
                                    }))
                                }
                                hover_brightness="125"
                                size="small"
                            />
                        </FilterOptions>
                    );
                })}
            </div>
            <div className={filter_group_classes + " pt-4"}>
                {modes.map(mode => {
                    return (
                        <FilterOptions
                            key={mode}
                            filter_key="modes"
                            filter_value={mode}
                            orientation="right"
                        >
                            <FilterButton
                                text={
                                    <>
                                        {mode}
                                        <div className="ml-1 ">
                                            {mode_to_symbol[mode](
                                                filters.modes[mode]
                                                    ? "#000000"
                                                    : colors.buttons.disabled,
                                            )}
                                        </div>
                                    </>
                                }
                                is_active={filters.modes[mode]}
                                on_click={() =>
                                    setFilters(_filters => ({
                                        ..._filters,
                                        modes: { ..._filters.modes, [mode]: !_filters.modes[mode] },
                                    }))
                                }
                                color={colors.buttons.modes}
                                size="small"
                            />
                        </FilterOptions>
                    );
                })}
            </div>
            <div className="mt-auto mb-2 space-y-3">
                <FeedbackButton size="36" />
                <About />
            </div>
        </div>
    );
}

export default LeftColumn;
