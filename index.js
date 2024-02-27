const chatLog = document.getElementById("chat-log");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const buttonIcon = sendButton.querySelector("i");

sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

async function sendMessage() {
  const message = userInput.value.trim();

  if (message === "") {
    return;
  } else if (message === "developer") {
    userInput.value = "";
    appendMessage("user", message);

    try {
      const response = await fetchChatGPTAPI(message);
      appendMessage("bot", response);
    } catch (error) {
      console.error(error);
      appendMessage("bot", "Error : Check Your API Key!");
    }

    resetButtonIcon();
    return;
  }

  appendMessage("user", message);
  userInput.value = "";

  try {
    const response = await fetchChatGPTAPI(message);
    appendMessage("bot", response);
  } catch (error) {
    console.error(error);
    appendMessage("bot", "Error : Unable to process your request!");
  }

  resetButtonIcon();
}

async function fetchChatGPTAPI(message) {
  // Check if the user asked about the creator
  if (
    message.toLowerCase().includes("who") &&
    message.toLowerCase().includes("built") &&
    message.toLowerCase().includes("you")
  ) {
    return "I was built by Sathwik Pericherla.";
  }

  const url = "https://chatgpt-gpt4-ai-chatbot.p.rapidapi.com/ask";
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": "6884d9c7b4msh5521f6687df6685p1e6502jsn62e396d555ec",
      "X-RapidAPI-Host": "chatgpt-gpt4-ai-chatbot.p.rapidapi.com",
    },
    body: JSON.stringify({
      query: message,
    }),
  };

  const response = await fetch(url, options);
  const data = await response.json();

  console.log(data); // Log the entire API response

  return data.response || "Sorry, I couldn't understand your question.";
}

function appendMessage(sender, message) {
  const messageElement = document.createElement("div");
  const iconElement = document.createElement("div");
  const chatElement = document.createElement("div");
  const icon = document.createElement("i");

  chatElement.classList.add("chat-box", sender);
  iconElement.classList.add("icon");
  messageElement.classList.add("message");
  messageElement.innerText = message;

  if (sender === "user") {
    icon.classList.add("fas", "fa-user");
  } else {
    icon.classList.add("fas", "fa-robot");
  }

  iconElement.appendChild(icon);
  chatElement.appendChild(iconElement);
  chatElement.appendChild(messageElement);
  chatLog.appendChild(chatElement);
}

function resetButtonIcon() {
  buttonIcon.classList.add("fas", "fa-paper-plane");
  buttonIcon.classList.remove("fas", "fa-spinner", "fa-pulse");
}