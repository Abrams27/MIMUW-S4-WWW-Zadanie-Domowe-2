import { QuizScore } from "../scoreboards/scoreboard.js";
import { Properties } from "../properties/properties.js";
export class IndexedDBClient {
    static saveScore(quizScore) {
        let indexedDBRequest = this.getIndexedDBRequestWithDefaultHandlers();
        indexedDBRequest.onsuccess = (event) => {
            var indexedDataBase = event.target.result;
            var transaction = indexedDataBase.transaction([Properties.INDEXED_BD_OBJECT_STORE_SIMPLE_SCOREBOARD], "readwrite");
            transaction.onerror = IndexedDBClient.defaultErrorHandler;
            var objectStore = transaction.objectStore(Properties.INDEXED_BD_OBJECT_STORE_SIMPLE_SCOREBOARD);
            var request = objectStore.add(quizScore);
            request.onerror = IndexedDBClient.defaultErrorHandler;
            indexedDataBase.close();
        };
    }
    static saveDetailedScore(detailedQuizScore) {
        let indexedDBRequest = this.getIndexedDBRequestWithDefaultHandlers();
        indexedDBRequest.onsuccess = (event) => {
            var indexedDataBase = event.target.result;
            var transaction = indexedDataBase.transaction([Properties.INDEXED_BD_OBJECT_STORE_DETAILED_SCOREBOARD], "readwrite");
            transaction.onerror = IndexedDBClient.defaultErrorHandler;
            var objectStore = transaction.objectStore(Properties.INDEXED_BD_OBJECT_STORE_DETAILED_SCOREBOARD);
            var request = objectStore.add(detailedQuizScore);
            request.onerror = IndexedDBClient.defaultErrorHandler;
            indexedDataBase.close();
        };
    }
    static getAllScoresAndInsertToTableWithSupplier(supplier) {
        let indexedDBRequest = this.getIndexedDBRequestWithDefaultHandlers();
        indexedDBRequest.onsuccess = (event) => {
            var indexedDataBase = event.target.result;
            var transaction = indexedDataBase.transaction([Properties.INDEXED_BD_OBJECT_STORE_SIMPLE_SCOREBOARD], "readwrite");
            transaction.onerror = IndexedDBClient.defaultErrorHandler;
            var objectStore = transaction.objectStore(Properties.INDEXED_BD_OBJECT_STORE_SIMPLE_SCOREBOARD);
            var request = objectStore.getAll();
            request.onerror = IndexedDBClient.defaultErrorHandler;
            request.onsuccess = function () {
                let quizScoresArray = request.result
                    .map(quizScore => QuizScore.copyOf(quizScore));
                supplier(quizScoresArray);
            };
            indexedDataBase.close();
        };
    }
    static getIndexedDBRequestWithDefaultHandlers() {
        let indexedDBRequest = indexedDB.open(Properties.INDEXED_DB_TABLE_NAME, Properties.INDEXED_DB_VERSION);
        indexedDBRequest.onerror = IndexedDBClient.defaultErrorHandler;
        indexedDBRequest.onupgradeneeded = IndexedDBClient.defaultOnUpgradeNeededeHandler;
        return indexedDBRequest;
    }
    static defaultErrorHandler() {
        throw new Error("indexedDB error");
    }
    static defaultOnUpgradeNeededeHandler(event) {
        var indexedDataBase = event.target.result;
        var objStore = indexedDataBase
            .createObjectStore(Properties.INDEXED_BD_OBJECT_STORE_SIMPLE_SCOREBOARD, { autoIncrement: true });
        var objStore = indexedDataBase
            .createObjectStore(Properties.INDEXED_BD_OBJECT_STORE_DETAILED_SCOREBOARD, { autoIncrement: true });
    }
}
