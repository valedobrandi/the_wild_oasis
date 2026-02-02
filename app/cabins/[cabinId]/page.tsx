import Cabin from "@/app/_components/Cabin";
import Reservation from "@/app/_components/Reservation";
import Spinner from "@/app/_components/Spinner";
import {  getCabin, getCabins } from "@/app/_lib/apiCabins";
import "@/app/_styles/index.css";
import { Suspense } from "react";

export async function generateMetadata(props: { params: { cabinId: string } }) {
    const cabin = await getCabin(props.params.cabinId);
    return {
        title: `Cabin ${cabin.name} Details`,
        description: `Discover your perfect getaway at The Wild Oasis - Cabin ${cabin.name}, where nature meets comfort in our charming cabins.`,
    };
}

export async function generateStaticParams() {
    const cabins = await getCabins();
    return cabins.map((cabin: { id: string }) => ({
        cabinId: String(cabin.id),
    }));
}

export default async function Page(props: { params: { cabinId: string } }) {

     const [cabin]  = 
        await Promise.all([
            getCabin(props.params.cabinId),
        ]);

    const { 
        /* id ,*/ 
        name, 
        maxCapacity, 
        /* regularPrice ,*/ 
        /* discount ,*/ 
        image, 
        description 
    } = cabin;


    return (
        <div className="max-w-6xl mx-auto mt-8">
            <Cabin cabin={cabin} />
            <div>
                <h2 className="text-5xl font-semibold text-center mb-10 text-accent-100">
                    Reserve today. Pay on arrival.
                </h2>
                <Suspense fallback={<Spinner/>}>
                    <Reservation cabin={cabin}/>
                </Suspense>
            </div>
        </div>
    );
}
