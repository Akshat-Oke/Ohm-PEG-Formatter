import {
  Chunk,
  Comment,
  Grammar,
  Ohm,
  Rhs,
  RhsTerm,
  Rule,
  Visitor,
} from "./Rule";

export class PrettyPrinter implements Visitor<string> {
  grammars: Grammar[];
  output: string[] = [];
  indent: number = 0;
  constructor(grammars: Grammar[]) {
    this.grammars = grammars;
  }
  private get(element: Ohm, currentIndent: number): string {
    this.indent = currentIndent;
    return this.fill(currentIndent) + element.accept(this);
  }
  getFormatterString(): string {
    let str = "";
    this.grammars.forEach((grammar) => (str += this.get(grammar, 0)));
    return str;
  }

  visitGrammar(grammar: Grammar): string {
    this.indent++;
    let str = `${this.get(grammar.identifier, 0)} {\n`;
    grammar.rules.forEach((rule) => {
      str += this.get(rule, 2) + "\n";
    });
    return str + "}\n";
  }
  visitRule(rule: Rule): string {
    const lhs = this.get(rule.lhs, 0);
    const rhs = rule.rhs;
    const terms = rhs.orExpressions;
    const exisitingIndent = lhs.length + 2;
    let str = lhs;
    let offset = 1;
    if (str.length > 24) {
      str += "\n" + this.fill(str.length - 3);
      offset = -4;
    }
    str += " = " + terms[0].accept(this);
    if (terms.length > 1)
      str += "\n" + this.get(rule.rhs, exisitingIndent + offset); //+1 for space before "="
    return str;
  }
  /**
   * Or expressions
   * | asdasd
   * | asda as
   * | go oeri rr
   */
  visitRhs(rhs: Rhs): string {
    const terms = rhs.orExpressions;
    let str = "";
    const exisitingIndent = this.indent;
    for (let i = 1; i < terms.length; i++) {
      str +=
        (i > 1 ? this.fill(exisitingIndent) : "") +
        "| " +
        this.get(terms[i], 0) +
        "\n";
    }
    return str;
  }
  visitComment(c: Comment): string {
    return c.value.lexeme;
  }
  visitRhsTerm(term: RhsTerm): string {
    let str = this.get(term.value, 0);
    if (term.caseName) {
      str += " --" + term.caseName.lexeme;
    }
    return str;
  }
  visitChunk(chunk: Chunk): string {
    let str = "";
    chunk.value.forEach((token) => (str += token.lexeme + " "));
    return str.substring(0, str.length - 1);
  }
  private fill(indent: number): string {
    let str = "";
    while (indent-- > 0) {
      str += " ";
    }
    return str;
  }
}
