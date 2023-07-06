const db = firebase.firestore();

// here we give data
const form = document.querySelector('#task-form')

// here we display data
const taskscontainer = document.querySelector('#tasks-container');

let editStatus = false;
let id = '';

// save task 

const saveTask = (title,description)=>{
    db.collection('tasks').doc().set({
        title,
        description
    })
}

//get tasks

// const getTask = ()=> db.collection('tasks').get()
const onGetTasks = (callback) => db.collection('tasks').onSnapshot(callback);
const deleteTask = (id) => db.collection('tasks').doc(id).delete();

// get tasks ( for update portion)

const getTasks = (id) => db.collection('tasks').doc(id).get();

const updateTask = (id,updateTask)=>{
    db.collection('tasks').doc(id).update(updateTask);
}

// window load
window.addEventListener('DOMContentLoaded', async(e)=>{
    // const queryShot= await getTask()   // for test
    // console.log(queryShot);   //  for test
    

    onGetTasks((querySnapShot)=>{

        taskscontainer.innerHTML = '';

       querySnapShot.forEach(doc => {
         const task = doc.data()

         task.id = doc.id
        //  console.log(task);
        taskscontainer.innerHTML += `
        <div class='box'>
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <div class='btn-group'>
             <button class='btn-delete' data-id = '${task.id}'>Delete</button>
             <button class='edit-btn'  data-id = '${task.id}'>Edit</button>
            </div>
        </div>
        `

        // delete items
        const btnDelete = document.querySelectorAll('.btn-delete');

        btnDelete.forEach((btn)=>{
            btn.addEventListener('click',async(e)=>{
                const idTask = e.target.dataset.id
                await deleteTask(idTask);
                alert('Godd Job', 'Deleted');
            })
        })
         // uptade Data 
         const btnEdit = document.querySelectorAll('.edit-btn');

         btnEdit.forEach((btn)=>{
            btn.addEventListener('click',async(e)=>{
                const idTask = e.target.dataset.id;
                const doc = await getTasks(idTask);
                const task = doc.data();
                editStatus = true;
                id = idTask;

                form['task-title'].value = task.title;
                form['task-description'].value = task.description;
                form['btn-task-form'].innerHTML = 'Update';
            })
         })
    

       });
    })
})

// function add task
form.addEventListener('submit',async(e)=>{
    e.preventDefault()

    const title = form['task-title'];
    const description = form['task-description'];

    if(!editStatus){
        if(title.value === '' || description.value ==''){
            // swal('warning','Fill All Fields','warning')
            alert('please fill the blanks');
        }else{
            await saveTask(title.value,description.value);
            alert('Godd Job');
        }
    }else{
        if(title.value === '' || description.value === ''){
            alert('please fill the blanks');
        }else{
            await updateTask(id,{
                title:title.value,
                description:description.value
            })
            alert('Godd Job', 'Update Successfully');
            editStatus = false;
            id = '';
        }
    }
    form.reset();
    title.focus();
})


// else{
//     if(title.value ==== '' || description.value ===''){
//         alert('please fill the blanks');
//     }else{
//         await updateTask(id,{
//             title:title.value,
//             description:description.value
//         })
//         alert('Godd Job','Update Successfully');
//     }
// }