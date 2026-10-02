// --- STATE VARIABLES ---
let currentValue = '0';
let previousValue = null;
let operation = null;

// --- DOM ELEMENT REFERENCES ---
// Display Screen
const display = document.getElementById('display');

// Button Groups
const digitButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');

// Action Buttons
const clearButton = document.getElementById('clear');
const deleteButton = document.getElementById('delete');
const percentButton = document.getElementById('percent');
const decimalButton = document.getElementById('decimal');
const equalsButton = document.getElementById('equals');

// Loop over digitButtons and attach a click listener to each button
digitButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    // Read the pressed digit value from the button's data-number attribute
    const digit = event.target.dataset.number;

    // Apply blueprint logic: replace '0' or append new digit
    if (currentValue === '0') {
      currentValue = digit;
    } else {
      currentValue += digit;
    }

    // Update the display div on screen
    display.textContent = currentValue;
  });
});

// Attach a click listener to the decimal button
decimalButton.addEventListener('click', () => {
  // Check if currentValue does NOT already include a decimal point
  if (!currentValue.includes('.')) {
    currentValue += '.';
    display.textContent = currentValue;
  }
});

// Map operator symbols directly to calculation functions
const operations = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => (b === 0 ? 'Error' : a / b),
};

// Function to run a calculation using the map
function calculate(num1, num2, op) {
  const a = parseFloat(num1);
  const b = parseFloat(num2);
  
  if (!operations[op]) return num2;
  
  const result = operations[op](a, b);
  return String(result);
}

// Loop over operatorButtons and attach click listeners
operatorButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    const nextOperator = event.target.dataset.operator;

    // Case 1: Changing operator without entering a new number
    if (currentValue === '' && previousValue !== null) {
      operation = nextOperator;
      display.textContent = previousValue + ' ' + operation;
    } 
    // Case 2: First operator press
    else if (previousValue === null) {
      previousValue = currentValue;
      currentValue = '';
      operation = nextOperator;
      display.textContent = previousValue + ' ' + operation;
    } 
    // Case 3: Chaining operations (e.g., 5 + 3 +)
    else if (previousValue !== null && currentValue !== '') {
      const result = calculate(previousValue, currentValue, operation);
      
      
      if (result === 'Error') {
        display.textContent = 'Error';
        currentValue = '';
        previousValue = null;
        operation = null;
        return;
      }

      previousValue = result;
      currentValue = '';
      operation = nextOperator;
      display.textContent = previousValue + ' ' + operation;
    }
  });
});

// Equals button
equalsButton.addEventListener('click', () => {
  if (previousValue !== null && currentValue !== '' && operation !== null) {
    const result = calculate(previousValue, currentValue, operation);

    if (result === 'Error') {
      display.textContent = 'Error';
    } else {
      display.textContent = result;
    }

    currentValue = result;
    previousValue = null;
    operation = null;
  }
});

// Clear button
clearButton.addEventListener('click', () => {
  currentValue = '0';
  previousValue = null;
  operation = null;
  display.textContent = currentValue;
});

// Delete button
deleteButton.addEventListener('click', () => {
  currentValue = currentValue.slice(0, -1);
  if (currentValue === '') {
    currentValue = '0';
  }
  display.textContent = currentValue;
});

// Percent button
percentButton.addEventListener('click', () => {
  if (previousValue !== null && operation !== null) {
    // Chained: e.g. 200 + 10% → 10% of 200 = 20
    const base = parseFloat(previousValue);
    const percentValue = (base * parseFloat(currentValue)) / 100;
    currentValue = String(percentValue);
  } else {
    // Immediate: 50% → 0.5
    currentValue = String(parseFloat(currentValue) / 100);
  }
  display.textContent = currentValue;
});