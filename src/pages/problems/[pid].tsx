import Topbar from "@/components/Topbar/Topbar"
import WorkSpace from "@/components/WorkSpace/WorkSpace"
import { problems } from "@/utils/problems";
import { Problem } from "@/utils/types/problem";

type ProblemPageProps = {
  problem: Problem
}

const ProblemPage: React.FC<ProblemPageProps> = (props: ProblemPageProps) => {
  return (
    <>
      <Topbar problemPage />
      <WorkSpace problem={props.problem} />
    </>
  )
}

export default ProblemPage

// https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-paths 
export async function getStaticPaths() {
  const paths = Object.keys(problems).map((key) => ({
    params: { pid: key },
  }));

  return {
    paths,
    fallback: false, // With the pid not in the problems array return 404 page
  };
}

// https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-props 
export async function getStaticProps({ params }: { params: { pid: string } }) {
  const { pid } = params;
  const problem = problems[pid];

  if (!problem) {
    return {
      notFound: true,
    };
  }
  problem.handlerFunction = problem.handlerFunction.toString();
  return {
    props: {
      problem,
    },
  };
}