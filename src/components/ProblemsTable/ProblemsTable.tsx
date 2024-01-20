import Link from "next/link";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { BsCheckCircle } from "react-icons/bs";
import { AiFillYoutube } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import YouTube from "react-youtube";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
import { DBProblem } from "@/utils/types/problem";
import mockProblems from "@/mockProblems/problems"

type ProblemsTableProps = {
    setIsloading: Dispatch<SetStateAction<boolean>>
}

const ProblemsTable: React.FC<ProblemsTableProps> = ({ setIsloading }) => {
    const [youtubePlayer, setYoutubePlayer] = useState({
        isOpen: false,
        videoId: ''
    })

    const closePlayer = () => {
        setYoutubePlayer({
            isOpen: false,
            videoId: ''
        })
    }

    const problems = useGetProblems(setIsloading)

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closePlayer()
        }
        window.addEventListener('keydown', handleEsc)
        return () => { window.removeEventListener('keydown', handleEsc) }
    })
    return <>
        <tbody className="text-white">
            {problems.map((problem, index) => {
                return (
                    <tr key={problem.id} className={`${index % 2 == 1 ? "bg-dark-layer-1" : ""}`}>
                        <th>
                            <BsCheckCircle fontSize={18} width={18} />
                        </th>
                        <td>
                            <Link className="hover:text-blue-600 cursor-pointer" href={`/problems/${problem.id}`}>
                                {`${index + 1}. ${problem.title}`}
                            </Link>
                        </td>
                        <td className={`px-6 py-4 ${getDifficultyColor(problem.difficulty)}`}>
                            {problem.difficulty}
                        </td>
                        <td className={`px-6 py-4`}>
                            {problem.category}
                        </td>
                        <td className={`px-6 py-4`}>
                            {problem.videoId ? (
                                <AiFillYoutube className="cursor-pointer hover:text-red-800" fontSize={28}
                                    onClick={() => {
                                        if (problem.videoId) setYoutubePlayer({ isOpen: true, videoId: problem.videoId })
                                    }}
                                />
                            ) : <p className="text-gray-400">Coming soon</p>}
                        </td>
                    </tr>
                )
            })}
        </tbody >
        {youtubePlayer.isOpen && <tfoot className='fixed top-0 left-0 h-screen w-screen flex items-center justify-center' onClick={closePlayer}>
            <div className='bg-black z-10 opacity-70 top-0 left-0 w-screen h-screen absolute' ></div>
            <div className='w-full z-50 h-full px-6 relative max-w-4xl'>
                <div className='w-full h-full flex items-center justify-center relative'>
                    <div className='w-full relative'>
                        <IoClose fontSize={"35"} className='cursor-pointer absolute -top-16 right-0' />
                        <YouTube videoId={youtubePlayer.videoId} loading='lazy' iframeClassName='w-full min-h-[500px]' />
                    </div>
                </div>
            </div>
        </tfoot>}
    </>
}

const useGetProblems = (setIsloading: Dispatch<SetStateAction<boolean>>) => {
    const [problems, setProblems] = useState<DBProblem[]>([]);

    useEffect(() => {
        const getProblems = async () => {
            const tmp: DBProblem[] = [];
            try {
                setIsloading(true);
                const q = query(collection(firestore, "problems"), orderBy("order", "asc"));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    tmp.push({ id: doc.id, ...doc.data() } as DBProblem);
                });
            } catch (error) {
                console.log(error)
                for (let i = 0; i < mockProblems.length; i++) {
                    tmp.push(mockProblems[i])
                }
            } finally {
                setProblems(tmp);
                setIsloading(false);
            }

        };
        getProblems();
    }, [setIsloading]);

    return problems;
}

const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
        case "Easy":
            return "text-dark-green-s"
        case "Medium":
            return "text-yellow-500"
        case "Hard":
            return "text-red-500"
        default:
            return ""
    }
}

export default ProblemsTable