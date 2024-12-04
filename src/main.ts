import { Lexer } from "./lexer/lexer";
import { Parser } from "./parser/parser";

const lexer = new Lexer(`{"key": "value"}`);
const tokens = lexer.getTokens();
const parser = new Parser(tokens);
const json = parser.parse();

console.log("Parsed Json : ", json);
