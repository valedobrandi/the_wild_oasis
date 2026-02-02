"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Filter() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    function handleFilterChange(filter: string) {
       const params = new URLSearchParams(searchParams);
       params.set("maxCapacity", filter);
       router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
    return (
        <div className="border border-primary-800 flex">
            <button
                onClick={() => handleFilterChange("all")}
                className="px-5 py-2 hover:bg-primary-700">
                All cabins
            </button>
            <button
                onClick={() => handleFilterChange("small")}
                className="px-5 py-2 hover:bg-primary-700">
                1&ndash;3 guests
            </button>
            <button
                onClick={() => handleFilterChange("medium")}
                className="px-5 py-2 hover:bg-primary-700">
                4&ndash;7 guests
            </button>
            <button
                onClick={() => handleFilterChange("large")}
                className="px-5 py-2 hover:bg-primary-700">
                8&ndash;12 guests
            </button>
        </div>
    )
}