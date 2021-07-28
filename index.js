let myLeads = []
let dragging, draggedOver
const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")
const leadsFromLocalStorage = JSON.parse( localStorage.getItem("myLeads") )
const tabBtn = document.getElementById("tab-btn")
let listItens = document.querySelectorAll('.draggable');
[].forEach.call(listItens, function(item) {
  addEventsDragAndDrop(item);
});


deleteBtn.addEventListener("mouseover", () => {
    deleteBtn.textContent = 'Double Click'
    setTimeout(() => {
        deleteBtn.textContent = 'DELETE ALL'
    }, 1000)
}, false)

if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage
    render(myLeads)
}

tabBtn.addEventListener("click", function(){   
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        // myLeads.push(tabs[0].url)
        // localStorage.setItem("myLeads", JSON.stringify(myLeads) )
        // render(myLeads)
        addItem(tabs[0].url)
    })
})

// function addDelete(lead) {
//     lead.addEventListener("mouseover", () => {

//     })
// }

function addItem(lead) {
    myLeads.push(lead)
    localStorage.setItem("myLeads", JSON.stringify(myLeads))
    let listItem =`
                <div class="test-div">
                    <a target='_blank' href='${lead}'>
                        ${lead}
                    </a>
                </div>
                <button class='delete'>DELETE</button>
        `
    let li = document.createElement('li');
    li.setAttribute('class', 'draggable')
    li.setAttribute('draggable', 'true')
    li.innerHTML = listItem
    ulEl.appendChild(li)
    addEventsDragAndDrop(li)
    li.children[1].addEventListener('click', () => {
            myLeads = myLeads.filter((leadL) => leadL !== lead)
            li.remove()
            localStorage.clear()
            localStorage.setItem("myLeads", JSON.stringify(myLeads))
    })
}

function render(leads) {
    let listItems = ""
    for (let i = 0; i < leads.length; i++) {
        listItems += `
            <li class='draggable' draggable='true'>
                <div class="test-div">
                    <a target='_blank' href='${leads[i]}'>
                        ${leads[i]}
                    </a>
                </div>
                <button class='delete'>DELETE</button>
            </li>
        `
    }
    ulEl.innerHTML = listItems
    for(let i = 0; i < leads.length; i++) {
        if (ulEl.children[i].nodeName.toLowerCase() === 'li') {
            addEventsDragAndDrop(ulEl.children[i])
            ulEl.children[i].children[1].addEventListener('click', () => {
                myLeads = myLeads.filter((lead) => lead !== ulEl.children[i].children[0].innerText)
                ulEl.children[i].remove()
                localStorage.clear()
                localStorage.setItem("myLeads", JSON.stringify(myLeads))
        })
        }
    }
}

// function deleteLi(button) {
//     console.log(button.parentNode)
//     button.addEventListener('click', () => {
//         myLeads = myLeads.filter((lead) => lead !== this.parentNode.children[0].children[0].innerText)
//         this.parentNode.remove()
//         localStorage.clear()
//         localStorage.setItem("myLeads", JSON.stringify(myLeads))
//     })
    
// }

deleteBtn.addEventListener("dblclick", function() {
    localStorage.clear()
    myLeads = []
    render(myLeads)
})

inputBtn.addEventListener("click", function() {
    if (inputEl.value != "") {
        // myLeads.push(inputEl.value)
        // localStorage.setItem("myLeads", JSON.stringify(myLeads))
        addItem(inputEl.value)
        inputEl.value = ""
        // render(myLeads)
    }
})

function dragStart(e) {
    setDragging(e)
    this.style.opacity = '0.4';
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
};
 
function dragEnter(e) {
    this.classList.add('over');
}
 
function dragLeave(e) {
    e.stopPropagation();
    this.classList.remove('over');
}
 
function dragOver(e) {
    e.preventDefault();
    draggedOver = e.target.children[0].innerText
    console.log(draggedOver)
    e.dataTransfer.dropEffect = 'move';
    return false;
}
 
function dragDrop(e) {
    const index1 = myLeads.indexOf(dragging)
    const index2 = myLeads.indexOf(draggedOver)
    myLeads.splice(index1, 1, draggedOver)
    myLeads.splice(index2, 1, dragging)
    console.log(myLeads)
    localStorage.clear()
    localStorage.setItem('myLeads', JSON.stringify(myLeads))
    if (dragSrcEl != this) {
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');
    }
    return false;
}
 
function dragEnd(e) {
  let listItens = document.querySelectorAll('.draggable');
  [].forEach.call(listItens, function(item) {
    item.classList.remove('over');
  });
  this.style.opacity = '1';
}

const setDragging = (e) => {
    dragging = e.target.children[0].innerText
    console.log(dragging)
};

const test = (a,b,c) => a+b+c;

function addEventsDragAndDrop(el) {
//   el.addEventListener('drag', setDragging)
  el.addEventListener('dragstart', dragStart, false);
  el.addEventListener('dragenter', dragEnter, false);
  el.addEventListener('dragover', dragOver, false);
  el.addEventListener('dragleave', dragLeave, false);
  el.addEventListener('drop', dragDrop, false);
  el.addEventListener('dragend', dragEnd, false);
}

