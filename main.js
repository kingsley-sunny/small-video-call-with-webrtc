let peerConnection;
let localStream;
let remoteStream;

const iceServers = [{ urls: ["stun:stun1.1.google.com:19302"] }];

const init = async () => {
  localStream = await window.navigator.mediaDevices.getUserMedia({ video: true, audio: false });

  document.getElementById("user-1").srcObject = localStream;
};

const createPeerConnection = async sdpType => {
  peerConnection = new RTCPeerConnection({
    iceServers: iceServers,
  });

  remoteStream = new MediaStream();
  document.getElementById("user-2").srcObject = remoteStream;

  // add the local stream to the peer connection
  localStream.getTracks().forEach(track => {
    console.log("🚀 ~~ localStream.getTracks ~~ track:", track);

    peerConnection.addTrack(track, localStream);
  });

  // listen to the peer connection track
  peerConnection.ontrack = async event => {
    console.log("🚀 ~~ createOffer ~~ event:", event);

    event.streams[0].getTracks().forEach(track => {
      remoteStream.addTrack(track);
    });
  };

  peerConnection.onicecandidate = async event => {
    if (event.candidate) {
      console.log("🚀 ~~ createOffer ~~ event:", event);
      document.getElementById(sdpType).value = JSON.stringify(peerConnection.localDescription);
    }
  };
};

const createOffer = async () => {
  await createPeerConnection("offer-sdp");

  // create the offer
  const offer = await peerConnection.createOffer();
  // set the local description
  await peerConnection.setLocalDescription(offer);

  // show the offer to the document
  document.getElementById("offer-sdp").value = JSON.stringify(offer);
};

const createAnswer = async () => {
  await createPeerConnection("answer-sdp");

  let offer = document.getElementById("offer-sdp").value;

  if (!offer) return alert("Retrieve offer from peer first");
  offer = JSON.parse(offer);

  await peerConnection.setRemoteDescription(offer);

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  document.getElementById("answer-sdp").value = JSON.stringify(answer);
};

const addAnswer = async () => {
  let answer = document.getElementById("answer-sdp").value;
  if (!answer) return alert("Retrieve answer from peer first");

  answer = JSON.parse(answer);
  console.log("🚀 ~~ addAnswer ~~ answer:", answer);

  if (!peerConnection.currentRemoteDescription) {
    peerConnection.setRemoteDescription(answer);
  }
};

window.onload = init();

// add event listener
document.getElementById("create-offer").addEventListener("click", createOffer);

document.getElementById("create-answer").addEventListener("click", createAnswer);

document.getElementById("add-answer").addEventListener("click", addAnswer);
