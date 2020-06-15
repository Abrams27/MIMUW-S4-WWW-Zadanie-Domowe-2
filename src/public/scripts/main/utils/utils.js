export class Utils {
    static getStringOrThrowError(value, errorMessage) {
        if (value == null) {
            throw new Error(errorMessage);
        }
        return value;
    }
    static notNullHTMLElementOrThrowError(value, errorMessage) {
        if (value == null) {
            throw new Error(errorMessage);
        }
        return value;
    }
    static getStringDescriptingTimeInSeconds(seconds) {
        if (seconds == 1) {
            return this.getStringDescriptingTimeInSecondsFor1Second();
        }
        else if (seconds > 1 && seconds < 5) {
            return this.getStringDescriptingTimeInSecondsForGreaterThan1AndLessThan5Seconds(seconds);
        }
        else {
            return this.getStringDescriptingTimeInSecondsFor0AndGreaterThan4Seconds(seconds);
        }
    }
    static getStringDescriptingTimeInSecondsFor1Second() {
        return "1 sekunda";
    }
    static getStringDescriptingTimeInSecondsForGreaterThan1AndLessThan5Seconds(seconds) {
        return `${seconds} sekundy`;
    }
    static getStringDescriptingTimeInSecondsFor0AndGreaterThan4Seconds(seconds) {
        return `${seconds} sekund`;
    }
}
