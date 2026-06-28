import { useState, useEffect } from "react";
import { 
    Award, 
    CheckCircle2, 
    Clock, 
    ChevronRight, 
    RotateCcw, 
    FileText, 
    XCircle, 
    ArrowLeft, 
    HelpCircle,
    Loader2,
    AlertCircle
} from "lucide-react";
import "./assessment.css";

const MOCK_QUESTIONS = {
    "JavaScript Core Basics": [
        { q: "Which keyword is used to declare a block-scoped variable?", options: ["var", "let", "const", "Both let and const"], ans: 3 },
        { q: "What is the output of typeof null in JavaScript?", options: ["'null'", "'undefined'", "'object'", "'number'"], ans: 2 },
        { q: "Which array method adds one or more elements to the end?", options: ["pop()", "push()", "shift()", "unshift()"], ans: 1 }
    ],
    "React Framework Proficiency": [
        { q: "Which hook handles side-effects in functional React components?", options: ["useState", "useEffect", "useContext", "useMemo"], ans: 1 },
        { q: "What does JSX stand for in React development?", options: ["JavaScript Syntax Extension", "JavaScript XML", "Java Syntax Extension", "JSON XML"], ans: 1 },
        { q: "How is read-only data passed from a parent component down to a child?", options: ["State", "Props", "Context", "Redux"], ans: 1 }
    ],
    "Python Coding Skills": [
        { q: "Which character is used to start a single-line comment in Python?", options: ["//", "/*", "#", "--"], ans: 2 },
        { q: "Which Python data structure is ordered and mutable?", options: ["List", "Tuple", "Set", "Dictionary"], ans: 0 },
        { q: "What keyword is used to define a function in Python?", options: ["func", "def", "function", "lambda"], ans: 1 }
    ]
};

export default function Assessment({ assessmentCourse, clearAssessmentCourse, onBadgeEarned }) {
    const [quizState, setQuizState] = useState("list"); // "list" | "quiz" | "result"
    const [activeTest, setActiveTest] = useState(null);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [customQuestions, setCustomQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (assessmentCourse) {
            const generateAndStart = async () => {
                setIsLoading(true);
                setError("");
                setQuizState("list");
                
                try {
                    const prompt = `Generate a skills assessment for the course: "${assessmentCourse.title}".
It must have exactly 15 multiple choice questions.
Each question must have exactly 4 options.
Format the output strictly as a JSON array where each object has:
- "q": The question text (string).
- "options": An array of exactly 4 options (strings).
- "ans": The 0-indexed integer of the correct option (0, 1, 2, or 3).

Do not output any introductory or concluding text, only the raw JSON.`;

                    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY || ''}`,
                            "Content-Type": "application/json",
                            "HTTP-Referer": "http://localhost:5173",
                            "X-Title": "ShikshaSetu"
                        },
                        body: JSON.stringify({
                            model: "openai/gpt-oss-20b:free",
                            messages: [
                                {
                                    role: "user",
                                    content: prompt
                                }
                            ]
                        })
                    });

                    if (!response.ok) {
                        throw new Error(`API returned status ${response.status}`);
                    }

                    const data = await response.json();
                    let text = data.choices?.[0]?.message?.content?.trim();
                    
                    if (!text) {
                        throw new Error("No response received from AI model.");
                    }
                    
                    if (text.startsWith("```")) {
                        text = text.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
                    }

                    const parsed = JSON.parse(text);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        const formattedQuestions = parsed.map(q => ({
                            q: q.q || "Question placeholder?",
                            options: Array.isArray(q.options) && q.options.length >= 4 
                                ? q.options.slice(0, 4) 
                                : ["A", "B", "C", "D"],
                            ans: typeof q.ans === 'number' && q.ans >= 0 && q.ans < 4 ? q.ans : 0
                        }));
                        
                        // Ensure exactly 15 questions
                        let finalQuestions = [...formattedQuestions];
                        if (finalQuestions.length < 15) {
                            while (finalQuestions.length < 15) {
                                finalQuestions.push({
                                    q: `Review question about ${assessmentCourse.category || 'course topic'}?`,
                                    options: ["Option A", "Option B", "Option C", "Option D"],
                                    ans: 0
                                });
                            }
                        } else if (finalQuestions.length > 15) {
                            finalQuestions = finalQuestions.slice(0, 15);
                        }

                        setCustomQuestions(finalQuestions);
                        
                        const test = {
                            name: `${assessmentCourse.title} Assessment`,
                            questions: 15,
                            duration: "15 Mins",
                            difficulty: "Mixed",
                            topic: assessmentCourse.category || "General",
                            isCustom: true
                        };
                        
                        setActiveTest(test);
                        setCurrentIdx(0);
                        setSelectedAnswers({});
                        setScore(0);
                        setQuizState("quiz");
                    } else {
                        throw new Error("Failed to parse questions array.");
                    }
                } catch (err) {
                    console.error("Error generating assessment:", err);
                    setError(err.message || "Failed to generate assessment. Please try again.");
                } finally {
                    setIsLoading(false);
                }
            };
            
            generateAndStart();
        }
    }, [assessmentCourse]);

    if (isLoading) {
        return (
            <div className="assessment-container loading-state">
                <div className="loading-card text-center p-8 flex flex-col items-center">
                    <Loader2 className="animate-spin text-[#e8773f] mb-4" size={48} />
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Generating Assessment</h3>
                    <p className="text-slate-500 mt-2 text-center max-w-md">
                        We are using AI to generate 15 customized assessment questions for <strong>{assessmentCourse?.title}</strong>. This might take a few moments...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="assessment-container error-state">
                <div className="error-card text-center p-8 flex flex-col items-center">
                    <AlertCircle className="text-rose-500 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-rose-600">Generation Failed</h3>
                    <p className="text-slate-500 mt-2 text-center max-w-md">{error}</p>
                    <button className="action-btn-list mt-6 border-none cursor-pointer" onClick={() => {
                        if (clearAssessmentCourse) clearAssessmentCourse();
                        setError("");
                    }}>
                        Return to Assessments
                    </button>
                </div>
            </div>
        );
    }

    const assessments = [
        { name: "JavaScript Core Basics", questions: 3, duration: "5 Mins", difficulty: "Beginner", topic: "JavaScript" },
        { name: "React Framework Proficiency", questions: 3, duration: "5 Mins", difficulty: "Intermediate", topic: "React" },
        { name: "Python Coding Skills", questions: 3, duration: "5 Mins", difficulty: "Beginner", topic: "Python" },
    ];

    const startQuiz = (test) => {
        setActiveTest(test);
        setCurrentIdx(0);
        setSelectedAnswers({});
        setScore(0);
        setQuizState("quiz");
    };

    const handleAnswerSelect = (optionIdx) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [currentIdx]: optionIdx
        });
    };

    const handleNext = () => {
        const questionsList = activeTest?.isCustom ? customQuestions : MOCK_QUESTIONS[activeTest.name];
        if (currentIdx < questionsList.length - 1) {
            setCurrentIdx(currentIdx + 1);
        } else {
            // Calculate final score
            let correct = 0;
            questionsList.forEach((q, idx) => {
                if (selectedAnswers[idx] === q.ans) {
                    correct++;
                }
            });
            const isPassed = correct >= (activeTest?.isCustom ? 8 : 2);
            setScore(correct);
            setQuizState("result");
            
            if (isPassed) {
                const badgeTitle = activeTest.isCustom 
                    ? `${assessmentCourse.title} Badge`
                    : `${activeTest.name} Badge`;
                    
                fetch("/api/profile/badges/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        course_title: activeTest.name,
                        badge_name: badgeTitle
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success && onBadgeEarned) {
                        onBadgeEarned();
                    }
                })
                .catch(err => console.error("Error recording badge:", err));
            }
        }
    };

    const handleBackToList = () => {
        setQuizState("list");
        setActiveTest(null);
        if (clearAssessmentCourse) {
            clearAssessmentCourse();
        }
    };

    if (quizState === "quiz" && activeTest) {
        const questionsList = activeTest.isCustom ? customQuestions : MOCK_QUESTIONS[activeTest.name];
        const currentQuestion = questionsList[currentIdx];
        const progressPercentage = ((currentIdx + 1) / questionsList.length) * 100;

        return (
            <div className="assessment-container">
                <div className="quiz-header-card">
                    <button className="back-btn-quiz" onClick={handleBackToList}>
                        <ArrowLeft size={16} />
                        <span>Quit Quiz</span>
                    </button>
                    <div className="quiz-info-header">
                        <h3>{activeTest.name}</h3>
                        <span className="quiz-badge-diff">{activeTest.difficulty}</span>
                    </div>
                </div>

                <div className="quiz-progress-wrapper">
                    <div className="quiz-progress-labels">
                        <span>Question {currentIdx + 1} of {questionsList.length}</span>
                        <span>{Math.round(progressPercentage)}% Complete</span>
                    </div>
                    <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                </div>

                <div className="quiz-question-card">
                    <h4 className="question-text">{currentQuestion.q}</h4>
                    <div className="quiz-options-list">
                        {currentQuestion.options.map((option, idx) => (
                            <button
                                key={idx}
                                className={`option-btn ${selectedAnswers[currentIdx] === idx ? "selected" : ""}`}
                                onClick={() => handleAnswerSelect(idx)}
                            >
                                <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                                <span className="option-text">{option}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="quiz-action-footer">
                    <button
                        className="quiz-next-btn"
                        disabled={selectedAnswers[currentIdx] === undefined}
                        onClick={handleNext}
                    >
                        <span>{currentIdx === questionsList.length - 1 ? "Submit Assessment" : "Next Question"}</span>
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        );
    }

    if (quizState === "result" && activeTest) {
        const questionsList = activeTest.isCustom ? customQuestions : MOCK_QUESTIONS[activeTest.name];
        const passed = score >= (activeTest.isCustom ? 8 : 2);

        return (
            <div className="assessment-container result-state-container">
                <div className="result-card">
                    {passed ? (
                        <div className="result-status-header pass">
                            <Award className="result-award-icon glow-pass" size={64} />
                            <h2>Certification Passed!</h2>
                            <p>You have successfully verified your skills in {activeTest.topic}.</p>
                        </div>
                    ) : (
                        <div className="result-status-header fail">
                            <XCircle className="result-award-icon glow-fail" size={64} />
                            <h2>Assessment Incomplete</h2>
                            <p>You didn't answer enough questions correctly. Try reviewing the coursework.</p>
                        </div>
                    )}

                    <div className="result-score-summary">
                        <div className="score-widget">
                            <span className="score-num">{score} / {questionsList.length}</span>
                            <span className="score-label">Correct Answers</span>
                        </div>
                        <div className="score-details-row">
                            <div className="score-detail-item">
                                <Clock size={16} />
                                <span>Duration: &lt; 2 mins</span>
                            </div>
                            <div className="score-detail-item">
                                <HelpCircle size={16} />
                                <span>Accuracy: {Math.round((score / questionsList.length) * 100)}%</span>
                            </div>
                        </div>
                    </div>

                    {passed && (
                        <div className="verified-badge-alert">
                            <CheckCircle2 size={18} className="badge-alert-icon" />
                            <span><strong>Verified Credential Awarded:</strong> A skill badge has been added to your profile card.</span>
                        </div>
                    )}

                    <div className="result-actions">
                        <button className="action-btn-retry" onClick={() => startQuiz(activeTest)}>
                            <RotateCcw size={16} />
                            <span>Retry Test</span>
                        </button>
                        <button className="action-btn-list" onClick={handleBackToList}>
                            <span>Return to Dashboard</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="assessment-view-container">
            <div className="section-header">
                <h2>Skills Assessments</h2>
                <p>Verify your expertise to get certified credentials and badges on your profile.</p>
            </div>
            
            <div className="assessment-grid">
                {assessments.map((test, i) => (
                    <div key={i} className="assessment-card-styled">
                        <div className="assessment-card-header">
                            <div className="assessment-icon-box">
                                <FileText size={20} />
                            </div>
                            <span className="difficulty-tag">{test.difficulty}</span>
                        </div>
                        
                        <div className="assessment-card-body">
                            <h3>{test.name}</h3>
                            <div className="assessment-meta-list">
                                <div className="meta-item">
                                    <HelpCircle size={14} />
                                    <span>{test.questions} Questions</span>
                                </div>
                                <div className="meta-item">
                                    <Clock size={14} />
                                    <span>{test.duration}</span>
                                </div>
                            </div>
                        </div>

                        <div className="assessment-card-footer">
                            <button className="start-assessment-btn" onClick={() => startQuiz(test)}>
                                <span>Start Assessment</span>
                                <ChevronRight size={15} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

