import Link from "next/link"

import { useSetRecoilState } from "recoil"
import { authModalState } from "@/atom/authModalAtom"

type NavBarProps = {}

const NavBar: React.FC<NavBarProps> = (props: NavBarProps) => {
    const setAuthState = useSetRecoilState(authModalState)
    const handleClick = () => {
        setAuthState(prev => ({ ...prev, isOpen: true, type: "login" }))
    }
    return (
        <div className="flex items-center justify-between sm:px-12 px-2 md:px-24">
            <Link href="/" className="flex items-center justify-center h-20" >
                <img src="/logo.png" alt="leetcode logo" className="h-full"></img>
            </Link>
            <div className="items-center flex">
                <button className="bg-brand-orange rounded-md px-2 py-1 text-white font-medium sm:px-4
                    hover:text-brand-orange hover:bg-white hover:border-2 hover:border-brand-orange border-2 border-transparent
                    transition duration-300 ease-in-out"
                    onClick={handleClick}
                >
                    Sign in
                </button>
            </div>
        </div>
    )
}

export default NavBar