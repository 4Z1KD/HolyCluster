import React, { useState } from "react";

function Propagation(data) {
    //let prop = {"a_index": 88, "k_index": 4, "sfi": 219}
    if (data.propagation===undefined) {
        return (<div></div>)
    }

    const [isOpen, setIsOpen] = useState(true);    
    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    };

    const a = Math.round(data.propagation.a_index);
    const k = Math.round(data.propagation.k_index);
    const sfi = Math.round(data.propagation.sfi);

    
    
    let a_color = "blue"
    let a_deg = "rotate-45"
    if (a <=6) {
        a_color = "bg-green";
        a_deg = "rotate-12";
    }
    else if (a > 6 && a <= 9) {
        a_color = "bg-yellow";
        a_deg = "rotate-45";
    }
    else {
        a_color = "bg-red";
        a_deg = "rotate-90";
    }

    let k_color = "blue"
    let k_deg = "rotate-45"
    if (k <=1) {
        k_color = "bg-green";
        k_deg = "rotate-1";
    }
    else if (k > 1 && k <= 2) {
        k_color = "bg-yellow";
        k_deg = "rotate-[30deg]";
    }
    else if (k > 2 && k <= 4) {
        k_color = "bg-orange";
        k_deg = "rotate-[60deg]";
    }
    else {
        k_color = "bg-red";
        k_deg = "rotate-90";
    }

    let sfi_color = "blue"
    let sfi_deg = "rotate-45"
    if (sfi <=70) {
        sfi_color = "bg-red";
        sfi_deg = "rotate-12";
    }
    else if (sfi > 70 && sfi <= 80) {
        sfi_color = "bg-yellow";
        sfi_deg = "rotate-45";
    }
    else if (sfi > 80 && sfi <= 90) {
        sfi_color = "bg-orange";
        sfi_deg = "rotate-[60deg]";
    }
    else {
        sfi_color = "bg-green";
        sfi_deg = "rotate-90";
}

    return (
        <div className="">
            <div className="cursor-pointer bg-gray-200 p-2 flex justify-between items-center" onClick={toggleCollapse}>
                <div className="text-xs font-semibold">
                {isOpen ? (
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                    />
                </svg>
                ) : 
                (
                    <div className="justify-center items-center">
                      <span className={`${a_color}-400 text-sm font-medium py-1 px-2 rounded-full mr-2`}>
                        a: {a}
                      </span>
                      <span className={`${k_color}-400 text-sm font-medium py-1 px-2 rounded-full mr-2`}>
                        k: {k}
                      </span>
                      <span className={`${sfi_color}-400 text-sm font-medium py-1 px-2 rounded-full mr-2`}>
                        sfi: {sfi}
                      </span>
                    </div>
                  )
                }
                </div>
                {/* Arrow Icon */}
                <div
                className={`transition-transform transform ${
                    isOpen ? "rotate-180" : ""
                }`}
                >
                
                </div>
            </div>
            {isOpen && (
            <div>
                <div className="p-3">
                    <div className={a_color + "-400 relative flex aspect-[2] items-center justify-center overflow-hidden rounded-t-full"}>
                        <div className={a_deg + " absolute top-0 aspect-square w-full bg-gradient-to-tr from-transparent from-50% to-white to-50% transition-transform duration-500"}></div>
                        <div className={a_color + "-200 absolute top-1/4 flex aspect-square w-3/4 justify-center rounded-full"}></div>
                        <div className="absolute bottom-2 w-full truncate text-center text-lg leading-none">a: {a}</div>
                    </div>
                </div>
                <div className="p-3">
                    <div className={k_color + "-400 relative flex aspect-[2] items-center justify-center overflow-hidden rounded-t-full"}>
                        <div className={k_deg + " absolute top-0 aspect-square w-full bg-gradient-to-tr from-transparent from-50% to-white to-50% transition-transform duration-500"}></div>
                        <div className={k_color + "-200 absolute top-1/4 flex aspect-square w-3/4 justify-center rounded-full"}></div>
                        <div className="absolute bottom-2 w-full truncate text-center text-lg leading-none">k: {k}</div>
                    </div>
                </div>
                <div className="p-3">
                    <div className={sfi_color + "-400 relative flex aspect-[2] items-center justify-center overflow-hidden rounded-t-full"}>
                        <div className={sfi_deg + " absolute top-0 aspect-square w-full bg-gradient-to-tr from-transparent from-50% to-white to-50% transition-transform duration-500"}></div>
                        <div className={sfi_color + "-200 absolute top-1/4 flex aspect-square w-3/4 justify-center rounded-full"}></div>
                        <div className="absolute bottom-2 w-full truncate text-center text-lg leading-none">sfi: {sfi}</div>
                    </div>
                </div>
            </div>
            )}
            </div>        
    );
}

export default Propagation;
