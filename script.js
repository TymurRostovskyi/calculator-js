// script.js (updated)
// Elements
const resultEl = document.getElementById("result");
const operationEl = document.getElementById("operation");
const themeBtn = document.getElementById("theme-btn");

// State
let current = "";           // what user types now (string)
let previous = "";          // previous value (string)
let operator = null;        // 'add' | 'subtract' | 'multiply' | 'divide' | null
let darkMode = false;

let percentDisplay = false; // whether current was converted by pressing %
let percentRaw = "";        // original percent input (e.g. "20" from "20%")

// helper: map internal operator to symbol
const opSymbol = {
  add: "+",
  subtract: "−",
  multiply: "×",
  divide: "÷"
};

const updateOperationDisplay = () => {
  if (previous && operator) {
    const symbol = opSymbol[operator] || "";
    if (percentDisplay && percentRaw !== "") {
      // show original percent with % sign
      operationEl.textContent = `${previous} ${symbol} ${percentRaw}%`;
    } else {
      operationEl.textContent = `${previous} ${symbol}`;
    }
  } else {
    operationEl.textContent = "";
  }
};

const updateResultDisplay = () => {
  // show current or 0
  resultEl.textContent = current || "0";
};

const updateDisplay = () => {
  updateOperationDisplay();
  updateResultDisplay();
};

// clear all
const clearAll = () => {
  current = "";
  previous = "";
  operator = null;
  percentDisplay = false;
  percentRaw = "";
  updateDisplay();
};

// number input
const handleNumber = (num) => {
  // if percent was active previously, entering a number resets percent state
  if (percentDisplay) {
    percentDisplay = false;
    percentRaw = "";
  }

  if (num === "." && current.includes(".")) return;
  // if current is result of a complete calculation and no operator yet, allow append (like normal)
  current = current === "0" && num !== "." ? num : current + num;
  updateDisplay();
};

// when an operator is pressed (+ - × ÷)
const handleOperator = (op) => {
  // If no current and there is previous (allow changing operator)
  if (!current && previous) {
    operator = op;
    percentDisplay = false;
    percentRaw = "";
    updateDisplay();
    return;
  }

  // If we already have previous and operator and current -> perform previous calculation first
  if (previous && operator && current) {
    calculate(); // this will move result into current
  }

  // Move current to previous and set operator
  if (current) {
    previous = current;
    current = "";
  }
  operator = op;
  percentDisplay = false;
  percentRaw = "";
  updateDisplay();
};

// percent handling
const handlePercent = () => {
  if (!current) return;

  // If there's a previous value and an operator (e.g., 100 + 20 %)
  if (previous && operator) {
    // compute percent relative to previous for add/subtract, and relative semantics for multiply/divide:
    const prevNum = parseFloat(previous);
    const curNum = parseFloat(current);
    if (isNaN(prevNum) || isNaN(curNum)) return;

    // For add/subtract, % means prev * cur / 100 (so that 100 + 20% → 100 + 20)
    // For multiply/divide, it's natural to treat current as percent of 1 => cur/100 (100 × 20% = 20)
    let percentValue;
    if (operator === "add" || operator === "subtract") {
      percentValue = (prevNum * curNum) / 100;
    } else {
      // multiply or divide
      percentValue = (curNum) / 100 * (operator === "multiply" ? prevNum : 1); 
      // For multiply we might want prev * (cur/100) — but we leave standard flow:
      // We'll set current to curNum/100 so that calculate() interprets it correctly.
    }

    // Save the raw percent typed for display (e.g. "20")
    percentRaw = String(curNum);
    // Use percentDisplay flag to show "20%" in operation area
    percentDisplay = true;

    // For add/subtract: set current to the computed percentValue (so calculate will do prev + current)
    if (operator === "add" || operator === "subtract") {
      current = String(percentValue);
    } else {
      // For multiply/divide, set current to curNum/100 so calculation uses prev * (cur/100)
      current = String(curNum / 100);
    }

    updateDisplay();
    return;
  }

  // If no previous/operator — simply divide the current by 100 (turn into percentage)
  const cur = parseFloat(current);
  if (isNaN(cur)) return;
  percentRaw = String(cur);
  percentDisplay = true;
  current = String(cur / 100);
  updateDisplay();
};

// calculate based on operator
const calculate = () => {
  if (!operator || !previous || current === "") return;

  const a = parseFloat(previous);
  const b = parseFloat(current);
  if (isNaN(a) || isNaN(b)) return;

  let result;

  switch (operator) {
    case "add":
      result = a + b;
      break;
    case "subtract":
      result = a - b;
      break;
    case "multiply":
      result = a * b;
      break;
    case "divide":
      result = b === 0 ? "Error" : a / b;
      break;
    default:
      return;
  }

  // After calculation, clear previous/operator, show result in current
  current = String(result);
  previous = "";
  operator = null;
  // computed result is not a percent entry anymore
  percentDisplay = false;
  percentRaw = "";
  updateDisplay();
};

// sign change
const toggleSign = () => {
  if (!current) return;
  const n = parseFloat(current);
  if (isNaN(n)) return;
  current = String(n * -1);
  // percent flag resets because value changed
  percentDisplay = false;
  percentRaw = "";
  updateDisplay();
};

// wire buttons
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const number = btn.dataset.number;
    const action = btn.dataset.action;

    if (number !== undefined) {
      handleNumber(number);
      return;
    }

    switch (action) {
      case "clear": clearAll(); break;
      case "sign": toggleSign(); break;
      case "percent": handlePercent(); break;
      case "equals": calculate(); break;
      case "add":
      case "subtract":
      case "multiply":
      case "divide":
        handleOperator(action); break;
      default: break;
    }
  });
});

// theme toggle (unchanged)
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  darkMode = !darkMode;
  themeBtn.textContent = darkMode ? "Switch to Light Mode" : "Switch to Dark Mode";
});

// init
clearAll();
