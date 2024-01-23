import Split from "react-split"
import ProblemDescription from "./ProblemsDescription/ProblemsDescription"
import PlayGround from "./PlayGround/PlayGround"
import { Problem } from "@/utils/types/problem"
import Confetti from "react-confetti"
import { useState } from "react"
import useWindowSize from "@/hook/useWindowSize";

type WorkSpaceProps = {
    problem: Problem
}

const WorkSpace: React.FC<WorkSpaceProps> = (props: WorkSpaceProps) => {
    const { width, height } = useWindowSize();
    const [success, setSuccess] = useState(false);
    const [solved, setSolved] = useState(false);
    return (
        <div>
            <Split className="flex" minSize={0}>
                <ProblemDescription problem={props.problem} _solved={solved} />
                <div className="bg-dark-fill-2">
                    <PlayGround problem={props.problem} setSuccess={setSuccess} setSolved={setSolved} />
                    {success && <Confetti gravity={0.3} tweenDuration={3000} width={width - 1} height={height - 1} />}
                </div>
            </Split>
        </div>
    )
}

export default WorkSpace