import { useEffect, useState } from "react"
import Hero from "../../components/course/hero"
import Text from "../../components/course/text"
import Module from "../../components/course/module"
import { server } from "@/configs/server"
import CourseCard from "../../components/coursecard/index"
import AppLoading from "@/components/ui/app-loading"
import { PayloadModuleResponse, PayloadCoursePage, PayloadCoursePageContent, PayloadSuggestCourse } from "../../api/api"
import { useParams } from "react-router-dom"
import { toast } from "sonner"

const Course = () => {
    const { courseId } = useParams()
    const [courseInfo, setCourseInfo] = useState<PayloadCoursePage | null>(null)
    const [courseContent, setCourseContent] = useState<PayloadCoursePageContent[] | null>(null)
    const [modules, setModules] = useState<PayloadModuleResponse[]>([])
    const [suggestCourses, setSuggestCourses] = useState<PayloadSuggestCourse[] | undefined>(undefined)

    useEffect(() => {
        const fetchData = async () => {
            try {
                //* Reset state to avoid stale data
                setCourseInfo(null)
                setCourseContent(null)
                setModules([])
                setSuggestCourses(undefined)

                //* Validate courseId
                if (!courseId) {
                    toast.error("Invalid Course ID")
                    return
                }

                //* Fetch course information
                const courseInfoResponse = await server.coursePage.getCoursePageInfo(courseId.toString())
                if (courseInfoResponse.data) {
                    setCourseInfo(courseInfoResponse.data)
                } else {
                    toast.error("Course not found")
                    return
                }

                //* Fetch course content
                const courseContentResponse = await server.coursePage.getCoursePageContent(courseId.toString())
                if (courseContentResponse.data) {
                    const contentData = courseContentResponse.data.map((item: PayloadCoursePageContent) => ({
                        coursePageId: item.coursePageId,
                        moduleId: item.moduleId,
                        order: item.order,
                        text: item.text || "", // Default empty text if undefined
                        type: item.type,
                    }))
                    setCourseContent(contentData)

                    //* Fetch modules and their steps
                    const modulesToFetch = contentData.filter((item) => item.type === "module")
                    const modulePromises = modulesToFetch.map(async (module) => {
                        const moduleResponse = await server.module.getModuleInfo(module.moduleId?.toString() || "")
                        if (moduleResponse?.data) {
                            return {
                                module: moduleResponse.data,
                                moduleId: module.moduleId,
                            }
                        }
                        return null
                    })

                    const fetchedModules = await Promise.all(modulePromises)
                    const validModules = fetchedModules.filter((m): m is { module: PayloadModuleResponse; moduleId: number } => !!m)
                    setModules(validModules.map((m) => m.module))
                } else {
                    toast.error("Course content not found")
                }

                //* Fetch suggest courses
                if (courseInfoResponse.data?.fieldId) {
                    const suggestResponse = await server.coursePage.getSuggestCoursesByFieldId(courseInfoResponse.data.fieldId.toString())
                    if (suggestResponse.data) {
                        const filteredCourses = suggestResponse.data.filter(
                            (course) => course.id !== parseInt(courseId, 10) // Exclude current courseId
                        )
                        setSuggestCourses(filteredCourses)
                    } else {
                        toast.error("Failed to fetch suggested courses")
                    }
                }
            } catch (err) {
                console.error("Error fetching data:", err)
                toast.error("An error occurred while fetching data.")
            }
        }

        fetchData()
    }, [courseId])

    if (!courseId || !courseInfo) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <AppLoading />
            </div>
        )
    }

    return (
        <div className="absolute top-0 w-full flex flex-col overflow-x-hidden mb-20">
            <Hero key={courseId} courseName={courseInfo?.name ?? ""} courseField={courseInfo?.field ?? ""} courseId={courseInfo?.id ?? 0} />
            <div className="w-full flex flex-col items-center justify-center space-y-10 mt-20">
                {courseContent &&
                    courseContent.map((item, index) => {
                        if (item.type === "text") {
                            return <Text key={index} content={item.text || ""} backgroundIndex={index} />
                        } else if (item.type === "module") {
                            const moduleData = modules.find((mod) => mod.id === item.moduleId)

                            if (moduleData) {
                                return (
                                    <Module
                                        key={index}
                                        moduleId={item.moduleId || 0}
                                        moduleTitle={moduleData.title || "Untitled Module"}
                                        moduleDescription={moduleData.description || "No description available."}
                                        moduleImageUrl={moduleData.imageUrl || "/default-image.png"}
                                    />
                                )
                            }
                        }
                        return null
                    })}
            </div>

            {Array.isArray(suggestCourses) && suggestCourses.length > 0 && (
                <>
                    <div className="mt-20"></div>
                    <p className="mt-20 text-2xl font-medium flex justify-center">What's next?</p>
                    <div className="w-full flex justify-center mt-20">
                        <div className="w-full max-w-[95%] flex justify-center">
                            <div className="overflow-x-auto overflow-y-hidden scrollbar-hide">
                                <div className="flex justify-start">
                                    {suggestCourses.map((course, index) => (
                                        <div
                                            key={index}
                                            className={`mr-10 ${
                                                suggestCourses.length < 4 && index === suggestCourses.length - 1 ? "last:mr-0" : "last:-mr-20"
                                            }`}
                                        >
                                            <CourseCard
                                                courseName={course.name || "Untitled Course"}
                                                fieldName={course.fieldName || "Unknown Field"}
                                                imageUrl={course.fieldImageUrl || "/default-image.png"}
                                                courseId={course.id || 0}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            <div className="h-40"></div>
        </div>
    )
}

export default Course

