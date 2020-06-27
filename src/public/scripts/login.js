import { DocumentEditor } from './main/editors/documentEditors.js';
import { Properties } from './main/properties/Properties.js';
const documentEditor = DocumentEditor.fromDocument(document);
const crsfInput = documentEditor.getElement(Properties.CRSF_INPUT_ID);
const crsfCookie = documentEditor.getCookie(Properties.CRSF_COOKIE_NAME);
crsfInput.value = crsfCookie;
