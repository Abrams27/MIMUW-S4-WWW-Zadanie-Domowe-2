

export class HttpClient {

  private host: string = 'http://localhost:3000';

  public async getQuizzesNamesList(): Promise<string[]> {
    const fetchResult: any[] = await fetch('http://localhost:3000/api/quiz/list')
      .then(response => response.json());

    return fetchResult
      .map(element => element.name);
  }
}
