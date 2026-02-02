import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";

const authConfig = {
    providers: [
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
    ],
    callbacks: {
        authorized({auth, request}: {auth: any, request: Request}) {
            return !!auth?.user;
        }
    },
    singIn() {
        
    },
    pages: {
        signIn: '/login',
    }
};

export const {
    auth,
    signIn,
    signOut,
    handlers: { GET, POST }, 
} = NextAuth(authConfig);