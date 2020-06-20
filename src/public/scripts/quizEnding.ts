import {Properties} from './main/properties/properties.js';
import {QuizEndingProperties} from './main/properties/quizEndingProperties.js';
import {QuizDetailedScoreboard} from './main/scoreboards/scoreboard.js';
import {QuizEndingPageEditor} from './main/editors/quizEndingEditors.js';
import {DocumentEditor} from './main/editors/documentEditors.js';
import {HttpClient} from './main/httpclient/httpClient.js';

const documentEditor: DocumentEditor = DocumentEditor.fromDocument(document);
const httpClient: HttpClient = new HttpClient();

// const nullableDetailedScoreboardJson: string | null = sessionStorage.getItem(Properties.QUIZ_DETAILED_SCOREBOARD_SESSION_STORAGE_KEY);
// const detailedScoreboardJson: string = Utils.getStringOrThrowError(nullableDetailedScoreboardJson, 'invalid session storage key');
// const detailedScoreboard: QuizDetailedScoreboard = QuizDetailedScoreboard.fromJson(detailedScoreboardJson);

httpClient.getQuizStatistics()
.then(o => {
  const detailedScoreboard: QuizDetailedScoreboard = QuizDetailedScoreboard.fromJson(o);
  const quizEndingPageUpdater: QuizEndingPageEditor = new QuizEndingPageEditor(document, detailedScoreboard);
  quizEndingPageUpdater.loadPage();
});
// const quizEndingPageUpdater: QuizEndingPageEditor = new QuizEndingPageEditor(document, detailedScoreboard);
// quizEndingPageUpdater.loadPage();

// IndexedDBClient.saveScore(detailedScoreboard.getQuizScore());


const returnButton: HTMLButtonElement = documentEditor.getElement(QuizEndingProperties.QUIZ_ENDING_RETURN_BUTTON) as HTMLButtonElement;
returnButton.addEventListener(Properties.CLICK_EVENT_TYPE, returnButtonClickListener);

function returnButtonClickListener() {
  // todo pewnie cos zrobic
  location.href = Properties.QUIZ_HTML_FILE;
}
