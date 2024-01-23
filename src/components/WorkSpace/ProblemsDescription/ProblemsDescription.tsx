import { AiFillLike, AiFillDislike, AiOutlineLoading3Quarters, AiFillStar } from "react-icons/ai";
import { BsCheck2Circle } from "react-icons/bs";
import { TiStarOutline } from "react-icons/ti";
import { DBProblem, Problem } from "@/utils/types/problem"
import { useEffect, useState } from "react";
import { auth, firestore } from "@/firebase/firebase";
import { arrayRemove, arrayUnion, doc, getDoc, runTransaction, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import CircleSkeleton from "@/components/Skeletons/CircleSkeleton";
import RectangleSkeleton from "@/components/Skeletons/RectangleSkeleton";
import { toast } from "react-toastify";

type ProblemDescriptionProps = {
    problem: Problem
};

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problem }) => {
    const [user] = useAuthState(auth);
    const { currentProblem, loading, problemDifficultyClass, setCurrentProblem } = useGetCurrentProblem(problem.id);
    const { liked, disliked, solved, setData, starred, loadingProblem } = useGetUsersDataOnProblem(problem.id);
    const [updating, setUpdating] = useState(false);

    const returnUserDataAndProblemData = async (transaction: any) => {
        const userRef = doc(firestore, "users", user!.uid);
        const problemRef = doc(firestore, "problems", problem.id);
        const userDoc = await transaction.get(userRef);
        const problemDoc = await transaction.get(problemRef);
        return { userDoc, problemDoc, userRef, problemRef };
    };

    const handleLiked = async () => {
        if (!user) {
            toast.error("You must be logged in to like a problem", { position: "top-left", theme: "dark" });
            return
        }
        if (updating || loadingProblem || loading) return;
        setUpdating(true);
        await runTransaction(firestore, async (transaction) => {
            const { problemDoc, userDoc, problemRef, userRef } = await returnUserDataAndProblemData(transaction);

            if (userDoc.exists() && problemDoc.exists()) {
                if (liked) {
                    // remove problem id from likedProblems on user document, decrement likes on problem document
                    transaction.update(userRef, {
                        likedProblems: userDoc.data().likedProblems.filter((id: string) => id !== problem.id),
                    });
                    transaction.update(problemRef, {
                        likes: problemDoc.data().likes - 1,
                    });

                    setCurrentProblem((prev) => (prev ? { ...prev, likes: prev.likes - 1 } : null));
                    setData((prev) => ({ ...prev, liked: false }));
                } else if (disliked) {
                    transaction.update(userRef, {
                        likedProblems: [...userDoc.data().likedProblems, problem.id],
                        dislikedProblems: userDoc.data().dislikedProblems.filter((id: string) => id !== problem.id),
                    });
                    transaction.update(problemRef, {
                        likes: problemDoc.data().likes + 1,
                        dislikes: problemDoc.data().dislikes - 1,
                    });

                    setCurrentProblem((prev) =>
                        prev ? { ...prev, likes: prev.likes + 1, dislikes: prev.dislikes - 1 } : null
                    );
                    setData((prev) => ({ ...prev, liked: true, disliked: false }));
                } else {
                    transaction.update(userRef, {
                        likedProblems: [...userDoc.data().likedProblems, problem.id],
                    });
                    transaction.update(problemRef, {
                        likes: problemDoc.data().likes + 1,
                    });
                    setCurrentProblem((prev) => (prev ? { ...prev, likes: prev.likes + 1 } : null));
                    setData((prev) => ({ ...prev, liked: true }));
                }
            }
        });
        setUpdating(false);
    }

    const handleDisLiked = async () => {
        if (!user) {
            toast.error("You must be logged in to like a problem", { position: "top-left", theme: "dark" });
            return
        }
        if (updating || loadingProblem || loading) return;
        setUpdating(true);
        await runTransaction(firestore, async (transaction) => {
            const { problemDoc, userDoc, problemRef, userRef } = await returnUserDataAndProblemData(transaction);

            if (userDoc.exists() && problemDoc.exists()) {
                if (liked) {
                    transaction.update(userRef, {
                        likedProblems: userDoc.data().likedProblems.filter((id: string) => id !== problem.id),
                        dislikedProblems: [...userDoc.data().dislikedProblems, problem.id],
                    });
                    transaction.update(problemRef, {
                        likes: problemDoc.data().likes - 1,
                        disliked: problemDoc.data().disliked + 1
                    });

                    setCurrentProblem((prev) => (prev ? { ...prev, likes: prev.likes - 1, dislikes: prev.dislikes + 1 } : null));
                    setData((prev) => ({ ...prev, dislikes: true, liked: false }));
                } else if (disliked) {
                    transaction.update(userRef, {
                        dislikedProblems: userDoc.data().dislikedProblems.filter((id: string) => id !== problem.id),
                    });
                    transaction.update(problemRef, {
                        dislikes: problemDoc.data().dislikes - 1,
                    });

                    setCurrentProblem((prev) =>
                        prev ? { ...prev, dislikes: prev.dislikes - 1 } : null
                    );
                    setData((prev) => ({ ...prev, disliked: false }));
                } else {
                    transaction.update(userRef, {
                        dislikedProblems: [...userDoc.data().dislikedProblems, problem.id],
                    });
                    transaction.update(problemRef, {
                        dislikes: problemDoc.data().dislikes + 1,
                    });
                    setCurrentProblem((prev) => (prev ? { ...prev, dislikes: prev.dislikes + 1 } : null));
                    setData((prev) => ({ ...prev, disliked: true }));
                }
            }
        });
        setUpdating(false);
    }

    const handleStared = async () => {
        if (!user) {
            toast.error("You must be logged in to like a problem", { position: "top-left", theme: "dark" });
            return
        }
        if (updating || loadingProblem || loading) return;
        setUpdating(true);

        const userRef = doc(firestore, "users", user.uid);
        if (!starred) {
            await updateDoc(userRef, {
                starredProblems: arrayUnion(problem.id),
            });
            setData((prev) => ({ ...prev, starred: true }));
        } else {
            await updateDoc(userRef, {
                starredProblems: arrayRemove(problem.id),
            });
            setData((prev) => ({ ...prev, starred: false }));
        }

        setUpdating(false);
    }

    return (
        <div className='bg-dark-layer-1'>
            {/* TAB */}
            <div className='flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden'>
                <div className={"bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer"}>
                    Description
                </div>
            </div>

            <div className='flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto'>
                <div className='px-5'>
                    {/* Problem heading */}
                    <div className='w-full'>
                        <div className='flex space-x-4'>
                            <div className='flex-1 mr-2 text-lg text-white font-medium'>{problem?.title}</div>
                        </div>
                        {!loading && currentProblem && (
                            <div className='flex items-center mt-3'>
                                <div
                                    className={`inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize ${problemDifficultyClass}`}
                                >
                                    {currentProblem?.difficulty}
                                </div>

                                <div className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1
                                 rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-dark-gray-6'
                                    onClick={handleLiked}
                                >
                                    {!updating && liked ? <AiFillLike className='text-dark-blue-s' /> : <AiFillLike />}
                                    {updating && <AiOutlineLoading3Quarters className='animate-spin' />}
                                    <span className='text-xs'>{currentProblem?.likes}</span>
                                </div>

                                <div className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1
                                 rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-s text-dark-gray-6'
                                    onClick={handleDisLiked}
                                >
                                    {!updating && disliked ? <AiFillDislike className='text-dark-blue-s' /> : <AiFillDislike />}
                                    {updating && <AiOutlineLoading3Quarters className='animate-spin' />}
                                    <span className='text-xs'>{currentProblem?.dislikes}</span>
                                </div>

                                <div className='cursor-pointer hover:bg-dark-fill-3 rounded p-[3px] ml-4 text-xl
                                 transition-colors duration-200 text-green-s text-dark-gray-6'
                                    onClick={handleStared}
                                >
                                    {!updating && starred ? <AiFillStar className='text-dark-yellow' /> : <TiStarOutline />}
                                    {updating && <AiOutlineLoading3Quarters className='animate-spin' />}
                                </div>

                                {solved && <div className='rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-s text-dark-green-s'>
                                    <BsCheck2Circle />
                                </div>}
                            </div>
                        )}

                        {loading && (
                            <div className='mt-3 flex space-x-2'>
                                <RectangleSkeleton />
                                <CircleSkeleton />
                                <RectangleSkeleton />
                                <RectangleSkeleton />
                                <CircleSkeleton />
                            </div>
                        )}

                        {/* Problem Statement(paragraphs) */}
                        <div className='text-white text-sm'>
                            <div
                                dangerouslySetInnerHTML={{ __html: problem.problemStatement }}
                            />
                        </div>

                        {/* Examples */}
                        <div className='mt-4'>
                            {problem.examples.map((example, index) => (
                                <div key={example.id}>
                                    <p className='font-medium text-white '>Example {index + 1}: </p>
                                    {example.img && <img src={example.img} alt="problem image" className="mt-1" />}
                                    <div className='example-card'>
                                        <pre>
                                            <strong className='text-white'>Input: </strong> {example.inputText}
                                            <br />
                                            <strong>Output:</strong> {example.outputText} <br />
                                            {example.explanation && <>
                                                <strong>Explanation: </strong> {example.explanation}
                                            </>}
                                        </pre>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Constraints */}
                        {problem.constraints && <div className='my-5'>
                            <div className='text-white text-sm font-medium'>Constraints:</div>
                            <ul className='text-white ml-5 list-disc my-4'>
                                <div dangerouslySetInnerHTML={{ __html: problem.constraints }} />
                            </ul>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ProblemDescription;


function useGetCurrentProblem(problemId: string) {
    const [currentProblem, setCurrentProblem] = useState<DBProblem | null>(null);
    const [loading, setLoading] = useState(true);
    const [problemDifficultyClass, setProblemDifficultyClass] = useState("");

    useEffect(() => {
        // Get problem from DB
        const getCurrentProblem = async () => {
            setLoading(true);
            const docRef = doc(firestore, "problems", problemId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const problem = docSnap.data();
                setCurrentProblem({ id: docSnap.id, ...problem } as DBProblem);
                // easy, medium, hard
                setProblemDifficultyClass(
                    problem.difficulty === "Easy"
                        ? "bg-olive text-olive"
                        : problem.difficulty === "Medium"
                            ? "bg-dark-yellow text-dark-yellow"
                            : "bg-dark-pink text-dark-pink"
                );
            }
            setLoading(false);
        };
        getCurrentProblem();
    }, [problemId]);

    return { currentProblem, loading, problemDifficultyClass, setCurrentProblem };
}

function useGetUsersDataOnProblem(problemId: string) {
    const [data, setData] = useState({ liked: false, disliked: false, starred: false, solved: false });
    const [user] = useAuthState(auth);
    const [loadingProblem, setloadingProblem] = useState(true);

    useEffect(() => {
        const getUsersDataOnProblem = async () => {
            setloadingProblem(true)
            const userRef = doc(firestore, "users", user!.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const data = userSnap.data();
                const { solvedProblems, likedProblems, dislikedProblems, starredProblems } = data;
                setData({
                    liked: likedProblems.includes(problemId), // likedProblems["two-sum","jump-game"]
                    disliked: dislikedProblems.includes(problemId),
                    starred: starredProblems.includes(problemId),
                    solved: solvedProblems.includes(problemId),
                });
            }
            setloadingProblem(false)
        };

        if (user) getUsersDataOnProblem();
        return () => setData({ liked: false, disliked: false, starred: false, solved: false });
    }, [problemId, user]);

    return { ...data, setData, loadingProblem };
}