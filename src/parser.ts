import { PEG } from "./PEG_formatter";
import { Grammar, Ohm, Rule, Comment, Chunk, Rhs, RhsTerm } from "./Rule";
import { Token } from "./tokenizer";
import { TokenType, TokenType as TT } from "./tokentype";

export class Parser {
  tokens: Token[];
  current: number = 0;
  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }
  parse(): Grammar[] | undefined {
    try {
      return this.ohm();
    } catch (e: any) {
      this.reportError(e);
    }
  }
  private ohm(): Grammar[] {
    let grammars: Grammar[] = [];
    while (!this.isAtEnd()) {
      grammars.push(this.grammar());
    }
    return grammars;
  }
  private grammar(): Grammar {
    let id = this.grammarName();
    this.consume(TT.LEFT_BRACE, "Expected '{' after grammar name");
    let rules: (Rule | Comment)[] = [];
    while (!this.check(TT.RIGHT_BRACE) && !this.isAtEnd()) {
      if (this.check(TT.COMMENT)) {
        rules.push(this.comment());
      } else {
        rules.push(this.rule());
      }
    }
    this.consume(TT.RIGHT_BRACE, "Expected '}' after grammar body");
    return new Grammar(id, rules);
  }
  private grammarName(): Chunk {
    let chunk: Token[] = [];
    let n = this.consume(TT.IDENTIFIER, "Expected grammar name");
    if (!n) throw new ParseError(this.peek(), "");
    chunk.push(n);
    while (!this.check(TT.LEFT_BRACE)) {
      chunk.push(this.advance());
    }
    return new Chunk(chunk);
  }
  private comment(): Comment {
    return new Comment(this.advance());
  }
  private rule(): Rule {
    let lhs = this.lhs();
    this.consume(TT.EQUAL, "Expected '=' after rule name");
    let rhs = this.rhs();
    return new Rule(lhs, rhs);
  }
  private lhs(): Chunk {
    let chunk: Token[] = [];
    while (!this.check(TT.EQUAL) && !this.isAtEnd()) {
      chunk.push(this.advance());
    }
    return new Chunk(chunk);
  }
  private rhs(): Rhs {
    let rhsTerms: RhsTerm[] = [];
    //intial term
    rhsTerms.push(this.rhsTerm());
    while (this.match(TT.PIPE) && !this.isAtEnd()) {
      rhsTerms.push(this.rhsTerm());
    }
    return new Rhs(rhsTerms);
  }
  private rhsTerm(): RhsTerm {
    let term: Token[] = [];
    let caseName: Token | undefined;
    while (
      !this.check(TT.NEW_LINE, false) &&
      // !this.check(TT.PIPE) &&
      !this.isAtEnd()
    ) {
      if (this.check(TT.CASE_COMM)) {
        this.advance();
        caseName = this.consume(
          TT.IDENTIFIER,
          "Expected case comment after '--'",
          false
        );
        break;
      } else {
        term.push(this.advance());
      }
    }
    return new RhsTerm(new Chunk(term), caseName);
  }
  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }
  private advance(): Token {
    if (!this.isAtEnd()) {
      this.current++;
    }
    return this.previous();
  }
  private previous(): Token {
    return this.tokens[this.current - 1];
  }
  private match(type: TokenType): boolean {
    if (this.check(type)) {
      this.advance();
      return true;
    }
    // types.forEach((type) => {
    //   if (this.check(type)) {
    //     this.advance();
    //     return true;
    //   }
    // });
    return false;
  }
  private check(type: TokenType, skipNewLines = true): boolean {
    if (this.isAtEnd()) return false;
    while (skipNewLines && this.peek().type === TT.NEW_LINE) this.advance();
    return this.peek().type === type;
  }
  private peek(): Token {
    return this.tokens[this.current];
  }
  private consume(
    type: TokenType,
    message: string,
    skipNewLines: boolean = true
  ): Token | undefined {
    while (skipNewLines && this.check(TT.NEW_LINE)) this.advance();
    if (this.check(type)) return this.advance();
    throw new ParseError(this.peek(), message);
  }
  private reportError(e: any) {
    let errToken: Token = e.token;
    PEG.error(errToken.line, errToken.col, e.message);
  }
}
class ParseError {
  token: Token;
  message: string;
  constructor(token: Token, message: string) {
    this.token = token;
    this.message = message;
  }
}
