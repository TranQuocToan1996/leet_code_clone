import Split from "react-split"
import ProblemDescription from "./ProblemsDescription/ProblemsDescription"
import PlayGround from "./PlayGround/PlayGround"
import { Problem } from "@/utils/types/problem"

type WorkSpaceProps = {
    problem: Problem
}

const WorkSpace: React.FC<WorkSpaceProps> = (props: WorkSpaceProps) => {
    return (
        <div>
            <Split className="flex" minSize={0}>
                <ProblemDescription problem={props.problem} />
                <PlayGround problem={props.problem} />
            </Split>
        </div>
    )
}

export default WorkSpace