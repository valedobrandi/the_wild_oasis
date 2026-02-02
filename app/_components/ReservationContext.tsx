"use client";
import React, { createContext, useState } from "react";

type Range = { from: Date | undefined; to: Date | undefined } | undefined;

interface ReservationContextType {
    range: Range;
    setRange: React.Dispatch<React.SetStateAction<Range>>;
    resetRange: () => void;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

function ReservationContextProvider(props: { children: React.ReactNode }) {
    const [range, setRange] = useState<Range>(undefined);
    function resetRange() {
        setRange(undefined);
    }

    return (
        <ReservationContext.Provider value={{ range, setRange, resetRange }}>
            {props.children}
        </ReservationContext.Provider>
    );
}

function useReservation() {
    const context = React.useContext(ReservationContext);
    if (context === undefined) {
        throw new Error(
            "useReservation must be used within a ReservationContextProvider",
        );
    }
    return context;
}

export { ReservationContextProvider, useReservation };
