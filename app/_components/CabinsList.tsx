import { getCabins } from "../_lib/apiCabins";
import CabinCard from "./CabinCard";
interface CabinsListProps {
  filter?: string;
}
export default async function CabinsList({ filter }: CabinsListProps) {
  const cabins = await getCabins();
  let filteredCabins = cabins;

  switch (filter) {
    case "all":
      filteredCabins = cabins;
      break;
    case "small":
      filteredCabins = cabins.filter(cabin => cabin.maxCapacity <= 3);
      break;
    case "medium":
      filteredCabins = cabins.filter(cabin => cabin.maxCapacity >= 3);
      break;
    case "large":
      filteredCabins = cabins.filter(cabin => cabin.maxCapacity >= 8);
      break;
  }

  return (
    <>
      {filteredCabins.length > 0 && (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
          {filteredCabins.map((cabin) => (
            <CabinCard cabin={cabin} key={cabin.id} />
          ))}
        </div>
      )}
    </>
  )
}