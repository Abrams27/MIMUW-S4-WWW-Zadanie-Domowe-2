import { DocumentEditor } from './main/editors/documentEditors.js';
import { Properties } from './main/properties/Properties.js';
import { PasswordChangeProperties } from './main/properties/passwordChangeProperties';
const documentEditor = DocumentEditor.fromDocument(document);
const crsfInput = documentEditor.getElement(Properties.CRSF_INPUT_ID);
const crsfCookie = documentEditor.getCookie(Properties.CRSF_COOKIE_NAME);
crsfInput.value = crsfCookie;
const quizLogoutButton = documentEditor.getElement(PasswordChangeProperties.PASSWORD_CHANGE_LOGOUT_BUTTON_ID);
quizLogoutButton.addEventListener(Properties.CLICK_EVENT_TYPE, quizLogoutButtonClickListener);
function quizLogoutButtonClickListener() {
    location.href = Properties.QUIZ_LOGOUT_HTML_FILE;
}
