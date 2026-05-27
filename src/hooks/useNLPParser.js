/**
 * useNLPParser — Zero-Friction Indonesian NLP Parser
 * Converts natural language input to structured financial events.
 * No backend required — runs entirely in the browser.
 */

// ─── CATEGORY KEYWORDS ────────────────────────────────────────────────────────
const CATEGORY_MAP = {
  Makan: [
    'makan', 'warteg', 'warung', 'nasi', 'ayam', 'mie', 'bakso', 'soto', 'sate',
    'rendang', 'nasi goreng', 'indomie', 'gorengan', 'jajan', 'mcd', 'kfc', 'burger',
    'pizza', 'gofood', 'grabfood', 'shopeefood', 'geprek', 'pecel', 'gado',
    'pempek', 'siomay', 'bubur', 'lotek', 'seblak', 'cireng', 'batagor',
    'makan siang', 'makan malem', 'makan pagi', 'sarapan', 'lunch', 'dinner',
    'kantin', 'prasmanan', 'lauk', 'seafood', 'ikan', 'cumi', 'udang',
  ],
  Kopi: [
    'kopi', 'coffee', 'americano', 'latte', 'cappuccino', 'espresso', 'matcha',
    'starbucks', 'kenangan', 'janji jiwa', 'fore', 'kulo', 'teh', 'boba',
    'warkop', 'ngopi', 'caffeine', 'minuman', 'jus', 'es', 'thai tea',
    'kopsu', 'kopi susu', 'kopi hitam',
  ],
  Transport: [
    'gojek', 'grab', 'ojol', 'ojek', 'bensin', 'bbm', 'pertalite', 'pertamax',
    'parkir', 'bus', 'kereta', 'transjakarta', 'commuter', 'krl', 'mrt', 'lrt',
    'taxi', 'taksi', 'angkot', 'damri', 'tol', 'uber',
  ],
  Tagihan: [
    'token', 'listrik', 'pulsa', 'internet', 'wifi', 'kos', 'kontrakan', 'sewa',
    'bayar', 'tagihan', 'cicilan', 'angsuran', 'kredit', 'bill',
    'air', 'pdam', 'gas', 'iuran',
  ],
  Hiburan: [
    'spotify', 'netflix', 'youtube premium', 'game', 'bioskop', 'cinema',
    'steam', 'mobile legend', 'ml', 'ff', 'valorant', 'genshin',
    'disney', 'amazon prime', 'vidio', 'viu', 'main', 'jalan',
  ],
  Belanja: [
    'tokopedia', 'shopee', 'lazada', 'alfamart', 'indomaret', 'beli', 'borong',
    'minimarket', 'supermarket', 'giant', 'hypermart', 'mall', 'toko', 'baju',
    'sepatu', 'celana', 'kaos', 'skincare', 'sabun', 'shampoo', 'toiletries',
  ],
  Kesehatan: [
    'obat', 'apotek', 'dokter', 'vitamin', 'masker', 'klinik', 'puskesmas',
    'rs', 'rumah sakit', 'suplemen', 'antigen', 'test', 'lab',
  ],
  Pendidikan: [
    'buku', 'fotocopy', 'print', 'kuliah', 'spp', 'ukt', 'praktikum',
    'alat tulis', 'seminar', 'kursus', 'les', 'tutor', 'workshop',
  ],
};

const INCOME_KEYWORDS = [
  'gaji', 'salary', 'freelance', 'transferan', 'transfer', 'uang saku', 'kiriman',
  'pemasukan', 'income', 'jual', 'dapet', 'dapat', 'diterima', 'masuk', 'bayaran',
  'honor', 'bonus', 'komisi', 'refund', 'balik',
];

// ─── NUMBER NORMALIZER ─────────────────────────────────────────────────────────
const INDONESIAN_NUMBER_WORDS = {
  nol: 0, satu: 1, dua: 2, tiga: 3, empat: 4, lima: 5,
  enam: 6, tujuh: 7, delapan: 8, sembilan: 9, sepuluh: 10,
  sebelas: 11, dua_belas: 12, dua_puluh: 20, tiga_puluh: 30,
  empat_puluh: 40, lima_puluh: 50, seratus: 100, seribu: 1000,
  sejuta: 1_000_000,
};

/**
 * Extracts a numeric amount from Indonesian text.
 * Handles: "35k", "35rb", "35ribu", "1.5jt", "1 juta", "35.000", etc.
 */
export function extractAmount(text) {
  const t = text.toLowerCase().trim();
  
  // Pattern: digits + unit (k/rb/ribu/rbu/jt/juta)
  const unitPattern = /(\d+(?:[.,]\d+)?)\s*(?:(jt|juta|jt\.?))|((\d+(?:[.,]\d+)?)\s*(?:k|rb|rbu|ribu|rebuu?))/gi;
  
  let match;
  while ((match = unitPattern.exec(t)) !== null) {
    if (match[1]) {
      // juta
      const num = parseFloat(match[1].replace(',', '.'));
      return Math.round(num * 1_000_000);
    }
    if (match[4]) {
      // ribu / k
      const num = parseFloat(match[4].replace(',', '.'));
      return Math.round(num * 1_000);
    }
  }

  // Pattern: plain numbers with dots/commas as thousand separators
  // e.g. "35.000" or "1.500.000"
  const plainPattern = /\b(\d{1,3}(?:[.,]\d{3})+)\b/g;
  const plainMatch = plainPattern.exec(t);
  if (plainMatch) {
    return parseInt(plainMatch[1].replace(/[.,]/g, ''), 10);
  }
  
  // Pattern: bare number ≥ 3 digits
  const barePattern = /\b(\d{3,})\b/;
  const bareMatch = t.match(barePattern);
  if (bareMatch) {
    return parseInt(bareMatch[1], 10);
  }
  
  // Pattern: bare number (1-2 digits, likely thousands context)
  const shortPattern = /\b(\d{1,2})\b/;
  const shortMatch = t.match(shortPattern);
  if (shortMatch) {
    const val = parseInt(shortMatch[1], 10);
    // If standalone small number like "kopi 25" → assume thousands
    return val * 1_000;
  }

  return null;
}

/**
 * Classifies text into a spending category.
 */
export function classifyCategory(text) {
  const t = text.toLowerCase();
  
  for (const [category, keywords] of Object.entries(CATEGORY_MAP)) {
    for (const kw of keywords) {
      if (t.includes(kw)) return category;
    }
  }
  return 'Lainnya';
}

/**
 * Detects intent: expense vs income
 */
export function detectIntent(text) {
  const t = text.toLowerCase();
  for (const kw of INCOME_KEYWORDS) {
    if (t.includes(kw)) return 'income';
  }
  return 'expense';
}

/**
 * Tries to extract a merchant name from the text.
 */
export function extractMerchant(text) {
  const t = text.toLowerCase();
  
  const knownMerchants = [
    'warteg', 'warung', 'starbucks', 'kfc', 'mcd', "mcdonald's", 'pizza hut',
    'gofood', 'grabfood', 'shopeefood', 'tokopedia', 'shopee', 'lazada',
    'spotify', 'netflix', 'indomaret', 'alfamart', 'janji jiwa', 'kenangan',
    'kopi kenangan', 'warkop', 'fore coffee', 'kopsu',
  ];
  
  for (const merchant of knownMerchants) {
    if (t.includes(merchant)) {
      return merchant.charAt(0).toUpperCase() + merchant.slice(1);
    }
  }
  return null;
}

/**
 * Computes a confidence score for the parsed result.
 */
function computeConfidence(parsed) {
  let score = 1.0;
  if (!parsed.amount) score -= 0.6;
  if (!parsed.amount || parsed.amount <= 0) score -= 0.3;
  if (parsed.category === 'Lainnya') score -= 0.15;
  if (parsed.rawText.trim().length < 4) score -= 0.3;
  if (parsed.amount > 50_000_000) score -= 0.4; // suspiciously large
  return Math.max(0, Math.min(1, score));
}

/**
 * Main parse function — returns a structured event from raw text.
 */
export function parseInput(rawText) {
  if (!rawText || rawText.trim().length === 0) return null;
  
  const text = rawText.trim();
  const amount = extractAmount(text);
  const category = classifyCategory(text);
  const intent = detectIntent(text);
  const merchant = extractMerchant(text);
  
  // Build a clean description by stripping amount-like tokens
  const description = text
    .replace(/\d+(?:[.,]\d+)?\s*(?:k|rb|rbu|ribu|rebuu?|jt|juta)?/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    || text;

  const parsed = {
    rawText: text,
    amount,
    intent,
    category: intent === 'income' ? 'Pemasukan' : category,
    merchant,
    description: description.length > 2 ? description : text,
    timestamp: new Date().toISOString(),
    date: new Date().toISOString().split('T')[0],
  };

  parsed.confidence = computeConfidence(parsed);
  return parsed;
}

// ─── FEEDBACK MESSAGE GENERATOR ───────────────────────────────────────────────
const EMOJI_MAP = {
  Makan: '🍽️', Kopi: '☕', Transport: '🚗', Tagihan: '💡',
  Hiburan: '🎮', Belanja: '🛍️', Kesehatan: '💊', Pendidikan: '📚',
  Pemasukan: '💸', Lainnya: '📌',
};

export function formatRupiah(amount) {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1)}jt`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(amount % 1_000 === 0 ? 0 : 1)}k`;
  }
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export function generateBotReply(parsed, currentBalance) {
  if (!parsed || !parsed.amount) {
    return {
      text: '❓ Hmm, saya kurang ngerti. Coba format: "makan 18k" atau "kopi starbucks 45rb".',
      emoji: '❓',
    };
  }

  const emoji = EMOJI_MAP[parsed.category] || '📌';
  const amountStr = formatRupiah(parsed.amount);

  if (parsed.intent === 'income') {
    const newBalance = (currentBalance || 0) + parsed.amount;
    return {
      text: `🎉 Pemasukan +${amountStr} tercatat!\n💰 Saldo baru: ${formatRupiah(newBalance)}`,
      emoji: '💸',
    };
  }

  const newBalance = (currentBalance || 0) - parsed.amount;
  const categoryLabel = parsed.merchant ? `${emoji} ${parsed.merchant}` : `${emoji} ${parsed.category}`;

  return {
    text: `✅ ${categoryLabel} ${amountStr} tercatat!\n💰 Sisa: ${formatRupiah(Math.max(0, newBalance))}`,
    emoji,
  };
}

// ─── REACT HOOK ───────────────────────────────────────────────────────────────
import { useState, useCallback } from 'react';

export function useNLPParser() {
  const [inputText, setInputText] = useState('');
  const [parsed, setParsed] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const parse = useCallback((text) => {
    setIsProcessing(true);
    // Simulate micro-processing delay for UX feel
    setTimeout(() => {
      const result = parseInput(text);
      setParsed(result);
      setIsProcessing(false);
    }, 80);
    return parseInput(text); // also return immediately for sync use
  }, []);

  const reset = useCallback(() => {
    setInputText('');
    setParsed(null);
  }, []);

  return {
    inputText,
    setInputText,
    parsed,
    parse,
    reset,
    isProcessing,
  };
}
