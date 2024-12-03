import { isFalse, isNull, isNumber, isTrue } from "./helpers";

export type TokenType =
  | "OpenBrace"
  | "CloseBrace"
  | "OpenBracket"
  | "CloseBracket"
  | "String"
  | "Number"
  | "False"
  | "True"
  | "Null"
  | "Colon"
  | "Comma";

export interface Token {
  kind: TokenType;
  value: string;
}

export class Lexer {
  input: string;
  currChar: string;
  currPos: number;
  tokens: Token[];
  constructor(input: string) {
    this.input = input;
    this.currPos = -1;
    this.currChar = "";
    this.tokens = [];
  }

  nextChar() {
    this.currPos++;
    if (this.currPos < this.input.length) {
      this.currChar = this.input[this.currPos];
    } else {
      this.currChar = "";
    }
  }

  getTokens() {
    const tokens: Token[] = [];
    this.nextChar();
    while (this.currPos < this.input.length) {
      if (this.currChar === "{") {
        tokens.push({ kind: "OpenBrace", value: this.currChar });
      } else if (this.currChar === "}") {
        tokens.push({ kind: "CloseBrace", value: this.currChar });
      } else if (this.currChar === "[") {
        tokens.push({ kind: "OpenBracket", value: this.currChar });
      } else if (this.currChar === "]") {
        tokens.push({ kind: "CloseBracket", value: this.currChar });
      } else if (this.currChar === ":") {
        tokens.push({ kind: "Colon", value: this.currChar });
      } else if (this.currChar === ",") {
        tokens.push({ kind: "Comma", value: this.currChar });
      } else if (this.currChar === '"') {
        let strValue = "";
        this.nextChar();
        while (this.currChar !== '"') {
          if (this.currPos >= this.input.length) {
            throw new Error('expected to find "');
          }
          strValue += this.currChar;
          this.nextChar();
        }
        tokens.push({ kind: "String", value: strValue });
      } else if (/[\d\w$@#%&*!]/.test(this.currChar)) {
        let value = "";
        while (/[\d\w$@#%&*!]/.test(this.currChar)) {
          value += this.currChar;
          this.nextChar();
        }

        if (isNumber(value)) {
          tokens.push({ kind: "Number", value: value });
        } else if (isFalse(value)) {
          tokens.push({ kind: "False", value: value });
        } else if (isTrue(value)) {
          tokens.push({ kind: "True", value: value });
        } else if (isNull(value)) {
          tokens.push({ kind: "Null", value: value });
        } else {
          throw new Error(`Unexpected value : ${value}`);
        }
        continue;
      } else if (
        this.currChar === " " ||
        this.currChar === "\t" ||
        this.currChar === "\r" ||
        this.currChar === "\n"
      ) {
        this.nextChar();
        continue;
      } else {
        throw new Error(`unkown character : ${this.currChar}`);
      }
      this.nextChar();
    }
    return tokens;
  }
}
