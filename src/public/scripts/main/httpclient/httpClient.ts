export class HttpClient {

  private host: string = 'http://localhost:3000';

  public async getQuizzesNamesList(): Promise<string[]> {
    const fetchResult: any[] = await fetch(this.getUrl('/api/quiz/list'))
      .then(response => response.json());

    return fetchResult
      .map(element => element.name);
  }

  public async getQuizWithName(quizName: string): Promise<string> {
    return  await fetch(this.getUrl(`/api/quiz/name/${quizName}`))
      .then(response => response.json())
      .then(response => response.quiz);
  }

  public async getTopScores(): Promise<number[]> {
    const fetchResult: any[] = await fetch(this.getUrl('/api/quiz/scores'))
    .then(response => response.json());

    return fetchResult
      .map(element => element.score);
  }

  public postQuizResults(quizName: string, quizResults: string, csrfToken: string): Promise<any> {
    return fetch(this.getUrl(`/api/quiz/name/${quizName}`), {
      method: 'POST',
      body: quizResults,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      }
    });
    // .then(response => if);
  }

  public async getQuizStatistics(): Promise<string> {
    const fetchResult: string = await fetch(this.getUrl('/api/quiz/result/xd'))
      .then(response => response.json());

    return fetchResult;
  }

  private getUrl(resource: string): string {
    return `${this.host}${resource}`;
  }
}
