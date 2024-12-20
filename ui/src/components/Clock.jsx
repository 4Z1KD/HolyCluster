import { useState, useEffect } from "react";

function clock() {
    const [time, set_current_time] = useState(new Date());

    useEffect(() => {
        let interval_id = setInterval(() => set_current_time(new Date()), 1000);
        return () => {
            clearInterval(interval_id);
        };
    });

    function pad(number) {
        return number.toString().padStart(2, "0");
    }
    return (
        <div className="hidden 2xs:flex items-center text-center font-bold text-xl min-w-18">
            {`${pad(time.getUTCHours())}:${pad(time.getUTCMinutes())}z`}
        </div>
    );
}

export default clock;
