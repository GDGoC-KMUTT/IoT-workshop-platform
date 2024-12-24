package controllers

import (
	"backend/internals/entities/payload"
	"backend/internals/entities/response"
	"backend/internals/services"
	mockServices "backend/mocks/services"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
)

func setupTestCourseController(courseSvc services.CourseService) *fiber.App {
	app := fiber.New()

	controller := NewCourseController(courseSvc)

	app.Get("/courses/current", controller.GetCurrentCourse)
	app.Get("/courses/:course_id/total-steps", controller.GetTotalStepsByCourseId)

	return app
}

func TestGetCurrentCourseWhenSuccess(t *testing.T) {
	is := assert.New(t)

	mockCourseService := new(mockServices.CourseService)

	app := setupTestCourseController(mockCourseService)

	mockUserId := uint64(123)

	mockCourseName := "Test Course"
	expectedCourse := payload.Course{
		Id:      &mockUserId,
		Name:    &mockCourseName,
		FieldId: nil,
	}

	mockCourseService.EXPECT().GetCurrentCourse(mockUserId).Return(&expectedCourse, nil)

	req := httptest.NewRequest(http.MethodGet, "/courses/current", nil)
	req.Header.Set("Authorization", "Bearer mockToken")

	res, err := app.Test(req)

	var responsePayload response.InfoResponse[payload.Course]
	body, _ := io.ReadAll(res.Body)
	json.Unmarshal(body, &responsePayload)

	is.Nil(err)
	is.Equal(http.StatusOK, res.StatusCode)
	is.Equal(*expectedCourse.Id, *responsePayload.Data.Id)
	is.Equal(*expectedCourse.Name, *responsePayload.Data.Name)
}

func TestGetCurrentCourseWhenFailedToFetchCurrentCourse(t *testing.T) {
	is := assert.New(t)

	mockCourseService := new(mockServices.CourseService)

	app := setupTestCourseController(mockCourseService)

	mockUserId := uint64(123)

	mockCourseService.EXPECT().GetCurrentCourse(mockUserId).Return(&payload.Course{}, fmt.Errorf("failed to fetch current course"))

	req := httptest.NewRequest(http.MethodGet, "/courses/current", nil)
	req.Header.Set("Authorization", "Bearer mockToken")

	res, err := app.Test(req)

	var errResponse response.GenericError
	body, _ := io.ReadAll(res.Body)
	json.Unmarshal(body, &errResponse)

	is.Nil(err)
	is.Equal(http.StatusInternalServerError, res.StatusCode)
	is.Equal("failed to fetch current course", errResponse.Message)
}

func TestGetTotalStepsByCourseIdWhenSuccess(t *testing.T) {
	is := assert.New(t)

	mockCourseService := new(mockServices.CourseService)

	app := setupTestCourseController(mockCourseService)

	mockCourseId := uint64(1)
	expectedTotalSteps := payload.TotalStepsByCourseIdPayload{
		TotalSteps: 10,
	}

	mockCourseService.EXPECT().GetTotalStepsByCourseId(mockCourseId).Return(&expectedTotalSteps, nil)

	req := httptest.NewRequest(http.MethodGet, fmt.Sprintf("/courses/%d/total-steps", mockCourseId), nil)
	res, err := app.Test(req)

	var responsePayload response.InfoResponse[payload.TotalStepsByCourseIdPayload]
	body, _ := io.ReadAll(res.Body)
	json.Unmarshal(body, &responsePayload)

	is.Nil(err)
	is.Equal(http.StatusOK, res.StatusCode)
	is.Equal(expectedTotalSteps.TotalSteps, responsePayload.Data.TotalSteps)
}

func TestGetTotalStepsByCourseIdWhenFailedToFetchTotalSteps(t *testing.T) {
	is := assert.New(t)

	mockCourseService := new(mockServices.CourseService)

	app := setupTestCourseController(mockCourseService)

	mockCourseId := uint64(1)

	mockCourseService.EXPECT().GetTotalStepsByCourseId(mockCourseId).Return(&payload.TotalStepsByCourseIdPayload{}, fmt.Errorf("failed to fetch total steps"))

	req := httptest.NewRequest(http.MethodGet, fmt.Sprintf("/courses/%d/total-steps", mockCourseId), nil)
	res, err := app.Test(req)

	var errResponse response.GenericError
	body, _ := io.ReadAll(res.Body)
	json.Unmarshal(body, &errResponse)

	is.Nil(err)
	is.Equal(http.StatusInternalServerError, res.StatusCode)
	is.Equal("failed to fetch total steps", errResponse.Message)
}