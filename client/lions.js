/* eslint-env es6 */
fetch("/lions/").then(d => d.json()).then(data => {
    data.forEach(addLion);
});

let template = document.getElementById("lionTemplate").content;
let parent = document.getElementById("app");

function test(){
  fetch("/lions").then(d=>d.json()).then(updateLions)
}
function updateLions(lions) {
    //TODO check existing, modify accordingly (delete/add/update?)
    //use property lastUpdated
  let htmlLions = document.querySelectorAll("article.lion");
  htmlLions.forEach(lion=>{
    //lion.dataset.id
    const index = lions.findIndex(i => i.id == lion.dataset.id);
    //console.log(index)
    if(index<0){
      parent.removeChild(lion);
    } else {
      if(lion.dataset.lastUpdated < lions[index].lastUpdated){
        updateLion(lion);  
      }
    }
  })
}

function addLion(lion) {
    let clone = template.cloneNode(true);
    clone.querySelector("h1").textContent = lion.name;
    clone.querySelector("h2 span").textContent = lion.age;
    clone.querySelector("h2 span:nth-child(2)").textContent = lion.gender;
    clone.querySelector("p").textContent = lion.pride;
    clone.querySelector(`article`).dataset.id = lion.id;
    clone.querySelector(`article`).dataset.lastUpdated = lion.lastUpdated;
    clone.querySelector('button.update').addEventListener('click', (e) => {
        let elem = e.target.parentElement; //.dataset.id
        document.querySelector("input[name=name]").value = elem.querySelector("h1").textContent;
        document.querySelector("input[name=age]").value = elem.querySelector("h2 span").textContent;
        document.querySelector(`input[value='${elem.querySelector("h2 span:nth-child(2)").textContent}']`).checked = true;
        document.querySelector("textarea[name=pride]").value = elem.querySelector("p").textContent;
        document.querySelector("form").setAttribute('action', `http://localhost:3000/lions/${elem.dataset.id}`);
        document.querySelector("form").dataset.id = elem.dataset.id;
        document.querySelector("input[value='Update']").classList.toggle("hidden");
        document.querySelector("input[value='Save']").classList.toggle("hidden");
    })
    clone.querySelector('button.delete').addEventListener('click', (e) => {
        fetch(`/lions/${e.target.parentElement.dataset.id}`, {
                method: "delete",
            })
            .then(d => d.json())
            .then(d => {
                parent.removeChild(document.querySelector(`article.lion[data-id='${d.id}']`)) //skal bruge ' her, hvorfor??
            });
    });
    parent.appendChild(clone);
}
let submitButton = document.querySelector("input[type='submit']");
submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    let lion = {
        name: document.querySelector("input[name=name]").value,
        age: document.querySelector("input[name=age]").value,
        gender: document.querySelector("input[name=gender]:checked").value,
        pride: document.querySelector("textarea[name=pride]").value
    }//TODO refractor into function getValues()
    //TODO optimistic insert, rollback on error?
    fetch("/lions", {
        method: "post",
        headers: {
            'Content-Type': 'application/json; charset=utf-8',//TODO charset not needed?
            "Accept":"application/json"
        },
        body: JSON.stringify(lion)
    }).then(d => d.json()).then(t => {
        addLion(t);
        clearForm();
    });
})

function clearForm() {
    document.querySelector("input[name=name]").value = '';
    document.querySelector("input[name=age]").value = '';
    document.querySelectorAll("input[name=gender]").forEach(i => i.checked = false);
    document.querySelector("textarea[name=pride]").value = ''
    document.querySelector("input[value='Update']").classList.add("hidden");
    document.querySelector("input[value='Save']").classList.remove("hidden");
}
//Edit, update, put
let updateButton = document.querySelector("input[value='Update']");
updateButton.addEventListener('click', (e) => {
    e.preventDefault();
    let lion = {
        name: document.querySelector("input[name=name]").value,
        age: document.querySelector("input[name=age]").value,
        gender: document.querySelector("input[name=gender]:checked").value,
        pride: document.querySelector("textarea[name=pride]").value
    }
    fetch(`/lions/${document.querySelector("form").dataset.id}`, {
        method: "put",
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(lion)
    }).then(d => d.json()).then(t => {
        updateLion(t);
        clearForm();
    });
})

function updateLion(lion) {
    let el = document.querySelector(`article[data-id='${lion.id}']`);
    el.querySelector("h1").textContent = lion.name;
    el.querySelector("span").textContent = lion.age;
    el.querySelector("span:nth-child(2)").textContent = lion.gender;
    el.querySelector("p").textContent = lion.pride;
    el.dataset.lastUpdated = lion.lastUpdated;
}