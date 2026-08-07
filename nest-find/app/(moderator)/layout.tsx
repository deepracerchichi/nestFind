import {NavBar} from "@/components/NavBar"

export default function ModeratorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <NavBar />
            {children}
        </>
    )
}