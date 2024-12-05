// const state = {
//     taskList : [
//         {
//             imageurl: "",
//             taskTitle: "",
//             taskType: "",
//             taskdescription: "",
//         },
//         {
//             imageurl: "",
//             taskTitle: "",
//             taskType: "",
//             taskdescription: "",
//         },
//         {
//             imageurl: "",
//             taskTitle: "",
//             taskType: "",
//             taskdescription: "",
//         },
//         {
//             imageurl: "",
//             taskTitle: "",
//             taskType: "",
//             taskdescription: "",
//         },
//     ]
// }

const state = {
    taskList: [],
};

// DOM

const taskContents = document.querySelector(".task__container");
const taskmodel = document.querySelector(".task_model_body");


const htmltaskcontent = ({id, title, description, type, url}) =>`
    <div class="col-md-6 col-lg-4 mt-3 id=${id} key=${id}">
        <div class="card shadow-sm task__card">
            <div class="card-header d-flex justify-content-end task_card_header gap-2">
                <button type="button" class="btn btn-outline-primary mr-2" name=${id} onclick = "editTask.apply(this, arguments)">
                <i class="fa-solid fa-pencil" name=${id}></i>
                </button>
                <button type="button" class="btn btn-outline-danger mr-2" name=${id} onclick = "deleteTask.apply(this, arguments)">
                <i class="fa-solid fa-trash" name=${id}></i>
                </button>
            </div> 


             <div class="card-body">
             ${
            url ? `<img src = ${url} width="100%" height="180px" alt="card image cap" class="card-img-top md-3 rounded-md" /> `
            : 
              `<img src = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" width="100%" height="180px"/> `
             }

            <h5 class="card-title">${title}</h5>
            <p class="card-text">${description}</p>
                    <div class="tags text-white d-flex flex-wrap">
                    <span class="badge text-bg-primary m-1">${type}</span>
                    </div>
            </div>
                  <div class="card-footer">
                  <button type ="button" class="btn btn-outline-primary float-right" data-bs-toggle="modal" data-bs-target="#showtask" id=${id} onclick="openTask.apply(this, arguments)" ${console.log("id: ", id)}> Open Task </button> 
                 
                  </div>
        </div>
    </div>

`

const htmlmodecontent = ({id, title, description, url}) => {
    const date = new Date(parseInt(id));
    return`
        <div id=${id}>
            ${
                url ? `<img src = ${url} width="100%" alt="model image cap" class="img-fluid mb-3" /> `
                : `<img src = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" width="100%" alt="model image cap" class="img-fluid mb-3" /> `
            }
            <strong class="text-muted text-sm"> Created on:${date.toDateString()} </strong>
            <h2 class="my-3">${title}</h2>
            <p class="lead">${description}</p>
        </div>
    `
}



const updateLocalStorage = () => {
    localStorage.setItem('task', JSON.stringify({
        tasks: state.taskList
    }))
}

const loadInitialData = () => {
    const localStorageCopy = JSON.parse(localStorage.task);

    if(localStorageCopy) state.taskList = localStorageCopy.tasks;  
    state.taskList.map((cardData)=>{
        taskContents.insertAdjacentHTML("beforeend",htmltaskcontent(cardData))
    })
}

const handleSubmit =() =>{
    const id = `${Date.now()}`;

    const input = {
        url: document.getElementById(imageurl).value, 
        title: document.getElementById(task_title).value,
        description: document.getElementById(task_description).value,
        type: document.getElementById(task_type).value,
    };

    if(input.title =='' || input.description==''  || input.type == ''){
        return alert("please all required fields")
    }

    taskContents.insertAdjacentHTML("beforeend",htmltaskcontent({...input,id}))

    state.taskList.push({...input,id});
    updateLocalStorage()
}

const openTask = (e) =>{
    if(!e) e = window.event;

    const getTask = state.taskList.find(({id}) => id === e.target.id);

    console.log("target: ", e.target.id)
    taskmodel.innerHTML = htmlmodecontent(getTask)
}

const deleteTask = (e) =>{
    if(!e) e = window.event;

    const targetId = e.target.getAttribute('name');
    const type = e.target.tagName;
    // console.log(type)

    const removeTask = state.taskList.filter(({id}) => id !== targetId);
    console.log(removeTask)
    state.taskList = removeTask;

    updateLocalStorage()


    if(type === "BUTTON"){
        console.log(e.target.parentNode.parentNode.parentNode);
        return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
            e.target.parentNode.parentNode.parentNode
        )
    }

    return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
        e.target.parentNode.parentNode.parentNode.parentNode
    )

}    


const editTask = (e) =>{
    if(!e) e = window.event;

    const targetId = e.target.id;
    const type = e.target.tagName

    let parentNode;
    let taskTitle;
    let taskDescription;
    let taskType;
    let submitButton;

    if(type === "BUTTON"){
        parentNode = e.target.parentNode.parentNode
    }else{
        parentNode = e.target.parentNode.parentNode.parentNode
    }

    taskTitle = parentNode.childNodes[3].childNodes[3];
    taskDescription = parentNode.childNodes[3].childNodes[5];
    taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    // console.log(taskTitle)

    submitButton = parentNode.childNodes[5].childNodes[1];

    taskTitle.setAttribute("contenteditable","true")
    taskDescription.setAttribute("contenteditable","true")
    taskType.setAttribute("contenteditable","true")

    submitButton.setAttribute('onclick', "saveEdit.apply(this, arguments)");
    submitButton.removeAttribute("data-bs-toggle");
    submitButton.removeAttribute("data-bs-target");
    submitButton.innerHTML = "Save Changes"
    
}

const saveEdit = (e) => {
    if(!e) e = window.event;

    const targetId = e.target.id;
    const parentNode = e.target.parentNode.parentNode;
    // console.log(parentNode)
    const taskTitle = parentNode.childNodes[3].childNodes[3];
    const taskDescription = parentNode.childNodes[3].childNodes[5];
    const taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    const submitButton = parentNode.childNodes[5].childNodes[1];

    const updateDate = {
        taskTitle: taskTitle.innerHTML,
        taskDescription: taskDescription.innerHTML,
        taskType: taskType.innerHTML
    }

    let stateCopy = state.taskList;

    stateCopy = stateCopy.map((task)=>task.id==targetId? {url : task.url,
        id: task.id,
        title: updateDate.taskTitle,
        Description: updateDate.taskDescription,
        type:updateDate.taskDescription} : task)

        state.taskList = stateCopy;
        updateLocalStorage()
    
    taskTitle.setAttribute("contenteditable","false")
    taskDescription.setAttribute("contenteditable","false")
    taskType.setAttribute("contenteditable","false")

    submitButton.setAttribute('onclick', "openTask.apply(this, arguments)");
    submitButton.setAttribute("data-bs-toggle" ,"modal");
    submitButton.setAttribute("data-bs-target", "#showtask");
    submitButton.innerHTML = "Open Task"
}


const searchTask = (e) => {
    if(!e) e = window.event;
    while(taskContents.firstChild){
        taskContents.removeChild(taskContents.firstChild)
    }

    const resultData = state.taskList.filter(({title})=> title.toLowerCase().includes(e.target.value))
    
    resultData.map((cardData)=> {taskContents.insertAdjacentHTML("beforeend",htmltaskcontent(cardData))})
}