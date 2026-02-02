import SideNavigation from "@/app/_components/SideNavigation"

export default function Layout(props: { children: React.ReactNode }) {
    return (
        <nav className="grid grid-cols-[16rem_1fr] h-full gap-12">
            <SideNavigation />
            <ul>{props.children}</ul>
        </nav>
    )
}