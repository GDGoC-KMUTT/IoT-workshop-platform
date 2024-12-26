import { ChangeEvent, useEffect, useState } from "react"
import { Search } from "lucide-react"
import FieldButton from "@/components/buttons/FieldButton"
import CourseCard from "@/components/card/CourseCard"
import useCourseWithFieldId from "@/hooks/useCourseByFieldId"
import useFieldTypes from "@/hooks/useFieldTypes"
import useArticles from "@/hooks/useArticles"
import ArticleCard from "@/components/card/ArticleCard"
const Explore = () => {
    const [keyword, setKeyword] = useState<string>("")
    const [activeField, setActiveField] = useState<number | undefined>(undefined)
    const { fieldTypes, isLoading: isLoadingFieldTypes } = useFieldTypes()
    const { courses, isLoading: isLoadingCourseWithFiledId } = useCourseWithFieldId(activeField)
    const { articles, isLoading: isArticlesLoading } = useArticles()

    const [searchType, setSearchType] = useState("course")

    useEffect(() => {
        if (fieldTypes && fieldTypes.length > 0) {
            setActiveField(fieldTypes[0].id)
        }
    }, [fieldTypes])

    if (isLoadingFieldTypes || isLoadingCourseWithFiledId || isArticlesLoading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center w-[100vw] ">
                <h1 className="text-primary">Loading Data</h1>
            </div>
        )
    }

    const handleKeywordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setKeyword(event.target.value)
    }

    const handleFieldChange = (fieldId: number) => {
        setActiveField(fieldId)
        console.log(`Filtering results for field: ${fieldId}`)
    }
    const handleSearchTypeChange = (searchType: string) => {
        console.log(searchType)
        setSearchType(searchType)
    }
    const filteredCourses = courses?.filter((course) => course.name?.toLowerCase().includes(keyword.toLowerCase()))
    const filteredArticles = articles?.filter((article) => article.title?.toLowerCase().includes(keyword.toLowerCase()))

    return (
        <div className="min-h-screen flex flex-col items-center w-[100vw] py-24 px-10">
            <div className="flex flex-col justify-center items-center bg-droplet1 bg-center bg-contain bg-no-repeat py-10">
                <h1 className="mb-[20px] text-explore-foreground text-center">Explore something new!</h1>
                <div className={`flex justify-center space-x-4 flex-wrap`}>
                    <div className="relative mt-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 " />
                        <input
                            type="text"
                            className="pl-10 pr-4 py-2 bg-form rounded-full w-64  h-[50px]"
                            value={keyword}
                            onChange={handleKeywordChange}
                        />
                    </div>
                    <div className="mt-4">
                        <button
                            className={`rounded-lg w-[120px] h-[50px] hover:border-primary hover:border-2  ${searchType == "course" ? "bg-explore text-explore-foreground" : "text-foreground bg-transparent"}`}
                            onClick={() => handleSearchTypeChange("course")}
                        >
                            Course
                        </button>
                        <button
                            className={`rounded-lg w-[120px] h-[50px] hover:border-primary hover:border-2  ${searchType == "article" ? "bg-explore text-explore-foreground" : "text-foreground bg-transparent"}`}
                            onClick={() => handleSearchTypeChange("article")}
                        >
                            Article
                        </button>
                    </div>
                </div>
                <div className={`flex justify-center flex-wrap space-x-3 max-w-[70%] my-[20px] ${searchType == "article" && "invisible"} `}>
                    {fieldTypes?.map((fieldType) => (
                        <FieldButton
                            key={fieldType.id}
                            fieldType={fieldType}
                            isActive={activeField === fieldType.id}
                            onClick={() => handleFieldChange(fieldType.id || 0)}
                        />
                    ))}{" "}
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 items-center w-full mx-auto">
                {searchType == "course" &&
                    filteredCourses?.map((course) => {
                        return <CourseCard key={course.id} course={course} />
                    })}
                {searchType == "article" &&
                    filteredArticles?.map((article) => {
                        return <ArticleCard key={article.id} article={article} />
                    })}
            </div>
        </div>
    )
}

export default Explore

