import pdfParse from 'pdf-parse';

async function extractTextFromPDF(url) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const data = await pdfParse(Buffer.from(buffer));
  return data.text;
}

async function extractKeyInfo(text) {
  const info = {};
  const titleMatch = text.match(/(?:project|title|brief)[:]\s*([^\n]+)/i) ||
    text.match(/^([^\n]{10,100})/);
  if (titleMatch) info.projectTitle = titleMatch[1].trim();

  const budgetMatch = text.match(/(?:budget|cost|estimate)[:]\s*\$?\s*(\d+[,\d]*(\.\d{2})?)/i) ||
    text.match(/\$\s*(\d+[,\d]*(\.\d{2})?)/);
  if (budgetMatch) info.budget = budgetMatch[1].replace(/,/g, '');

  const datePatterns = [
    /(?:deadline|completion|due|target)[\s:]*([\d]{1,2}[-/][\d]{1,2}[-/][\d]{2,4})/i,
    /(?:deadline|completion|due|target)[\s:]*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s.]+\d{1,2}(?:st|nd|rd|th)?[\s,]*\d{4})/i
  ];
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      const date = new Date(match[1]);
      if (!isNaN(date.getTime())) {
        info.desiredDate = date.toISOString().split('T')[0];
        break;
      }
    }
  }

  const descriptionPatterns = [
    /(?:description|overview|summary|scope)[:]\s*([^\n]+(?:\n(?!\n)[^\n]+)*)/i,
    /(?:project details|requirements)[:]\s*([^\n]+(?:\n(?!\n)[^\n]+)*)/i
  ];
  for (const pattern of descriptionPatterns) {
    const match = text.match(pattern);
    if (match) {
      info.description = match[1].trim();
      break;
    }
  }

  const expertisePatterns = {
    entry: /\b(?:junior|entry[\s-]level|beginner)\b/i,
    expert: /\b(?:senior|expert|advanced|specialist)\b/i,
    mid: /\b(?:mid[\s-]level|intermediate|regular)\b/i
  };
  for (const [level, pattern] of Object.entries(expertisePatterns)) {
    if (pattern.test(text)) {
      info.expertiseLevel = level;
      break;
    }
  }

  const channels = {
    seo: /\b(?:seo|search engine optimization)\b/i,
    sem: /\b(?:sem|paid search|google ads|ppc)\b/i,
    social: /\b(?:social media|facebook|instagram|linkedin|twitter)\b/i,
    content: /\b(?:content|blog|article|copywriting)\b/i
  };
  info.channels = {};
  for (const [channel, pattern] of Object.entries(channels)) {
    info.channels[channel] = pattern.test(text);
  }
  return info;
}

async function run() {
  const fileUrl = process.argv[2];
  if (!fileUrl) {
    console.error('File URL is required');
    process.exit(1);
  }
  try {
    const text = await extractTextFromPDF(fileUrl);
    const info = await extractKeyInfo(text);
    console.log(JSON.stringify({ success: true, data: info }, null, 2));
  } catch (error) {
    console.error(JSON.stringify({ success: false, error: error.message }));
    process.exit(1);
  }
}

run();
