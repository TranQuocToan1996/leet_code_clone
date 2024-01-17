import Link from "next/link"
import { useSetRecoilState } from "recoil"
import { authModalAtom } from "@/atom/authModalAtom"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase"
import { useRouter } from "next/router";
import { Spinner } from "@nextui-org/react";

type SignUpProps = {}

const SignUp: React.FC<SignUpProps> = (props: SignUpProps) => {
    const router = useRouter()
    const setAuthState = useSetRecoilState(authModalAtom)
    const handleClick = () => {
        setAuthState(prev => ({ ...prev, type: "login" }))
    }
    const [inputs, setInputs] = useState({ email: '', displayName: '', password: '' })
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
    const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);
    const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!inputs.email || !inputs.password || !inputs.displayName) return alert("Please fill all fields");
        try {
            const newUser = await createUserWithEmailAndPassword(inputs.email, inputs.password)
            if (!newUser) return
            router.push("/")
        } catch (error) {
            alert(error)
        }
    }

    useEffect(() => { if (error) alert(error) }, [error])

    if (loading) return <Spinner label="Loading..." />
    return (
        <form className="space-y-6 px-6 pb-4" onSubmit={handleRegister}>
            <h3 className="text-white text-xl font-medium">Register to LeetClone</h3>
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
                <label htmlFor="displayName" className="text-sm font-medium block mb-2 text-gray-300">Display Name</label>
                <input type="displayName" id="displayName" name="displayName" placeholder="John Doe"
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
                Register
            </button>
            <div className="flex text-sm text-gray-300 font-medium gap-1">
                <h3 className="text-white">Already have an account?</h3>
                <Link href="#" className="text-blue-600 hover:underline" onClick={handleClick}>Log In</Link>
            </div>
        </form>
    )
}

export default SignUp