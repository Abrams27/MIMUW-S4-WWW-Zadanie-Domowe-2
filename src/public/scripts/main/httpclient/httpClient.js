var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class HttpClient {
    constructor() {
        this.host = 'http://localhost:3000';
    }
    getQuizzesNamesList() {
        return __awaiter(this, void 0, void 0, function* () {
            const fetchResult = yield fetch(this.getUrl('/api/quiz/list'))
                .then(response => response.json());
            return fetchResult
                .map(element => element.name);
        });
    }
    getSolvedQuizzesNamesList() {
        return __awaiter(this, void 0, void 0, function* () {
            const fetchResult = yield fetch(this.getUrl('/api/quiz/solved'))
                .then(response => response.json());
            return fetchResult
                .map(element => element.name);
        });
    }
    getQuizWithName(quizName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fetch(this.getUrl(`/api/quiz/name/${quizName}`))
                .then(response => response.json())
                .then(response => response.quiz);
        });
    }
    getTopScores() {
        return __awaiter(this, void 0, void 0, function* () {
            const fetchResult = yield fetch(this.getUrl('/api/quiz/scores'))
                .then(response => response.json());
            return fetchResult
                .map(element => element.score);
        });
    }
    postQuizResults(quizName, quizResults, csrfToken) {
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
    getQuizStatistics() {
        return __awaiter(this, void 0, void 0, function* () {
            const fetchResult = yield fetch(this.getUrl('/api/quiz/result/xd'))
                .then(response => response.json());
            return fetchResult;
        });
    }
    getUrl(resource) {
        return `${this.host}${resource}`;
    }
}
