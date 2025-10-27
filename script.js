// ===== SELECT ELEMENTS =====
const display = document.getElementById("display");
const smallDisplay = document.getElementById("smallDisplay");
const buttons = document.querySelectorAll(".btn");
const themeButton = document.getElementById("themeButton");
const body = document.body;

let currentInput = "0";
let previousInput = "";
let operator = null;
let isDark = false;
let waitingForSecondNumber = false;

// ===== BUTTON LOGIC =====
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const action = btn.getAttribute("data-action");

    if (!isNaN(action) || action === ".") {
      handleNumber(action);
    } else if (["+", "-", "*", "/"].includes(action)) {
      handleOperator(action);
    } else if (action === "=") {
      calculate();
    } else if (action === "clear") {
      clearAll();
    } else if (action === "backspace") {
      backspace();
    } else if (action === "%") {
      handlePercent();
    } else if (action === "+/-") {
      toggleSign();
    }

    updateDisplay();
  });
});

function handleNumber(num) {
  if (waitingForSecondNumber) {
    currentInput = num === "." ? "0." : num;
    waitingForSecondNumber = false;
  } else {
    if (currentInput === "0" && num !== ".") {
      currentInput = num;
    } else {
      if (num === "." && currentInput.includes(".")) return;
      currentInput += num;
    }
  }
}

function handleOperator(op) {
  if (operator && !waitingForSecondNumber) {
    calculate();
  }
  previousInput = currentInput;
  operator = op;
  waitingForSecondNumber = true;
}

function calculate() {
  if (!operator || waitingForSecondNumber) return;

  const prev = parseFloat(previousInput);
  const curr = parseFloat(currentInput);
  let result;

  switch (operator) {
    case "+": result = prev + curr; break;
    case "-": result = prev - curr; break;
    case "*": result = prev * curr; break;
    case "/": result = curr !== 0 ? prev / curr : "Error"; break;
  }

  currentInput = result.toString();
  operator = null;
  previousInput = "";
  waitingForSecondNumber = false;
}

function handlePercent() {
  if (previousInput && operator) {
    currentInput = (parseFloat(previousInput) * parseFloat(currentInput) / 100).toString();
  } else {
    currentInput = (parseFloat(currentInput) / 100).toString();
  }
}

function toggleSign() {
  if (currentInput === "0") return;
  currentInput = (parseFloat(currentInput) * -1).toString();
}

function backspace() {
  currentInput = currentInput.slice(0, -1) || "0";
}

function clearAll() {
  currentInput = "0";
  previousInput = "";
  operator = null;
  waitingForSecondNumber = false;
}

// ===== UPDATE DISPLAY =====
function updateDisplay() {
  display.textContent = currentInput;
  smallDisplay.textContent = previousInput && operator
    ? `${previousInput} ${operator}`
    : "";
}

// ===== THEME TOGGLE =====
themeButton.addEventListener("click", () => {
  isDark = !isDark;
  body.classList.toggle("dark", isDark);
  body.classList.toggle("light", !isDark);

  themeButton.textContent = isDark
    ? "Switch to Light Mode"
    : "Switch to Dark Mode";
});

// Default light theme
body.classList.add("light");
updateDisplay();
