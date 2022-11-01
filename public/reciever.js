const socket = io();
socket.on('connect', () => {
    console.log('Connected to server');
});


const button = document.querySelector('#join-button');
const join_container = document.querySelector('#join-container');
const room = document.querySelector('#room');
const output = document.querySelector('#output')
const filelist = document.querySelector('#file-list');



button.addEventListener('click', () => {
    console.log(room.value);
    socket.emit('reciever-join', room.value);
});

socket.on('error',(err)=>{
    alert(err.message)
})

socket.on('join-sucess',(data)=>{
    console.log(data.message +" "+ data.id);
    join_container.innerHTML = `You have joined ${data.id}`
})

socket.on('metadata',(data)=>{
    console.log(data);
    filelist.innerHTML = `<li><ul><li> Name : ${data.name}</li><li> Size : ${data.size} bytes</li><li> Type : ${data.type}</li></ul></li>`
})

socket.on('file',(file)=>{
    let blob = new Blob([new Uint8Array(file.data)])
    let anc= document.createElement('a');
    anc.href =window.URL.createObjectURL(blob);
    // window.location = window.URL.createObjectURL(blob);
    anc.download= `${file.name}`
    anc.target = '_blank'
    anc.click()
    window.URL.revokeObjectURL(anc.href);
})