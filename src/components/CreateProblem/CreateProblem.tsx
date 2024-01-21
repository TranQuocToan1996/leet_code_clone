import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'react-toastify'
import { doc, setDoc } from 'firebase/firestore'
import { firestore } from '@/firebase/firebase'


type CreateProblemProps = {}

const emptyProblem = {
    id: "",
    title: "",
    difficulty: "",
    category: "",
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
    return (
        <>
            <form className='flex flex-col p-6 gap-3 max-w-sm' onSubmit={handleSubmit}>

                <div className="flex flex-col">
                    <label htmlFor="id" className='text-white mb-1'>ID:</label>
                    <input type="text" onChange={handleChange} placeholder='id' name='id' id='id' />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="title" className='text-white mb-1'>Title:</label>
                    <input type="text" onChange={handleChange} placeholder='title' name='title' id='title' />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="difficulty" className='text-white mb-1'>Difficulty:</label>
                    <input type="text" onChange={handleChange} placeholder='difficulty' name='difficulty' id='difficulty' />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="category" className='text-white mb-1'>Category:</label>
                    <input type="text" onChange={handleChange} placeholder='category' name='category' id='category' />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="videoId" className='text-white mb-1'>Video ID:</label>
                    <input type="text" onChange={handleChange} placeholder='videoId' name='videoId' id='videoId' />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="link" className='text-white mb-1'>Link:</label>
                    <input type="text" onChange={handleChange} placeholder='link' name='link' id='link' />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="order" className='text-white mb-1'>Order:</label>
                    <input type="number" onChange={handleChange} placeholder='order' name='order' id='order' />
                </div>

                <button className='bg-white mt-3'>Save problem</button>
            </form>
        </>
    )
}

export default CreateProblem