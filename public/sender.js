const socket = io();

socket.on('connect', () => {
    room.textContent=socket.id
});

const fileButton = document.querySelector('#file-btn');
const file = document.querySelector('#file')
const room = document.querySelector('#room')
const receiver_list = document.querySelector('#rec-list')

file.addEventListener('change',(e)=>{
    console.log(e.target.files[0]);
    socket.emit('metadata',{name : file.files[0]?.name,size:file.files[0]?.size,type:file.files[0]?.type})
})

fileButton.addEventListener('click',()=>{
    socket.emit('file',{data :file.files[0],type : file.files[0]?.type,name:file.files[0]?.name})
    // const reader = new FileReader()
    // reader.onload = ()=>{
    //     console.log(reader.result);
    // }
    // reader.readAsArrayBuffer(file.files[0])
})

socket.on('init',(data)=>{
    console.log(data);
    // receiver=data.id;
    receiver_list.innerHTML += `<li>${data.id}</li>`
})

const span = document.querySelector("#room");

span.addEventListener("click", () => {
    navigator.clipboard.writeText(span.textContent);
});
