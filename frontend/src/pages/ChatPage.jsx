import './ChatPage.css'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
    createConversationApi,
    sendMessageToConversationApi,
    getConversationMessagesApi
} from '../services/chatApi'
import chatbotLogo from "../assets/chatbot-logo.png";
import { HiOutlineUser } from "react-icons/hi2";

function ChatPage() {
    const [inputMessage, setInputMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [conversationId, setConversationId] = useState(null)

    const [searchParams] = useSearchParams()

    useEffect(() => {
        const id = searchParams.get('conversationId')

        if (!id) {
            setConversationId(null)
            setMessages([])
            return
        }

        setConversationId(Number(id))

        getConversationMessagesApi(id)
            .then((response) => {
                const loadedMessages = response.data.map((message) => ({
                    id: message.id,
                    sender: message.role,
                    text: message.content
                }))

                setMessages(loadedMessages)
            })
            .catch((error) => {
                console.error('Error loading conversation messages:', error)
            })
    }, [searchParams])

    function sendMessage() {
        if (!inputMessage.trim()) return

        const textToSend = inputMessage

        const userMessage = {
            id: Date.now(),
            sender: 'user',
            text: textToSend
        }

        setMessages((prev) => [...prev, userMessage])
        setInputMessage('')
        setLoading(true)

        const request = conversationId
            ? sendMessageToConversationApi(conversationId, textToSend)
            : createConversationApi(textToSend)

        request
            .then((response) => {
                if (!conversationId && response.data.conversation_id) {
                    setConversationId(response.data.conversation_id)
                    window.dispatchEvent(new Event('chatHistoryUpdated'))
                }

                const assistantMessage = {
                    id: Date.now() + 1,
                    sender: 'assistant',
                    text: response.data.assistant_answer
                }

                setMessages((prev) => [...prev, assistantMessage])
            })
            .catch((error) => {
                const errorMessage = {
                    id: Date.now() + 1,
                    sender: 'assistant',
                    text: error.response?.data?.detail || 'Could not send message'
                }

                setMessages((prev) => [...prev, errorMessage])
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <div className="chat-page">
            <main className="chat-main">
                <div className="chat-title">
                    <h1 className="chat-title">
                        <img
                            src={chatbotLogo}
                            alt="JERZO AI"
                            className="chat-title-icon"
                        />
                        JERZO AI
                    </h1>
                    <p>
                        Ask anything about jerseys, teams, styles, recommendations and availability.
                    </p>
                </div>

                <div className="chat-messages">
                    {messages.length === 0 ? (
                        <div className="chat-empty">
                            <h2>How can I help you today?</h2>
                        </div>
                    ) : (
                        messages.map((message) => (
                            <div
                                className={`chat-message ${message.sender === 'user' ? 'user' : 'assistant'}`}
                                key={message.id}
                            >
                                <div className="chat-avatar">
                                    {message.sender === "user" ? (
                                        <HiOutlineUser className="chat-user-icon" />
                                    ) : (
                                        <img
                                            src={chatbotLogo}
                                            alt="JERZO AI"
                                            className="chat-message-ai-icon"
                                        />
                                    )}
                                </div>

                                <div className="chat-bubble">
                                    {message.text}
                                </div>
                            </div>
                        ))
                    )}

                    {loading && (
                        <div className="chat-message assistant">
                            <div className="chat-avatar">⚽</div>
                            <div className="chat-bubble">Thinking...</div>
                        </div>
                    )}
                </div>

                <div className="chat-input-area">
                    <textarea
                        placeholder="Ask JERZO AI..."
                        value={inputMessage}
                        onChange={(event) => setInputMessage(event.target.value)}
                    />

                    <button type="button" onClick={sendMessage}>
                        ➤
                    </button>
                </div>
            </main>
        </div>
    )
}

export default ChatPage