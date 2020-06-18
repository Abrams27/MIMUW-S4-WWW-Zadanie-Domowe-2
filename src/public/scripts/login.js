import { DocumentEditor } from './main/editors/documentEditors.js';
const documentEditor = DocumentEditor.fromDocument(document);
const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('CSRF-TOKEN'))
    .split('=')[1];
console.log(cookieValue);
const input = documentEditor.getElement('crsf');
input.value = cookieValue;
