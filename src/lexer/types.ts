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

export interface Test {
  name: string;
  input: string;
  want: Token[];
  err: Error | null;
}
