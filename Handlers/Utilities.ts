export default class Utilities {
    static splitByWords(text: string, maxWords = 1500) {
        const words = text.split(/\s+/);
        const chunks = [];
        for (let i = 0; i < words.length; i += maxWords) {
            chunks.push(words.slice(i, i + maxWords).join(" "));
        }
        return chunks;
    }
}