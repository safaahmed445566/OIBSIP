const exprBox = document.getElementById("expression");
const resultBox = document.getElementById("result");
const messageBox = document.getElementById("message");
const keypad = document.querySelector(".buttons");

let expr = "";
let done = false;

const ops = ["+", "-", "*", "/"];

// Calculate an expression without eval().
function calculate(text) {
    const nums = [];
    const signs = [];
    let part = "";

    if (!text) {
        throw new Error("Enter a calculation first");
    }

    // Read the numbers and operators.
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];

        if ("0123456789.".includes(ch)) {
            part += ch;
        } else if (ops.includes(ch)) {
            // A minus sign can belong to a negative number.
            if (
                ch === "-" &&
                (i === 0 || ops.includes(text[i - 1]))
            ) {
                part += ch;
            } else {
                if (
                    part === "" ||
                    part === "-" ||
                    !Number.isFinite(Number(part))
                ) {
                    throw new Error("Invalid expression");
                }

                nums.push(Number(part));
                signs.push(ch);
                part = "";
            }
        } else {
            throw new Error("Invalid expression");
        }
    }

    if (
        part === "" ||
        part === "-" ||
        !Number.isFinite(Number(part))
    ) {
        throw new Error("Complete the expression");
    }

    nums.push(Number(part));

    // Calculate multiplication and division first.
    for (let i = 0; i < signs.length; i++) {
        if (signs[i] === "*" || signs[i] === "/") {
            let value;

            if (signs[i] === "*") {
                value = nums[i] * nums[i + 1];
            } else {
                if (nums[i + 1] === 0) {
                    throw new Error("Cannot divide by zero");
                }

                value = nums[i] / nums[i + 1];
            }

            nums.splice(i, 2, value);
            signs.splice(i, 1);
            i--;
        }
    }

    // Calculate addition and subtraction afterward.
    let total = nums[0];

    for (let i = 0; i < signs.length; i++) {
        if (signs[i] === "+") {
            total += nums[i + 1];
        } else {
            total -= nums[i + 1];
        }
    }

    if (!Number.isFinite(total)) {
        throw new Error("Invalid result");
    }

    return Number(total.toPrecision(12));
}

// Refresh the display and show any calculation errors.

 // Refresh the calculator display and handle errors.
function refresh() {
    exprBox.textContent = expr || "0";
    resultBox.textContent = "0";
    messageBox.textContent = "";

    if (!expr || expr === "-") {
        return;
    }

    try {
        resultBox.textContent = calculate(expr);
    } catch (err) {
        resultBox.textContent = "—";
        messageBox.textContent = err.message;
    }
}


// Add a digit or decimal point.
function enterNumber(value) {
    if (done) {
        expr = "";
        done = false;
    }

    const lastPart = expr.split(/[+*/-]/).pop();

    if (value === "." && lastPart.includes(".")) {
        return;
    }

    if (value === "." && lastPart === "") {
        expr += "0";
    }

    expr += value;
    refresh();
}

// Add or replace an operator.
function enterOperator(op) {
    if (done) {
        done = false;
    }

    if (!expr) {
        if (op === "-") {
            expr = "-";
            refresh();
        }
        return;
    }

    if (expr.endsWith(".")) {
        expr += "0";
    }

    const last = expr.slice(-1);

    if (ops.includes(last)) {
        if (op === "-" && last !== "-") {
            expr += "-";
        } else {
            expr = expr.slice(0, -1) + op;
        }
    } else {
        expr += op;
    }

    refresh();
}

// Clear the calculator.
function clearAll() {
    expr = "";
    done = false;
    refresh();
}

// Remove the last character.
function removeLast() {
    expr = expr.slice(0, -1);
    done = false;
    refresh();
}

// Display the final answer.
function getAnswer() {
    try {
        const answer = calculate(expr);

        expr = String(answer);
        done = true;
        refresh();
   } catch (err) {
    resultBox.textContent = "Error";
    messageBox.textContent = err.message;
    done = true;
}
}

// Toggle the sign of the last number.
function toggleSign() {
    if (!expr) {
        expr = "-";
        refresh();
        return;
    }

    // If the expression ends with an operator, begin a negative number.
    if (ops.includes(expr.slice(-1))) {
        if (expr.slice(-1) === "-") {
            expr = expr.slice(0, -1);
        } else {
            expr += "-";
        }

        done = false;
        refresh();
        return;
    }

    // Find the last number.
    const match = expr.match(/\d*\.?\d+|\d+\./);

    if (!match || match.index + match[0].length !== expr.length) {
        return;
    }

    let start = match.index;

    // Include a minus sign only when it is a unary negative sign.
    if (
        start > 0 &&
        expr[start - 1] === "-" &&
        (start - 1 === 0 || ops.includes(expr[start - 2]))
    ) {
        start--;
    }

    const number = expr.slice(start);

    if (number.startsWith("-")) {
        expr = expr.slice(0, start) + number.slice(1);
    } else {
        expr = expr.slice(0, start) + "-" + number;
    }

    done = false;
    refresh();
}

// Handle all calculator button clicks.
keypad.addEventListener("click", function (event) {
    const btn = event.target.closest("button");

    if (!btn) {
        return;
    }

    if (btn.dataset.number !== undefined) {
        enterNumber(btn.dataset.number);
        return;
    }

    if (btn.dataset.operator !== undefined) {
        enterOperator(btn.dataset.operator);
        return;
    }

    switch (btn.dataset.action) {
        case "clear":
            clearAll();
            break;

        case "backspace":
            removeLast();
            break;

        case "equals":
            getAnswer();
            break;

        case "sign":
            toggleSign();
            break;
    }
});

refresh();