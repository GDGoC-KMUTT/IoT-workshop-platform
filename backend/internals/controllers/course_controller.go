package controllers

import (
	"backend/internals/entities/payload"
	"backend/internals/entities/response"
	"backend/internals/services"
	"github.com/golang-jwt/jwt/v5"
	"github.com/gofiber/fiber/v2"
)

type CourseController struct {
	courseSvc services.CourseService
}

func NewCourseController(courseSvc services.CourseService) CourseController {
	return CourseController{
		courseSvc: courseSvc,
	}
}

// GetCoursesByFieldId
// @ID getCoursesByFieldId
// @Tags courses
// @Summary Get all courses for a specific field_id
// @Accept json
// @Produce json
// @Param field_id path uint true "Field ID"
// @Success 200 {object} response.InfoResponse[[]payload.CourseWithFieldType]
// @Failure 400 {object} response.GenericError
// @Router /courses/field/{field_id} [get]
func (r *CourseController) GetCoursesByFieldId(c *fiber.Ctx) error {
	param := new(payload.FieldIdParam)

	if err := c.ParamsParser(param); err != nil {
		return &response.GenericError{
			Err:     err,
			Message: "invalid field_id parameter",
		}
	}

	courses, err := r.courseSvc.GetCourseByFieldId(param.FieldId)
	if err != nil {
		return &response.GenericError{
			Err:     err,
			Message: "failed to get courses",
		}
	}

	return response.Ok(c, courses)
}

// GetCurrentCourse
// @ID getCurrentCourse
// @Tags courses
// @Summary Get the current course the user is in based on their latest activity
// @Accept json
// @Produce json
// @Success 200 {object} response.InfoResponse[payload.Course]
// @Failure 400 {object} response.GenericError
// @Router /courses/current [get]
func (r *CourseController) GetCurrentCourse(c *fiber.Ctx) error {
	user := c.Locals("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userID := claims["userId"].(float64)

	// Get the current course for the user
	course, err := r.courseSvc.GetCurrentCourse(uint(userID))
	if err != nil {
		return &response.GenericError{
			Err:     err,
			Message: "failed to fetch current course",
		}
	}

	return response.Ok(c, course)
}

// GetTotalStepsByCourseId
// @ID getTotalStepsByCourseId
// @Tags courses
// @Summary Get the total steps for a specific course by course_id
// @Accept json
// @Produce json
// @Param course_id path uint true "Course ID"
// @Success 200 {object} response.InfoResponse[payload.TotalStepsByCourseIdPayload]
// @Failure 400 {object} response.GenericError
// @Router /courses/{course_id}/total-steps [get]
func (r *CourseController) GetTotalStepsByCourseId(c *fiber.Ctx) error {
	// Define the parameter struct for the course ID
	param := new(payload.CourseIdParam)

	// Parse the course_id parameter from the URL
	if err := c.ParamsParser(param); err != nil {
		return &response.GenericError{
			Err:     err,
			Message: "invalid course_id parameter",
		}
	}

	// Fetch the total steps for the course based on the course ID
	totalSteps, err := r.courseSvc.GetTotalStepsByCourseId(param.CourseId)
	if err != nil {
		return &response.GenericError{
			Err:     err,
			Message: "failed to fetch total steps",
		}
	}

	// Return the total steps in the response
	return response.Ok(c, totalSteps)
}