const result = document.getElementById('result');
const PI = 3.14159265359;
let lastNumber = '', lastOperator = '';

function append(value) {
  if (result.value === '0' || result.value === 'Error') result.value = '';
  result.value += value;

  const match = result.value.match(/([\d.]+)\s*([+\-*/])\s*$/);
  if (match) { lastNumber = match[1]; lastOperator = match[2]; }
}

function clearResult() {
  result.value = '0';
  lastNumber = ''; lastOperator = '';
}

function calculate() {
  try {
    let expr = result.value
      .replace(/π/g, PI)
      .replace(/√/g, 'Math.sqrt')
      .replace(/\^/g, '**')
      .replace(/sin\(/g, 'Math.sin(Math.PI/180*')
      .replace(/cos\(/g, 'Math.cos(Math.PI/180*')
      .replace(/log\(/g, 'Math.log10(');

    const open = (expr.match(/\(/g) || []).length;
    const close = (expr.match(/\)/g) || []).length;
    for (let i = 0; i < open - close; i++) expr += ')';

    result.value = eval(expr);
    lastNumber = result.value;
  } catch { result.value = 'Error'; }
}

function percent() {
  if (!lastNumber || !lastOperator) return;
  const current = parseFloat(result.value.match(/[\d.]+$/)?.[0] || '0');
  let percentValue;

  if (lastOperator === '+' || lastOperator === '-') {
    percentValue = parseFloat(lastNumber) * current / 100;
  } else if (lastOperator === '*' || lastOperator === '/') {
    percentValue = current / 100;
  } else return;

  result.value = result.value.replace(/[\d.]+$/, percentValue);
  calculate();
}

function toggleTheme() {
  document.body.classList.toggle('dark');
  const btn = document.querySelector('.theme-btn .icon');
  btn.textContent = document.body.classList.contains('dark') ? 'Light Mode' : 'Dark Mode';
}