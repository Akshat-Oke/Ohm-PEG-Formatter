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
export class Ohm {
}
export class Grammar extends Ohm {
    constructor(identifier, rules) {
        super();
        this.identifier = identifier;
        this.rules = rules;
    }
    accept(visitor) {
        return visitor.visitGrammar(this);
    }
    toString() {
        let str = `Grammar ${this.identifier.toString()} {
      ${this.rules.map((rule) => rule.toString()).join("\n")}
    }`;
        return str;
    }
}
export class Rule extends Ohm {
    constructor(lhs, rhs) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
    accept(visitor) {
        return visitor.visitRule(this);
    }
    toString() {
        let str = `Rule(${this.lhs.toString()} = ${this.rhs.toString()})`;
        return str;
    }
}
export class Comment extends Ohm {
    constructor(value) {
        super();
        this.value = value;
    }
    accept(visitor) {
        return visitor.visitComment(this);
    }
    toString() {
        return `Comment(${this.value.lexeme})`;
    }
}
export class Rhs extends Ohm {
    constructor(orExpressions) {
        super();
        this.orExpressions = orExpressions;
    }
    accept(visitor) {
        return visitor.visitRhs(this);
    }
    toString() {
        return `Rhs([
      ${this.orExpressions.map((exp) => exp.toString()).join("\n")}
    ])`;
    }
}
export class Chunk extends Ohm {
    constructor(value) {
        super();
        this.value = value;
    }
    accept(visitor) {
        return visitor.visitChunk(this);
    }
    toString() {
        return `Chunk(${this.value.map((exp) => exp.toString()).join("\n")})`;
    }
}
export class RhsTerm extends Ohm {
    constructor(value, caseName) {
        super();
        this.value = value;
        this.caseName = caseName;
    }
    accept(visitor) {
        return visitor.visitRhsTerm(this);
    }
    toString() {
        var _a;
        return `RhsTerm(${this.value.toString()}, -- ${(_a = this.caseName) === null || _a === void 0 ? void 0 : _a.lexeme})`;
    }
}
