const _STORAGE_KEY = "MY_BOOKSHELF_V1";
const _form = document.getElementById("input-book");
const _modal = document.getElementById("myModal");
const _vTitle = document.getElementById("iTitle");
const _vPenulis = document.getElementById("iPenulis");
const _vTahun = document.getElementById("iTahun");
const _vIsComplete = document.getElementById("iIsFinished");
const _vSearch = document.getElementById("iSearch");
const _toast = document.getElementById("toast");
const _dialogDelete = document.getElementById("dialogDelete");
let _itemId = "";
let _data = [];
let _btnRemove = ""

window.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById("defaultOpen").click();
    formDialog();

    if (isStorageExist()) {
        loadDataFromStorage();
    }

});

_vSearch.addEventListener("input", () => {
    let filter = _vSearch.value.toUpperCase();
    const lists = document.getElementsByClassName("list-container");
    let textValue = "";

    for (i = 0; i < lists.length; i++) {
        let title = lists[i].children[0].children[0].innerText
        let author = lists[i].children[0].children[1].innerText
        let year = lists[i].children[0].children[2].innerText

        textValue = title || author || year;
        if (textValue.toUpperCase().indexOf(filter) > -1) {
            lists[i].style.display = "";
        } else {
            lists[i].style.display = "none";
        }
    }
});

document.addEventListener("ondatamoved", () => {
    renderList();
    showMessage("Data berhasil dipindahkan", "green");
});

document.addEventListener("ondatadeleted", () => {
    renderList();
    showMessage("Data berhasil dihapus", "green");
});

document.addEventListener("ondatasaved", () => {
    closeForm();
    renderList();
    showMessage("Data berhasil disimpan", "green");
});

document.addEventListener("ondataloaded", () => {
    console.log("Data loaded.");
    renderList();
});

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false
    }
    return true;
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(_STORAGE_KEY);

    let aData = JSON.parse(serializedData);

    if (aData !== null)
        _data = aData;

    document.dispatchEvent(new Event("ondataloaded"));
}

function saveData(data, saveType) {
    localStorage.setItem(_STORAGE_KEY, data);

    if (saveType === "moveItem") {
        document.dispatchEvent(new Event("ondatamoved"));
    } else if (saveType === "deleteItem") {
        document.dispatchEvent(new Event("ondatadeleted"));
    } else {
        document.dispatchEvent(new Event("ondatasaved"));
    }
}


function renderList() {
    const containerUnfinished = document.getElementById("unfinished");
    const containerFinished = document.getElementById("finished");
    let listFinished = "";
    let listUnfinished = "";

    const dataUnfinished = _data.filter(items => {
        return items.isComplete === false;
    });

    const dataFinished = _data.filter(items => {
        return items.isComplete === true;
    });

    if (dataUnfinished.length > 0) {
        for (let item of dataUnfinished) {
            listUnfinished += `<div class="list-container">
                <div class="detail-wrapper font-fraunces">
                    <h3 class="title m-0">${item.title}</h3>
                    <span>Penulis : ${item.author}</span>
                    <span>Tahun : ${item.year}</span>
                </div>
                <div class="dropdown">
                    <span onclick="toggleDropdown(this.parentNode)" class="icon-more">
                        <svg class="icon line" width="24" height="24" id="more-vertical" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1" style="fill: none; stroke: rgb(168, 166, 168); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2.5;"></circle><circle cx="12" cy="12" r="1" style="fill: none; stroke: rgb(168, 166, 168); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2.5;"></circle><circle cx="12" cy="19" r="1" style="fill: none; stroke: rgb(168, 166, 168); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2.5;"></circle></svg>
                    </span>
                    <div class="dropdown-content">
                        <li>
                            <div onclick="moveItem(this, ${item.id}, 'finished')" style="display: flex; flex-direction: row; align-items: center; justify-content: flex-start;">
                                <svg class="icon line" width="16" height="16" id="check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polyline points="5 12 10 17 19 8" style="fill: none; stroke: rgb(237, 100, 18); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></polyline></svg>
                                <span style="margin-left: .5rem">
                                    Finished
                                </span>
                            </div>
                        </li>
                        <div class="separator"></div>
                        <li>
                            <div onclick="editItem(this, ${item.id})" style="display: flex; flex-direction: row; align-items: center; justify-content: flex-start;">
                                <svg class="icon line" width="16" height="16" id="edit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20,4a2.09,2.09,0,0,0-2.95.12L8.17,13,7,17l4-1.17L19.88,7A2.09,2.09,0,0,0,20,4Z" style="fill: none; stroke: rgb(237, 100, 18); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></path><line x1="21" y1="21" x2="3" y2="21" style="fill: none; stroke: rgb(237, 100, 18); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></line></svg>
                                <span style="margin-left: .5rem">
                                    Edit
                                </span>
                            </div>
                        </li>
                        <div class="separator"></div>
                        <li>
                            <div onclick="removeItem(this, ${item.id})" style="display: flex; flex-direction: row; align-items: center; justify-content: flex-start;">
                                <svg class="icon line" width="16" height="16" id="delete-alt" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4,7H20M16,7V4a1,1,0,0,0-1-1H9A1,1,0,0,0,8,4V7" style="fill: none; stroke: rgb(237, 100, 18); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></path><path d="M6,7H18a0,0,0,0,1,0,0V20a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V7A0,0,0,0,1,6,7Z" style="fill: none; stroke: rgb(237, 100, 18); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></path><line x1="10" y1="11" x2="10" y2="17" style="fill: none; stroke: rgb(237, 100, 18); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></line><line x1="14" y1="11" x2="14" y2="17" style="fill: none; stroke: rgb(237, 100, 18); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></line></svg>
                                <span style="margin-left: .5rem">
                                    Remove
                                </span>
                            </div>
                        </li>
                    </div>
                </div>
            </div>`;
        }
        containerUnfinished.innerHTML = listUnfinished;
    } else {
        containerUnfinished.innerHTML = `<div style="display: flex; height: calc(100vh - 13rem); flex-direction: column; align-content: center; justify-content: center; align-items: center;">
            <span class="font-fraunces" style="color: #A8A6A8; font-weight: 500; font-size: 1rem;">Tidak ada data</span>
        </div>`;
    }

    if (dataFinished.length > 0) {
        for (let item of dataFinished) {
            listFinished += `<div class="list-container">
                <div class="detail-wrapper font-fraunces">
                    <h3 class="title m-0">${item.title}</h3>
                    <span>Penulis : ${item.author}</span>
                    <span>Tahun : ${item.year}</span>
                </div>
                <div class="dropdown">
                    <span onclick="toggleDropdown(this.parentNode)" class="icon-more">
                        <svg class="icon line" width="24" height="24" id="more-vertical" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1" style="fill: none; stroke: rgb(168, 166, 168); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2.5;"></circle><circle cx="12" cy="12" r="1" style="fill: none; stroke: rgb(168, 166, 168); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2.5;"></circle><circle cx="12" cy="19" r="1" style="fill: none; stroke: rgb(168, 166, 168); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2.5;"></circle></svg>
                    </span>
                    <div class="dropdown-content">
                        <li>
                            <div onclick="moveItem(this, ${item.id}, 'unfinished')" style="display: flex; flex-direction: row; align-items: center; justify-content: flex-start;">
                                <svg class="icon line" width="16" height="16" id="rotate-left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7,17.29A8,8,0,1,0,5.06,11" style="fill: none; stroke: rgb(237, 100, 18); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></path><polyline points="3 6 5 11 10 9" style="fill: none; stroke: rgb(237, 100, 18); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></polyline></svg>
                                <span style="margin-left: .5rem">
                                    Unfinished
                                </span>
                            </div>
                        </li>
                        <div class="separator"></div>
                        <li>
                            <div onclick="editItem(this, ${item.id})" style="display: flex; flex-direction: row; align-items: center; justify-content: flex-start;">
                                <svg class="icon line" width="16" height="16" id="edit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20,4a2.09,2.09,0,0,0-2.95.12L8.17,13,7,17l4-1.17L19.88,7A2.09,2.09,0,0,0,20,4Z" style="fill: none; stroke: rgb(237, 100, 18); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></path><line x1="21" y1="21" x2="3" y2="21" style="fill: none; stroke: rgb(237, 100, 18); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></line></svg>
                                <span style="margin-left: .5rem">
                                    Edit
                                </span>
                            </div>
                        </li>
                        <div class="separator"></div>
                        <li>
                            <div onclick="removeItem(this, ${item.id})" style="display: flex; flex-direction: row; align-items: center; justify-content: flex-start;">
                                <svg class="icon line" width="16" height="16" id="delete-alt" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4,7H20M16,7V4a1,1,0,0,0-1-1H9A1,1,0,0,0,8,4V7" style="fill: none; stroke: rgb(237, 100, 18); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></path><path d="M6,7H18a0,0,0,0,1,0,0V20a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V7A0,0,0,0,1,6,7Z" style="fill: none; stroke: rgb(237, 100, 18); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></path><line x1="10" y1="11" x2="10" y2="17" style="fill: none; stroke: rgb(237, 100, 18); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></line><line x1="14" y1="11" x2="14" y2="17" style="fill: none; stroke: rgb(237, 100, 18); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></line></svg>
                                <span style="margin-left: .5rem">
                                    Remove
                                </span>
                            </div>
                        </li>
                    </div>
                </div>
            </div>`;
        }
        containerFinished.innerHTML = listFinished;
    } else {
        containerFinished.innerHTML = `<div style="display: flex; height: calc(100vh - 13rem); flex-direction: column; align-content: center; justify-content: center; align-items: center;">
            <span class="font-fraunces" style="color: #A8A6A8; font-weight: 500; font-size: 1rem;">Tidak ada data</span>
        </div>`;
    }

}

function moveItem(elm, id, to) {
    elm.parentNode.parentNode.classList.toggle("block");
    _data.forEach(item => {
        if (item.id === id) {
            item.isComplete = to === "finished" ? true : false;
        }
    });

    const data = JSON.stringify(_data);
    saveData(data, "moveItem");
}

function editItem(el, id) {
    const aData = _data.filter(data => {
        return data.id === id;
    });

    _itemId = aData[0].id;
    _vTitle.value = aData[0].title;
    _vPenulis.value = aData[0].author;
    _vTahun.value = aData[0].year;
    _vIsComplete.checked = aData[0].isComplete;

    el.parentNode.parentNode.classList.toggle("block");
    openForm("Edit Buku");
}

function cancelRemove() {
    _dialogDelete.style.display = "none";
}

function confirmRemove() {
    _dialogDelete.style.display = "none";
    _btnRemove.parentNode.parentNode.classList.toggle("block");

    _data.splice(_data.findIndex(function (data) {
        return data.id === _itemId;
    }), 1);

    const data = JSON.stringify(_data);
    saveData(data, "deleteItem");
}

function removeItem(elm, id) {
    _itemId = id;
    _btnRemove = elm;
    _dialogDelete.style.display = "block";
}

function btnSearch(elm) {
    const logo = document.getElementById("logo");
    const inputSearch = document.getElementById("input-search");

    if (logo.classList.contains("none")) {
        inputSearch.childNodes[1].blur();
        _vSearch.value = "";
        renderList();
    }

    elm.children[0].classList.toggle("none");
    elm.children[1].classList.toggle("none");
    logo.classList.toggle("none");
    inputSearch.classList.toggle("block");
    inputSearch.childNodes[1].focus();
}

function submitForm(event) {
    event.preventDefault()

    if (_itemId !== "") {
        _data.forEach(item => {
            if (item.id === _itemId) {
                item.title = _vTitle.value,
                item.author = _vPenulis.value,
                item.year = _vTahun.value,
                item.isComplete = _vIsComplete.checked
            }
        });
    } else {
        let obj = {
            id: +new Date(),
            title: _vTitle.value,
            author: _vPenulis.value,
            year: _vTahun.value,
            isComplete: _vIsComplete.checked
        }
        _data.push(obj);
    }

    const data = JSON.stringify(_data);
    saveData(data, "newOrUpdateItem");
}

function toggleDropdown(el) {
    el.childNodes[3].classList.toggle("block");
}

function openTab(pageName, elmnt) {
    const tabcontent = document.getElementsByClassName("tabcontent");
    const tablinks = document.getElementsByClassName("tablink");

    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    document.getElementById(pageName).style.display = "block";
    elmnt.classList.toggle("active");
}

function formDialog() {
    const btnAdd = document.getElementById("btnTambahBuku");
    const btnClose = document.getElementsByClassName("close")[0];

    btnAdd.onclick = function () {
        openForm("Tambah Buku");
    }

    btnClose.onclick = function () {
        closeForm();
    }

    window.onclick = function (event) {
        if (event.target == _modal) {
            closeForm();
        }

        if (event.target == _dialogDelete) {
            _dialogDelete.style.display = "none";
        }
    }
}

function closeForm() {
    _modal.style.display = "none";
    _itemId = "";
    _form.reset();
}

function openForm(formTitle) {
    const modalTitle = document.getElementById("modal-title");

    modalTitle.innerText = formTitle;
    _modal.style.display = "block";
    _form.children[0].children[0].children[1].focus();
}

function showMessage(message, bgColor) {
    _toast.innerText = message;
    _toast.style.backgroundColor = bgColor;
    _toast.classList.toggle("show");
    setTimeout(() => {
        _toast.classList.toggle("show");
    }, 3000);
}