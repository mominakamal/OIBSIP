const tempInput = document.getElementById('tempInput');
const unitSelect = document.getElementById('unitSelect');
const convertBtn = document.getElementById('convertBtn');
const errorMsg = document.getElementById('errorMsg');
const resC = document.getElementById('resC');
const resF = document.getElementById('resF');
const resK = document.getElementById('resK');

convertBtn.addEventListener('click', () => {
  errorMsg.textContent = '';
  const rawValue = tempInput.value.trim();
  const unit = unitSelect.value;

  // Validate: must be a number
  if (rawValue === '' || isNaN(rawValue)) {
    errorMsg.textContent = 'Please enter a valid numeric temperature.';
    clearResults();
    return;
  }

  const value = parseFloat(rawValue);

  // Convert input to Celsius first (common base)
  let celsius;
  if (unit === 'C') {
    celsius = value;
  } else if (unit === 'F') {
    celsius = (value - 32) * 5 / 9;
  } else if (unit === 'K') {
    celsius = value - 273.15;
  }

  // Edge case: below absolute zero
  if (celsius < -273.15) {
    errorMsg.textContent = 'Temperature cannot be below absolute zero (-273.15°C).';
    clearResults();
    return;
  }

  // Convert Celsius to all units
  const fahrenheit = (celsius * 9 / 5) + 32;
  const kelvin = celsius + 273.15;

  resC.textContent = celsius.toFixed(2) + ' °C';
  resF.textContent = fahrenheit.toFixed(2) + ' °F';
  resK.textContent = kelvin.toFixed(2) + ' K';
});

function clearResults() {
  resC.textContent = '—';
  resF.textContent = '—';
  resK.textContent = '—';
}
