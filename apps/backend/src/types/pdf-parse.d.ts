declare module 'pdf-parse' {
  interface PdfParseResult {
    numpages: number;
    text: string;
    info: Record<string, unknown>;
    metadata: Record<string, unknown>;
  }

  function pdfParse(
    dataBuffer: Buffer,
    options?: Record<string, unknown>,
  ): Promise<PdfParseResult>;

  export default pdfParse;
}
