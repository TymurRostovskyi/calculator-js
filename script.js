const result = document.getElementById('result');

// Append number or operator
function append(value) {
  if (result.value === '0' || result.value === 'Error') {
    result.value = '';
  }
  result.value += value;
}

// Clear display
function clearResult() {
  result.value = '0';
}

// Calculate result
function calculate() {
  try {
    result.value = eval(result.value);
  } catch {
    result.value = 'Error';
  }
}

// Toggle Dark Mode
function toggleTheme() {
  document.body.classList.toggle('dark');
  const btn = document.querySelector('.theme-btn');
  btn.textContent = document.body.classList.contains('dark') ? '☀️ Light Mode' : '🌙 Dark Mode';
}