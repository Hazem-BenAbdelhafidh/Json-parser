export const isNumber = (str: string) => {
  return !isNaN(Number(str));
};

export const isFalse = (str: string) => {
  return str === "false";
};

export const isTrue = (str: string) => {
  return str === "true";
};

export const isNull = (str: string) => {
  return str === "null";
};
