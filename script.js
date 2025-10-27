const result = document.getElementById('result');
const PI = 3.14159265359;

function append(value) {
  if (result.value === '0' || result.value === 'Error') {
    result.value = '';
  }
  result.value += value;
}

function clearResult() {
  result.value = '0';
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

    // Close parentheses for trig functions
    const openParen = (expr.match(/\(/g) || []).length;
    const closeParen = (expr.match(/\)/g) || []).length;
    for (let i = 0; i < openParen - closeParen; i++) {
      expr += ')';
    }

    result.value = eval(expr);
  } catch {
    result.value = 'Error';
  }
}

function percent() {
  try {
    result.value = eval(result.value) / 100;
  } catch {
    result.value = 'Error';
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark');
  const btn = document.querySelector('.theme-btn');
  btn.textContent = document.body.classList.contains('dark') ? 'Light Mode' : 'Dark Mode';
}
