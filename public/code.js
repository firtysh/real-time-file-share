(function () {
  let receiverID;
  const socket = io();
  function generateID() {
    return `${Math.trunc(Math.random() * 999)}-${Math.trunc(
      Math.random() * 999
    )}-${Math.trunc(Math.random() * 999)}`;
  }


  document.querySelector("#file-btn1").addEventListener("click", function () {
    let joinID = generateID();
    document.querySelector("#room").innerHTML = `
    <span>${joinID}</span>
    `;
    socket.emit("sender-join", {
      uid: joinID,
    });
  });

  socket.on("init", function (uid) {
    receiverID = uid;
  
  });

    document
      .querySelector("#file-input")
      .addEventListener("change", function (e) {
        let file = e.target.files[0];
        if (!file) {
          return;
        }
        let reader = new FileReader();
        reader.onload= function (e) {
          let buffer = new Uint8Array(reader.result);
          let el = document.createElement("div");
          el.classList.add("item");
          el.innerHTML = `
              // <div class="progress">0%</div>
              <div class="filename">${file.name}</div>
          `;
          document.querySelector(".files-list").appendChild(el);
          shareFile(
            {
              filename: file.name,
              total_buffer_size: buffer.length,
              buffer_size: 1024,
            },
            buffer
          )
        }
        reader.readAsArrayBuffer(file);
      });

  function shareFile(metadata, buffer) {
    socket.emit("file-meta", {
      uid: receiverID,
      metadata: metadata,
    });
    socket.on("fs-share", function () {
      let chunk = buffer.slice(0, metadata.buffer_size);
      buffer = buffer.slice(metadata.buffer_size, buffer.length);

      if (chunk.length != 0) {
        socket.emit("file-raw", {
          uid: receiverID,
          buffer: chunk,
        });
      }else{
      console.log("Sent file successfully");
      }
    });
  }
  const span = document.querySelector("#room");

span.addEventListener("click", () => {
    navigator.clipboard.writeText(span.textContent);
});
})();
