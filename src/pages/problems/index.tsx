import CreateProblem from "@/components/CreateProblem/CreateProblem"

type CreateProblemPageProps = {}

const CreateProblemPage: React.FC<CreateProblemPageProps> = (props: CreateProblemPageProps) => {
    return (
        <div className='bg-dark-layer-2 min-h-screen'>
            <CreateProblem />
        </div>
    )
}

export default CreateProblemPage