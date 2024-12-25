package repositories

import "backend/internals/db/models"

type StepEvaluateRepository interface {
	GetStepEvalByStepId(stepId *uint64) ([]*models.StepEvaluate, error)
}
