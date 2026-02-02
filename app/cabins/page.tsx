import CabinsList from "../_components/CabinsList";
import { Suspense } from "react";
import Spinner from "../_components/Spinner";
import { ca } from "date-fns/locale";
import Filter from "../_components/Filter";
import ReservationReminder from "../_components/ReservationReminder";

type Props = {
  searchParams: { [key: string]: string | undefined };
}

export const metadata = {
  title: "Cabins",
}

export default async function Page({ searchParams }: Props) {

  var filter = "all";
  if ("maxCapacity" in searchParams) {
    if (searchParams["maxCapacity"]) {
      filter = searchParams["maxCapacity"];
    }
  }

  return (
    <div>
      <h1 className="text-4xl mb-5 text-accent-400 font-medium">
        Our Luxury Cabins
      </h1>
      <p className="text-primary-200 text-lg mb-10">
        Cozy yet luxurious cabins, located right in the heart of the Italian
        Dolomites. Imagine waking up to beautiful mountain views, spending your
        days exploring the dark forests around, or just relaxing in your private
        hot tub under the stars. Enjoy nature`&apos;`s beauty in your own little home
        away from home. The perfect spot for a peaceful, calm vacation. Welcome
        to paradise.
      </p>
      <div className="flex justify-end mb-8">
        <Filter />
      </div>
      <Suspense fallback={<Spinner />} key={filter}>
        <CabinsList filter={filter} />
      </Suspense>
      <ReservationReminder />
    </div>
  );
}