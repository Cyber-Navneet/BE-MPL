// Client-side resume validation and text extraction. Files never leave the browser.
// PDF and DOCX parsers are loaded on demand so they don't weigh down the rest of the app.

export const MAX_RESUME_BYTES = 10 * 1024 * 1024
export const ACCEPTED_EXTENSIONS = '.pdf,.docx,.txt'

const FORMATS = {
  pdf: ['application/pdf'],
  docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  txt: ['text/plain'],
}

// Some browsers/OSes report an empty or generic MIME type; the extension decides in that case.
const GENERIC_MIME_TYPES = ['', 'application/octet-stream']

// Minimum characters of text before we consider a document readable.
const MIN_TEXT_LENGTH = 50

export class ResumeParseError extends Error {}

export function getResumeFormat(file) {
  const extension = file.name.split('.').pop()?.toLowerCase()
  return FORMATS[extension] ? extension : null
}

// Returns an error message, or '' when the file is acceptable.
export function validateResumeFile(file) {
  const format = getResumeFormat(file)
  if (!format) return 'Unsupported file type. Please upload a PDF, DOCX or TXT file.'
  if (!GENERIC_MIME_TYPES.includes(file.type) && !FORMATS[format].includes(file.type)) {
    return `This file does not look like a valid ${format.toUpperCase()} document.`
  }
  if (file.size === 0) return 'This file is empty.'
  if (file.size > MAX_RESUME_BYTES) return 'File is larger than 10MB. Please upload a smaller file.'
  return ''
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

async function extractPdfText(file) {
  const [pdfjs, { default: workerUrl }] = await Promise.all([
    import('pdfjs-dist'),
    import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
  ])
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl

  let pdf
  try {
    pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise
  } catch (error) {
    if (error?.name === 'PasswordException') {
      throw new ResumeParseError('This PDF is password-protected. Please upload an unlocked copy.')
    }
    throw new ResumeParseError('Could not read this PDF. The file may be damaged.')
  }

  const pages = []
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const content = await page.getTextContent()
    pages.push(content.items.map((item) => `${item.str}${item.hasEOL ? '\n' : ' '}`).join(''))
  }
  await pdf.destroy()
  return pages.join('\n')
}

async function extractDocxText(file) {
  const module = await import('mammoth/mammoth.browser.js')
  const mammoth = module.default ?? module
  try {
    const { value } = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })
    return value
  } catch {
    throw new ResumeParseError('Could not read this DOCX file. The file may be damaged.')
  }
}

const EXTRACTORS = {
  pdf: extractPdfText,
  docx: extractDocxText,
  txt: (file) => file.text(),
}

export async function extractResumeText(file) {
  const format = getResumeFormat(file)
  const text = (await EXTRACTORS[format](file)).replace(/\r\n?/g, '\n').trim()

  if (text.length < MIN_TEXT_LENGTH) {
    throw new ResumeParseError(
      format === 'pdf'
        ? 'No readable text found in this PDF. It may be a scanned image; please upload a text-based PDF (OCR is not supported).'
        : 'This resume has too little readable text to analyse.',
    )
  }
  return text
}
