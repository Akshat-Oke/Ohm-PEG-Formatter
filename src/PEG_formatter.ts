import { Parser } from "./parser";
import { Grammar } from "./Rule";
import { Token, Tokenizer } from "./tokenizer";

export class PEG {
  tokenizer: Tokenizer;
  static hadError = false;
  constructor(source: string) {
    this.tokenizer = new Tokenizer(source);
  }
  parse(): Grammar[] | undefined {
    let tokens = this.tokenizer.scanTokens();
    let parser = new Parser(tokens);
    return parser.parse();
  }
  getTokens(): Token[] {
    return this.tokenizer.tokens;
  }
  static error(line: number, col: number, message: string): void {
    this.hadError = true;
    this.reportError(line, col, message);
  }
  private static reportError(line: number, col: number, message: string): void {
    console.log(`[line ${line} col${col}] Error: ${message}`);
  }
  static parseError(message: string): void {
    console.log(message);
  }
}
