export type ASTNode =
  | { type: "Object"; value: { [key: string]: ASTNode } }
  | {
      type: "Array";
      value: ASTNode[];
    }
  | {
      type: "String";
      value: string;
    }
  | {
      type: "Number";
      value: number;
    }
  | {
      type: "Boolean";
      value: boolean;
    }
  | { type: "Null" };

export interface Test {
  name: string;
  input: string;
  want: ASTNode;
  err: Error | null;
}
