import { Token, TokenType } from "../lexer/types";
import { ASTNode } from "./types";

export class Parser {
  currToken: Token | null;
  currPos: number;
  tokens: Token[];

  constructor(tokens: Token[]) {
    this.currToken = null;
    this.currPos = -1;
    this.tokens = tokens;
  }

  nextToken() {
    this.currPos++;
    if (this.currPos < this.tokens.length) {
      this.currToken = this.tokens[this.currPos];
    } else {
      this.currToken = null;
    }
  }

  parse() {
    if (!this.tokens.length) {
      throw new Error("Nothing to parse. Please provide a json");
    }
    this.nextToken();
    const Json = this.parseValue();

    return Json;
  }

  parseValue(): ASTNode {
    switch (this.currToken?.kind) {
      case "String":
        return { type: "String", value: this.currToken.value };
      case "Number":
        return { type: "Number", value: Number(this.currToken.value) };
      case "True":
        return { type: "Boolean", value: true };
      case "False":
        return { type: "Boolean", value: false };
      case "Null":
        return { type: "Null" };
      case "OpenBrace":
        return this.parseObject();
      case "OpenBracket":
        return this.parseArray();
      default:
        throw new Error(`Unexpected token type : ${this.currToken?.kind}`);
    }
  }

  parseObject(): ASTNode {
    const node: ASTNode = { type: "Object", value: {} };
    this.nextToken();

    while (this.currToken?.kind !== "CloseBrace") {
      if (this.currToken?.kind === "String") {
        const key = this.currToken.value;
        this.nextToken();
        if ((this.currToken.kind as TokenType) !== "Colon") {
          throw new Error("Expected : in key value pair");
        }
        this.nextToken();
        const value = this.parseValue();
        node.value[key] = value;
      } else {
        throw new Error(
          `Expected String key in object. Token type : ${this.currToken?.kind}`
        );
      }
      this.nextToken();
      if ((this.currToken?.kind as TokenType) === "Comma") {
        this.nextToken();
      }
    }

    return node;
  }

  parseArray(): ASTNode {
    const node: ASTNode = { type: "Array", value: [] };
    this.nextToken();

    while (this.currToken?.kind !== "CloseBracket") {
      const value = this.parseValue();
      node.value.push(value);
      this.nextToken();
      if (this.currToken?.kind === "Comma") {
        this.nextToken();
      }
    }
    return node;
  }
}
