// parseResumeFromPDF.ts
import { PDFDocument } from 'pdf-lib';
import { parseResume } from './parseResume';

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  // Ensure the PDF is valid by loading with pdf-lib
  await PDFDocument.load(arrayBuffer);
  // Naive text extraction: pull text between parentheses from the raw file
  const raw = new TextDecoder().decode(arrayBuffer);
  const matches = raw.match(/\(([^()]*)\)/g) || [];
  return matches.map((s) => s.slice(1, -1)).join(' ');
}

export async function parseResumeFromPDF(file: File): Promise<{ years: number; level: string }> {
  const text = await extractTextFromPDF(file);
  return parseResume(text);
}