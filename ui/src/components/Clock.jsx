import { useState, useEffect } from "react";

function clock() {
    const [time, set_current_time] = useState(new Date());

    useEffect(() => {
        setInterval(() => set_current_time(new Date()), 1000)
    })
    function pad(number) {
        return number.toString().padStart(2, "0");
    }
    return <div className="flex items-center text-center font-bold text-xl">
        {`${pad(time.getUTCHours())}:${pad(time.getUTCMinutes())}:${pad(time.getUTCSeconds())}z`}
    </div>
}

export default clock;
