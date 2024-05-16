const generateBiGramArray = (str: string) => {
  if (str.length === 0) {
    return [];
  }
  if (str.length === 1) {
    return [str];
  }
  return [...Array(str.length - 1)].map((_, i) => `${str[i]}${str[i + 1]}`);
};

export const generateBiGramObject = (
  strings: Array<string>,
  rawStrings: Array<string> = []
) => {
  if (strings.length === 0) return {};
  const biGramArray = strings.flatMap(generateBiGramArray);
  const obj: { [index: string]: boolean } = {};
  biGramArray.forEach((s) => (obj[s] = true));
  rawStrings.forEach((s) => {
    if (s.length !== 0) obj[s] = true;
  });
  return obj;
};