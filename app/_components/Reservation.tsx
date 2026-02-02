import { getBookedDatesByCabinId, getSettings } from "../_lib/apiCabins";
import { auth } from "../_lib/auth";
import { CabinType } from "./Cabin";
import DateSelector from "./DateSelector";
import LoginMessage from "./LoginMessage";
import ReservationForm from "./ReservationForm";

export default async function Reservation(props: { cabin: CabinType }) {

    const session = await auth();

    const [settings, bookedDates] =
        await Promise.all([
            getSettings(),
            getBookedDatesByCabinId(props.cabin.id)
        ]);

    return (
        <div className="flex border border-primary-800 min-h-[400px]">
            <DateSelector settings={settings} />
            {session 
            ? <ReservationForm maxCapacity={props.cabin.maxCapacity} user={session.user} /> 
            : <LoginMessage />}
        </div>
    )
}