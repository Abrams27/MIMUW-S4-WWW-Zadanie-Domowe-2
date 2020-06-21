import {Quiz, QuizQuestionWithAnswerJson, QuizQuestionWithAnswersAndTime} from '@shared/quizzes';

export class QuizDetailedScoreboard {

  private readonly questionsStatistics: QuestionStatistics[];
  private readonly quizScore: QuizScore;

  private constructor(questionsStatistics: QuestionStatistics[]) {
    this.questionsStatistics = questionsStatistics;
    this.quizScore = new QuizScore(this.calculateResultWithPenalties());
  }

  public static fromJson(quizDetailedScoreboardJson: string): QuizDetailedScoreboard {
    const parsedQuizDetailedScoreboardJson = JSON.parse(quizDetailedScoreboardJson);
    const questionsStatistics: QuestionStatistics[] = this.copyOfQuestionStatisticsArray(parsedQuizDetailedScoreboardJson.questionsStatistics);

    return new QuizDetailedScoreboard(questionsStatistics);
  }

  private static copyOfQuestionStatisticsArray(questionsStatistics: QuestionStatistics[]): QuestionStatistics[] {
    return questionsStatistics
    .map(questionStatistics => QuestionStatistics.copyOf(questionStatistics));
  }

  public static fromQuizAndQuizPercentageTimeDetailedScoreboard(
      quiz: Quiz, quizPercentageTimeDetailedScoreboard: QuizPercentageTimeDetailedScoreboard, answersTime: number): QuizDetailedScoreboard {
    const questionStatistics: QuestionStatistics[] = this.getQuestionStatisticsForQuiz(quiz, quizPercentageTimeDetailedScoreboard, answersTime);

    return new QuizDetailedScoreboard(questionStatistics);
  }

  private static getQuestionStatisticsForQuiz(
      quiz: Quiz, quizPercentageTimeDetailedScoreboard: QuizPercentageTimeDetailedScoreboard, answersTime: number): QuestionStatistics[] {

    const questionPercentageTimeStatistics: QuestionPercentageTimeStatistics[] =
        quizPercentageTimeDetailedScoreboard.getQuestionPercentageTimeStatistics();

    const questionsWithAnswers: QuizQuestionWithAnswerJson[] =
        quiz.getQuestionsWithAnswers();

    return Array.from(Array(questionPercentageTimeStatistics.length).keys())
      .map( o => new QuestionStatistics(
          this.isAnswerCorrect(questionPercentageTimeStatistics[o].getAnswer(), questionsWithAnswers[o].answer),
          questionsWithAnswers[o].wrongAnswerPenalty,
          this.getAnswerTime(questionPercentageTimeStatistics[o].getTimeSpendPercentage(), answersTime),
          questionsWithAnswers[o].answer));

  }

  private static isAnswerCorrect(answer: number, correctAnswer: number): boolean {
    return answer === correctAnswer;
  }

  private static getAnswerTime(answerTimePercentage: number, wholeTime: number): number {
    return wholeTime * answerTimePercentage / 100;
  }

  public toJson(): string {
    return JSON.stringify(this);
  }

  public getNumericQuizScore(): number {
    return this.quizScore.getScore();
  }

  public getQuizScore(): QuizScore {
    return this.quizScore;
  }

  public getQuestionsStatistics(): QuestionStatistics[] {
    return this.questionsStatistics;
  }

  public getNumberOfCorrectsAnswers(): number {
    return this.questionsStatistics
    .map(questionStatistics => questionStatistics.isAnswerCorrect())
    .map(isAnswerCorrect => Number(isAnswerCorrect))
    .reduce((sum, isCorrect) => sum + isCorrect);
  }

  public getNumberOfAnswers(): number {
    return this.questionsStatistics.length;
  }

  private static mapQuizQuestionWithAnswersAndTime(questionsListWithUserAnswers: QuizQuestionWithAnswersAndTime[]): QuestionStatistics[] {
    return QuizQuestionWithAnswersAndTimeMapper
    .mapToQuestionStatisticsArray(questionsListWithUserAnswers);
  }

  private calculateResultWithPenalties(): number {
    return this.questionsStatistics
    .map(questionStatistics => questionStatistics.getTimeWithPenalty())
    .reduce((sum, score) => sum + score);
  }

}


export class QuestionStatistics {

  private readonly isAnswerCorrectFlag: boolean;
  private readonly timePenalty: number;
  private readonly timeSpendInSeconds: number;
  private readonly correctAnswer: number;

  public constructor(isAnswerCorrect: boolean, timePenalty: number, timeSpendInSeconds: number, correctAnswer: number) {
    this.isAnswerCorrectFlag = isAnswerCorrect;
    this.timePenalty = timePenalty;
    this.timeSpendInSeconds = timeSpendInSeconds;
    this.correctAnswer = correctAnswer;
  }

  public static copyOf(questionStatistics: QuestionStatistics): QuestionStatistics {
    return new QuestionStatistics(
        questionStatistics.isAnswerCorrectFlag,
        questionStatistics.timePenalty,
        questionStatistics.timeSpendInSeconds,
        questionStatistics.correctAnswer);
  }

  public isAnswerCorrect(): boolean {
    return this.isAnswerCorrectFlag;
  }

  public getTimeWithPenalty(): number {
    if (this.isAnswerCorrectFlag) {
      return this.timeSpendInSeconds;
    } else {
      return this.timeSpendInSeconds + this.timePenalty;
    }
  }

}


export class QuizScore {

  private readonly score: number;

  public constructor(score: number) {
    this.score = score;
  }

  public getScore(): number {
    return this.score;
  }

  public static copyOf(quizScore: QuizScore): QuizScore {
    return new QuizScore(quizScore.score);
  }

  public compare(quizScore: QuizScore): number {
    if (this.score < quizScore.score) {
      return -1;
    } else if (this.score > quizScore.score) {
      return 1;
    } else {
      return 0;
    }
  }

}




export class QuizPercentageTimeDetailedScoreboard {

  private readonly quizName: string;
  private readonly questionPercentageTimeStatistics: QuestionPercentageTimeStatistics[];

  private constructor(quizName: string, questionPercentageTimeStatistics: QuestionPercentageTimeStatistics[]) {
    this.quizName = quizName;
    this.questionPercentageTimeStatistics = questionPercentageTimeStatistics;
  }

  public static copyOf(quizPercentageTimeDetailedScoreboard: QuizPercentageTimeDetailedScoreboard): QuizPercentageTimeDetailedScoreboard {
    const quizName: string = quizPercentageTimeDetailedScoreboard.quizName;
    const questionPercentageTimeStatistic: QuestionPercentageTimeStatistics[] =
        QuizPercentageTimeDetailedScoreboard.copyQuestionsListWithUserAnswers(quizPercentageTimeDetailedScoreboard.questionPercentageTimeStatistics);

    return new QuizPercentageTimeDetailedScoreboard(quizName, questionPercentageTimeStatistic);
  }

  private static copyQuestionsListWithUserAnswers(questionPercentageTimeStatistics: QuestionPercentageTimeStatistics[]): QuestionPercentageTimeStatistics[] {
    return questionPercentageTimeStatistics
      .map(questionPercentageTimeStatistic => QuestionPercentageTimeStatistics.copyOf(questionPercentageTimeStatistic));
  }

  public getQuizName(): string {
    return this.quizName;
  }

  public getQuestionPercentageTimeStatistics(): QuestionPercentageTimeStatistics[] {
    return this.questionPercentageTimeStatistics;
  }
}


export class QuestionPercentageTimeStatistics {

  private readonly answer: number;
  private readonly timeSpendPercentage: number;

  private constructor(answer: number, timeSpendPercentage: number) {
    this.answer = answer;
    this.timeSpendPercentage = timeSpendPercentage;
  }

  public static copyOf(questionPercentageTimeStatistics: QuestionPercentageTimeStatistics): QuestionPercentageTimeStatistics {
    return new QuestionPercentageTimeStatistics(
        questionPercentageTimeStatistics.answer,
        questionPercentageTimeStatistics.timeSpendPercentage);
  }

  public getAnswer(): number {
    return this.answer;
  }

  public getTimeSpendPercentage(): number {
    return this.timeSpendPercentage;
  }

}



class QuizQuestionWithAnswersAndTimeMapper {

  public static mapToQuestionStatisticsArray(quizQuestionWithAnswersAndTimeArray: QuizQuestionWithAnswersAndTime[]): QuestionStatistics[] {
    return quizQuestionWithAnswersAndTimeArray
    .map(quizQuestionWithAnswersAndTime => this.mapToQuestionStatistics(quizQuestionWithAnswersAndTime));
  }

  private static mapToQuestionStatistics(quizQuestionWithAnswersAndTime: QuizQuestionWithAnswersAndTime): QuestionStatistics {
    const isAnswerCorrect: boolean = quizQuestionWithAnswersAndTime.isUserAnswerCorrect();
    const wrongAnswerPenalty: number = quizQuestionWithAnswersAndTime.getWrongAnswerPenalty();
    const answerTimeInSeconds: number = quizQuestionWithAnswersAndTime.getUserAnswerTime();

    return new QuestionStatistics(isAnswerCorrect, wrongAnswerPenalty, answerTimeInSeconds, 1);
  }

}
