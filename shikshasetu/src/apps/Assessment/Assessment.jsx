import { useState } from "react";
import { 
    Award, 
    CheckCircle2, 
    Clock, 
    ChevronRight, 
    RotateCcw, 
    FileText, 
    XCircle, 
    ArrowLeft, 
    HelpCircle 
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

export default function Assessment() {
    const [quizState, setQuizState] = useState("list"); // "list" | "quiz" | "result"
    const [activeTest, setActiveTest] = useState(null);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [score, setScore] = useState(0);

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
        const questionsList = MOCK_QUESTIONS[activeTest.name];
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
            setScore(correct);
            setQuizState("result");
        }
    };

    const handleBackToList = () => {
        setQuizState("list");
        setActiveTest(null);
    };

    if (quizState === "quiz" && activeTest) {
        const questionsList = MOCK_QUESTIONS[activeTest.name];
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
        const questionsList = MOCK_QUESTIONS[activeTest.name];
        const passed = score >= 2;

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

