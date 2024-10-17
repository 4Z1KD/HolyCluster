import BandSpots from "@/components/BandSpots.jsx";
import { band_colors } from "@/bands_and_modes.js";

function TextualSpots({
    filters,
    spots,
    hovered_spot,
    set_hovered_spot,
    on_spot_click,
    alerts,
}) {
    const spots_by_band = spots.reduce((acc, item) => {
        if (filters.bands[item.band]) {
            if (!acc[item.band]) {
                  acc[item.band] = [];
            }
            acc[item.band].push(item);
        }
        return acc;
    }, {});

    let band_tables = Object.entries(spots_by_band).map(([band, spots]) => {
        let color = band_colors.get(Number(band));
        return [band, <BandSpots
            key={band}
            band={band}
            color={color}
            spots={spots_by_band[band]}
            hovered_spot={hovered_spot}
            set_hovered_spot={set_hovered_spot}
            on_spot_click={on_spot_click}
            alerts={alerts}
        />];
    });
    band_tables = Object.fromEntries(band_tables);

    const band_size_scores = Object.entries(spots_by_band).map(([band, spots]) => {
        return [band, 1 + Math.max(spots.length, 11)];
    });

    let second_column = band_size_scores;
    second_column.reverse();

    const total_sum = band_size_scores.reduce((acc, [_, score]) => acc + score, 0);
    const first_column = [];
    let first_column_sum = 0;
    while (first_column_sum < (total_sum / 2)) {
        let [band, score] = second_column.pop();
        first_column_sum += score;
        first_column.push([band, score]);
    }

    return <div className="h-fit flex gap-2">
        <div>
            {first_column.map(([ band, _ ]) => band_tables[band])}
        </div>
        <div>
            {second_column.map(([band, _]) => band_tables[band])}
        </div>
    </div>;
}

export default TextualSpots;
