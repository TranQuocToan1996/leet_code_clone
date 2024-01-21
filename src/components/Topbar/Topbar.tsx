import { auth } from "@/firebase/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { CgSpinner } from "react-icons/cg"
import LogOut from "../Logout/Logout"
import { useSetRecoilState } from "recoil"
import { authModalAtom } from "@/atom/authModalAtom"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import Link from "next/link"
import { BsList } from "react-icons/bs"
import Timer from "../Timer/Timer"

type TopbarProps = {
    problemPage?: boolean
}

const Topbar: React.FC<TopbarProps> = (props: TopbarProps) => {
    const [user, loading] = useAuthState(auth)
    const setAuthModalState = useSetRecoilState(authModalAtom)
    // If !user move to /auth ?
    const handleClickSignIn = () => {
        setAuthModalState(prev => ({
            ...prev,
            isOpen: true,
            type: "login"
        }))
    }
    if (loading) return <CgSpinner />
    return (
        <nav className='relative flex h-[50px] w-full shrink-0 items-center px-5 bg-dark-layer-1 text-dark-gray-7'>
            <div className={`flex w-full items-center justify-between ${!props.problemPage ? "max-w-[1200px] mx-auto" : ""}`}>
                <Link href='/' className='h-[22px] flex-1'>
                    <img src='/logo-full.png' alt='Logo' className='h-full' />
                </Link>

                {props.problemPage && (
                    <>
                        <div className="flex flex-1 justify-center items-center gap-4">
                            <div className="flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 h-8 w-8">
                                <FaChevronLeft />
                            </div>
                            <Link href="/" className="flex justify-center items-center gap-2 font-medium max-w-[170px] text-dark-gray-8 cursor-pointer">
                                <div>
                                    <BsList />
                                </div>
                                <p>Problems list</p>
                            </Link>
                            <div className="flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 h-8 w-8">
                                <FaChevronRight />
                            </div>
                        </div>
                    </>
                )}

                <div className='flex items-center space-x-4 flex-1 justify-end'>
                    <div>
                        <a
                            href='/'
                            target='_blank'
                            rel='noreferrer'
                            className='bg-dark-fill-3 py-1.5 px-3 cursor-pointer rounded text-brand-orange hover:bg-dark-fill-2'
                        >
                            Premium
                        </a>
                    </div>

                    {props.problemPage && user && <Timer />}

                    {!user ? (
                        <Link href='/auth' onClick={handleClickSignIn}>
                            <button className='bg-dark-fill-3 py-1 px-2 cursor-pointer rounded '>Sign In</button>
                        </Link>
                    ) : (
                        <>
                            <div className="cursor-pointer group relative">
                                <img src="/avatar.png" alt="user avatar" className="h-8 w-8 rounded-full"></img>
                                <div
                                    className='absolute top-10 left-2/4 -translate-x-2/4  mx-auto bg-dark-layer-1 text-brand-orange 
                            p-2 rounded shadow-lg z-40 group-hover:scale-100 scale-0 transition-all duration-300 ease-in-out
                            '
                                >
                                    <p className='text-sm'>{user.email}</p>
                                </div>
                            </div>
                            <LogOut />
                        </>
                    )}
                </div>
            </div>
        </nav >
    )
}

export default Topbar