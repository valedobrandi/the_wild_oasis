"use client";

import Image from "next/image";
import { updateProfileAction } from "../_lib/actions";

type Guest = {
    id: string;
    email: string;
    fullName: string;
    nationalID?: string;
    nationality?: string;
    countryFlag?: string;
};

export function UpdateProfile({ children, guest }: { children: React.ReactNode; guest: Guest }) {


    const { fullName, email, countryFlag } = guest;

    return (
        <form action={updateProfileAction} className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col">
            <div className="space-y-2">
                <label>Full name</label>
                <input
                    disabled
                    name="fullName"
                    defaultValue={fullName}
                    className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
                />
            </div>

            <div className="space-y-2">
                <label>Email address</label>
                <input
                    disabled
                    name="email"
                    defaultValue={email}
                    className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
                />
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label htmlFor="nationality">Where are you from?</label>
                    <div className="flex-1 relative">
                        <Image
                            src={countryFlag || "/logo.png"}
                            fill
                            alt="Country flag"
                            className="h-5 rounded-sm object-contain"
                        />
                    </div>
                </div>
                {children}
            </div>

            <div className="space-y-2">
                <label htmlFor="nationalID">National ID number</label>
                <input
                    name="nationalID"
                    defaultValue={guest.nationalID || ""}
                    className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
                />
            </div>

            <div className="flex justify-end items-center gap-6">
                <button className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300">
                    Update profile
                </button>
            </div>
        </form>
    )
}