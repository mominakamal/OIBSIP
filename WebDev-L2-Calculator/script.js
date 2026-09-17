const expressionDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const actionButtons = document.querySelectorAll("[data-action]");

let expression = "";
let resultShown = false;


// Number buttons
numberButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const number = button.getAttribute("data-number");

        if (resultShown) {
            expression = "";
            resultShown = false;
        }

        // Prevent multiple decimal points in one number
        if (number === ".") {

            const parts = expression.split(/[+\-*/%]/);
            const currentNumber = parts[parts.length - 1];

            if (currentNumber.includes(".")) {
                return;
            }

            if (currentNumber === "") {
                expression += "0";
            }
        }

        expression += number;

        updateDisplay();
    });
});


// Operator buttons
operatorButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const operator = button.getAttribute("data-operator");

        if (expression === "") {
            return;
        }

        resultShown = false;

        const lastCharacter = expression[expression.length - 1];

        // Replace operator if another operator is already at the end
        if ("+-*/%".includes(lastCharacter)) {
            expression = expression.slice(0, -1);
        }

        expression += operator;

        updateDisplay();
    });
});


// Clear and Delete buttons
actionButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const action = button.getAttribute("data-action");

        if (action === "clear") {
            expression = "";
            resultDisplay.textContent = "";
            resultShown = false;
            updateDisplay();
        }

        if (action === "delete") {
            expression = expression.slice(0, -1);
            resultDisplay.textContent = "";
            resultShown = false;
            updateDisplay();
        }

        if (action === "calculate") {
            calculate();
        }
    });
});


// Update calculator display
function updateDisplay() {

    if (expression === "") {
        expressionDisplay.textContent = "0";
    } else {
        expressionDisplay.textContent = expression
            .replace(/\*/g, "×")
            .replace(/\//g, "÷")
            .replace(/-/g, "−");
    }
}


// Calculate expression without eval()
function calculate() {

    if (expression === "") {
        return;
    }

    const lastCharacter = expression[expression.length - 1];

    // Do not calculate if expression ends with operator
    if ("+-*/%".includes(lastCharacter)) {
        resultDisplay.textContent = "Enter a number";
        return;
    }

    try {

        const tokens = expression.match(/\d+(\.\d+)?|[+\-*/%]/g);

        if (!tokens) {
            resultDisplay.textContent = "Error";
            return;
        }

        // First handle multiplication, division and percentage
        let values = [];
        let operators = [];

        values.push(parseFloat(tokens[0]));

        for (let i = 1; i < tokens.length; i += 2) {

            const operator = tokens[i];
            const nextNumber = parseFloat(tokens[i + 1]);

            if (operator === "*" || operator === "/" || operator === "%") {

                const previousValue = values.pop();

                if (operator === "/" && nextNumber === 0) {
                    resultDisplay.textContent = "Cannot divide by zero";
                    return;
                }

                let calculatedValue;

                if (operator === "*") {
                    calculatedValue = previousValue * nextNumber;
                }

                if (operator === "/") {
                    calculatedValue = previousValue / nextNumber;
                }

                if (operator === "%") {
                    calculatedValue = previousValue % nextNumber;
                }

                values.push(calculatedValue);

            } else {

                operators.push(operator);
                values.push(nextNumber);
            }
        }

        // Now handle addition and subtraction
        let finalResult = values[0];

        for (let i = 0; i < operators.length; i++) {

            if (operators[i] === "+") {
                finalResult += values[i + 1];
            }

            if (operators[i] === "-") {
                finalResult -= values[i + 1];
            }
        }

        // Round long decimal results
        finalResult = Number(finalResult.toFixed(10));

        resultDisplay.textContent = finalResult;

        resultShown = true;

    } catch (error) {

        resultDisplay.textContent = "Error";
    }
}
