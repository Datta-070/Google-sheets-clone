const header=document.getElementById("header");
const snoContainer=document.getElementById("sno");
const bodyContainer=document.getElementById("body-container");
let activeCellId=null;
const activeCellElement=document.getElementById("active-cell");
const form=document.querySelector(".form");
const state={};
form.addEventListener("change", onChangeFormData);

const content = "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Pariatur, deserunt?"

const columns=27, rows=100;
for(let i=1;i<columns;i++){
    const headCell=document.createElement("div");
    headCell.className="head-cell";
    headCell.innerText= String.fromCharCode(64+i);
    header.appendChild(headCell);
}

for(let i=1;i<=rows;i++){
    const snoCell=document.createElement("div");
    snoCell.innerText= i;
    snoCell.className="sno-cell";
    snoContainer.appendChild(snoCell);
}

for(let row=1;row<=rows;row++){
    const rowElement=document.createElement("div");
    rowElement.className="row";

    for(let col=1;col<columns;col++){
        const cell=document.createElement("div");
        cell.className="cell";
        cell.contentEditable=true;
        cell.id=`${String.fromCharCode(64 + col)}${row}`;
        rowElement.appendChild(cell);
        cell.addEventListener("focus", onFocusCell)
    }
    bodyContainer.appendChild(rowElement);
}

function onChangeCellText(event) {
    let changedText = event.target.innerText;
    if (state[activeCellId]) {
        state[activeCellId].text = changedText;
    }
    else {
        state[activeCellId] = { ...defaultStyles, text: changedText };
    }
}

function onFocusCell(event){
    activeCellId=event.target.id;
    activeCellElement.innerText=activeCellId;

    if(state[activeCellId]){
        resetForm(state[activeCellId])
    }
    else{
        resetForm(defaultStyles);
    }
}

const defaultStyles={
align:"left",
bgColor:"#ffffff",
fontFamily:"poppins-regular",
fontSize:16,
isBold:true,
isItalic:false,
isUnderline:false,
textColor:"#000000",
}
function onChangeFormData(){
    const options={
        fontFamily:form["fontFamily"].value,
        fontSize:form["fontSize"].value+"px",
        isBold:form["isBold"].checked,
        isItalic:form["isItalic"].checked,
        isUnderline:form["isUnderline"].checked,
        align:form.align.value,
        textColor:form["textColor"].value,
        bgColor:form["bgColor"].value,

    };
    applyStyles(options);
}
function applyStyles(styles){
    if(!activeCellId){
        form.reset();
        alert("Please select a cell to apply");
        return;
    }
    const activeCell= document.getElementById(activeCellId);
    activeCell.style.color= styles.textColor;
    activeCell.style.backgroundColor= styles.bgColor;
    activeCell.style.textAlign= styles.align;
    activeCell.style.fontWeight= styles.isBold ?"600":"400";
    activeCell.style.fontFamily= styles.fontFamily;
    activeCell.style.fontSize= styles.fontSize;
    activeCell.style.textDecoration=styles.isUnderline ? "underline":"none";
    activeCell.style.fontStyle=styles.isItalic ? "italic":"normal";

    state[activeCellId]={...styles, text: activeCell.innerText  };
}

function resetForm(styles) {

    form.fontSize.value = styles.fontSize;
    form.fontFamily.value = styles.fontFamily;
    form.isBold.checked = styles.isBold;
    form.isItalic.checked = styles.isItalic;
    form.isUnderline.checked = styles.isUnderline;
    form.align.value = styles.align;
    form.textColor.value = styles.textColor;
    form.bgColor.value = styles.bgColor;
}

function downloadContent() {

const blob = new Blob([content], { type: "text/plain" });
    console.log(blob);
    const url = URL.createObjectURL(blob);
    console.log(url);

    const link = document.createElement("a");
    link.href = url;
    link.download = "temp.txt";
    link.click();
}

function exportData() {

    const jsonData = JSON.stringify(state);
    const blob = new Blob([jsonData], { type: "text/plain" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "data.json";
    link.href = url;
    link.click();
}