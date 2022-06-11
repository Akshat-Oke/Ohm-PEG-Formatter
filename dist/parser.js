import { PEG } from "./PEG_formatter.js";
import { Grammar, Rule, Comment, Chunk, Rhs, RhsTerm } from "./Rule.js";
import { TokenType, TokenType as TT } from "./tokentype.js";
export class Parser {
    constructor(tokens) {
        this.current = 0;
        this.tokens = tokens;
    }
    parse() {
        try {
            return this.ohm();
        }
        catch (e) {
            this.reportError(e);
        }
    }
    ohm() {
        let grammars = [];
        while (!this.isAtEnd()) {
            grammars.push(this.grammar());
        }
        return grammars;
    }
    grammar() {
        let id = this.grammarName();
        this.consume(TT.LEFT_BRACE, "Expected '{' after grammar name");
        let rules = [];
        while (!this.check(TT.RIGHT_BRACE) && !this.isAtEnd()) {
            if (this.check(TT.COMMENT)) {
                rules.push(this.comment());
            }
            else {
                rules.push(this.rule());
            }
        }
        this.consume(TT.RIGHT_BRACE, "Expected '}' after grammar body");
        return new Grammar(id, rules);
    }
    grammarName() {
        let chunk = [];
        let n = this.consume(TT.IDENTIFIER, "Expected grammar name");
        if (!n)
            throw new ParseError(this.peek(), "");
        chunk.push(n);
        while (!this.check(TT.LEFT_BRACE)) {
            chunk.push(this.advance());
        }
        return new Chunk(chunk);
    }
    comment() {
        return new Comment(this.advance());
    }
    rule() {
        let lhs = this.lhs();
        this.consume(TT.EQUAL, "Expected '=' after rule name");
        let rhs = this.rhs();
        return new Rule(lhs, rhs);
    }
    lhs() {
        let chunk = [];
        while (!this.check(TT.EQUAL) && !this.isAtEnd()) {
            chunk.push(this.advance());
        }
        return new Chunk(chunk);
    }
    rhs() {
        let rhsTerms = [];
        //intial term
        rhsTerms.push(this.rhsTerm());
        while (this.match(TT.PIPE) && !this.isAtEnd()) {
            rhsTerms.push(this.rhsTerm());
        }
        return new Rhs(rhsTerms);
    }
    rhsTerm() {
        let term = [];
        let caseName;
        while (!this.check(TT.NEW_LINE, false) &&
            // !this.check(TT.PIPE) &&
            !this.isAtEnd()) {
            if (this.check(TT.CASE_COMM)) {
                this.advance();
                caseName = this.consume(TT.IDENTIFIER, "Expected case comment after '--'", false);
                break;
            }
            else {
                term.push(this.advance());
            }
        }
        return new RhsTerm(new Chunk(term), caseName);
    }
    isAtEnd() {
        return this.peek().type === TokenType.EOF;
    }
    advance() {
        if (!this.isAtEnd()) {
            this.current++;
        }
        return this.previous();
    }
    previous() {
        return this.tokens[this.current - 1];
    }
    match(type) {
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
    check(type, skipNewLines = true) {
        if (this.isAtEnd())
            return false;
        while (skipNewLines && this.peek().type === TT.NEW_LINE)
            this.advance();
        return this.peek().type === type;
    }
    peek() {
        return this.tokens[this.current];
    }
    consume(type, message, skipNewLines = true) {
        while (skipNewLines && this.check(TT.NEW_LINE))
            this.advance();
        if (this.check(type))
            return this.advance();
        throw new ParseError(this.peek(), message);
    }
    reportError(e) {
        let errToken = e.token;
        PEG.error(errToken.line, errToken.col, e.message);
    }
}
class ParseError {
    constructor(token, message) {
        this.token = token;
        this.message = message;
    }
}
