class Calculator {
    
    constructor() {
        this.previousOperand = '';
        this.currentOperand = '0';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }
 
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }

   
    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand = this.currentOperand.toString() + number;
        }
    }

    chooseOperation(operation) {
        if (["sqrt","sin","cos","tan"].includes(operation)) {
            this.operation = operation;
            this.compute();
            return;
        }
        if (this.currentOperand === '0') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
    }

    compute() {
        let computation;
        
        if (this.operation === 'sqrt') {
            const value = parseFloat(this.currentOperand);
            if (isNaN(value)) return;
            computation = Math.sqrt(value);
        } else if (this.operation === 'sin') {
            const value = parseFloat(this.currentOperand);
            if (isNaN(value)) return;
            computation = Math.sin(value * Math.PI / 180);
        } else if (this.operation === 'cos') {
            const value = parseFloat(this.currentOperand);
            if (isNaN(value)) return;
            computation = Math.cos(value * Math.PI / 180);
        } else if (this.operation === 'tan') {
            const value = parseFloat(this.currentOperand);
            if (isNaN(value)) return;
            computation = Math.tan(value * Math.PI / 180);
        } else if (this.operation === 'pow') {
            const base = parseFloat(this.previousOperand);
            const exp = parseFloat(this.currentOperand);
            if (isNaN(base) || isNaN(exp)) return;
            computation = Math.pow(base, exp);
        } else {
            const prev = parseFloat(this.previousOperand);
            const current = parseFloat(this.currentOperand);
            if (isNaN(prev) || isNaN(current)) return;
            switch (this.operation) {
                case '+':
                    computation = prev + current;
                    break;
                case '-':
                    computation = prev - current;
                    break;
                case '*':
                    computation = prev * current;
                    break;
                case '/':
                    if (current === 0) {
                        alert('Cannot divide by zero!');
                        return;
                    }
                    computation = prev / current;
                    break;
                case '%':
                    computation = (prev * current) / 100;
                    break;
                default:
                    return;
            }
        }
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '0';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        document.getElementById('current-operand').textContent = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            document.getElementById('previous-operand').textContent = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            document.getElementById('previous-operand').textContent = '';
        }
    }
}

const calculator = new Calculator();

document.addEventListener('DOMContentLoaded', () => {
  
    document.querySelectorAll('[data-number]').forEach(button => {
        button.addEventListener('click', () => {
            calculator.appendNumber(button.dataset.number);
            calculator.updateDisplay();
        });
    });

    document.querySelectorAll('[data-action]').forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;
            switch (action) {
                case 'clear':
                    calculator.clear();
                    break;
                case 'delete':
                    calculator.delete();
                    break;
                case '=':
                    calculator.compute();
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                case 'sqrt':
                case 'pow':
                case 'sin':
                case 'cos':
                case 'tan':
                    calculator.chooseOperation(action);
                    break;
            }
            calculator.updateDisplay();
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key >= '0' && e.key <= '9' || e.key === '.') {
            calculator.appendNumber(e.key);
        } else if (e.key === '+' || e.key === '-') {
            calculator.chooseOperation(e.key);
        } else if (e.key === '*') {
            calculator.chooseOperation('*');
        } else if (e.key === '/') {
            e.preventDefault();
            calculator.chooseOperation('/');
        } else if (e.key === '%') {
            calculator.chooseOperation('%');
        } else if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            calculator.compute();
        } else if (e.key === 'Backspace') {
            calculator.delete();
        } else if (e.key === 'Escape') {
            calculator.clear();
        }
        
        calculator.updateDisplay();
    });

    calculator.updateDisplay();
});
