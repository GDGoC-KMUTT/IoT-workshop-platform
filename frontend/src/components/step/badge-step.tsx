import React, { FC } from "react"
import { Badge } from "@/components/ui/badge"
import MarkdownRenderer from "@/components/ui/markdown-renderer"

type BadgeStepProps = {
    badgeColor: string // Badge background color
    icon: React.ReactNode // Badge icon
    label: string // Label for the badge
    content: string | undefined // Content to be rendered
}

const BadgeStep: FC<BadgeStepProps> = ({ badgeColor, content, icon, label }) => {
    return (
        <div className="my-4">
            <Badge className={`${badgeColor} text-white gap-1 py-1 hover:${badgeColor}`}>
                {icon}
                <p className="uppercase text-base">{label}</p>
            </Badge>
            <div className="h-2/4 w-full bg-white rounded-sm flex flex-col p-3 border-[1px] border-gray-400 mt-4">
                {content && (
                    <div className="markdown">
                        <MarkdownRenderer content={content} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default BadgeStep

