let TypeGuardsUtils = /** @class */ (() => {
    class TypeGuardsUtils {
        static doesObjectContainsFields(object, fields) {
            for (let field of fields) {
                if (!(field in object)) {
                    return false;
                }
            }
            return true;
        }
        static isFieldAnArray(field) {
            return field instanceof Array;
        }
        static isFieldOfType(field, requiredFieldType) {
            return typeof field == requiredFieldType;
        }
    }
    TypeGuardsUtils.STRING_TYPE = "string";
    TypeGuardsUtils.NUMBER_TYPE = "number";
    TypeGuardsUtils.BOOLEAN_TYPE = "boolean";
    return TypeGuardsUtils;
})();
export { TypeGuardsUtils };
let QuizGuard = /** @class */ (() => {
    class QuizGuard {
        static check(object) {
            return TypeGuardsUtils.doesObjectContainsFields(object, this.OBJECT_FIELDS)
                && TypeGuardsUtils.isFieldOfType(object.name, TypeGuardsUtils.STRING_TYPE)
                && TypeGuardsUtils.isFieldOfType(object.introduction, TypeGuardsUtils.STRING_TYPE)
                && this.isFieldAnArrayOfQuestionsWithAnswers(object.questionsWithAnswers);
        }
        static isFieldAnArrayOfQuestionsWithAnswers(field) {
            return TypeGuardsUtils.isFieldAnArray(field)
                && this.areFieldsInArrayInstancesOfQuestionsWithAnswers(field);
        }
        static areFieldsInArrayInstancesOfQuestionsWithAnswers(fields) {
            return fields
                .every(field => this.isFieldInstanceOfQuestionsWithAnswers(field));
        }
        static isFieldInstanceOfQuestionsWithAnswers(field) {
            return QuizQuestionWithAnswerGuard.check(field);
        }
    }
    QuizGuard.OBJECT_FIELDS = ["name", "introduction", "questionsWithAnswers"];
    return QuizGuard;
})();
export { QuizGuard };
let QuizQuestionWithAnswerGuard = /** @class */ (() => {
    class QuizQuestionWithAnswerGuard {
        static check(object) {
            return TypeGuardsUtils.doesObjectContainsFields(object, this.OBJECT_FIELDS)
                && TypeGuardsUtils.isFieldOfType(object.question, TypeGuardsUtils.STRING_TYPE)
                && TypeGuardsUtils.isFieldOfType(object.answer, TypeGuardsUtils.NUMBER_TYPE)
                && TypeGuardsUtils.isFieldOfType(object.wrongAnswerPenalty, TypeGuardsUtils.NUMBER_TYPE);
        }
    }
    QuizQuestionWithAnswerGuard.OBJECT_FIELDS = ["question", "answer", "wrongAnswerPenalty"];
    return QuizQuestionWithAnswerGuard;
})();
export { QuizQuestionWithAnswerGuard };
let QuizDetailedScoreboardGuard = /** @class */ (() => {
    class QuizDetailedScoreboardGuard {
        static check(object) {
            return TypeGuardsUtils.doesObjectContainsFields(object, this.OBJECT_FIELDS)
                && this.isFieldAnArrayOfQuestionStatistics(object.questionsStatistics)
                && this.isFieldInstanceOfQuizScore(object.quizScore);
        }
        static isFieldAnArrayOfQuestionStatistics(field) {
            return TypeGuardsUtils.isFieldAnArray(field)
                && this.areFieldsInArrayInstancesOfQuestionStatistics(field);
        }
        static areFieldsInArrayInstancesOfQuestionStatistics(fields) {
            return fields
                .every(field => this.isFieldInstanceOfQuestionStatistics(field));
        }
        static isFieldInstanceOfQuestionStatistics(field) {
            return QuestionStatisticsGuard.check(field);
        }
        static isFieldInstanceOfQuizScore(field) {
            return QuizScoreGuard.check(field);
        }
    }
    QuizDetailedScoreboardGuard.OBJECT_FIELDS = ["questionsStatistics", "quizScore"];
    return QuizDetailedScoreboardGuard;
})();
export { QuizDetailedScoreboardGuard };
let QuizScoreGuard = /** @class */ (() => {
    class QuizScoreGuard {
        static check(object) {
            return TypeGuardsUtils.doesObjectContainsFields(object, this.OBJECT_FIELDS)
                && TypeGuardsUtils.isFieldOfType(object.score, TypeGuardsUtils.NUMBER_TYPE);
        }
    }
    QuizScoreGuard.OBJECT_FIELDS = ["score"];
    return QuizScoreGuard;
})();
export { QuizScoreGuard };
let QuestionStatisticsGuard = /** @class */ (() => {
    class QuestionStatisticsGuard {
        static check(object) {
            return TypeGuardsUtils.doesObjectContainsFields(object, this.OBJECT_FIELDS)
                && TypeGuardsUtils.isFieldOfType(object.isAnswerCorrectFlag, TypeGuardsUtils.BOOLEAN_TYPE)
                && TypeGuardsUtils.isFieldOfType(object.timePenalty, TypeGuardsUtils.NUMBER_TYPE)
                && TypeGuardsUtils.isFieldOfType(object.timeSpendInSeconds, TypeGuardsUtils.NUMBER_TYPE);
        }
    }
    QuestionStatisticsGuard.OBJECT_FIELDS = ["isAnswerCorrectFlag", "timePenalty", "timeSpendInSeconds"];
    return QuestionStatisticsGuard;
})();
export { QuestionStatisticsGuard };
