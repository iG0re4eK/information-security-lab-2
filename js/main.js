import { numbers, win1251Codes, box } from "./data.js";

const inputWord = document.getElementById("inputWord");
const encodeBtn = document.getElementById("encodeBtn");
const resultPlace = document.getElementById("resultPlace");

encodeBtn.addEventListener("click", () => {
  resultPlace.innerHTML = "";
  const item = document.createElement("div");
  item.classList.add("result-item");

  const variables = {
    L: inputWord.value.slice(0, 4),
    R: inputWord.value.slice(4, 8),
    X: inputWord.value.slice(8, 12),
  };

  const iteration = document.createElement("span");
  iteration.classList.add("iteration");
  iteration.textContent = "1";
  item.appendChild(iteration);

  const tableVariables = document.createElement("table");
  const headerRowVars = document.createElement("tr");
  const thVars = document.createElement("th");
  thVars.setAttribute("colspan", "3");
  thVars.textContent = "Переменные";
  headerRowVars.appendChild(thVars);
  tableVariables.appendChild(headerRowVars);

  let binaryArray = [];

  for (const [key, value] of Object.entries(variables)) {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.innerHTML = `${key}<sub>0</sub>`;

    const valueCell = document.createElement("td");
    valueCell.textContent = value;

    const binaryCell = document.createElement("td");
    let binaryString = "";

    for (let i = 0; i < value.length; i++) {
      const charCode = win1251Codes[value[i]];
      if (charCode !== undefined) {
        const binary = charCode.toString(2).padStart(8, "0");
        binaryString += binary + " ";
      }
    }
    binaryArray.push(binaryString.split(" ").join(""));

    binaryCell.textContent = binaryString.trim();

    row.appendChild(nameCell);
    row.appendChild(valueCell);
    row.appendChild(binaryCell);
    tableVariables.appendChild(row);
  }

  item.appendChild(tableVariables);

  const sumSection = document.createElement("div");
  sumSection.classList.add("sum-section");

  const tableSum = document.createElement("table");
  const headerRowSum = document.createElement("tr");
  const thSum = document.createElement("th");
  thSum.setAttribute("colspan", "2");
  thSum.innerHTML = `Сложение`;
  headerRowSum.appendChild(thSum);
  tableSum.appendChild(headerRowSum);

  const addSumRow = (name, value, table) => {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    nameCell.innerHTML = name;

    const valueCell = document.createElement("td");
    let binaryString = "";
    for (let i = 0; i < value.length; i++) {
      const charCode = win1251Codes[value[i]];
      if (charCode !== undefined) {
        const binary = charCode.toString(2).padStart(8, "0");
        binaryString += binary + " ";
      }
    }
    valueCell.textContent = binaryString.trim();

    row.appendChild(nameCell);
    row.appendChild(valueCell);
    table.appendChild(row);
  };

  let formattedResult = "";

  const addResultSumRow = (name, value, table) => {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    nameCell.innerHTML = name;

    const valueCell = document.createElement("td");
    const rValue = parseInt(value[1], 2);
    const xValue = parseInt(value[2], 2);

    let sum = xValue + rValue;

    let result = sum.toString(2);

    if (result.length > 32) {
      result = result.slice(-32);
    } else {
      result = result.padStart(32, "0");
    }

    formattedResult = result.replace(/(.{8})/g, "$1 ");

    valueCell.textContent = formattedResult;

    row.appendChild(nameCell);
    row.appendChild(valueCell);
    table.appendChild(row);
  };

  addSumRow("X<sub>0</sub>", variables.X, tableSum);
  addSumRow("R<sub>0</sub>", variables.R, tableSum);
  addResultSumRow("f(X<sub>0</sub>,R<sub>0</sub>)", binaryArray, tableSum);

  sumSection.appendChild(tableSum);
  item.appendChild(sumSection);

  const swapSection = document.createElement("div");
  swapSection.classList.add("swap-operation");

  const tableSwap = document.createElement("table");
  const headerRowSwap = document.createElement("tr");
  const headersSwap = [
    "Индекс",
    "Двоичная",
    "Десятичная",
    "Перевод",
    "Двоичная",
  ];

  headersSwap.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRowSwap.appendChild(th);
  });
  tableSwap.appendChild(headerRowSwap);

  const cleanResult = formattedResult.split(" ").join("");

  let functionResult = [];

  for (let i = 0; i < 8; i++) {
    const row = document.createElement("tr");

    const startIndex = i * 4;
    const binarySlice = cleanResult.slice(startIndex, startIndex + 4);

    const decimalValue = parseInt(binarySlice, 2);

    const translationValue = box[decimalValue][i];

    const translatedBinary = translationValue.toString(2).padStart(4, "0");

    functionResult.push(translatedBinary);

    const cells = [
      (8 - i).toString(),
      binarySlice,
      decimalValue.toString(),
      translationValue.toString(),
      translatedBinary,
    ];

    cells.forEach((cellText) => {
      const td = document.createElement("td");
      td.textContent = cellText;
      row.appendChild(td);
    });

    tableSwap.appendChild(row);
  }
  swapSection.appendChild(tableSwap);
  item.appendChild(swapSection);

  const tableShift = document.createElement("table");
  const headerRowShift = document.createElement("tr");
  const thShift = document.createElement("th");
  thShift.setAttribute("colspan", "2");
  thShift.innerHTML = `Сдвиг на 11 бит`;
  headerRowShift.appendChild(thShift);
  tableShift.appendChild(headerRowShift);

  item.appendChild(tableShift);

  let shiftFunction = functionResult;
  let shiftFunctionResult = [];

  const addShiftValue = (name, value, table) => {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    nameCell.innerHTML = name;

    const valueCell = document.createElement("td");

    let binaryString = value.join("");

    let firstStr = binaryString.slice(0, 11);
    let secondStr = binaryString.slice(11);
    const shiftedString = secondStr + firstStr;

    let result = "";
    for (let i = 0; i < shiftedString.length; i++) {
      result += shiftedString[i];
      if ((i + 1) % 4 === 0 && i !== shiftedString.length - 1) {
        result += " ";
      }
    }

    shiftFunctionResult = [];
    const bytes = shiftedString.match(/.{1,8}/g);
    shiftFunctionResult.push(...bytes);

    valueCell.textContent = result;
    row.appendChild(nameCell);
    row.appendChild(valueCell);
    table.appendChild(row);
  };

  const addSumRowTransform = (name, value, table) => {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    nameCell.innerHTML = name;

    const valueCell = document.createElement("td");

    let binaryString = value.join(" ");

    valueCell.textContent = binaryString;
    row.appendChild(nameCell);
    row.appendChild(valueCell);
    table.appendChild(row);
  };

  addSumRowTransform(
    "f(X<sub>0</sub>,R<sub>0</sub>)",
    functionResult,
    tableShift
  );
  addShiftValue(
    "f(X<sub>0</sub>,R<sub>0</sub>)<sub><-11</sub>",
    shiftFunction,
    tableShift
  );

  const tableSumModule = document.createElement("table");
  const headerRowSumModule = document.createElement("tr");
  const thSumModule = document.createElement("th");
  thSumModule.setAttribute("colspan", "2");
  thSumModule.innerHTML = `Сложение по модулю`;
  headerRowSumModule.appendChild(thSumModule);
  tableSumModule.appendChild(headerRowSumModule);

  const stringToBinaryArray = (str) => {
    let binaryArray = [];
    for (let i = 0; i < str.length; i++) {
      const charCode = win1251Codes[str[i]];
      if (charCode !== undefined) {
        binaryArray.push(charCode.toString(2).padStart(8, "0"));
      }
    }
    return binaryArray;
  };

  let finallyResult = "";

  const addResultRowModule = (name, value, table) => {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    nameCell.innerHTML = name;

    const valueCell = document.createElement("td");

    const lBinary = stringToBinaryArray(value[0]);
    const fValue = value[1];

    let xorResult = [];

    for (let i = 0; i < lBinary.length; i++) {
      let xorByte = "";
      for (let j = 0; j < 8; j++) {
        xorByte += lBinary[i][j] === fValue[i][j] ? "0" : "1";
      }
      xorResult.push(xorByte);
    }

    const binaryString = xorResult.join(" ");
    finallyResult = binaryString;
    valueCell.textContent = binaryString;

    row.appendChild(nameCell);
    row.appendChild(valueCell);
    table.appendChild(row);
  };

  functionResult.join("");
  addSumRow("L<sub>0</sub>", variables.L, tableSumModule);
  addSumRowTransform(
    "f(X<sub>0</sub>,R<sub>0</sub>)<sub><-11</sub>",
    shiftFunctionResult,
    tableSumModule
  );
  addResultRowModule(
    "L<sub>0</sub> ⊕ f(X<sub>0</sub>,R<sub>0</sub>)<sub><-11</sub>",
    [variables.L, shiftFunctionResult],
    tableSumModule
  );
  item.appendChild(tableSumModule);

  const addResult = (name, value, table) => {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    nameCell.innerHTML = name;

    const valueCell = document.createElement("td");

    valueCell.textContent = value;

    row.appendChild(nameCell);
    row.appendChild(valueCell);
    table.appendChild(row);
  };

  const tableResult = document.createElement("table");
  const headerRowResult = document.createElement("tr");
  const thResult = document.createElement("th");
  thResult.setAttribute("colspan", "2");
  thResult.innerHTML = `Результат`;
  headerRowResult.appendChild(thResult);
  tableResult.appendChild(headerRowResult);

  addResult("R<sub>1</sub>", finallyResult, tableResult);

  item.appendChild(tableResult);

  resultPlace.appendChild(item);
});
