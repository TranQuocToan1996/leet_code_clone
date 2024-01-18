import Topbar from "@/components/Topbar/Topbar"

type ProblemPageProps = {}

const ProblemPage: React.FC<ProblemPageProps> = (props: ProblemPageProps) => {
  return (
    <>
      <Topbar problemPage={true} />
    </>
  )
}

export default ProblemPage