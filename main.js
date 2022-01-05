const input = document.querySelector(".input");
const container = document.querySelector(".container");
let checkbox = document.querySelector(".loadData");

let data;
input.addEventListener("change", handleFiles);
function handleFiles() {
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
        data = JSON.parse(e.target.result);
    };
    fileReader.readAsText(this.files[0]);
}
let isDataLoaded = false;
let keys;
checkbox.addEventListener("change", function (e) {
    let isChecked = e.target.checked;
    if (!data) {
        e.target.checked = false;
        return alert("Please select the file :)");
    }
    const { products } = data;
    let dataArr = [];
    if (isChecked && !isDataLoaded) {
        dataArr = getFullDataArray(products);
        keys = Object.keys(dataArr[0]);
        keys = keys.map((key, index) => {
            return { count: index + 1, key };
        });
        getAllFields(keys);
        isDataLoaded = true;
    }
});
const availableBox = document.querySelector(".available__box");
const displayBox = document.querySelector(".display__box ");

const add = document.querySelector(".add");
const remove = document.querySelector(".remove");
let availableFields = [];
let fieldsToBeDisplayed = [];

function getAllFields(keys) {
    keys.forEach(({ count, key: k }) => {
        const div = document.createElement("div");
        div.className = "field";
        div.innerText = k;
        availableBox.append(div);
        availableFields.push({ count, k });
    });
}

add.addEventListener("click", () => {
    const itemShouldAddIndex = fieldsToBeDisplayed.length;

    if (itemShouldAddIndex < keys.length || itemShouldAddIndex === 0) {
        const field = availableFields[itemShouldAddIndex];
        fieldsToBeDisplayed.push(field);
        addToFieldsToDisplay(fieldsToBeDisplayed);
    }
});
remove.addEventListener("click", () => {
    fieldsToBeDisplayed.pop();
    addToFieldsToDisplay(fieldsToBeDisplayed);
});

function addToFieldsToDisplay(fields) {
    displayBox.innerHTML = "";
    fields.forEach(({ count, k: key }) => {
        const div = document.createElement("div");
        div.className = "field";
        div.innerText = key;
        displayBox.append(div);
    });
}

const next = document.querySelector(".next");
const cancel = document.querySelector(".cancel");
let ultimateDataToBeShown = [];
next.addEventListener("click", () => {
    if (fieldsToBeDisplayed.length <= 0) {
        alert("Please select something to display data :)");
        return;
    }
    const { products } = data;
    const dataArr = getFullDataArray(products);
    let toBeShownFields = fieldsToBeDisplayed.map(({ count, k }) => {
        return k;
    });
    ultimateDataToBeShown = dataArr.map((eachData) => {
        let field = {};
        toBeShownFields.forEach((f) => {
            field[f] = eachData[f];
        });
        return field;
    });
    // console.log(ultimateDataToBeShown);
    createTable(ultimateDataToBeShown, toBeShownFields);
});
cancel.addEventListener("click", () => {
    location.reload();
});

function getFullDataArray(products) {
    let dataArr = [];
    for (let key in products) {
        const mobile = products[key];
        dataArr.push(mobile);
    }
    dataArr.sort((first, second) => {
        const firstPopularity = Number(first.popularity);
        const secondPopularity = Number(second.popularity);
        if (firstPopularity > secondPopularity) return -1;
        if (firstPopularity < secondPopularity) return 1;
        return 0;
    });
    return dataArr;
}

let table = document.createElement("table");
let thead = document.createElement("thead");
let tbody = document.createElement("tbody");

table.appendChild(thead);
table.appendChild(tbody);

function createTable(mobileData, fields) {
    let row = document.createElement("tr");
    fields.forEach((field) => {
        let heading = document.createElement("th");
        heading.innerText = field;
        row.append(heading);
    });
    thead.append(row);
    table.append(thead);
    table.append(tbody);
    container.innerHTML = "";
    container.classList.add("table__container");
    const button = document.createElement("button");
    button.innerText = "Load other data";
    button.addEventListener("click", () => {
        location.reload();
    });
    container.append(button);
    container.append(table);
    mobileData.forEach((mobile) => {
        let row = document.createElement("tr");
        fields.forEach((field) => {
            let data = document.createElement("td");
            data.innerText = mobile[field];
            row.append(data);
        });
        tbody.append(row);
    });
}
