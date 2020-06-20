export interface QuizQuestionWithAnswerJson {
  question: string,
  answer: number,
  wrongAnswerPenalty: number
}

export interface QuizJson {
  name: string,
  introduction: string,
  questionsWithAnswers: QuizQuestionWithAnswerJson[]
}


export class Quiz {
  private readonly quizJson: QuizJson;

  private constructor(quizJson: QuizJson) {
    this.quizJson = quizJson;
  }

  public static fromJson(quizJson: string): Quiz {
    const parsedQuizJson = JSON.parse(quizJson);

    return new Quiz(parsedQuizJson);
  }

  public toJson(): string {
    return JSON.stringify(this.quizJson);
  }

  public getName(): string {
    return this.quizJson.name;
  }

  public hasName(name: string): boolean {
    return this.getName() === name;
  }

  public getIntroduction(): string {
    return this.quizJson.introduction;
  }

  public getQuestionsWithAnswers(): QuizQuestionWithAnswerJson[] {
    return this.quizJson
        .questionsWithAnswers;
  }

}


export class QuizQuestionWithAnswersAndTime {

  private readonly quizQuestionWithAnswerJson: QuizQuestionWithAnswerJson;
  private userAnswer: number;
  private doesUserAnsweredFlag: boolean;
  private answerTime: number;

  private constructor(quizQuestionWithAnswerJson: QuizQuestionWithAnswerJson) {
    this.quizQuestionWithAnswerJson = quizQuestionWithAnswerJson;
    this.userAnswer = 0;
    this.doesUserAnsweredFlag = false;
    this.answerTime = 0;
  }

  public static fromQuizQuestionWithAnswerJson(quizQuestionWithAnswerJson: QuizQuestionWithAnswerJson): QuizQuestionWithAnswersAndTime {
    return new QuizQuestionWithAnswersAndTime(quizQuestionWithAnswerJson);
  }

  public updateUserAnswer(userAnswer: number) {
    this.userAnswer = userAnswer;
    this.doesUserAnsweredFlag = true;
  }

  public removeUserAnswer() {
    this.doesUserAnsweredFlag = false;
  }

  public updateUserAnswerTime(answerTime: number) {
    this.answerTime = answerTime;
  }

  public getUserAnswerTime(): number {
    return this.answerTime;
  }

  public doesUserAnswered(): boolean {
    return this.doesUserAnsweredFlag;
  }

  public isUserAnswerCorrect(): boolean {
    return this.doesUserAnswered()
        && this.userAnswer === this.quizQuestionWithAnswerJson.answer;
  }

  public getQuestionText(): string {
    return this.quizQuestionWithAnswerJson.question;
  }

  public getWrongAnswerPenalty(): number {
    return this.quizQuestionWithAnswerJson.wrongAnswerPenalty;
  }

  public getUserAnswer(): number {
    return this.userAnswer;
  }
}

