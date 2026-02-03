"use server";

import { revalidatePath } from "next/cache";
import { deleteBooking, getBookings, updateGuest } from "./apiCabins";
import { auth, signIn, signOut } from "./auth";

export async function singInAction() {
    await signIn("google", { redirect: true, callbackUrl: "/account" });
}

export async function signOutAction() {
    await signOut({redirect: true});
}

export async function updateProfileAction(data: FormData) {
    const session = await auth();

    if (!session || !session.user) {
        throw new Error("Not authenticated");
    }
        
    const nationalID = data.get("nationalID")?.toString() || "";
    const nationality = data.get("nationality")?.toString().split("%")[0] || null;
    const countryFlag = data.get("nationality")?.toString().split("%")[1] || null;

    if (nationalID.length > 16 || nationalID.length === 4) {
        throw new Error("Write a valid National ID number");
    }

    await updateGuest(session.user.id!, {
        nationalID,
        nationality,
        countryFlag
    });

    revalidatePath("/account/profile");
}

export async function deleteReservationAction(bookingId: string) {
    const session = await auth();

    if (!session || !session.user) {
        throw new Error("Not authenticated");
    }

    const guestBookings = await getBookings(session.user.id!);
    const bookingIds = guestBookings.map(booking => booking.id);

    if (!bookingIds.includes(bookingId)) {
        throw new Error("You are not allowed to delete this booking");
    }

    await deleteBooking(bookingId);

    revalidatePath("/account/reservations");
}