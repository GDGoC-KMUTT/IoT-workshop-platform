import { Blocks, SquareSquare } from "lucide-react"
import { PayloadModuleStepResponse } from "../../api/api"
import StepCard from "../step"

type ModuleProps = {
    moduleTitle: string
    moduleDescription: string
    moduleImageUrl: string
    steps: PayloadModuleStepResponse[]
}

const Module: React.FC<ModuleProps> = ({ moduleTitle, moduleDescription, moduleImageUrl, steps }) => {

    return (
        <div className="relative sm:w-[70%] xl:w-[700px] bg-white border-2 border-gray-300 shadow-sm rounded-lg p-10 flex flex-col space-y-3 mb-10">
            {/* Green Circle */}
            <div className="absolute top-20 -left-2 mt-[-10px] ml-[-10px] w-10 h-10 bg-green-500 rounded-full"></div>

            {/* Module Info and Image */}
            <div className="flex flex-col sm:flex-row sm:space-x-6">
                {/* Module Info */}
                <div className="flex flex-col space-y-4 w-full sm:w-2/3">
                    <div className="flex flex-row">
                        <Blocks color="gray" />
                        <p className="pl-2 text-gray-600 font-normal">MODULE</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-medium mb-3">{moduleTitle}</h2>
                        <p>{moduleDescription}</p>
                    </div>
                </div>

                {/* Image content */}
                {moduleImageUrl && (
                    <div className="w-full sm:w-1/3 sm:flex sm:justify-center">
                        <img src={moduleImageUrl} alt="module image" className="w-[200px] h-[120px] rounded-sm object-cover" />
                    </div>
                )}
            </div>

            {/* Steps Section */}
            <div className="flex flex-row">
                <SquareSquare color="gray" className="" />
                <p className="pl-2 text-gray-600 font-normal">STEPS</p>
            </div>
            <ul className="space-y-3">
                {steps.length > 0 ? (
                    steps.map((step) =>
						step.id && step.title ? (
							<StepCard
								key={step.id}
								stepId={step.id}
								title={step.title}
								check={step?.check ?? false}
							/>
						) : null
					)

                ) : (
                    <p className="text-gray-500">No steps for this module.</p>
                )}
            </ul>
        </div>
    )
}

export default Module
