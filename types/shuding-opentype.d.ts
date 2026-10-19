declare module "@shuding/opentype.js" {
  interface Font {
    getAdvanceWidth(text: string, fontSize: number): number;
  }
  interface OpenType {
    parse(buffer: ArrayBuffer): Font;
  }
  const opentype: OpenType;
  export default opentype;
}
