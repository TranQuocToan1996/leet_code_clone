import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'react-toastify'
import { doc, setDoc } from 'firebase/firestore'
import { firestore } from '@/firebase/firebase'


type CreateProblemProps = {}

const emptyProblem = {
    id: "",
    title: "",
    difficuty: "",
    caterogy: "",
    videoId: "",
    link: "",
    order: 0,
    likes: 0,
    dislikes: 0
}

const CreateProblem: React.FC<CreateProblemProps> = (props: CreateProblemProps) => {
    const [newProblem, setNewProblem] = useState(emptyProblem)
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewProblem(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            setDoc(doc(firestore, "problems", newProblem.id), {
                ...newProblem,
                order: Number(newProblem.order)
            })
            setNewProblem(emptyProblem)
            toast("saved")
        } catch (error: any) {
            toast.error(error)
        }
    }
    // TODO: Add label, fix CSS
    return (
        <>
            <form className='flex flex-col p-6 gap-3 max-w-sm'
                onSubmit={handleSubmit}
            >
                <input type="text" onChange={handleChange} placeholder='id' name='id' />
                <input type="text" onChange={handleChange} placeholder='title' name='title' />
                <input type="text" onChange={handleChange} placeholder='difficuty' name='difficuty' />
                <input type="text" onChange={handleChange} placeholder='caterogy' name='caterogy' />
                <input type="text" onChange={handleChange} placeholder='videoId' name='videoId' />
                <input type="text" onChange={handleChange} placeholder='link' name='link' />
                <input type="number" onChange={handleChange} placeholder='order' name='order'
                />
                <button className='bg-white'>Save problem</button>
            </form>
        </>
    )
}

export default CreateProblem