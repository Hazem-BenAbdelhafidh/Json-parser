import { Lexer, Token } from "./lexer";

interface Test {
  name: string;
  input: string;
  want: Token[];
  err: Error | null;
}

describe("constructor and nextChar test: ", () => {
  it("should increment curr pos and give correct value for curr char : ", () => {
    const lexer = new Lexer(`{"key":"value"}`);
    expect(lexer.currPos).toEqual(-1);
    expect(lexer.currChar).toEqual("");
    expect(lexer.tokens).toEqual([]);
    lexer.nextChar();
    expect(lexer.currPos).toEqual(0);
    expect(lexer.currChar).toEqual("{");
  });
});

describe("Get Tokens Test :", () => {
  const tests: Test[] = [
    {
      name: "test string value",
      input: `{"key" : "value"}`,
      want: [
        { kind: "OpenBrace", value: "{" },
        { kind: "String", value: "key" },
        { kind: "Colon", value: ":" },
        { kind: "String", value: "value" },
        { kind: "CloseBrace", value: "}" },
      ],
      err: null,
    },
    {
      name: "test number value",
      input: `{"key" : 123}`,
      want: [
        { kind: "OpenBrace", value: "{" },
        { kind: "String", value: "key" },
        { kind: "Colon", value: ":" },
        { kind: "Number", value: "123" },
        { kind: "CloseBrace", value: "}" },
      ],
      err: null,
    },
    {
      name: "test two keys and two values",
      input: `{"key1" : "value1",

        "key2" : "value2"
      }`,
      want: [
        { kind: "OpenBrace", value: "{" },
        { kind: "String", value: "key1" },
        { kind: "Colon", value: ":" },
        { kind: "String", value: "value1" },
        { kind: "Comma", value: "," },
        { kind: "String", value: "key2" },
        { kind: "Colon", value: ":" },
        { kind: "String", value: "value2" },
        { kind: "CloseBrace", value: "}" },
      ],
      err: null,
    },
    {
      name: "test two keys and two values",
      input: `{"key" : [1,2]}`,
      want: [
        { kind: "OpenBrace", value: "{" },
        { kind: "String", value: "key" },
        { kind: "Colon", value: ":" },
        { kind: "OpenBracket", value: "[" },
        { kind: "Number", value: "1" },
        { kind: "Comma", value: "," },
        { kind: "Number", value: "2" },
        { kind: "CloseBracket", value: "]" },
        { kind: "CloseBrace", value: "}" },
      ],
      err: null,
    },
    {
      name: "test null value",
      input: `{"key" : null}`,
      want: [
        { kind: "OpenBrace", value: "{" },
        { kind: "String", value: "key" },
        { kind: "Colon", value: ":" },
        { kind: "Null", value: "null" },
        { kind: "CloseBrace", value: "}" },
      ],
      err: null,
    },
    {
      name: "test true value",
      input: `{"key" : true}`,
      want: [
        { kind: "OpenBrace", value: "{" },
        { kind: "String", value: "key" },
        { kind: "Colon", value: ":" },
        { kind: "True", value: "true" },
        { kind: "CloseBrace", value: "}" },
      ],
      err: null,
    },
    {
      name: "test false value",
      input: `{"key" : false}`,
      want: [
        { kind: "OpenBrace", value: "{" },
        { kind: "String", value: "key" },
        { kind: "Colon", value: ":" },
        { kind: "False", value: "false" },
        { kind: "CloseBrace", value: "}" },
      ],
      err: null,
    },
    {
      name: "test unvalid string",
      input: `{"key : false}`,
      want: [],
      err: new Error('expected to find "'),
    },
    {
      name: "test unkown value 1",
      input: `{"key" : $slmdkq}`,
      want: [],
      err: new Error("Unexpected value : $slmdkq"),
    },
    {
      name: "test unexpected value 2",
      input: `{"key" : 15$q}`,
      want: [],
      err: new Error("Unexpected value : 15$q"),
    },
  ];
  for (const test of tests) {
    it(test.name, () => {
      const lexer = new Lexer(test.input);
      if (test.err) {
        expect(() => {
          lexer.getTokens();
        }).toThrow(test.err);
      } else {
        expect(lexer.getTokens()).toEqual(test.want);
      }
    });
  }
});
