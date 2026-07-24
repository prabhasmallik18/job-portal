import React, { useState, useRef, useContext } from 'react';import Navbar from './Navbar';import { AppContext } from '../context/AppContext';
import styles from './InterviewPrep.module.css';

const InterviewPrep = ({ userId }) => {
    const { backendUrl } = useContext(AppContext);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [sessionId, setSessionId] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [userAnswer, setUserAnswer] = useState('');
    const [sessionComplete, setSessionComplete] = useState(false);
    const [report, setReport] = useState(null);
    const [sessionStarted, setSessionStarted] = useState(false);
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);

    const handleStartSession = async (e) => {
        e.preventDefault();
        const topic = e.target.topic.value;
        const difficulty = e.target.difficulty.value;

        try {
            const response = await fetch(`${backendUrl}/api/interview/generate-questions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, topic, difficulty })
            });

            const data = await response.json();
            setQuestions(data.questions);
            setSessionId(data.sessionId);
            setCurrentQuestion(0);
            setSessionStarted(true);
        } catch (error) {
            console.error('Error starting interview:', error);
            // Set temporary demo questions
            const demoQuestions = {
                'React': [
                    { question: 'Explain the concept of React hooks and how they differ from class components', topic: 'React', difficulty: 'intermediate', tip: 'Focus on state management and side effects' },
                    { question: 'What is the virtual DOM and why is it important?', topic: 'React', difficulty: 'beginner', tip: 'Discuss reconciliation and performance' },
                    { question: 'How would you optimize a React component with thousands of items?', topic: 'React', difficulty: 'advanced', tip: 'Think about virtualization and memoization' }
                ],
                'Node.js': [
                    { question: 'Explain the event loop in Node.js', topic: 'Node.js', difficulty: 'intermediate', tip: 'Cover phases and callbacks' },
                    { question: 'What is the difference between process.nextTick and setImmediate?', topic: 'Node.js', difficulty: 'advanced', tip: 'Discuss execution order' }
                ],
                'System Design': [
                    { question: 'Design a URL shortening system like bit.ly', topic: 'System Design', difficulty: 'advanced', tip: 'Consider database design and load balancing' },
                    { question: 'How would you design a notification system?', topic: 'System Design', difficulty: 'advanced', tip: 'Think about scalability' }
                ],
                'Behavioral': [
                    { question: 'Tell us about a time you made a difficult decision', topic: 'Behavioral', difficulty: 'beginner', tip: 'Use STAR method' }
                ]
            };
            
            const questionList = demoQuestions[topic] || demoQuestions['React'];
            setQuestions(questionList);
            setSessionId(`demo-${Date.now()}`);
            setCurrentQuestion(0);
            setSessionStarted(true);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 320, height: 240 },
                audio: true 
            });
            videoRef.current.srcObject = stream;
            videoRef.current.play();

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    };

    const stopRecording = async () => {
        return new Promise((resolve) => {
            const mediaRecorder = mediaRecorderRef.current;
            if (mediaRecorder) {
                mediaRecorder.ondataavailable = (event) => {
                    const videoBlob = new Blob([event.data], { type: 'video/webm' });
                    // In real app, upload to cloud storage
                    resolve(URL.createObjectURL(videoBlob));
                };
                mediaRecorder.stop();
            }
            setIsRecording(false);
        });
    };

    const handleSubmitAnswer = async () => {
        const videoUrl = isRecording ? await stopRecording() : '';

        try {
            await fetch(`${backendUrl}/api/interview/submit-answer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    questionIndex: currentQuestion,
                    userAnswer,
                    videoUrl,
                    answerDuration: 120
                })
            });

            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setUserAnswer('');
            } else {
                handleCompleteInterview();
            }
        } catch (error) {
            console.error('Error submitting answer:', error);
        }
    };

    const handleCompleteInterview = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/interview/complete/${sessionId}`, {
                method: 'PUT'
            });

            const data = await response.json();
            setReport(data.report);
            setSessionComplete(true);
        } catch (error) {
            console.error('Error completing interview:', error);
            // Set temporary demo report
            setReport({
                performance: {
                    totalScore: 78,
                    clarity: 8,
                    technicalKnowledge: 7,
                    communicationSkills: 8,
                    confidence: 7
                },
                weakAreas: [
                    { topic: 'System Design Patterns', prodiciency: 6, suggestedResources: ['Grokking the System Design Interview', 'System Design Primer'] },
                    { topic: 'Data Structures', prodiciency: 7, suggestedResources: ['LeetCode', 'GeeksforGeeks'] }
                ],
                recommendation: 'Good effort! Your communication skills are strong, but work on technical depth. Practice more system design problems and review advanced data structures.'
            });
            setSessionComplete(true);
        }
    };

    if (!sessionStarted) {
        return (
            <>
                <Navbar />
                <div className={styles.container}>
                <div className={styles.header}>
                    <h1>🎤 Mock Interview Practice</h1>
                    <p>Practice with AI-powered questions and get real-time feedback</p>
                </div>

                <div className={styles.setupSection}>
                    <form onSubmit={handleStartSession} className={styles.setupForm}>
                        <div className={styles.formGroup}>
                            <label htmlFor="topic">Interview Topic</label>
                            <select name="topic" id="topic" required>
                                <option value="">Select a topic...</option>
                                <option value="React">React</option>
                                <option value="Node.js">Node.js</option>
                                <option value="System Design">System Design</option>
                                <option value="Behavioral">Behavioral</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="difficulty">Difficulty Level</label>
                            <select name="difficulty" id="difficulty" required>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>

                        <button type="submit" className={styles.startBtn}>
                            🚀 Start Interview Session
                        </button>
                    </form>

                    <div className={styles.info}>
                        <h3>What to Expect:</h3>
                        <ul>
                            <li>✅ 5-7 tailored interview questions</li>
                            <li>🎥 Optional video recording for posture/expressions</li>
                            <li>⏱️ 2 minutes per question (suggested)</li>
                            <li>📊 Detailed AI feedback on each answer</li>
                            <li>📈 Performance report and improvement areas</li>
                        </ul>
                    </div>
                </div>
                </div>
            </>
        );
    }

    if (sessionComplete && report) {
        return (
            <>
                <Navbar />
                <div className={styles.container}>
                <div className={styles.reportSection}>
                    <div className={styles.reportHeader}>
                        <h1>📋 Interview Report</h1>
                        <div className={styles.scoreDisplay}>
                            <span className={styles.scoreValue}>{report.performance.totalScore}</span>
                            <span className={styles.scoreLabel}>/ 100</span>
                        </div>
                    </div>

                    <div className={styles.performanceCards}>
                        <div className={styles.perfCard}>
                            <span>🎯 Clarity</span>
                            <strong>{report.performance.clarity}/10</strong>
                        </div>
                        <div className={styles.perfCard}>
                            <span>💡 Technical Knowledge</span>
                            <strong>{report.performance.technicalKnowledge}/10</strong>
                        </div>
                        <div className={styles.perfCard}>
                            <span>💬 Communication</span>
                            <strong>{report.performance.communicationSkills}/10</strong>
                        </div>
                        <div className={styles.perfCard}>
                            <span>🔥 Confidence</span>
                            <strong>{report.performance.confidence}/10</strong>
                        </div>
                    </div>

                    {report.weakAreas && report.weakAreas.length > 0 && (
                        <div className={styles.weakAreas}>
                            <h3>📚 Areas to Improve</h3>
                            {report.weakAreas.map((area, idx) => (
                                <div key={idx} className={styles.weakArea}>
                                    <h4>{area.topic}</h4>
                                    <p>Proficiency: {area.prodiciency}/10</p>
                                    <div className={styles.resources}>
                                        {area.suggestedResources?.map((res, i) => (
                                            <a key={i} href="#" className={styles.resource}>{res}</a>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={styles.recommendation}>
                        <p className={styles.recText}>{report.recommendation}</p>
                        <button className={styles.nextBtn}>Practice More</button>
                    </div>
                </div>
                </div>
            </>
        );
    }

    if (questions.length > 0) {
        const question = questions[currentQuestion];
        const progress = Math.round(((currentQuestion + 1) / questions.length) * 100);

        return (
            <>
                <Navbar />
                <div className={styles.container}>
                <div className={styles.interviewHeader}>
                    <div className={styles.progress}>
                        <div className={styles.progressLabel}>
                            <span className={styles.counterTitle}>Question</span>
                            <strong className={styles.counterValue}>{currentQuestion + 1} of {questions.length}</strong>
                        </div>
                        <div className={styles.progressBarWrapper}>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
                            </div>
                            <span className={styles.progressText}>{progress}% complete</span>
                        </div>
                    </div>
                </div>

                <div className={styles.interviewContent}>
                    <div className={styles.questionSection}>
                        <h2 className={styles.question}>{question.question}</h2>
                        <div className={styles.questionMeta}>
                            <span className={styles.topic}>📌 Topic: {question.topic}</span>
                            <span className={styles.difficulty}>⚡ {question.difficulty}</span>
                        </div>
                        {question.tip && (
                            <div className={styles.tip}>
                                <strong>💡 Tip:</strong> {question.tip}
                            </div>
                        )}
                    </div>

                    <div className={styles.answerSection}>
                        <div className={styles.answerActions}>
                            <button 
                                className={`${styles.recordBtn} ${isRecording ? styles.recording : ''}`}
                                onClick={isRecording ? stopRecording : startRecording}
                            >
                                {isRecording ? '⛔ Stop Recording' : '🎥 Start Recording (Optional)'}
                            </button>
                        </div>

                        <textarea
                            className={styles.answerText}
                            placeholder="Type your answer here or just speak to the camera..."
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                        />

                        {isRecording && (
                            <video 
                                ref={videoRef} 
                                className={styles.preview}
                                muted
                            />
                        )}

                        <button 
                            className={styles.submitBtn}
                            onClick={handleSubmitAnswer}
                            disabled={!userAnswer && !isRecording}
                        >
                            {currentQuestion === questions.length - 1 ? '✅ Complete Interview' : '➡️ Next Question'}
                        </button>
                    </div>
                </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div>Loading questions...</div>
        </>
    );
};

export default InterviewPrep;
