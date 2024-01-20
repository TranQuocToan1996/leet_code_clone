import Split from "react-split"
import ProblemDescription from "./ProblemsDescription/ProblemsDescription"
import PlayGround from "./PlayGround/PlayGround"

type WorkSpaceProps = {}

const WorkSpace: React.FC<WorkSpaceProps> = (props: WorkSpaceProps) => {
    return (
        <div>
            <Split className="flex" minSize={0}>
                <ProblemDescription />
                <PlayGround />
            </Split>
        </div>
    )
}

export default WorkSpace