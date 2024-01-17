import AuthModal from "@/components/Modal/AuthModal"
import NavBar from "@/components/Navbar/Navbar"

import { useRecoilValue } from "recoil"
import { authModalAtom } from "@/atom/authModalAtom"

type AuthPageProps = {}

const AuthPage: React.FC<AuthPageProps> = (props: AuthPageProps) => {
    const authModal = useRecoilValue(authModalAtom)
    return (
        <div className="bg-gradient-to-b from-gray-600 to-black h-screen relative">
            <div className="mx-auto max-w-7xl">
                <NavBar />
                <div className="flex items-center justify-center h-[calc(100vh-5rem)]
                    pointer-events-none select-none
                ">
                    <img src="/hero.png" alt="FAANG img" />
                </div>
                {authModal.isOpen && <AuthModal />}
            </div>
        </div>
    )
}

export default AuthPage