document.addEventListener("DOMContentLoaded", function () {
    const chatButton = document.getElementById("chat-button");
    const chatBox = document.getElementById("chat-box");
    const closeChat = document.getElementById("close-chat");
    const sendBtn = document.getElementById("send-btn");
    const chatInput = document.getElementById("chat-input");
    const messagesDiv = document.getElementById("messages");

    // Toggle Chat Box Visibility
    chatButton.addEventListener("click", () => {
        chatBox.classList.remove("d-none");
    });

    closeChat.addEventListener("click", () => {
        chatBox.classList.add("d-none");
    });

    // Append Messages to Chat Box
    function appendMessage(sender, message) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("mb-2");
        messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    // Fetch Response from DuckDuckGo API
    async function fetchDuckDuckGoResponse(query) {
        const apiUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.Abstract) {
                return data.Abstract;
            } else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
                return `Here's what I found: ${data.RelatedTopics[0].Text}`;
            } else {
                return "I'm sorry, I couldn't find an answer to your question.";
            }
        } catch (error) {
            console.error("Error fetching response:", error);
            return "An error occurred. Please try again later.";
        }
    }

    // Handle Sending Message
    async function sendMessage() {
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        appendMessage("You", userMessage);
        chatInput.value = ""; // Clear input

        // Show DuckDuckGo Thinking Message
        appendMessage("DuckDuckGo", "Thinking...");

        // Fetch Response and Update Chat
        const aiResponse = await fetchDuckDuckGoResponse(userMessage);
        messagesDiv.lastChild.innerHTML = `<strong>DuckDuckGo:</strong> ${aiResponse}`;
    }

    // Handle Send Button Click
    sendBtn.addEventListener("click", sendMessage);

    // Handle Enter Key Press in Chat Input
    chatInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent default behavior of Enter key (e.g., form submission)
            sendMessage();
        }
    });
});
