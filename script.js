//Body of the sheet
const topContainer = document.querySelector(".top");
const mainCellContainer = document.querySelector(".right");
const SnoContainer = document.querySelector(".sno");
const cols = 26;
const rows = 100;

//options
const cellNamePlaceHolder = document.querySelector("#activeElement");
const form = document.querySelector("#form");
const fontSizeInput = document.querySelector("#font-size");
const fontFamilyInput = document.querySelector("#font-family");

//Scroll options for sheet
let downloadBtn = document.querySelector("#downloadBtn");
let uploadBtn = document.querySelector("#uploadBtn");

//Font Color, BG Color Options
const bgColorlabel = document.getElementById("bgColorLabel");
const bgColorInput = document.getElementById("bgColor");

const textColorlabel = document.getElementById("textColorlabel");
const textColorInput = document.getElementById("color");

//Sheet Handling
const sheetsContainer = document.getElementById("sheetsContainer");
const footerSheetsContainer = document.querySelector(".sheets-folder-cont");

//Cut, Copy, Paste
const copyBtn = document.querySelector("#copyBtn");
const cutBtn = document.querySelector("#cutBtn");
const pasteBtn = document.querySelector("#pasteBtn");

copyBtn.addEventListener("click", copyContent);
cutBtn.addEventListener("click", cutContent);
pasteBtn.addEventListener("click", pasteContent);


//Body Features
function createTopCells() {
    for (let i = 0; i <= cols; i++) {
      const cell = document.createElement("div");
      if (i !== 0) {
        cell.innerText = String.fromCharCode(64 + i);
      }
      cell.classList = "cell top-cell";
      topContainer.appendChild(cell);
    }
  }
  
  function createSnoCells() {
    for (let i = 1; i <= rows; i++) {
      const snoCell = document.createElement("div");
      snoCell.innerText = i;
      snoCell.classList = "cell sno-cell";
      SnoContainer.appendChild(snoCell);
    }
  }
  
  function createRow(rowNumber) {
    const row = document.createElement("div");
    for (let i = 0; i < cols; i++) {
      const cell = document.createElement("div");
      cell.classList = "cell main-cell";
      cell.contentEditable = true;
      row.appendChild(cell);
  
      cell.id = String.fromCharCode(64 + i + 1) + rowNumber;
      cell.addEventListener("focus", onCellFocus);
      cell.addEventListener("input", onCellFocus);
    }
    row.classList = "main-row";
    mainCellContainer.appendChild(row);
  }
  
  for (let i = 1; i <= rows; i++) {
    createRow(i);
  }
  
  createSnoCells();
  createTopCells();

  //Text Design Features
  function toggleClass(element) {
    element.classList.toggle("active");
  }
  
  bgColorlabel.addEventListener("click", () => {
    bgColorInput.classList.toggle("disp");
  });
  
  bgColorInput.addEventListener("input", () => {
    bgColor = bgColorInput.value;
  });
  
  textColorlabel.addEventListener("click", () => {
    textColorInput.classList.toggle("disp");
  });
  
  textColorInput.addEventListener("input", () => {
    color = textColorInput.value;
  });

  //Scroll Features
  function exportData() {
    const fileData = JSON.stringify(sheets);
    const blob = new Blob([fileData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = url;
    link.download = "sheets.json";
  
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  downloadBtn.addEventListener("click", function (event) {
    event.preventDefault(); 
    exportData();
  });
  
  function importData(e) {
    e.preventDefault();
    const input = document.createElement("input");
    input.type = "file";
  
    input.addEventListener("change", (event) => {
      const file = event.target.files[0];
  
      if (file) {
        const reader = new FileReader();
  
        reader.onload = (e) => {
          const importedSheets = JSON.parse(e.target.result);
          sheets.length = 0;
  
          importedSheets.forEach((importedSheet) => {
            sheets.push(importedSheet);
          });
          switchSheet(sheets.length - 1);
          updateUI();
        };
  
        reader.readAsText(file);
      }
    });
  
    input.click();
  }
  
  uploadBtn.addEventListener("click", importData);

  //Sheet Handling Features
  let activeSheetIndex = 0;
const sheets = [{ state: {}, name: "Sheet 1" }];

function switchSheet(index) {
  sheets[activeSheetIndex].state = getCurrentSheetState();
  activeSheetIndex = index;
  updateUI();
}

function addSheet() {
  const newSheet = { state: {}, name: `Sheet ${sheets.length + 1}` };
  sheets.push(newSheet);
  activeSheetIndex = sheets.length - 1;
  updateUI();
}

function deleteSheet() {
  if (sheets.length > 1) {
    sheets.splice(activeSheetIndex, 1);
    if (activeSheetIndex >= sheets.length) {
      activeSheetIndex = sheets.length - 1;
    }
    updateUI();
  } else {
    alert("You can't delete the last sheet.");
  }
}

function updateUI() {
  sheetsContainer.innerHTML = "";
  sheets.forEach((sheet, index) => {
    const sheetButton = createSheetButton(sheet.name, index);
    sheetButton.classList.add("sheet-btn");
    sheetsContainer.appendChild(sheetButton);

    if (index === activeSheetIndex) {
      sheetButton.classList.add("current-sheet");
    } else {
      sheetButton.classList.remove("current-sheet");
    }
  });

  const activeSheetState = sheets[activeSheetIndex].state;
  createSheetCells(activeSheetState);
}

function createSheetButton(sheetName, index) {
  const sheetButton = document.createElement("button");
  sheetButton.textContent = sheetName;
  sheetButton.addEventListener("click", () => switchSheet(index));
  return sheetButton;
}

function createSheetCells(state) {
  mainCellContainer.innerHTML = "";
  SnoContainer.innerHTML = "";

  for (let i = 1; i <= rows; i++) {
    const snoCell = document.createElement("div");
    snoCell.innerText = i;
    snoCell.classList = "cell sno-cell";
    SnoContainer.appendChild(snoCell);
  }

  for (let row = 1; row <= rows; row++) {
    const rowContainer = document.createElement("div");
    rowContainer.classList.add("main-row");

    for (let col = 1; col <= cols; col++) {
      const cellId = String.fromCharCode(64 + col) + row;
      const cell = createCell(cellId, state[cellId]);
      rowContainer.appendChild(cell);

      cell.addEventListener("focus", onCellFocus);
      cell.addEventListener("input", onFormChange);
    }

    mainCellContainer.appendChild(rowContainer);
  }
}

function createCell(cellId, content) {
  const cell = document.createElement("div");
  cell.id = cellId;
  cell.classList = "cell main-cell";
  cell.contentEditable = true;
  cell.innerText = content || "";
  return cell;
}

function getCurrentSheetState() {
  const state = {};

  for (let row = 1; row <= rows; row++) {
    for (let col = 1; col <= cols; col++) {
      const cellId = String.fromCharCode(64 + col) + row;
      const cell = document.getElementById(cellId);
      state[cellId] = cell.innerText;
    }
  }

  return state;
}

updateUI();

//Cut, Copy, Paste features
let clipboard = { content: "", action: "" };

function copyContent() {
  clipboard.content = activeElement.innerText;
  clipboard.action = "copy";
}

function cutContent() {
  clipboard.content = activeElement.innerText;
  clipboard.action = "cut";
  activeElement.innerText = "";
}

function pasteContent() {
  if (clipboard.action === "copy" || clipboard.action === "cut") {
    activeElement.innerText = clipboard.content;
    if (clipboard.action === "cut") {
      clipboard.content = "";
      clipboard.action = "";
    }
  }
}

document.addEventListener("keydown", function (event) {
  if (event.ctrlKey === "c") {
    copyContent();
  } else if (event.ctrlKey === "v") {
    pasteContent();
  } else if (event.ctrlKey === "x") {
    cutContent();
  }
});

//Options Feature
let activeElement = null;

const state = {};

const defaultProp = {
  fontSize: 16,
  fontFamily: "sans",
  color: "#000000",
  textAlign: "left",
  bgColor: "#ffffff",
  bold: false,
  italic: false,
  underline: false,
  value: "",
};

function onCellFocus(event) {
  const elementId = event.target.id;
  cellNamePlaceHolder.value = elementId;
  activeElement = event.target;
  if (state[activeElement.id]) {
    resetOptions(state[elementId]);
  } else {
    resetOptions(defaultProp);
  }
}

function resetOptions(optionState) {
  form.fontFamily.value = optionState.fontFamily;
  form.fontSize.value = optionState.fontSize;
  form.textAlign.value = optionState.textAlign;
  form.color.value = optionState.color;
  form.bgColor.value = optionState.bgColor;
  form.bold.value = optionState.bold;
  form.italic.value = optionState.italic;
  form.underline.value = optionState.underline;
}

function onFormChange(event) {
  if (!activeElement) {
    alert("please Select cell to make changes");
    form.reset();
    return;
  }
  let currentState = {
    fontFamily: form.fontFamily.value,
    fontSize: form.fontSize.value,
    textAlign: form.textAlign.value,
    color: form.color.value,
    bgColor: form.bgColor.value,
    bold: form.bold.checked,
    italic: form.italic.checked,
    underline: form.underline.checked,
  };
  applyStyleToCell(currentState);
  state[activeElement.id] = { ...currentState, value: activeElement.innerText };
}

function applyStyleToCell(styleObject) {
  activeElement.style.fontSize = `${styleObject.fontSize}px`;
  activeElement.style.fontFamily = styleObject.fontFamily;
  activeElement.style.color = styleObject.color;
  activeElement.style.backgroundColor = styleObject.bgColor;
  activeElement.style.textAlign = styleObject.textAlign;
  activeElement.style.fontWeight = styleObject.bold ? "bold" : "normal";
  activeElement.style.fontStyle = styleObject.italic ? "italic" : "normal";
  activeElement.style.textDecoration = styleObject.underline
    ? "underline"
    : "none";
}

form.addEventListener("input", onFormChange);
form.addEventListener("submit", (event) => event.preventDefault());

//Text Handling
const expressionInput = document.querySelector("#expressionInput");

expressionInput.addEventListener("input", handleExpressionInput);

function handleExpressionInput() {
  const expression = expressionInput.value;
  if (expression.trim() !== "") {
    try {
      const result = eval(expression);

      activeElement.innerText = result;
      state[activeElement.id] = { ...state[activeElement.id], value: result };
    } catch (error) {
      console.error("Error evaluating expression:", error);
    }
  }
}