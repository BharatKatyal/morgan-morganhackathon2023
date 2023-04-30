import { React, useEffect, useRef, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import Message from '../components/Message';
import Sidebar from '../components/Sidebar';
import LoadingDots from '../components/LoadingDots';
import 'bootstrap/dist/css/bootstrap.min.css';
import './chat.css'

function Chat() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [messageState, setMessageState] = useState({
        messages: [{
            message: "Hi, what would you like to learn about this legal case?",
            type: "apiMessage",
        }],
        pending: "",
        history: [],
        pendingSourceDocs: []
    })

    const { messages, history } = messageState;
    const messageListRef = useRef(null);
    const textAreaRef = useRef(null);

    useEffect(() => {
        textAreaRef.current?.focus();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();

        setError(null);

        if (!query) {
            alert('Please input a question');
            return;
        }

        const question = query.trim();

        setMessageState((state) => ({
            ...state,
            messages: [
                ...state.messages,
                {
                    type: 'userMessage',
                    message: question,
                }
            ],
        }));

        setLoading(true);
        setQuery('');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question, history }),
            });

            const data = await response.json();
            console.log('data', data);

            if (data.error) setError(data.error);
            else {
                setMessageState((state) => ({
                    ...state,
                    messages: [
                        ...state.messages,
                        {
                            type: 'apiMessage',
                            message: data.text,
                            sourceDocs: data.sourceDocuments,
                        },
                    ],
                    history: [...state.history, [question, data.text]],
                }));
            }
            console.log('messageState', messageState);

            setLoading(false);

            messageListRef.current?.scrollTo(0, messageListRef.current.scrollHeight);
        } catch (error) {
            setLoading(false);
            setError('An error occured while fetching the data. Please try again.');
            console.log('error', error);
        }
    }

    const handleEnter = (e) => {
        if (e.key === 'Enter' && query) handleSubmit(e);
        else if (e.key == 'Enter') e.preventDefault();
    }

    function onCaseSelected(legalCase) {
        console.log(legalCase.title);
    }

    return (
        <div id="chatPage">
            <Sidebar cases={[{ id: 123, title: "Case" }, { id: 234, title: "Case 2" }]} onCaseSelected={onCaseSelected}/>
            <div id="workspace">
                <h1 className='header'><img src='/Morgan_&_Morgan_Logo.svg.png'
                    alt='Logo'
                    width = "690px"
                    height = "100px"
                />Legal Document Analysis Bot</h1>
                <div ref={messageListRef} className="messageList">
                {messages.map((message, index) => (
                    <Message
                        key={`message-${index}`}
                        message={message}
                        type={message.type}
                        loading={loading}
                    />
                ))}
                </div>
                <div className='center'>
                    <div className="cloudform">
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Control
                                    type="textarea"
                                    disabled={loading}
                                    onKeyDown={handleEnter}
                                    ref={textAreaRef}
                                    autoFocus={false}
                                    maxLength={512}
                                    id="userInput"
                                    placeholder={
                                        loading
                                            ? 'Waiting for response...'
                                            : 'What is this legal case about?'
                                    }
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="textarea"
                                />
                            </Form.Group>
                            <Form.Group>
                                <Button type="submit" disabled={loading} className="generatebutton">
                                    {loading ? (
                                        <div className="loadingWheel">
                                            <LoadingDots color="#000" />
                                        </div>
                                    ) : (
                                        <svg
                                            viewBox="0 0 20 20"
                                            className="svgicon"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                                        </svg>
                                    )}
                                </Button>
                            </Form.Group>
                        </Form>
                    </div>
                </div>
                { error && (
                    <div className="errorcontainer">
                        <p className="text-red-500">{error}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
export default Chat;
