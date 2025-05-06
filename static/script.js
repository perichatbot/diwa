// DOM elements
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

  const chatBox = document.getElementById('chatBox');
  chatBox.innerHTML = '';

  if (push) history.pushState({ page: 'chat' }, '', '');
}

function togglePassword(fieldId, btn) {
  const input = document.getElementById(fieldId);
  const icon = btn.querySelector("i");
  input.type = input.type === "password" ? "text" : "password";
  icon.classList.toggle("fa-eye");
  icon.classList.toggle("fa-eye-slash");
}

function handleLogin() {
  const user = document.getElementById("login-username").value.trim();
  const pass = document.getElementById("login-password").value.trim();
  const errorDiv = document.getElementById("login-error");
  errorDiv.textContent = "";

  if (!user || !pass) {
    errorDiv.textContent = "Please fill in all fields.";
  } else if (user === "jeeve" && pass === "123") {
    formSection.style.display = "none";
    showChatbot();
  } else if (user === "jeeve") {
    errorDiv.textContent = "Wrong password. Try Again.";
  } else {
    errorDiv.textContent = "Invalid username or password.";
  }
}

function handleSignup() {
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const pass = document.getElementById("signup-password").value.trim();
  const cpass = document.getElementById("signup-cpass").value.trim();
  const errorDiv = document.getElementById("signup-error");
  const passError = document.getElementById("password-match-error");

  errorDiv.textContent = "";
  passError.textContent = "";

  if (!name || !email || !pass || !cpass) {
    errorDiv.textContent = "Please fill in all fields.";
  } else if (email !== "biru@gmail.com") {
    errorDiv.textContent = "Invalid email.";
  } else if (name.toLowerCase() !== "biru") {
    errorDiv.textContent = "Incorrect user name.";
  } else if (pass !== "1234") {
    errorDiv.textContent = "Invalid password.";
  } else if (pass !== cpass) {
    passError.textContent = "Passwords do not match.";
  } else {
    formSection.style.display = "none";
    showChatbot();
  }
}

// Auto resize chat input
chatInput.addEventListener('input', function () {
  this.style.height = 'auto';
  this.style.height = (this.scrollHeight) + 'px';
});

chatInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

sendBtn.addEventListener('click', sendMessage);

function sendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;

  chatInput.disabled = true;
  sendBtn.disabled = true;

  saveMessageToHistory(message);
  chatInput.value = '';
  chatInput.style.height = 'auto';

  const chatBox = document.getElementById('chatBox');
  let currentConversation = chatBox.getElementsByClassName('chat-conversation')[0];

  if (!currentConversation) {
    currentConversation = document.createElement('div');
    currentConversation.className = 'chat-conversation';
    chatBox.appendChild(currentConversation);
  }

  const welcomeMessage = document.querySelector('.welcome-message');
  if (welcomeMessage) welcomeMessage.remove();

  const userMsg = document.createElement('div');
  userMsg.className = 'chat-message user-message';
  userMsg.textContent = message;
  currentConversation.appendChild(userMsg);

  setTimeout(() => {
    document.querySelector(".chat-content").scrollTo({
      top: document.querySelector(".chat-content").scrollHeight - 80,
      behavior: "smooth"
    });
  }, 100);

  setTimeout(() => {
    fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    })
    .then(data => {
        const botMsg = document.createElement('div');
        botMsg.className = 'chat-message bot-message';
      
        const response = data.response || "No response.";
      
        // Apply basic structure to the response
        botMsg.innerHTML = `
          <div style="padding: 8px;">
            <strong>Bot:</strong>
            <p>${response.replace(/\n/g, "<br>")}</p>
          </div>
        `;
      
        currentConversation.appendChild(botMsg);
      })
      
      .catch(err => {
        console.error("Bot error:", err);
        const botMsg = document.createElement('div');
        botMsg.className = 'chat-message bot-message';
        botMsg.textContent = "Oops! Something went wrong.";
        currentConversation.appendChild(botMsg);
      })
      .finally(() => {
        chatInput.disabled = false;
        sendBtn.disabled = false;
        chatInput.focus();

        setTimeout(() => {
          document.querySelector(".chat-content").scrollTo({
            top: document.querySelector(".chat-content").scrollHeight,
            behavior: "smooth"
          });
        }, 100);
      });
  }, 1000);
}

function saveMessageToHistory(message) {
  let history = JSON.parse(localStorage.getItem("chatHistory")) || [];
  history.push(message);
  localStorage.setItem("chatHistory", JSON.stringify(history));
}

function showChatHistory() {
  const history = JSON.parse(localStorage.getItem("chatHistory")) || [];
  chatHistory.innerHTML = history.length
    ? history.map((msg, index) => `
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span style="cursor: pointer;" onclick="goToConversation('${msg}')">• ${msg}</span>
        <button onclick="deleteHistoryItem(${index})" style="background: none; border: none; color: red;">🗑️</button>
      </div>`).join("")
    : "<p>No previous messages.</p>";
}

function goToConversation(promptText) {
  localStorage.setItem('selectedPrompt', promptText);
  showChatbot();
  setTimeout(scrollToSelectedPrompt, 500);
}

function scrollToSelectedPrompt() {
  const selectedPrompt = localStorage.getItem('selectedPrompt');
  if (!selectedPrompt) return;

  const conversations = document.querySelectorAll('.chat-conversation');
  for (const conversation of conversations) {
    const userMessages = conversation.querySelectorAll('.chat-message.user-message');
    for (const userMsg of userMessages) {
      if (userMsg.textContent.trim() === selectedPrompt.trim()) {
        conversation.scrollIntoView({ behavior: 'smooth', block: 'start' });
        conversation.style.border = '2px solid #00ffff';
        conversation.style.borderRadius = '10px';
        conversation.style.padding = '10px';
        setTimeout(() => {
          conversation.style.border = 'none';
          conversation.style.padding = '0';
        }, 2000);
        localStorage.removeItem('selectedPrompt');
        return;
      }
    }
  }
}

function deleteHistoryItem(index) {
  let history = JSON.parse(localStorage.getItem("chatHistory")) || [];
  if (index < history.length) {
    history.splice(index, 1);
    localStorage.setItem("chatHistory", JSON.stringify(history));
    showChatHistory();
  }
}

function scrollToMessage(messageText) {
  const allMessages = document.querySelectorAll('.chat-message.user-message');
  for (const msg of allMessages) {
    if (msg.textContent.trim() === messageText.trim()) {
      msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      msg.style.backgroundColor = 'rgba(0,255,255,0.2)';
      setTimeout(() => {
        msg.style.backgroundColor = '';
      }, 2000);
      break;
    }
  }
}

// Event listeners
document.getElementById('aboutBtn').addEventListener('click', e => {
  e.preventDefault();
  showAboutPage();
});

document.getElementById('headerLoginBtn').addEventListener('click', e => {
  e.preventDefault();
  showLoginForm();
});

document.getElementById('headerSigninBtn').addEventListener('click', e => {
  e.preventDefault();
  showSignupForm();
});

document.getElementById('tryChatbotBtn').addEventListener('click', e => {
  e.preventDefault();
  showChatbot();
});

document.getElementById('helpBtn').addEventListener('click', e => {
  e.preventDefault();
  showAboutPage();
  setTimeout(() => {
    document.getElementById('helpSection').scrollIntoView({ behavior: 'smooth' });
  }, 100);
});

document.getElementById('bd').addEventListener('click', e => {
  e.preventDefault();
  showChatbot();
});

menuBtn.addEventListener('click', () => {
  sidebar.classList.add('show');
  menuBtnChat.style.display = 'none';
  navLinks.classList.toggle('show');
});

menuBtnChat.addEventListener('click', () => {
  sidebar.classList.add('show');
  menuBtnChat.style.display = 'none';
  document.getElementById('chatBackArrow').style.display = 'none';
});

backBtn.addEventListener('click', () => {
  sidebar.classList.remove('show');
  menuBtnChat.style.display = 'block';
  document.getElementById('chatBackArrow').style.display = 'block';
});

document.getElementById("toggleHistoryContainer").addEventListener("click", () => {
  const isVisible = chatHistory.style.display === "block";
  chatHistory.style.display = isVisible ? "none" : "block";
  if (!isVisible) showChatHistory();
});

document.getElementById('clearHistoryBtn').addEventListener('click', () => {
  localStorage.removeItem('chatHistory');
  chatHistory.innerHTML = "<p>No previous messages.</p>";
});

document.getElementById('formBackBtn').addEventListener('click', e => {
  e.preventDefault();
  formSection.style.display = "none";
  showMainPage();
});

document.querySelectorAll('.logo').forEach(logo => {
  logo.addEventListener('click', () => {
    chatSection.classList.remove('active');
    chatSection.style.display = 'none';
    aboutSection.classList.remove('active');
    showMainPage(false);
  });
});

// Handle browser back/forward navigation
window.addEventListener('popstate', function (event) {
  const state = event.state;
  if (!state || !state.page) {
    showMainPage(false);
  } else {
    switch (state.page) {
      case 'main': showMainPage(false); break;
      case 'about': showAboutPage(false); break;
      case 'login': showLoginForm(false); break;
      case 'signup': showSignupForm(false); break;
      case 'chat': showChatbot(false); break;
    }
  }
});

// Initialize on page load
window.onload = () => {
  showMainPage(false);
};
