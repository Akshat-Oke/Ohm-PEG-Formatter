import { Token } from "./tokenizer";

/*
  Grammar
  Ohm -> Grammar* 
  Grammar -> identifier "{" rule* "}"
  rule -> lhs "=" rhs
  lhs = any+
  any = ~"=" char
  rhs = term ("|" term)*
  term = ~"|" any
       | "(" rhs ")"
*/
export abstract class Ohm {
  abstract accept<T>(visitor: Visitor<T>): T;
}
export interface Visitor<T> {
  // visitOhm(arg0: Ohm): T;
  visitRule(arg0: Rule): T;
  visitComment(arg0: Comment): T;
  visitRhs(arg0: Rhs): T;
  visitRhsTerm(arg0: RhsTerm): T;
  visitChunk(arg0: Chunk): T;
  visitGrammar(arg0: Grammar): T;
}
export class Grammar extends Ohm {
  identifier: Chunk;
  rules: (Rule | Comment)[];
  constructor(identifier: Chunk, rules: (Rule | Comment)[]) {
    super();
    this.identifier = identifier;
    this.rules = rules;
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitGrammar(this);
  }
  toString(): string {
    let str = `Grammar ${this.identifier.toString()} {
      ${this.rules.map((rule) => rule.toString()).join("\n")}
    }`;
    return str;
  }
}
export class Rule extends Ohm {
  lhs: Chunk;
  rhs: Rhs;
  constructor(lhs: Chunk, rhs: Rhs) {
    super();
    this.lhs = lhs;
    this.rhs = rhs;
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitRule(this);
  }
  toString(): string {
    let str = `Rule(${this.lhs.toString()} = ${this.rhs.toString()})`;
    return str;
  }
}
export class Comment extends Ohm {
  value: Token;
  constructor(value: Token) {
    super();
    this.value = value;
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitComment(this);
  }
  toString(): string {
    return `Comment(${this.value.lexeme})`;
  }
}
export class Rhs extends Ohm {
  orExpressions: RhsTerm[];
  constructor(orExpressions: RhsTerm[]) {
    super();
    this.orExpressions = orExpressions;
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitRhs(this);
  }
  toString(): string {
    return `Rhs([
      ${this.orExpressions.map((exp) => exp.toString()).join("\n")}
    ])`;
  }
}
export class Chunk extends Ohm {
  value: Token[];
  constructor(value: Token[]) {
    super();
    this.value = value;
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitChunk(this);
  }
  toString(): string {
    return `Chunk(${this.value.map((exp) => exp.toString()).join("\n")})`;
  }
}
export class RhsTerm extends Ohm {
  value: Chunk;
  caseName?: Token | undefined;
  constructor(value: Chunk, caseName?: Token | undefined) {
    super();
    this.value = value;
    this.caseName = caseName;
  }
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitRhsTerm(this);
  }
  toString(): string {
    return `RhsTerm(${this.value.toString()}, -- ${this.caseName?.lexeme})`;
  }
}
