function Propagation(propagation) {
    //let prop = propagation;
    let prop = [{"id": 127865, "station": "DK0WCY", "time": "Wed 01/Jan/2025 17:02Z", "a": 18, "k": 8, "sfi": 218, "r": 162, "expk": 6, "aurora": false}]
    
    let a_color = "blue"
    let a_deg = "rotate-45"
    if (prop[0].a <=6) {
        a_color = "bg-green";
        a_deg = "rotate-12";
    }
    else if (prop[0].a > 6 && prop[0].a <= 9) {
        a_color = "bg-yellow";
        a_deg = "rotate-45";
    }
    else {
        a_color = "bg-red";
        a_deg = "rotate-90";
    }

    let k_color = "blue"
    let k_deg = "rotate-45"
    if (prop[0].k <=1) {
        k_color = "bg-green";
        k_deg = "rotate-1";
    }
    else if (prop[0].k == 2) {
        k_color = "bg-yellow";
        k_deg = "rotate-[30deg]";
    }
    else if (prop[0].k > 2 && prop[0].k <= 4) {
        k_color = "bg-orange";
        k_deg = "rotate-[60deg]";
    }
    else {
        k_color = "bg-red";
        k_deg = "rotate-90";
    }

    let sfi_color = "blue"
    let sfi_deg = "rotate-45"
    if (prop[0].sfi <=70) {
        sfi_color = "bg-red";
        sfi_deg = "rotate-12";
    }
    else if (prop[0].sfi > 70 && prop[0].sfi <= 80) {
        sfi_color = "bg-yellow";
        sfi_deg = "rotate-45";
    }
    else if (prop[0].sfi > 80 && prop[0].sfi <= 90) {
        sfi_color = "bg-orange";
        sfi_deg = "rotate-[60deg]";
    }
    else {
        sfi_color = "bg-green";
        sfi_deg = "rotate-90";
}

    return (
        <div>
            <div className="p-3">
                <div className={a_color + "-400 relative flex aspect-[2] items-center justify-center overflow-hidden rounded-t-full"}>
                    <div className={a_deg + " absolute top-0 aspect-square w-full bg-gradient-to-tr from-transparent from-50% to-white to-50% transition-transform duration-500"}></div>
                    <div className={a_color + "-200 absolute top-1/4 flex aspect-square w-3/4 justify-center rounded-full"}></div>
                    <div className="absolute bottom-2 w-full truncate text-center text-lg leading-none">a: {prop[0].a}</div>
                </div>
            </div>
            <div className="p-3">
                <div className={k_color + "-400 relative flex aspect-[2] items-center justify-center overflow-hidden rounded-t-full"}>
                    <div className={k_deg + " absolute top-0 aspect-square w-full bg-gradient-to-tr from-transparent from-50% to-white to-50% transition-transform duration-500"}></div>
                    <div className={k_color + "-200 absolute top-1/4 flex aspect-square w-3/4 justify-center rounded-full"}></div>
                    <div className="absolute bottom-2 w-full truncate text-center text-lg leading-none">k: {prop[0].k}</div>
                </div>
            </div>
            <div className="p-3">
                <div className={sfi_color + "-400 relative flex aspect-[2] items-center justify-center overflow-hidden rounded-t-full"}>
                    <div className={sfi_deg + " absolute top-0 aspect-square w-full bg-gradient-to-tr from-transparent from-50% to-white to-50% transition-transform duration-500"}></div>
                    <div className={sfi_color + "-200 absolute top-1/4 flex aspect-square w-3/4 justify-center rounded-full"}></div>
                    <div className="absolute bottom-2 w-full truncate text-center text-lg leading-none">sfi: {prop[0].sfi}</div>
                </div>
            </div>
        </div>
        
    );
}

export default Propagation;
