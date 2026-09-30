const answer = document.getElementById("answer");
const status = document.getElementById("status");
const camera = document.getElementById("camera");

function reply(text) {
  answer.textContent = text;
  status.textContent = "Ready!";
  speak(text);
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 1;
  u.pitch = 1.05;
  window.speechSynthesis.speak(u);
}

function handleCommand(raw) {
  const cmd = raw.toLowerCase().trim();

  if (cmd.includes("hello") || cmd.includes("hi")) {
    return "Hello! I'm aiboy560. Nice to meet you!";
  }
  if (cmd.includes("your name") || cmd.includes("who are you")) {
    return "My name is aiboy560.";
  }
  if (cmd.includes("time")) {
    return "The time is " + new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"}) + ".";
  }
  if (cmd.includes("date") || cmd.includes("today")) {
    return "Today is " + new Date().toLocaleDateString() + ".";
  }
  if (cmd.includes("joke")) {
    return "Why did the robot go to school? Because it wanted to improve its bytes!";
  }
  if (cmd.includes("open youtube")) {
    window.open("https://www.youtube.com", "_blank", "noopener");
    return "Opening YouTube.";
  }
  if (cmd.includes("open google")) {
    window.open("https://www.google.com", "_blank", "noopener");
    return "Opening Google.";
  }
  if (cmd.includes("stop")) {
    window.speechSynthesis.cancel();
    return "Okay, I stopped speaking.";
  }
  return "I heard you say: " + raw + ". My first version can do a few built-in commands. We can add more skills next.";
}

document.getElementById("listenBtn").addEventListener("click", () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    reply("Voice input is not supported in this browser. Try Chrome or Edge.");
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  status.textContent = "Listening...";
  recognition.start();
  recognition.onresult = e => {
    const text = e.results[0][0].transcript;
    status.textContent = "Thinking...";
    setTimeout(() => reply(handleCommand(text)), 250);
  };
  recognition.onerror = () => reply("I couldn't hear that. Please try again.");
});

document.getElementById("speakBtn").addEventListener("click", () => {
  speak(answer.textContent);
});

document.getElementById("cameraBtn").addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({video: true});
    camera.srcObject = stream;
    camera.hidden = false;
    status.textContent = "Camera is on";
    answer.textContent = "I can now see the camera image. In a later version, we can add safe computer-vision features.";
  } catch {
    reply("Camera permission was not granted.");
  }
});
