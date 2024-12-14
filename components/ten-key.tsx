import React, { useState } from "react";

export function Calculator() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: number) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? String(digit) : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const clearDisplay = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (previousValue == null) {
      setPreviousValue(inputValue);
    } else if (operator) {
      const currentValue = previousValue || 0;
      let computedValue;

      switch (operator) {
        case "+":
          computedValue = currentValue + inputValue;
          break;
        case "-":
          computedValue = currentValue - inputValue;
          break;
        case "*":
          computedValue = currentValue * inputValue;
          break;
        case "/":
          computedValue = currentValue / inputValue;
          break;
        default:
          computedValue = inputValue;
      }

      setDisplay(String(computedValue));
      setPreviousValue(computedValue);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const calculateResult = () => {
    performOperation("=");
    setOperator(null);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="rounded-lg p-4 w-80">
        <div className="bg-gray-200 p-4 text-right text-3xl font-bold mb-4 rounded">
          {display}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* First row */}
          <button
            onClick={() => inputDigit(7)}
            className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600 text-2xl"
          >
            7
          </button>
          <button
            onClick={() => inputDigit(8)}
            className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600 text-2xl"
          >
            8
          </button>
          <button
            onClick={() => inputDigit(9)}
            className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600 text-2xl"
          >
            9
          </button>
          <button
            onClick={() => performOperation("/")}
            className="bg-orange-500 text-white p-4 rounded hover:bg-orange-600 text-2xl"
          >
            ÷
          </button>

          {/* Second row */}
          <button
            onClick={() => inputDigit(4)}
            className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600 text-2xl"
          >
            4
          </button>
          <button
            onClick={() => inputDigit(5)}
            className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600 text-2xl"
          >
            5
          </button>
          <button
            onClick={() => inputDigit(6)}
            className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600 text-2xl"
          >
            6
          </button>
          <button
            onClick={() => performOperation("*")}
            className="bg-orange-500 text-white p-4 rounded hover:bg-orange-600 text-2xl"
          >
            ×
          </button>

          {/* Third row */}
          <button
            onClick={() => inputDigit(1)}
            className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600 text-2xl"
          >
            1
          </button>
          <button
            onClick={() => inputDigit(2)}
            className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600 text-2xl"
          >
            2
          </button>
          <button
            onClick={() => inputDigit(3)}
            className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600 text-2xl"
          >
            3
          </button>
          <button
            onClick={() => performOperation("-")}
            className="bg-orange-500 text-white p-4 rounded hover:bg-orange-600 text-2xl"
          >
            -
          </button>

          {/* Fourth row */}
          <button
            onClick={clearDisplay}
            className="bg-red-500 text-white p-4 rounded hover:bg-red-600 text-2xl col-span-1"
          >
            C
          </button>
          <button
            onClick={() => inputDigit(0)}
            className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600 text-2xl col-span-1"
          >
            0
          </button>
          <button
            onClick={inputDecimal}
            className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600 text-2xl col-span-1"
          >
            .
          </button>
          <button
            onClick={() => performOperation("+")}
            className="bg-orange-500 text-white p-4 rounded hover:bg-orange-600 text-2xl col-span-1"
          >
            +
          </button>

          {/* Fifth row */}
          <button
            onClick={calculateResult}
            className="bg-green-500 text-white p-4 rounded hover:bg-green-600 text-2xl col-span-4"
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
