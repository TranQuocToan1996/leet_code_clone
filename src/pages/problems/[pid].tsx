import Topbar from "@/components/Topbar/Topbar"
import WorkSpace from "@/components/WorkSpace/WorkSpace"

type ProblemPageProps = {}

const ProblemPage: React.FC<ProblemPageProps> = (props: ProblemPageProps) => {
  return (
    <>
      <Topbar problemPage={true} />
      <WorkSpace />
    </>
  )
}

export default ProblemPage