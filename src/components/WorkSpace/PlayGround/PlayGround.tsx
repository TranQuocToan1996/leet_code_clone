import ReactCodeMirror from "@uiw/react-codemirror"
import PreferenceNav from "@/components/WorkSpace/PlayGround/PreferenceNav/PreferenceNav"
import Split from "react-split"
import { vscodeDark } from "@uiw/codemirror-theme-vscode"
import { javascript } from "@codemirror/lang-javascript"
import EditorFooter from "@/components/WorkSpace/PlayGround/EditorFooter"
import { Problem } from "@/utils/types/problem"
import { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, firestore } from "@/firebase/firebase"
import { toast, ToastOptions } from "react-toastify"
import { useRouter } from "next/router"
import { problems } from "@/utils/problems"
import { arrayUnion, doc, updateDoc } from "firebase/firestore"
import useLocalStorage from "@/hook/useLocalStorage"


type PlayGroundProps = {
    problem: Problem
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>
    setSolved: React.Dispatch<React.SetStateAction<boolean>>
}

export interface ISetting {
    fontSize: string
    settingModalIsOpen: boolean
    dropdownIsOpen: boolean
}

const PlayGround: React.FC<PlayGroundProps> = ({ problem, setSuccess, setSolved }) => {
    const [user] = useAuthState(auth)
    const [testIndex, setTestIndex] = useState(0)
    const [userCode, setUserCode] = useState(problem.starterCode)
    const router = useRouter()
    const { pid } = router.query
    const keyProblem = `code-${pid}`
    const onChange = async (value: string) => {
        setUserCode(value)
        localStorage.setItem(keyProblem, value)
    }

    const [fontSize] = useLocalStorage("lcc-fontSize", "16px");
    const [settings, setSettings] = useState<ISetting>({
        fontSize: fontSize,
        settingModalIsOpen: false,
        dropdownIsOpen: false
    })

    useEffect(() => {
        if (!user) return
        const code = localStorage.getItem(keyProblem)
        setUserCode(code || problem.starterCode)
    }, [user, keyProblem, problem.starterCode])

    const handleSubmit = async () => {
        if (!user) {
            toast.error("Please login to submit your code", {
                position: "top-center",
                autoClose: 3000,
                theme: "dark",
            });
            return;
        }

        try {
            const runCode = userCode.slice(userCode.indexOf(problem.starterFunctionName));
            const userFunction = new Function(`return ${runCode}`)()
            const handler = problems[pid as string].handlerFunction
            if (typeof handler === 'function') {
                const match = handler(userFunction)
                if (match) {
                    toast.success("Congrats! All tests passed!", {
                        position: "top-center",
                        autoClose: 3000,
                        theme: "dark",
                    });
                    setSuccess(true);
                    setTimeout(() => {
                        setSuccess(false);
                    }, 3000);

                    const userRef = doc(firestore, "users", user.uid);
                    await updateDoc(userRef, {
                        solvedProblems: arrayUnion(pid),
                    });
                    setSolved(true);
                }
            }
        } catch (error: any) {
            const formatErr: ToastOptions = {
                position: "top-center",
                autoClose: 3000,
                theme: "dark",
            }
            const errPrefix = "AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:"
            console.log(error);
            if (error.message.startsWith(errPrefix)) {
                toast.error("Oops! One or more test cases failed", formatErr);
            } else {
                toast.error(error.message, formatErr);
            }
        }
    }



    return (
        <div className="flex flex-col bg-dark-layer-1 relative overflow-x-hidden">
            <PreferenceNav settings={settings} setSettings={setSettings} />

            <Split className="h-[calc(100vh-94px)]" direction="vertical" sizes={[60, 40]} minSize={60}>
                <div className="w-full overflow-auto">
                    <ReactCodeMirror
                        value={userCode}
                        theme={vscodeDark}
                        extensions={[javascript()]}
                        style={{ fontSize: settings.fontSize }}
                        onChange={onChange}
                    />
                </div>
                <div className="w-full px-5 overflow-auto">
                    {/* Testcase heading */}
                    <div className="flex h-10 items-center space-x-6">
                        <div className="relative flex h-full flex-col justify-center cursor-pointer">
                            <div className="text-sm font-medium leading-5 text-white">
                                Test cases
                            </div>
                            <hr className="absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white" />
                        </div>
                    </div>

                    <div className='flex'>
                        {problem.examples.map((example, index) => <>
                            <div className='mr-2 items-start mt-2' key={example.id} onClick={() => setTestIndex(index)}>
                                <div className='flex flex-wrap items-center gap-y-4'>
                                    <div className={`
                                    ${testIndex === index && "bg-green-500 hover:bg-green-700"}
                                    font-medium items-center transition-all focus:outline-none text-white
                                inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
                                `}>
                                        Case {index + 1}
                                    </div>
                                </div>
                            </div>
                        </>)}
                    </div>

                    {problem.examples.length > 0 && <div className='font-semibold my-4'>
                        <p className='text-sm font-medium mt-4 text-white'>Input:</p>
                        <div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
                            {problem.examples[testIndex].inputText}
                        </div>
                        <p className='text-sm font-medium mt-4 text-white'>Output:</p>
                        <div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
                            {problem.examples[testIndex].outputText}
                        </div>
                    </div>}
                </div>
            </Split>
            <EditorFooter handleSubmit={handleSubmit} />
        </div>
    )
}

export default PlayGround 