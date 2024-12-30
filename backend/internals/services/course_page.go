package services

import "backend/internals/entities/payload"

type CoursePageServiceInterface interface {
	GetCoursePageInfo(coursePageId string) (*payload.CoursePage, error)
	GetCoursePageContent(coursePageId string) ([]payload.CoursePageContent, error)
	GetSuggestCourseByFieldId(fieldId string) ([]payload.SuggestCourse, error)
}
