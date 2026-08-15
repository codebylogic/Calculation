// Math Expression Generation with Elo-Tiered Complexity

export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function unitDigit(n) {
  return Math.abs(n) % 10;
}

export function getGCD(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function getLCM(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / getGCD(a, b);
}

function getDivisors(n) {
  const absN = Math.abs(Math.round(n));
  const divs = [];
  for (let d = 2; d <= absN; d++) {
    if (absN % d === 0) divs.push(d);
  }
  return divs;
}

function generateTieredAddition(tier) {
  let num1, num2;
  if (tier === "diamond") {
    let attempts = 0;
    do {
      num1 = randInt(61, 99);
      num2 = randInt(61, 99);
      attempts++;
    } while ((unitDigit(num1) + unitDigit(num2)) < 10 && attempts < 100);
  } else if (tier === "gold") {
    let attempts = 0;
    do {
      num1 = randInt(51, 99);
      num2 = randInt(51, 99);
      attempts++;
    } while ((unitDigit(num1) === 0 || unitDigit(num2) === 0) && attempts < 100);
  } else {
    num1 = randInt(51, 99);
    num2 = randInt(51, 99);
  }
  return { questionText: `${num1} + ${num2}`, correctAnswer: num1 + num2 };
}

function generateTieredHCF(tier) {
  let min, forbiddenMax;
  if (tier === "diamond") { min = 71; forbiddenMax = 20; }
  else if (tier === "gold") { min = 51; forbiddenMax = 10; }
  else { min = 51; forbiddenMax = 1; }

  let a, b, gcd;
  let attempts = 0;
  do {
    a = randInt(min, min + 80);
    b = randInt(min, min + 80);
    gcd = getGCD(a, b);
    attempts++;
  } while (gcd >= 1 && gcd <= forbiddenMax && attempts < 200);

  return { questionText: `HCF of (${a}, ${b})`, correctAnswer: gcd };
}

function generateTieredSquare(tier) {
  let base;
  if (tier === "heroic") {
    base = 100 + (randInt(0, 2) * 10) + 5;
  } else if (tier === "diamond") {
    let attempts = 0;
    do {
      base = randInt(30, 80);
      attempts++;
    } while ((unitDigit(base) === 0 || unitDigit(base) === 5) && attempts < 100);
  } else if (tier === "gold") {
    let attempts = 0;
    do {
      base = randInt(30, 80);
      attempts++;
    } while (unitDigit(base) === 0 && attempts < 100);
  } else {
    base = randInt(30, 60);
  }
  return { questionText: `${base}²`, correctAnswer: base * base };
}

function generateTieredCubeRoot(tier) {
  let min, max;
  if (tier === "diamond" || tier === "heroic") { min = 20; max = 50; }
  else { min = 1; max = 30; }
  const base = randInt(min, max);
  return { questionText: `∛${base * base * base}`, correctAnswer: base };
}

function generateTieredPercentage(tier) {
  let pct, finalNum;
  if (tier === "gold" || tier === "diamond" || tier === "heroic") {
    pct = randInt(0, 9) * 10 + 2.5;
    finalNum = randInt(2, 40) * 20;
  } else {
    pct = randInt(1, 9) * 10;
    finalNum = randInt(2, 40) * 10;
  }
  const correctAnswer = parseFloat(((pct / 100) * finalNum).toFixed(2));
  return { questionText: `${pct}% of ${finalNum}`, correctAnswer };
}

function generateTieredBODMAS(tier) {
  let termCount, digitMin, digitMax;
  if (tier === "gold" || tier === "diamond" || tier === "heroic") {
    termCount = 4; digitMin = 10; digitMax = 999;
  } else if (tier === "silver") {
    termCount = 3; digitMin = 10; digitMax = 99;
  } else {
    termCount = 3; digitMin = 1; digitMax = 9;
  }

  const ops = ['+', '-', '×', '÷'];
  const expressionParts = [];

  const firstTerm = randInt(digitMin, digitMax);
  expressionParts.push(String(firstTerm));
  let chainValue = firstTerm;

  for (let i = 1; i < termCount; i++) {
    let op = ops[randInt(0, ops.length - 1)];
    let nextTerm;

    if (op === '÷') {
      const divisors = getDivisors(chainValue).filter(d => d <= 12);
      if (divisors.length === 0) {
        op = '+';
        nextTerm = randInt(digitMin, digitMax);
        chainValue = nextTerm;
      } else {
        nextTerm = divisors[randInt(0, divisors.length - 1)];
        chainValue = chainValue / nextTerm;
      }
    } else if (op === '×') {
      nextTerm = randInt(2, 12);
      chainValue = chainValue * nextTerm;
    } else {
      nextTerm = randInt(digitMin, digitMax);
      chainValue = nextTerm;
    }

    expressionParts.push(op, String(nextTerm));
  }

  const questionText = expressionParts.join(' ');
  const evalExpr = questionText.replace(/×/g, '*').replace(/÷/g, '/');
  let correctAnswer = 0;
  try {
    correctAnswer = Function(`"use strict"; return (${evalExpr});`)();
    correctAnswer = parseFloat(correctAnswer.toFixed(2));
  } catch (e) {
    correctAnswer = 0;
  }
  return { questionText, correctAnswer };
}

export function generateArithmeticExpression(categoryName, difficultyLevels = {}, activeTier = "learner") {
  let questionText = '';
  let correctAnswer = 0;
  const level = difficultyLevels[categoryName] || 2;

  switch (categoryName) {
    case "Addition (1 Digit)": {
      const max = (level === 1) ? 4 : (level === 2) ? 7 : 9;
      const num1 = randInt(1, max);
      const num2 = randInt(1, max);
      questionText = `${num1} + ${num2}`;
      correctAnswer = num1 + num2;
      break;
    }
    case "Addition":
    case "Addition (2 Digit)": {
      if (activeTier !== "learner") {
        const result = generateTieredAddition(activeTier);
        questionText = result.questionText;
        correctAnswer = result.correctAnswer;
      } else {
        let min1 = 10, max1 = 99, min2 = 10, max2 = 99;
        if (level === 1) { max1 = 40; max2 = 40; }
        else if (level === 3) { min1 = 60; min2 = 60; }
        const num1 = randInt(min1, max1);
        const num2 = randInt(min2, max2);
        questionText = `${num1} + ${num2}`;
        correctAnswer = num1 + num2;
      }
      break;
    }
    case "Addition (3 Digit)": {
      let min = 100, max = 999;
      if (level === 1) max = 400;
      else if (level === 3) min = 600;
      const num1 = randInt(min, max);
      const num2 = randInt(min, max);
      questionText = `${num1} + ${num2}`;
      correctAnswer = num1 + num2;
      break;
    }
    case "Mix Addition": {
      const termsCount = (level === 1) ? 3 : (level === 2) ? 4 : 5;
      const terms = [];
      for (let i = 0; i < termsCount; i++) {
        terms.push(randInt(10, 99));
      }
      questionText = terms.join(" + ");
      correctAnswer = terms.reduce((acc, curr) => acc + curr, 0);
      break;
    }
    case "Number Sum": {
      const digitsCount = (level === 1) ? 5 : (level === 2) ? 7 : 9;
      let strNum = "";
      let sum = 0;
      for (let i = 0; i < digitsCount; i++) {
        const digit = randInt(1, 9);
        strNum += digit;
        sum += digit;
      }
      questionText = `Sum digits of: ${strNum}`;
      correctAnswer = sum;
      break;
    }
    case "Subtraction (1 Digit)": {
      const num1 = (level === 1) ? randInt(5, 9) : randInt(4, 9);
      const num2 = randInt(1, num1);
      questionText = `${num1} - ${num2}`;
      correctAnswer = num1 - num2;
      break;
    }
    case "Subtraction":
    case "Subtraction (2 Digit)": {
      let min = 10, max = 99;
      if (level === 1) max = 50;
      else if (level === 3) min = 50;
      let num1 = randInt(min, max);
      let num2 = randInt(min, max);
      const maxNum = Math.max(num1, num2);
      const minNum = Math.min(num1, num2);
      questionText = `${maxNum} - ${minNum}`;
      correctAnswer = maxNum - minNum;
      break;
    }
    case "Subtraction (3 Digit)": {
      let min = 100, max = 999;
      if (level === 1) max = 500;
      else if (level === 3) min = 500;
      const num1 = randInt(min, max);
      const num2 = randInt(min, max);
      const maxNum = Math.max(num1, num2);
      const minNum = Math.min(num1, num2);
      questionText = `${maxNum} - ${minNum}`;
      correctAnswer = maxNum - minNum;
      break;
    }
    case "Multiplication (1 Digit)": {
      const max = (level === 1) ? 5 : 9;
      const num1 = randInt(1, max);
      const num2 = randInt(1, max);
      questionText = `${num1} × ${num2}`;
      correctAnswer = num1 * num2;
      break;
    }
    case "Tables (11-30)": {
      const n1_min = 11, n1_max = 30;
      const n2_max = (level === 1) ? 5 : (level === 2) ? 7 : 9;
      const num1 = randInt(n1_min, n1_max);
      const num2 = randInt(2, n2_max);
      questionText = `${num1} × ${num2}`;
      correctAnswer = num1 * num2;
      break;
    }
    case "Multiplication":
    case "Multiplication (2 Digit)": {
      let n1_min = 11, n1_max = 19, n2_min = 2, n2_max = 9;
      if (level === 1) { n1_max = 12; n2_max = 5; }
      else if (level === 3) { n1_min = 12; n1_max = 50; n2_min = 11; n2_max = 19; }
      const num1 = randInt(n1_min, n1_max);
      const num2 = randInt(n2_min, n2_max);
      questionText = `${num1} × ${num2}`;
      correctAnswer = num1 * num2;
      break;
    }
    case "T × S": {
      let min = 100, max = 500;
      if (level === 3) max = 999;
      const num1 = randInt(min, max);
      const num2 = randInt(2, 9);
      questionText = `${num1} × ${num2}`;
      correctAnswer = num1 * num2;
      break;
    }
    case "Square": {
      if (activeTier !== "learner") {
        const result = generateTieredSquare(activeTier);
        questionText = result.questionText;
        correctAnswer = result.correctAnswer;
      } else {
        let min = 11, max = 30;
        if (level === 2) max = 60;
        if (level === 3) max = 99;
        const a = randInt(min, max);
        questionText = `${a}²`;
        correctAnswer = a * a;
      }
      break;
    }
    case "Division":
    case "Division (Perfect)": {
      let base_min = 2, base_max = 10, mult_min = 2, mult_max = 10;
      if (level === 1) { base_max = 5; mult_max = 5; }
      else if (level === 3) { base_min = 11; base_max = 20; mult_min = 5; mult_max = 12; }
      const divisor = randInt(base_min, base_max);
      const quotient = randInt(mult_min, mult_max);
      const dividend = divisor * quotient;
      questionText = `${dividend} ÷ ${divisor}`;
      correctAnswer = quotient;
      break;
    }
    case "Square Root (1-20)": {
      let min = 1, max = 20;
      if (level === 1) max = 10;
      else if (level === 3) min = 11;
      const base = randInt(min, max);
      questionText = `√${base * base}`;
      correctAnswer = base;
      break;
    }
    case "Square Root (21-100)": {
      let min = 21, max = 100;
      if (level === 1) max = 50;
      else if (level === 3) min = 70;
      const base = randInt(min, max);
      questionText = `√${base * base}`;
      correctAnswer = base;
      break;
    }
    case "Cube Root (1-10)": {
      let min = 1, max = 10;
      if (level === 1) max = 5;
      else if (level === 3) min = 6;
      const base = randInt(min, max);
      questionText = `∛${base * base * base}`;
      correctAnswer = base;
      break;
    }
    case "Cube Root (11-50)": {
      if (activeTier !== "learner") {
        const result = generateTieredCubeRoot(activeTier);
        questionText = result.questionText;
        correctAnswer = result.correctAnswer;
      } else {
        let min = 11, max = 50;
        if (level === 1) max = 25;
        else if (level === 3) min = 35;
        const base = randInt(min, max);
        questionText = `∛${base * base * base}`;
        correctAnswer = base;
      }
      break;
    }
    case "LCM": {
      const max = (level === 1) ? 10 : (level === 2) ? 16 : 25;
      const a = randInt(4, max);
      const b = randInt(4, max);
      questionText = `LCM of (${a}, ${b})`;
      correctAnswer = getLCM(a, b);
      break;
    }
    case "HCF": {
      if (activeTier !== "learner") {
        const result = generateTieredHCF(activeTier);
        questionText = result.questionText;
        correctAnswer = result.correctAnswer;
      } else {
        const max = (level === 1) ? 40 : (level === 2) ? 80 : 120;
        const a = randInt(12, max);
        const b = randInt(12, max);
        questionText = `HCF of (${a}, ${b})`;
        correctAnswer = getGCD(a, b);
      }
      break;
    }
    case "Fractions": {
      if (level === 1) {
        const den = randInt(2, 5);
        const num1 = randInt(1, 3);
        const num2 = randInt(1, 3);
        questionText = `${num1}/${den} + ${num2}/${den}`;
        correctAnswer = parseFloat(((num1 + num2) / den).toFixed(2));
      } else {
        const den1 = randInt(2, 5);
        const den2 = randInt(2, 5);
        const num1 = randInt(1, 3);
        const num2 = randInt(1, 3);
        questionText = `${num1}/${den1} + ${num2}/${den2}`;
        correctAnswer = parseFloat(((num1 / den1) + (num2 / den2)).toFixed(2));
      }
      break;
    }
    case "Percentage": {
      if (activeTier !== "learner") {
        const result = generateTieredPercentage(activeTier);
        questionText = result.questionText;
        correctAnswer = result.correctAnswer;
      } else {
        const base = (level === 1) ? 100 : (level === 2) ? 50 : 25;
        const pct = (level === 1) ? 10 : (level === 2) ? 20 : 15;
        const num = randInt(1, 5);
        const finalNum = base * num;
        questionText = `${pct}% of ${finalNum}`;
        correctAnswer = parseFloat(((pct / 100) * finalNum).toFixed(2));
      }
      break;
    }
    case "Decimal Arithmetic":
    case "Decimals": {
      const num1 = parseFloat((Math.random() * 9 + 1).toFixed(level === 1 ? 1 : 2));
      const num2 = parseFloat((Math.random() * 9 + 1).toFixed(level === 1 ? 1 : 2));
      questionText = `${num1} + ${num2}`;
      correctAnswer = parseFloat((num1 + num2).toFixed(2));
      break;
    }
    case "BODMAS Rules":
    default: {
      if (activeTier !== "learner") {
        const result = generateTieredBODMAS(activeTier);
        questionText = result.questionText;
        correctAnswer = result.correctAnswer;
      } else if (level === 1) {
        questionText = "2 × 3 + 4";
        correctAnswer = 10;
      } else if (level === 2) {
        questionText = "12 ÷ 3 + 5 × 2";
        correctAnswer = 14;
      } else {
        questionText = "(15 + 5) ÷ 4 × 9";
        correctAnswer = 45;
      }
      break;
    }
  }

  return { questionText, correctAnswer };
}
