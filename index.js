let myLeads = []
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
        myLeads.push(tabs[0].url)
        localStorage.setItem("myLeads", JSON.stringify(myLeads) )
        render(myLeads)
    })
})

// function addDelete(lead) {
//     lead.addEventListener("mouseover", () => {

//     })
// }

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
                <button class='delete' onclick='deleteLi(this)'>DELETE</button>
            </li>
        `
    }
    ulEl.innerHTML = listItems
    for(let i = 0; i < leads.length; i++) {
        if (ulEl.children[i].nodeName.toLowerCase() === 'li') {
            addEventsDragAndDrop(ulEl.children[i])
        }
    }
}

function deleteLi(button) {
    console.log(button.parentNode.children[0].children[0].innerText)
    myLeads = myLeads.filter((lead) => lead !== button.parentNode.children[0].children[0].innerText)
    button.parentNode.remove()
    localStorage.clear()
    localStorage.setItem("myLeads", JSON.stringify(myLeads))
}

deleteBtn.addEventListener("dblclick", function() {
    localStorage.clear()
    myLeads = []
    render(myLeads)
})

inputBtn.addEventListener("click", function() {
    if (inputEl.value != "") {
        myLeads.push(inputEl.value)
        inputEl.value = ""
        localStorage.setItem("myLeads", JSON.stringify(myLeads) )
        render(myLeads)
    }
})

function dragStart(e) {
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
  e.dataTransfer.dropEffect = 'move';
  return false;
}
 
function dragDrop(e) {
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

function addEventsDragAndDrop(el) {
  el.addEventListener('dragstart', dragStart, false);
  el.addEventListener('dragenter', dragEnter, false);
  el.addEventListener('dragover', dragOver, false);
  el.addEventListener('dragleave', dragLeave, false);
  el.addEventListener('drop', dragDrop, false);
  el.addEventListener('dragend', dragEnd, false);
}

