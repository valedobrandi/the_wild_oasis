
import ReservationCard from "@/app/_components/ReservationCard";
import { getBookings } from "@/app/_lib/apiCabins";
import { auth } from "@/app/_lib/auth";


export const metadata = {
  title: "Your Reservations",
};

export default async function Page() {

  const session = await auth();

  if (!session || !session.user) {
    return (
      <div>
        <h2 className="font-semibold text-2xl text-accent-400 mb-7">
          Your reservations
        </h2>

        <p className="text-lg">
          You need to{" "}
          <a className="underline text-accent-500" href="/account/login">
            log in &rarr;
          </a>{" "}
          to see your reservations.
        </p>
      </div>
    );
  }

  const reserves = await getBookings(session.user.id!);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Your reservations
      </h2>

      {reserves.length === 0 ? (
        <p className="text-lg">
          You have no reservations yet. Check out our{" "}
          <a className="underline text-accent-500" href="/cabins">
            luxury cabins &rarr;
          </a>
        </p>
      ) : (
        <ul className="space-y-6">
          {reserves.map((booking) => (
            <ReservationCard bookings={booking} key={booking.id} />
          ))}
        </ul>
      )}
    </div>
  );
}
