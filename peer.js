const users = [];

window.onload = async () => {
  const button = document.querySelector("#connect");
  const endCall = document.querySelector("#end-call");

  const name = prompt("What is your name");

  // first get the user navigator devices
  // const videoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  // const audioStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });

  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

  const peer = new Peer(name, {
    config: {
      iceServers: [
        { url: "stun:stun1.1.google.com:19302" },
        { url: "stun:stun2.1.google.com:19302" },
      ],
    },
  });

  let peerCall;

  console.log(peer.id);
  // then render the stream
  renderVideoElement(stream, "main-user");

  peer.on("open", id => {
    users.push(id);
    renderText(id);
  });

  peer.on("call", call => {
    call.answer(stream);

    call.on("stream", remoteStream => {
      renderVideoElement(remoteStream, "remote-user", false, peer);
    });
  });

  peer.on("close", call => {
    document.getElementById("remote-user").remove();
  });

  // get the button
  button.addEventListener("click", async () => {
    const userId = document.querySelector("#user-id")?.value;

    if (!userId) {
      alert("Please enter a user-id");
      return;
    }

    peerCall = peer.call(userId, stream);

    peerCall.on("stream", remoteStream => {
      renderVideoElement(remoteStream, "remote-user", false);
    });
  });

  endCall.addEventListener("click", async () => {
    peer.destroy();
  });
};

const renderVideoElement = (stream, id, muted = true, peer) => {
  // add a button next to the video to off the audio stream and video stream

  const div = document.createElement("div");
  const button = document.createElement("button");
  const button2 = document.createElement("button");

  button.innerText = "Off Video";
  button2.innerText = "Mute";

  button.onclick = async () => {
    const videoTracks = stream.getVideoTracks()[0];
    const audioTracks = stream.getAudioTracks()[0];

    if (videoTracks.enabled) {
      videoTracks.enabled = false;
      audioTracks.enabled = false;
      button.innerText = "ON Video";
      button2.innerText = "Unmute";
    } else {
      videoTracks.enabled = true;
      audioTracks.enabled = true;
      button.innerText = "Off Video";
      button2.innerText = "Mute";
    }
  };
  // document.querySelector("h2").appendChild('');

  const videos = document.getElementById("videos");
  let video = document.getElementById(id);
  if (!video) {
    video = document.createElement("video");
  }

  video.autoplay = true;
  video.muted = muted;
  video.srcObject = stream;
  video.id = id;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });

  div.append(video);
  if (id === "main-user") {
    div.append(button);
    div.append(button2);
  }

  videos.appendChild(div);
  return video;
};

const renderText = text => {
  const p = document.createElement("p");
  p.innerText = "Name: " + text;
  document.querySelector("h2").appendChild(p);
  return p;
};

const getUserMedia = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  return stream;
};
