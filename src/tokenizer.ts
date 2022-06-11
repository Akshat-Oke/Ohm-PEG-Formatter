import { PEG } from "./PEG_formatter";
import { TokenType, TokenType as TT } from "./tokentype";

export class Tokenizer {
  private source: string;
  private start = 0;
  private current = 0;
  private line = 0;
  tokens: Token[];
  constructor(source: string) {
    this.source = source;
    this.tokens = [];
  }
  scanTokens(): Token[] {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }
    this.tokens.push(new Token(TT.EOF, "\0", this.line, this.current));
    return this.tokens;
  }
  private scanToken(): void {
    let c: string = this.advance();
    switch (c) {
      case "(":
        this.addToken(TT.LEFT_PAREN);
        break;
      case ")":
        this.addToken(TT.RIGHT_PAREN);
        break;
      case "{":
        this.addToken(TT.LEFT_BRACE);
        break;
      case "}":
        this.addToken(TT.RIGHT_BRACE);
        break;
      case "*":
        this.addToken(TT.STAR);
        break;
      case "~":
        this.addToken(TT.NEGATE);
        break;
      case "=":
        this.addToken(TT.EQUAL);
        break;
      case "+":
        if (this.match("=")) this.addToken(TT.ADD_SHORT);
        this.addToken(TT.PLUS);
        break;
      case "<":
        this.addToken(TT.GEN_OPEN);
        break;
      case ">":
        this.addToken(TT.GEN_CLOSE);
        break;
      case "|":
        this.addToken(TT.PIPE);
        break;
      case "#":
        this.addToken(TT.HASH);
        break;
      case "&":
        this.addToken(TT.AMPERSAND);
        break;
      case "?":
        this.addToken(TT.QUES);
        break;
      case "-":
        if (this.match("-")) this.addToken(TT.CASE_COMM);
        else PEG.error(this.line, this.start, "Unexpected character '-'");
        break;
      case ".":
        if (this.match(".")) this.addToken(TT.RANGE);
        else PEG.error(this.line, this.start, "Unexpected character '.'");
        break;
      case "/":
        if (this.match("/")) {
          this.singleLineComment();
        } else if (this.match("*")) {
          this.multilineComment();
        } else {
          PEG.error(this.line, this.start, "Unexpected character '/'");
        }
        break;
      case "\n":
        this.line++;
        this.addToken(TT.NEW_LINE);
      case " ":
      case "\r":
      case "\t":
        break;
      case '"':
        console.log("Found string start");
        this.string();
        break;
      default:
        if (this.isAlpha(c)) {
          this.identifier();
        } else PEG.error(this.line, this.start, `Unexpected character '${c}'`);
    }
  }
  private identifier(): void {
    while (/[a-z0-9_]/i.test(this.peek())) this.advance();
    this.addToken(TT.IDENTIFIER);
  }
  private isAlpha(c: string): boolean {
    return /[a-z_]/i.test(c);
  }
  private string(): void {
    let terminated = false;
    console.log("Looking at ", this.peek());
    while (this.peek() != "\n" && !this.isAtEnd() && !terminated) {
      console.log("Looking at ", this.peek());
      if (this.peek() == '"') {
        console.log("Got here");
        if (this.previous() == "\\" && this.source[this.current - 2] != "\\") {
          this.advance();
        } else {
          console.log("And here");
          terminated = true;
          //consume the "
          this.advance();
          break;
        }
      } else {
        this.advance();
      }
    }
    if (!terminated || this.isAtEnd()) {
      PEG.error(this.line, this.current, "Unterminated string");
    }
    this.addToken(TT.STRING);
  }
  private multilineComment(): void {
    // "/*" has already been consumed
    // The comment goes till */
    const proceed = () => {
      if (this.peek() == "\n") this.line++;
      //safe to proceed
      this.advance();
    };
    let startLine = this.line;
    while (!this.isAtEnd()) {
      if (this.match("*")) {
        //check if "/" is next
        if (this.match("/")) {
          this.addToken(TT.COMMENT, this.line - startLine);
          break;
        } else {
          proceed();
        }
      } else {
        proceed();
      }
    }
    if (this.isAtEnd()) {
      PEG.error(this.line, this.current, "Unterminated comment");
    }
  }
  private singleLineComment(): void {
    // "//" has been consumed already
    // The comment is till the end of the line
    while (this.peek() != "\n" && !this.isAtEnd()) {
      this.advance();
    }
    this.addToken(TT.COMMENT);
  }
  private addToken(type: TokenType, lineSpan?: number): void {
    this.tokens.push(
      new Token(
        type,
        this.source.substring(this.start, this.current),
        this.line,
        this.start,
        lineSpan
      )
    );
  }
  private advance(): string {
    return this.source[this.current++];
  }
  private match(c: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.peek() == c) {
      this.advance();
      return true;
    }
    return false;
  }
  private previous(): string {
    return this.source[this.current - 1];
  }
  private peek(): string {
    if (this.isAtEnd()) return "\0";
    return this.source[this.current];
  }
  private isAtEnd() {
    return this.current >= this.source.length;
  }
}
export class Token {
  type: TokenType;
  lexeme: string;
  /**Line of this token */
  line: number;
  col: number;
  /**Number of lines spanned by a multiline comment */
  lineSpan?: number;

  constructor(
    type: TokenType,
    lexeme: string,
    line: number,
    col: number,
    lineSpan?: number
  ) {
    this.type = type;
    this.lexeme = lexeme;
    this.line = line;
    this.col = col;
    this.lineSpan = lineSpan ?? 0;
  }
  toString(): string {
    return `${this.type}: ${this.lexeme}`;
  }
}
