// DOM Elements
const mainSection = document.querySelector('.main-section');
const aboutSection = document.querySelector('.about-section');
const footer = document.querySelector('footer');
const formSection = document.getElementById("form-section");
const chatSection = document.getElementById("chat-section");
const sidebar = document.getElementById("chatSidebar");
const menuBtn = document.getElementById("menuBtn");
const menuBtnChat = document.getElementById("menuBtnChat");
const navLinks = document.getElementById("navLinks");
const backBtn = document.getElementById("backBtn");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const chatHistory = document.getElementById("chatHistory");
const chatBox = document.getElementById('chatBox');

// Navigation functions
function showMainPage(push = true) {
  aboutSection.classList.remove('active');
  mainSection.classList.add('active');
  document.querySelector('.features').style.display = 'grid';
  footer.style.display = 'flex';
  document.getElementById("menuBtn").style.display = "block";
  document.getElementById("navLinks").style.display = "flex";
  document.querySelector("header").style.display = "flex";
  formSection.style.display = "none";
  chatSection.classList.remove("active");
  chatSection.style.display = "none";
  if (push) history.pushState({ page: 'main' }, '', '');
}

function showAboutPage(push = true) {
  mainSection.classList.remove('active');
  aboutSection.classList.add('active');
  document.querySelector('.features').style.display = 'none';
  footer.style.display = 'none';
  document.getElementById("menuBtn").style.display = "none";
  if (push) history.pushState({ page: 'about' }, '', '');
}

function showLoginForm(push = true) {
  formSection.style.display = "flex";
  mainSection.classList.remove('active');
  aboutSection.classList.remove('active');
  footer.style.display = 'none';
  document.getElementById("login-view").classList.add("active");
  document.getElementById("signup-view").classList.remove("active");
  if (push) history.pushState({ page: 'login' }, '', '');
}

function showSignupForm(push = true) {
  formSection.style.display = "flex";
  mainSection.classList.remove('active');
  aboutSection.classList.remove('active');
  footer.style.display = 'none';
  document.getElementById("signup-view").classList.add("active");
  document.getElementById("login-view").classList.remove("active");
  if (push) history.pushState({ page: 'signup' }, '', '');
}

function showChatbot(push = true) {
  chatSection.style.display = "flex";
  chatSection.classList.add("active");
  mainSection.classList.remove('active');
  aboutSection.classList.remove('active');
  footer.style.display = 'none';
  document.querySelector('.features').style.display = 'none';
  document.getElementById('navLinks').style.display = 'none';
  document.getElementById("menuBtn").style.display = "none";
  document.querySelector('header').style.display = 'none';
  chatBox.innerHTML = '';
  if (push) history.pushState({ page: 'chat' }, '', '');
}

// Auto-resize textarea
chatInput.addEventListener('input', function () {
  this.style.height = 'auto';
  this.style.height = (this.scrollHeight) + 'px';
});

// Submit on Enter
chatInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

// Append message
function appendMessage(sender, message) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `chat-message ${sender}-message`;
  msgDiv.innerHTML = formatBotReply(message, message);
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Send message
async function sendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;

  appendMessage("user", message);
  chatInput.value = "";
  chatInput.style.height = 'auto';
  chatInput.focus();
  sendBtn.disabled = true;

  saveMessageToHistory(message);

  // Simulate bot reply (replace with real backend logic)
  setTimeout(() => {
    const botReply = `Bot response to: ${message}`;
    appendMessage("bot", botReply);
    sendBtn.disabled = false;
  }, 1000);
}

function saveMessageToHistory(message) {
  let history = JSON.parse(localStorage.getItem("chatHistory")) || [];
  history.push(message);
  localStorage.setItem("chatHistory", JSON.stringify(history));
}

function showChatHistory() {
  const history = JSON.parse(localStorage.getItem("chatHistory")) || [];
  if (history.length) {
    chatHistory.innerHTML = history
      .map((msg, index) => `<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px;">
        <span style="flex: 1; cursor: pointer;" onclick="goToConversation('${msg}')">• ${msg}</span>
        <button onclick="deleteHistoryItem(${index})" style="background: none; border: none; color: red; cursor: pointer;">🗑️</button>
      </div>`)
      .join("");
  } else {
    chatHistory.innerHTML = "<p>No previous messages.</p>";
  }
}

function deleteHistoryItem(index) {
  let history = JSON.parse(localStorage.getItem("chatHistory")) || [];
  if (history.length > index) {
    history.splice(index, 1);
    localStorage.setItem("chatHistory", JSON.stringify(history));
    showChatHistory();
  }
}

function formatBotReply(userInput, backendReply) {
  const lowerInput = userInput.toLowerCase();
  if (lowerInput.includes("leave letter") || lowerInput.includes("formal letter") || backendReply.includes("Dear")) {
    return `<pre>${backendReply.trim()}</pre>`;
  }
  if (lowerInput.includes("list") || lowerInput.includes("bullet") || backendReply.match(/(,|•|- )/)) {
    const items = backendReply
      .split(/,|\n|•|- /)
      .filter(item => item.trim().length > 0)
      .map(item => `<li>${item.trim()}</li>`)
      .join('');
    return `<ul>${items}</ul>`;
  }
  if (lowerInput.includes("code") || backendReply.includes("<div>") || backendReply.includes("{")) {
    return `<pre><code>${backendReply.trim()}</code></pre>`;
  }
  return backendReply.replace(/\n/g, '<br>');
}

sendBtn.addEventListener("click", sendMessage);
