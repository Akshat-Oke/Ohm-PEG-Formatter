# Formatter for the Ohm PEG

---

[Ohm](https://ohmjs.org) is a parsing toolkit to parse custom file formats and quickly build parsers or interpreters for programming languages. Quoting from their website:

> The Ohm language is based on parsing expression grammars (PEGs), which are a formal way of describing syntax, similar to regular expressions and context-free grammars. The Ohm library provides a JavaScript interface for creating parsers, interpreters, and more from the grammars you write.

My [p8086 compiler](https://github.com/Akshat-Oke/p8086/) uses OhmJS to parse and generate 8086 code.

Here I pretty-print this Ohm Language using a simple and dumb walk over the AST.

And no, I have not used OhmJS to generate the parser haha.

The AST in question uses this grammar:

```
Ohm -> Grammar*
Grammar -> name "{" (rule | comment)* "}"
comment -> singleLine | multiLine
singleLine -> "//" (~"\n" char)+
multiLine -> "/*" char* "*/"
rule -> lhs "=" rhs
lhs -> any+
any ->(~"=") char
rhs -> rhsTerm ("|" rhsTerm)*
rhsTerm -> Chunk caseName?
caseName -> "--" Chunk
Chunk -> char+
```

Very simple. _Too simple_, in fact.

It does not have support for the `#`, `~` or `&` operators, nor parenthesized expressions. It treats every rule as a chunk of characters separated by a pipe `|`.

The end result of formatting is to align the "or cases" vertically with each other and the rule's "=" symbol. So, for example

```
expr = literal "+" expr | literal "-" expr | "(" expr ")" | literal
```

will give

```
expr = literal "+" expr --add
      | literal "-" expr --sub
      | "(" expr ")" --paren
      | literal --terminal
```

Also if you look closely, yes, I put comments in the grammar itself. Obviously we cannot treat comments as whitespace and ignore them (imagine your beautiful PEG with comments explaining every rule and you hit "Format Document": _poof_! All comments gone). So each comment is in the list of tokens generated by the tokenizer. Also, a `Chunk` can contain an "inline" comment `/_ like this _/. I'll look if there's a different way to handle this though.

---

There's lot of ugly code and hacky workarounds to get this working, but I guess it's okay for a start.

For the next formatter I can definitely do better than this:

```js
for (let i = 1; i < terms.length; i++) {
  str +=
    (i > 1 ? this.fill(exisitingIndent) : "") +
    "| " +
    this.get(terms[i], 0) +
    "\n";
}
```
