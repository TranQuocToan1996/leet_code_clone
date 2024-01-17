import Link from "next/link"
import { useSetRecoilState } from "recoil"
import { authModalAtom } from "@/atom/authModalAtom"
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase"
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";


type LoginProps = {}

const Login: React.FC<LoginProps> = (props: LoginProps) => {
    const router = useRouter()
    const setAuthState = useSetRecoilState(authModalAtom)
    const handleClick = (type: "login" | "register" | "forgotPassword") => {
        setAuthState(prev => ({ ...prev, type: type }))
    }
    const [inputs, setInputs] = useState({ email: '', password: '' })
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
    const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
    useEffect(() => { if (error) alert(error) }, [error])
    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!inputs.email || !inputs.password) return alert("Please fill all fields");
        try {
            const newUser = await signInWithEmailAndPassword(inputs.email, inputs.password)
            if (!newUser) return
            router.push("/")
        } catch (error) {
            alert(error)
        }
    }

    return (
        <form className="space-y-6 px-6 pb-4" onSubmit={handleLogin}>
            <h3 className="text-white text-xl font-medium">Sign in to LeetClone</h3>
            <div>
                <label htmlFor="email" className="text-sm font-medium block mb-2 text-gray-300">Your email</label>
                <input type="email" id="email" name="email" placeholder="email@domain.com"
                    className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                    bg-gray-600 border-gray-500 placeholder-gray-400 text-white
                    "
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="password" className="text-sm font-medium block mb-2 text-gray-300">Your password</label>
                <input type="password" id="password" name="password" placeholder="******" minLength={6}
                    className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                    bg-gray-600 border-gray-500 placeholder-gray-400 text-white
                    "
                    onChange={handleChange}
                />
            </div>
            <button
                type='submit'
                className='w-full text-white focus:ring-blue-300 font-medium rounded-lg
                text-sm px-5 py-2.5 text-center bg-brand-orange hover:bg-brand-orange-s
            '
            >
                Log In
            </button>
            <button
                type='submit'
                className='text-brand-orange text-sm text-right w-full hover:underline'
            >
                <Link href="#"
                    onClick={() => handleClick("forgotPassword")}
                >Forgot Password?</Link>
            </button>
            <div className="flex text-sm text-gray-300 font-medium gap-1">
                <h3 className="text-white">Not registered?</h3>
                <Link href="#"
                    className="text-blue-600 hover:underline"
                    onClick={() => handleClick("register")}
                >Create account</Link>
            </div>
        </form>
    )
}

export default Login