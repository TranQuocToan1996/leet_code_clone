import { auth } from "@/firebase/firebase"
import { ChangeEvent, FormEvent, useState, useEffect } from "react"
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth"
import { toast } from "react-toastify"

type ResetPasswordProps = {}

const ResetPassword: React.FC<ResetPasswordProps> = (props: ResetPasswordProps) => {
    const [email, setEmail] = useState("")
    const [sendPasswordResetEmail, sending, error] = useSendPasswordResetEmail(auth);
    const handleReset = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!email) return alert("empty email")
        if (sending) return alert("sending...")
        const success = await sendPasswordResetEmail(email)
        if (success) {
            toast.success("Sent email", { position: "top-center", autoClose: 3000 })
        }
    }
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }
    useEffect(() => { if (error) alert(error) }, [error])

    return (
        <form className="space-y-6 px-6 pb-4" onSubmit={handleReset}>
            <h3 className="text-white text-xl font-medium">Reset Password</h3>
            <p className="text-white text-sm font-medium">
                {`Forgotten your password? Enter your e-mail address below, and we'll send you an e-mail allowing you to reset it.`}
            </p>
            <div>
                <label htmlFor="email" className="text-sm font-medium block mb-2 text-gray-300">Your email</label>
                <input
                    value={email} onChange={handleChange}
                    type="email" id="email" name="email" placeholder="email@domain.com"
                    className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                    bg-gray-600 border-gray-500 placeholder-gray-400 text-white
                    " />
            </div>
            <button
                type='submit'
                className='w-full text-white focus:ring-blue-300 font-medium rounded-lg
                text-sm px-5 py-2.5 text-center bg-brand-orange hover:bg-brand-orange-s
            '
            >
                Reset Password
            </button>
        </form>
    )
}

export default ResetPassword