package repositories

import "backend/internals/db/models"

type UserEvaluateRepository interface {
	GetUserEvalByStepEvalIdUserId(stepEvalId *uint64, userId *float64) (*models.UserEvaluate, error)
	CreateUserEval(userEval *models.UserEvaluate) (*models.UserEvaluate, error)
	GetUserEvalById(userEvalId *uint64) (*models.UserEvaluate, error)
	GetPassAllUserEvalByStepEvalId(stepEvalId *uint64) ([]*models.UserEvaluate, error)
	GetUserEvalByIdAndUserId(userEvalId *uint64, userId *uint64) (*models.UserEvaluate, error)
	FindStepEvaluateIDsByStepID(stepID uint64) ([]uint64, error)
	FindUserPassedEvaluateIDs(userID uint, stepID uint64) ([]uint64, error)
	Update(userEval *models.UserEvaluate) error
}
