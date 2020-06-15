import { Utils } from "../utils/utils.js";
import { QuizEndingProperties } from "../properties/quizEndingProperties.js";
export class SelectEditor {
    constructor(document, selectElementId) {
        this.documentEditor = DocumentEditor.fromDocument(document);
        this.selectElement = this.documentEditor.getElement(selectElementId);
    }
    addOptions(options, optionElementClass) {
        options
            .forEach(option => this.createOptionElementAndAddToSelect(option, optionElementClass));
    }
    createOptionElementAndAddToSelect(optionElementName, optionElementClass) {
        const optionElement = this.buildOptionElement(optionElementName, optionElementClass);
        this.selectElement.appendChild(optionElement);
    }
    buildOptionElement(optionElementName, optionElementClass) {
        const document = this.documentEditor.getDocument();
        return OptionElementBuilder.Builder(document)
            .value(optionElementName)
            .innerHTML(optionElementName)
            .className(optionElementClass)
            .build();
    }
}
export class QuizScoreboardTableEditor {
    constructor(document, tableElementId) {
        this.documentEditor = DocumentEditor.fromDocument(document);
        this.tableElement = this.documentEditor.getElement(tableElementId);
        this.numberOfRows = 0;
    }
    addRowWithAnswerTimeAndPenaltyForQuestion(isAnswerCorrect, answerTime, wrongAnswerPenalty) {
        const newRow = this.tableElement.insertRow();
        this.addQuestionNumberCellToTableRow(newRow);
        this.addAnswerCorrectnessCellToTableRow(newRow, isAnswerCorrect);
        this.addTimeWithPenaltyIfWrongCellToTAbleRow(newRow, isAnswerCorrect, answerTime, wrongAnswerPenalty);
    }
    addQuestionNumberCellToTableRow(tableRow) {
        this.numberOfRows++;
        const formattedQuestionNumberCell = `Pytanie ${this.numberOfRows}:`;
        this.addCellToTableRow(tableRow, formattedQuestionNumberCell, QuizEndingProperties.QUIZ_ENDING_STATS_DETAILS_TABLE_LEFT_ELEMENT_CLASS);
    }
    addAnswerCorrectnessCellToTableRow(tableRow, isAnswerCorrect) {
        if (isAnswerCorrect) {
            this.addCorrectAnswerCellToTableRow(tableRow);
        }
        else {
            this.addIncorrectAnswerCellToTableRow(tableRow);
        }
    }
    addCorrectAnswerCellToTableRow(tableRow) {
        this.addCellToTableRow(tableRow, QuizEndingProperties.QUIZ_ENDING_STATS_DETAILS_TABLE_OK_ANSWER, QuizEndingProperties.QUIZ_ENDING_STATS_DETAILS_TABLE_MIDDLE_ELEMENT_OK_CLASS);
    }
    addIncorrectAnswerCellToTableRow(tableRow) {
        this.addCellToTableRow(tableRow, QuizEndingProperties.QUIZ_ENDING_STATS_DETAILS_TABLE_WA_ANSWER, QuizEndingProperties.QUIZ_ENDING_STATS_DETAILS_TABLE_MIDDLE_ELEMENT_WA_CLASS);
    }
    addTimeWithPenaltyIfWrongCellToTAbleRow(tableRow, isAnswerCorrect, answerTime, wrongAnswerPenalty) {
        if (isAnswerCorrect) {
            this.addTimeToTAbleRow(tableRow, answerTime);
        }
        else {
            this.addTimeWithPenaltyCellToTAbleRow(tableRow, answerTime, wrongAnswerPenalty);
        }
    }
    addTimeToTAbleRow(tableRow, answerTime) {
        const formattedTime = Utils.getStringDescriptingTimeInSeconds(answerTime);
        this.addCellToTableRow(tableRow, formattedTime, QuizEndingProperties.QUIZ_ENDING_STATS_DETAILS_TABLE_RIGHT_ELEMENT_CLASS);
    }
    addTimeWithPenaltyCellToTAbleRow(tableRow, answerTime, wrongAnswerPenalty) {
        const formattedTime = Utils.getStringDescriptingTimeInSeconds(answerTime);
        const formattedPenaltyTime = Utils.getStringDescriptingTimeInSeconds(wrongAnswerPenalty);
        const formattedTimeWithPenalty = `${formattedTime} (+ ${formattedPenaltyTime})`;
        this.addCellToTableRow(tableRow, formattedTimeWithPenalty, QuizEndingProperties.QUIZ_ENDING_STATS_DETAILS_TABLE_RIGHT_ELEMENT_CLASS);
    }
    addCellToTableRow(tableRow, innerHTML, cellClass) {
        const newCell = tableRow.insertCell();
        newCell.innerHTML = innerHTML;
        newCell.className = cellClass;
    }
}
export class HTMLElementEditor {
    constructor(document, labelElementId) {
        this.documentEditor = DocumentEditor.fromDocument(document);
        this.htmlElement = this.documentEditor.getElement(labelElementId);
    }
    setInnerHTML(innerHTML) {
        this.htmlElement.innerHTML = innerHTML;
    }
}
export class DocumentEditor {
    constructor(document) {
        this.document = document;
    }
    static fromDocument(document) {
        return new DocumentEditor(document);
    }
    getElement(elementId) {
        const nullableResultElement = this.document.getElementById(elementId);
        return Utils.notNullHTMLElementOrThrowError(nullableResultElement, "invalid element id");
    }
    getDocument() {
        return this.document;
    }
}
let OptionElementBuilder = /** @class */ (() => {
    class OptionElementBuilder {
        constructor(document) {
            this.resultOptionElement = document.createElement(OptionElementBuilder.OPTION_TAG);
        }
        static Builder(document) {
            return new OptionElementBuilder(document);
        }
        value(value) {
            this.resultOptionElement.value = value;
            return this;
        }
        innerHTML(value) {
            this.resultOptionElement.innerHTML = value;
            return this;
        }
        className(value) {
            this.resultOptionElement.className = value;
            return this;
        }
        build() {
            return this.resultOptionElement;
        }
    }
    OptionElementBuilder.OPTION_TAG = "option";
    return OptionElementBuilder;
})();
export { OptionElementBuilder };
