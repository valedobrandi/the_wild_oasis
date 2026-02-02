"use server";

import { signIn, signOut } from "./auth";

export async function singInAction() {
    await signIn("google", { redirect: true, callbackUrl: "/account" });
}

export async function signOutAction() {
    await signOut({redirect: true});
}