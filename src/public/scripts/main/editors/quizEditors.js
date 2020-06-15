import { Utils } from "../utils/utils.js";
import { DocumentEditor } from "./documentEditors.js";
import { QuizProperties } from "../properties/quizProperties.js";
export class ScoreboardTableEditor {
    constructor(document, tableElementId, numberOfRowsToDisplay) {
        this.documentEditor = DocumentEditor.fromDocument(document);
        this.tableElement = this.documentEditor.getElement(tableElementId);
        this.numberOfRowsToDisplay = numberOfRowsToDisplay;
    }
    addRowsWithScoresInGivenOrder(scoresArray) {
        scoresArray
            .slice(0, this.numberOfRowsToDisplay)
            .forEach(score => this.addRowWithScore(score));
    }
    addRowWithScore(score) {
        const newRow = this.tableElement.insertRow();
        const formattedScore = Utils.getStringDescriptingTimeInSeconds(score.getScore());
        this.addCellToTableRow(newRow, formattedScore, QuizProperties.QUIZ_SCOREBOARD_TABLE_ELEMENT_CLASS);
    }
    addCellToTableRow(tableRow, innerHTML, cellClass) {
        const newCell = tableRow.insertCell();
        newCell.innerHTML = innerHTML;
        newCell.className = cellClass;
    }
}
