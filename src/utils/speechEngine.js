// Speech Recognition & Natural Spoken Number Parsing (English, Hindi, Hinglish)

const units = {
  'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9,
  'ten': 10, 'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15, 'sixteen': 16,
  'seventeen': 17, 'eighteen': 18, 'nineteen': 19,
  'शून्य': 0, 'सिफर': 0, 'एक': 1, 'दो': 2, 'तीन': 3, 'चार': 4, 'पांच': 5, 'पाँच': 5, 'छह': 6, 'छः': 6, 'सात': 7, 'आठ': 8, 'नौ': 9, 'दस': 10,
  'ग्यारह': 11, 'बारह': 12, 'तेरह': 13, 'चौदह': 14, 'पंद्रह': 15, 'सोलह': 16, 'सत्रह': 17, 'अठारह': 18, 'उन्नीस': 19
};

const tens = {
  'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50, 'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90,
  'बीस': 20, 'इक्कीस': 21, 'बाईस': 22, 'तेईस': 23, 'चौबीस': 24, 'पच्चीस': 25, 'छब्बीस': 26, 'सत्ताईस': 27, 'अट्ठाईस': 28, 'उनतीस': 29,
  'तीस': 30, 'इकतीस': 31, 'बत्तीस': 32, 'तैंतीस': 33, 'चौंतीस': 34, 'पैंतीस': 35, 'छत्तीस': 36, 'सैंतीस': 37, 'अड़तीस': 38, 'उनतालीस': 39,
  'चालीस': 40, 'इकतालीस': 41, 'बयालीस': 42, 'तैंतालीस': 43, 'चवालीस': 44, 'पैंतालीस': 45, 'छियालीस': 46, 'सैंतालीस': 47, 'अड़तालीस': 48, 'उनचास': 49,
  'पचास': 50, 'इक्यावन': 51, 'बावन': 52, 'तिरेपन': 53, 'चौवन': 54, 'पचपन': 55, 'छप्पन': 56, 'सत्तावन': 57, 'अट्ठावन': 58, 'उनसठ': 59,
  'साठ': 60, 'इकसठ': 61, 'बासठ': 62, 'तिरेसठ': 63, 'चौंसठ': 64, 'पैंसठ': 65, 'छियासठ': 66, 'सड़सठ': 67, 'अड़सठ': 68, 'उनहत्तर': 69,
  'सत्तर': 70, 'इकहत्तर': 71, 'बहत्तर': 72, 'तिहत्तर': 73, 'चौहत्तर': 74, 'पचहत्तर': 75, 'छिहत्तर': 76, 'सतहत्तर': 77, 'अठहत्तर': 78, 'उन्नासी': 79,
  'अस्सी': 80, 'इक्यासी': 81, 'बयासी': 82, 'तिरासी': 83, 'चौरासी': 84, 'पचासी': 85, 'छियासी': 86, 'सतासी': 87, 'अठासी': 88, 'नवासी': 89,
  'नब्बे': 90, 'इक्यानवे': 91, 'बानवे': 92, 'तिरानवे': 93, 'चौरानवे': 94, 'पंचानवे': 95, 'छियानवे': 96, 'सत्तानवे': 97, 'अट्ठानवे': 98, 'निन्यानवे': 99
};

const scales = {
  'hundred': 100, 'thousand': 1000, 'lakh': 100000, 'सौ': 100, 'हजार': 1000, 'हज़ार': 1000, 'लाख': 100000
};

export function parseWordToDigit(word) {
  const cleanWord = word.toLowerCase().trim();
  if (units[cleanWord] !== undefined) return { val: units[cleanWord], type: 'unit' };
  if (tens[cleanWord] !== undefined) return { val: tens[cleanWord], type: 'ten' };
  if (scales[cleanWord] !== undefined) return { val: scales[cleanWord], type: 'scale' };
  return null;
}

export function reconstructSpokenNumber(text) {
  if (!text) return null;

  const clean = text.toLowerCase().trim()
    .replace(/[^a-zA-Z0-9\s.\u0900-\u097F]/g, '')
    .replace(/\bto\b/g, 'two')
    .replace(/\btoo\b/g, 'two')
    .replace(/\bfor\b/g, 'four')
    .replace(/\bpoint\b/g, '.')
    .replace(/\bदशमलव\b/g, '.')
    .replace(/\broot\b/g, '')
    .replace(/\bरूट\b/g, '')
    .replace(/\bcube\b/g, '')
    .replace(/\bक्यूब\b/g, '')
    .replace(/\band\b/g, '');

  const words = clean.split(/\s+/).filter(Boolean);

  // 1. Direct Regex Float/Int Match
  const directMatch = clean.match(/[-+]?[\d]+\.?[\d]*/);
  if (directMatch) {
    const val = parseFloat(directMatch[0]);
    if (!isNaN(val)) return val;
  }

  // 2. Consecutive individual digits (e.g. "one four two" -> 142 or "two point five" -> 2.5)
  let isConsecutiveSequence = true;
  let digitSequenceStr = "";
  for (let i = 0; i < words.length; i++) {
    const parsed = parseWordToDigit(words[i]);
    if (parsed && parsed.type === 'unit') {
      digitSequenceStr += parsed.val;
    } else if (words[i] === '.') {
      digitSequenceStr += '.';
    } else {
      isConsecutiveSequence = false;
      break;
    }
  }
  if (isConsecutiveSequence && digitSequenceStr !== "") {
    const val = parseFloat(digitSequenceStr);
    if (!isNaN(val)) return val;
  }

  // 3. Compound spoken phrases (e.g., "one hundred twenty five", "एक सौ बीस")
  const compoundList = [];
  let activeSegment = 0;
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const parsed = parseWordToDigit(w);
    if (parsed) {
      if (parsed.type === 'ten' || parsed.type === 'unit') {
        activeSegment += parsed.val;
      } else if (parsed.type === 'scale') {
        activeSegment = (activeSegment === 0 ? 1 : activeSegment) * parsed.val;
        compoundList.push(activeSegment);
        activeSegment = 0;
      }
    }
  }
  if (activeSegment > 0) {
    compoundList.push(activeSegment);
  }

  if (compoundList.length > 0) {
    const sum = compoundList.reduce((acc, c) => acc + c, 0);
    const concatStr = compoundList.map(v => String(v)).join('');
    const concatVal = parseFloat(concatStr);
    return { sum, concatVal };
  }
  return null;
}

export function verifyVerbalResponse(transcript, actualAns) {
  const parsedObj = reconstructSpokenNumber(transcript);
  if (parsedObj === null) return false;

  const actualNum = parseFloat(actualAns);
  if (typeof parsedObj === 'number') {
    return Math.abs(parsedObj - actualNum) < 0.05;
  }
  if (parsedObj.sum !== undefined) {
    if (Math.abs(parsedObj.sum - actualNum) < 0.05) return true;
    if (parsedObj.concatVal !== undefined && Math.abs(parsedObj.concatVal - actualNum) < 0.05) return true;
  }
  return false;
}

export function isSpeechRecognitionSupported() {
  return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
}

export function createSpeechRecognizer({ onResult, onStart, onEnd, onError, lang = 'hi-IN' }) {
  if (!isSpeechRecognitionSupported()) return null;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = lang;

  if (onStart) recognition.onstart = onStart;
  if (onResult) recognition.onresult = onResult;
  if (onError) recognition.onerror = onError;
  if (onEnd) recognition.onend = onEnd;

  return recognition;
}

export function playFeedbackBeep(isSuccess) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (isSuccess) {
      // Pleasant high rising harmonic
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else {
      // Soft low descending double tone
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
      osc.frequency.setValueAtTime(146.83, ctx.currentTime + 0.1); // D3
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    }
  } catch (e) {
    console.warn("Audio Context playback prevented or unsupported:", e);
  }
}
