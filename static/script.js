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

 // Navigation functions
 function showMainPage(push = true) {
aboutSection.classList.remove('active');
mainSection.classList.add('active');
document.querySelector('.features').style.display = 'grid';
footer.style.display = 'flex';

// ✅ Explicitly show UI elements that may have been hidden
document.getElementById("menuBtn").style.display = "block";
document.getElementById("navLinks").style.display = "flex";
document.querySelector("header").style.display = "flex";

// Hide others just in case
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
mainSection.classList.remove('active')
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
     chatSection.classList.add("active");
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
     chatSection.classList.add("active");
     showChatbot();
   }
 }


 // Textarea auto-resize
 chatInput.addEventListener('input', function() {
   this.style.height = 'auto';
   this.style.height = (this.scrollHeight) + 'px';
 });
 chatInput.addEventListener("keydown", function(event) {
if (event.key === "Enter" && !event.shiftKey) {
 event.preventDefault(); // Prevent newline
 sendMessage();
}
});

 // Send message on button click or Enter key
 function sendMessage() {
const message = chatInput.value.trim();
if (message) {
 // Disable input and button
 chatInput.disabled = true;
 sendBtn.disabled = true;

 saveMessageToHistory(message);
 chatInput.value = '';
 chatInput.style.height = 'auto';

 const chatBox = document.getElementById('chatBox');
 let currentConversation;

 const conversations = chatBox.getElementsByClassName('chat-conversation');
 if (conversations.length > 0) {
   currentConversation = conversations[conversations.length - 1];
 } else {
   currentConversation = document.createElement('div');
   currentConversation.className = 'chat-conversation';
   chatBox.appendChild(currentConversation);
 }

 const welcomeMessage = document.querySelector('.welcome-message');
 if (welcomeMessage) {
   welcomeMessage.remove();
 }

 const userMsg = document.createElement('div');
 userMsg.className = 'chat-message user-message';
 userMsg.textContent = message;
 currentConversation.appendChild(userMsg);

 // Scroll down a bit with spacing
 setTimeout(() => {
   const chatContent = document.querySelector(".chat-content");
   chatContent.scrollTo({
     top: chatContent.scrollHeight - 80,
     behavior: "smooth"
   });
 }, 100);

 // Simulate bot response delay
 setTimeout(() => {
   const botMsg = document.createElement('div');
   botMsg.className = 'chat-message bot-message';
   botMsg.textContent = ''; // You can replace this dynamically
   currentConversation.appendChild(botMsg);

   // Re-enable input and button after bot response
   chatInput.disabled = false;
   sendBtn.disabled = false;
   chatInput.focus();

   // Scroll again to see the bot message
   setTimeout(() => {
     const chatContent = document.querySelector(".chat-content");
     chatContent.scrollTo({
       top: chatContent.scrollHeight,
       behavior: "smooth"
     });
   }, 100);

 }, 1000); // Simulate 1s delay for bot response
}
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
       .map((msg, index) =>`<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px;">
       <span style="flex: 1; cursor: pointer;" onclick="goToConversation('${msg}')">• ${msg}</span>
       <button onclick="deleteHistoryItem(${index})" style="background: none; border: none; color: red; cursor: pointer;">🗑️</button>
     </div>`
   )
   .join("");
} else {
 chatHistory.innerHTML = "<p>No previous messages.</p>";
}
}

function goToConversation(promptText) {
// Save the clicked prompt into localStorage temporarily
localStorage.setItem('selectedPrompt', promptText);

// Navigate to the Chat page
showChatbot(); // You already have this function working

// After the chatbot loads, scroll to the correct conversation
setTimeout(() => {
 scrollToSelectedPrompt();
}, 500); // Give slight delay so chatbox content is ready
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

     // Highlight the conversation
     conversation.style.border = '2px solid #00ffff';
     conversation.style.borderRadius = '10px';
     conversation.style.padding = '10px';

     setTimeout(() => {
       conversation.style.border = 'none';
       conversation.style.padding = '0';
     }, 2000);

     // Optional: Clear selectedPrompt after scrolling
     localStorage.removeItem('selectedPrompt');

     return;
   }
 }
}
}





 document.getElementById('aboutBtn').addEventListener('click', function(e) {
e.preventDefault();
showAboutPage();
});




 document.getElementById('headerLoginBtn').addEventListener('click', function(e) {
   e.preventDefault();
   showLoginForm();
 });

 document.getElementById('headerSigninBtn').addEventListener('click', function(e) {
   e.preventDefault();
   showSignupForm();
 });

 document.getElementById('tryChatbotBtn').addEventListener('click', function(e) {
   e.preventDefault();
   showChatbot();
 });

 document.getElementById('helpBtn').addEventListener('click', function(e) {
   e.preventDefault();
   showAboutPage();
   setTimeout(() => {
     document.getElementById('helpSection').scrollIntoView({ behavior: 'smooth' });
   }, 100);
 });
 document.getElementById('bd').addEventListener('click', function(e) {
e.preventDefault();
showChatbot();
});

 // Sidebar toggle
 // Sidebar toggle
// Sidebar toggle
menuBtn.addEventListener('click', () => {
sidebar.classList.add('show');
menuBtnChat.style.display = 'none';  // 👈 hide inside chatbot
navLinks.classList.toggle('show');
});

menuBtnChat.addEventListener('click', () => {
sidebar.classList.add('show');
menuBtnChat.style.display = 'none';         // already there ✅
document.getElementById('chatBackArrow').style.display = 'none'; // 👈 hide back arrow
});

backBtn.addEventListener('click', () => {
sidebar.classList.remove('show');
menuBtnChat.style.display = 'block';       // already there ✅
document.getElementById('chatBackArrow').style.display = 'block'; // 👈 show it again
});




document.getElementById("toggleHistoryContainer").addEventListener("click", () => {
const isVisible = chatHistory.style.display === "block";
chatHistory.style.display = isVisible ? "none" : "block";

if (!isVisible) {
 showChatHistory();
}
});

 // Send message on button click or Enter key
 sendBtn.addEventListener('click', sendMessage);
 
 document.getElementById('clearHistoryBtn').addEventListener('click', () => {
localStorage.removeItem('chatHistory'); // Remove history from local storage
chatHistory.innerHTML = "<p>No previous messages.</p>"; // Update UI
});

 document.getElementById('formBackBtn').addEventListener('click', function(e) {
e.preventDefault();
formSection.style.display = "none";
showMainPage();
});
 // Start with main page
 window.onload = () => {
mainSection.classList.add('active');
formSection.style.display = "none";
chatSection.classList.remove("active");
document.getElementById("menuBtn").style.display = "block"; // ✅ show hamburger on load
};
function deleteHistoryItem(index) {
let history = JSON.parse(localStorage.getItem("chatHistory")) || [];
if (history.length > index) {
 history.splice(index, 1); // Remove the item at that index
 localStorage.setItem("chatHistory", JSON.stringify(history)); // Save back
 showChatHistory(); // Refresh the sidebar
}
}



function scrollToMessage(messageText) {
const allMessages = document.querySelectorAll('.chat-message.user-message');

for (const msg of allMessages) {
 if (msg.textContent.trim() === messageText.trim()) {
   msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
   msg.style.backgroundColor = 'rgba(0,255,255,0.2)'; // Highlight temporarily
   setTimeout(() => {
     msg.style.backgroundColor = ''; // Remove highlight after 2 sec
   }, 2000);
   break;
 }
}
}
// Handle logo click to go back to main page
document.querySelectorAll('.logo').forEach(logo => {
logo.addEventListener('click', function () {
 // Hide other sections
 document.getElementById('chat-section').classList.remove('active');
 document.getElementById('chat-section').style.display = 'none';
 document.querySelector('.about-section').classList.remove('active');

 // Show main section
 document.querySelector('.main-section').classList.add('active');
 document.querySelector('.features').style.display = 'grid';
 document.querySelector('footer').style.display = 'flex';
 document.querySelector('header').style.display = 'flex';
 document.getElementById('navLinks').style.display = 'flex';
 document.getElementById('menuBtn').style.display = 'block';
});
});
window.addEventListener('popstate', function(event) {
const state = event.state;
if (!state || !state.page) {
 showMainPage(false);
} else {
 switch (state.page) {
   case 'main':
     showMainPage(false);
     break;
   case 'about':
     showAboutPage(false);
     break;
   case 'login':
     showLoginForm(false);
     break;
   case 'signup':
     showSignupForm(false);
     break;
   case 'chat':
     showChatbot(false);
     break;
 }
}
history.replaceState({ page: 'main' }, '', '');

});
botMsg.innerHTML = formatBotReply(message, backendReply);
function formatBotReply(userInput, backendReply) {
const lowerInput = userInput.toLowerCase();

// Detect if it's a letter based on common words
if (lowerInput.includes("leave letter") || lowerInput.includes("formal letter") || backendReply.includes("Dear")) {
 return `<pre>${backendReply.trim()}</pre>`;
}

// Detect if it's a list based on commas or numbered points
if (
 lowerInput.includes("list") || lowerInput.includes("bullet") ||
 backendReply.match(/(,|•|- )/) // detects bullets or commas
) {
 const items = backendReply
   .split(/,|\\n|•|- /)
   .filter(item => item.trim().length > 0)
   .map(item => `<li>${item.trim()}</li>`)
   .join('');
 return `<ul>${items}</ul>`;
}

// Detect if it's code
if (lowerInput.includes("code") || backendReply.includes("<div>") || backendReply.includes("{")) {
 return `<pre><code>${backendReply.trim()}</code></pre>`;
}

// Default: replace line breaks with <br>
return backendReply.replace(/\\n/g, '<br>');
}
