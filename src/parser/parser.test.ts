import { Lexer } from "../lexer/lexer";
import { Parser } from "./parser";
import { ASTNode, Test } from "./types";

describe("Parser constructor and next token test : ", () => {
  it("should increment currPos and currToken", () => {
    const lexer = new Lexer(`{"key": "value"}`);
    const tokens = lexer.getTokens();
    const parser = new Parser(tokens);
    expect(parser.currPos).toEqual(-1);
    expect(parser.currToken).toEqual(null);
    parser.nextToken();
    expect(parser.currPos).toEqual(0);
    expect(parser.currToken).toEqual(tokens[0]);
  });
});

describe("Parsing logic:  ", () => {
  const tests: Test[] = [
    {
      name: "simple json",
      input: `{"key": "value"}`,
      want: {
        type: "Object",
        value: {
          key: {
            type: "String",
            value: "value",
          },
        },
      },
      err: null,
    },
    {
      name: "simple json with number value",
      input: `{"key": 123}`,
      want: {
        type: "Object",
        value: {
          key: {
            type: "Number",
            value: 123,
          },
        },
      },
      err: null,
    },
    {
      name: "simple json with null value",
      input: `{"key": null}`,
      want: {
        type: "Object",
        value: {
          key: {
            type: "Null",
          },
        },
      },
      err: null,
    },
    {
      name: "simple json with boolean value",
      input: `{"key1": true,
               "key2" : false 
      }`,
      want: {
        type: "Object",
        value: {
          key1: {
            type: "Boolean",
            value: true,
          },
          key2: {
            type: "Boolean",
            value: false,
          },
        },
      },
      err: null,
    },
    {
      name: "simple json with array",
      input: `{"key": [1,2,3]}`,
      want: {
        type: "Object",
        value: {
          key: {
            type: "Array",
            value: [
              { type: "Number", value: 1 },
              { type: "Number", value: 2 },
              { type: "Number", value: 3 },
            ],
          },
        },
      },
      err: null,
    },
    {
      name: "simple json with object",
      input: `{"key": {
        "keyIn": "valueIn"
      }}`,
      want: {
        type: "Object",
        value: {
          key: {
            type: "Object",
            value: {
              keyIn: {
                type: "String",
                value: "valueIn",
              },
            },
          },
        },
      },
      err: null,
    },
    {
      name: "empty input",
      input: ``,
      want: {} as ASTNode,
      err: new Error("Nothing to parse. Please provide a json"),
    },
    {
      name: "unvalid key",
      input: `{[123]: "value"}`,
      want: {} as ASTNode,
      err: new Error(`Expected String key in object. Token type : OpenBracket`),
    },
    {
      name: "key without value",
      input: `{"hazem",}`,
      want: {} as ASTNode,
      err: new Error("Expected : in key value pair"),
    },
    {
      name: "json with multiple key-values",
      input: `{"key": {
        "keyIn": "valueIn"
      }, 
      "key2" : "value2",
      "key3": [1,5,3],
      "key4": 1234,
      "key5" : true,
      "key6" : 1.25
      }`,
      want: {
        type: "Object",
        value: {
          key: {
            type: "Object",
            value: {
              keyIn: {
                type: "String",
                value: "valueIn",
              },
            },
          },
          key2: {
            type: "String",
            value: "value2",
          },
          key3: {
            type: "Array",
            value: [
              { type: "Number", value: 1 },
              { type: "Number", value: 5 },
              { type: "Number", value: 3 },
            ],
          },
          key4: {
            type: "Number",
            value: 1234,
          },
          key5: {
            type: "Boolean",
            value: true,
          },
          key6: {
            type: "Number",
            value: 1.25,
          },
        },
      },
      err: null,
    },
  ];

  for (const test of tests) {
    it(test.name, () => {
      const lexer = new Lexer(test.input);
      const tokens = lexer.getTokens();
      const parser = new Parser(tokens);
      if (test.err) {
        expect(() => parser.parse()).toThrow(test.err);
      } else {
        expect(parser.parse()).toEqual(test.want);
      }
    });
  }
});
