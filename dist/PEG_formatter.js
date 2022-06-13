import { Parser } from "./parser.js";
import { Tokenizer } from "./tokenizer.js";
export class PEG {
    constructor(source) {
        this.tokenizer = new Tokenizer(source);
    }
    parse() {
        this.hadError = false;
        let tokens = this.tokenizer.scanTokens();
        let parser = new Parser(tokens);
        return parser.parse();
    }
    getTokens() {
        return this.tokenizer.tokens;
    }
    static error(line, col, message) {
        this.reportError(line, col, message);
    }
    static reportError(line, col, message) {
        this.hadError = true;
        console.log(`[line ${line} col${col}] Error: ${message}`);
        document.getElementById("result").innerText += `[Error at line ${line}, pos ${col}] ${message}\n`;
        // this.errors.push(`[Error at line ${line}, pos ${col}] ${message}`)
    }
    static parseError(message) {
        console.log(message);
    }
}
PEG.hadError = false;
