import { Josefin_Sans } from "next/font/google";
import "./_styles/index.css";
import Header from "./_components/Header";
import { ReservationContextProvider } from "./_components/ReservationContext";

const josefine = Josefin_Sans({
    subsets: ["latin"],
    display: "swap",
});

export const metadata = {
    title: {
        template: "%s | The Wild Oasis",
        default: "The Wild Oasis",
    },
    description: "Discover your perfect getaway at The Wild Oasis - where nature meets comfort in our charming cabins.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${josefine.className} 
                    bg-primary-950 antialiased text-primary-50 
                    min-h-screen flex flex-col relative`}>
                <Header />
                <div className="flex-1 px-8 py-12 grid">
                    <main className="max-w-7xl mx-auto w-full">
                        <ReservationContextProvider>
                            {children}
                        </ReservationContextProvider>
                    </main>
                </div>
                <footer className="p-2">Copyright by The Wild Oasis</footer>
            </body>
        </html>
    );
}