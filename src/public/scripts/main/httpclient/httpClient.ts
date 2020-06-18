

export class HttpClient {

  private host: string = 'http://localhost:3000';

  public async getQuizzesNamesList(): Promise<string[]> {
    const fetchResult: any[] = await fetch(this.getUrl('/api/quiz/list'))
      .then(response => response.json());

    return fetchResult
      .map(element => element.name);
  }

  public async getTopScores(): Promise<number[]> {
    const fetchResult: any[] = await fetch(this.getUrl('/api/quiz/scores'))
    .then(response => response.json());

    return fetchResult
      .map(element => element.score);
  }

  private getUrl(resource: string): string {
    return `${this.host}${resource}`;
  }
}
