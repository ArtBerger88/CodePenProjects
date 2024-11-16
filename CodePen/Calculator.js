document.addEventListener("DOMContentLoaded", function () {
  const display = document.getElementById("display");
  const pads = document.querySelectorAll(".pad");
  let currentInput = "";
  let expression = "";
  let resultDisplayed = false;
  const operators = ["+", "-", "*", "/"];
  
  pads.forEach(pad => {
    pad.addEventListener("click", function () {
      const value = pad.innerText;
      const isReplacingOperator = ["+", "*", "/"].includes(value);
      const lastOperatorIndex = expression.lastIndexOf(' ');
      const lastChar = expression.substring(expression.length -1);
      const isReplaceable = operators.includes(expression.slice(-1));
      const operatorLength = expression.slice(-1).length;
      
      console.log(`Clicked: ${value}`);
      console.log(`Current Input: ${currentInput}`);
      console.log(`Expression: ${expression}`);
//clear button
      if (value === "clear") {
        currentInput = "";
        expression = "";
        display.innerText = "0";
        resultDisplayed = false;
      } else if (operators.includes(value)) {
        if (currentInput !== "" || resultDisplayed) {
          if (resultDisplayed) {
            expression = currentInput;
            resultDisplayed = false;
          } else {
            expression += currentInput;
          }
          if (operators.includes(expression.slice(-1))) {
            expression = expression.substring(0, expression.length - 1) + value; 
          } else {
          expression += value;
          }
          currentInput = "";
          display.innerText = expression;
        } else if (value === "-" && (expression === "" || operators.includes(expression.slice(-1)))) {
          currentInput = "-" + currentInput;
          display.innerText = currentInput;
        }
      } //Handling multiple operators 
      else if (isReplaceable && isReplacingOperator) {
        expression = expression.substring(0, expression.length - 1) + value;
        currentInput = value;
        display.innerText = expression;
       }
      
      //Handling decimal
      else if (value === ".") {
        if (!currentInput.includes(".")) {
          currentInput += value;
          display.innerText = currentInput;
        }
      } else {
        if (currentInput === "0" && value === "0") return;
        if (currentInput === "0" && value !== ".") {
          currentInput = value;
        } else {
          currentInput += value;
        }
        display.innerText = currentInput;
      } 

    });
  });
//Equals
  document.getElementById("equals").addEventListener("click", function () {
    console.log(`Evaluating Expression: ${expression + currentInput}`);
    if (currentInput !== "") {
      expression += currentInput;
      expression = expression.replace(/[*][+]/g, "+");
      expression = expression.replace(/\-+/g, "-");
      expression = expression.replace(/\++/g, "+");
      
      let result;
      try {
        result =  Function('"use strict";return (' + expression + ')')();
        display.innerText = result;
        currentInput = result.toString();
        expression = "";
        resultDisplayed = true;
      } catch (error) {
        display.innerText = "Error";
      }
    }
  });
});
