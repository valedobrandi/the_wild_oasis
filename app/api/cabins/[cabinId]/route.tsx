import { getBookedDatesByCabinId, getCabin } from "@/app/_lib/apiCabins";

interface Params {
  request: Request;
  cabinId: string;
}

export async function GET({ params }: { params: Params }) {
    try {
        const {  cabinId } = params;
        const [ cabin, bookedDates] = await Promise.all([
            getCabin(cabinId),
           getBookedDatesByCabinId(cabinId)
        ]);
        return new Response(JSON.stringify([cabin, bookedDates]), { status: 200 });
    } catch (error) {
        return new Response("Cabin not found", { status: 500 });
    }

}   