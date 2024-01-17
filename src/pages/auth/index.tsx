import NavBar from "@/components/Navbar/Navbar"

type AuthPageProps = {}

const AuthPage: React.FC<AuthPageProps> = (props: AuthPageProps) => {
    return (
        <div className="bg-gradient-to-b from-gray-600 to-black h-screen relative">
            <div className="mx-auto max-w-7xl">
                <NavBar />
                BODY
            </div>
        </div>
    )
}

export default AuthPage