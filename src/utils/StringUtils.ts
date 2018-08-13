export class StringUtils {
    static endsWith(str: string, searchString: string) {
        return str.substring(str.length - searchString.length, str.length) === searchString;
    }
}