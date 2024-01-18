import { auth } from "@/firebase/firebase"
import { button } from "@nextui-org/react"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useSignOut } from "react-firebase-hooks/auth"
import { CgSpinner } from "react-icons/cg"
import { FiLogOut } from "react-icons/fi"

type LogOutProps = {}

const LogOut: React.FC<LogOutProps> = (props: LogOutProps) => {
    const router = useRouter()
    const [signOut, loading, error] = useSignOut(auth)
    const handleLogout = async () => {
        if (loading) return
        signOut()
        router.push("/auth")
    }
    useEffect(() => {
        if (error) alert(error)
    }, [error])
    if (loading) return <CgSpinner />
    return (
        <button className="bg-dark-fill-3 py-1.5 px-3 rounded text-brand-orange" onClick={handleLogout}>
            <FiLogOut />
        </button>
    )
}

export default LogOut