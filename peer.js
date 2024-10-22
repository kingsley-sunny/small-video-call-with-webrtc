// const users = [];

// window.onload = async () => {
//   const button = document.querySelector("#connect");
//   const endCall = document.querySelector("#end-call");

//   const name = prompt("What is your name");

//   // first get the user navigator devices

//   const stream = await getUserMedia();
//   console.log("🚀 ~~ window.onload= ~~ stream:", stream);

//   // then render the stream
//   renderVideoElement(stream, "main-user");

//   const peer = new Peer(name, {
//     config: {
//       iceServers: [
//         { url: "stun:stun1.1.google.com:19302" },
//         { url: "stun:stun2.1.google.com:19302" },
//       ],
//     },
//   });

//   console.log(peer);

//   peer.on("open", id => {
//     users.push(id);
//     renderText(id);
//   });

//   peer.on("call", call => {
//     call.answer(stream);
//     console.log("🚀 ~~ window.onload= ~~ on call:", stream?.getVideoTracks()[0]);

//     call.on("stream", remoteStream => {
//       console.log("🚀 ~~ window.onload= ~~ remoteStream:", remoteStream?.getVideoTracks()[0]);

//       renderVideoElement(remoteStream, "remote-user", false);
//     });
//   });

//   peer.on("close", call => {
//     document.getElementById("remote-user").remove();
//   });

//   // get the button
//   button.addEventListener("click", async () => {
//     const userId = document.querySelector("#user-id")?.value;

//     if (!userId) {
//       alert("Please enter a user-id");
//       return;
//     }

//     const call = peer.call(userId, stream);

//     call.on("stream", remoteStream => {
//       console.log(
//         "🚀 ~~ button.addEventListener ~~ remoteStream:",
//         remoteStream?.getVideoTracks()[0]
//       );
//       renderVideoElement(remoteStream, "remote-user", false);
//     });
//   });

//   endCall.addEventListener("click", async () => {
//     peer.destroy();
//   });
// };

// const renderVideoElement = (stream, id, muted = true) => {
//   console.log("🚀 ~~ renderVideoElement ~~ stream:", stream?.getVideoTracks()[0]);

//   const videos = document.getElementById("videos");
//   let video = document.getElementById(id);
//   if (!video) {
//     video = document.createElement("video");
//   }

//   video.autoplay = true;
//   video.muted = muted;
//   video.srcObject = stream;
//   video.id = id;
//   video.addEventListener("loadedmetadata", () => {
//     video.play();
//   });

//   videos.appendChild(video);
//   return video;
// };

// const renderText = text => {
//   const p = document.createElement("p");
//   p.innerText = "Name: " + text;
//   document.querySelector("h2").appendChild(p);
//   return p;
// };

// const getUserMedia = async () => {
//   const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//   return stream;
// };
