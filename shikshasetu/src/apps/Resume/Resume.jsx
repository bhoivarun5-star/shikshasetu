import { useState } from "react";
import { 
    User, 
    Mail, 
    Phone, 
    Briefcase, 
    Wrench, 
    Sparkles, 
    Download, 
    Plus, 
    Trash, 
    MapPin, 
    Globe, 
    GraduationCap, 
    FileText,
    ArrowLeft,
    CheckCircle
} from "lucide-react";
import "./resume.css";

// Import all 10 template CSS files
import "./templates/template1.css";
import "./templates/template2.css";
import "./templates/template3.css";
import "./templates/template4.css";
import "./templates/template5.css";
import "./templates/template6.css";
import "./templates/template7.css";
import "./templates/template8.css";
import "./templates/template9.css";
import "./templates/template10.css";

const TEMPLATES = [
    { id: 1, name: "Modern Minimalist", desc: "Clean sans-serif typography, elegant slate margins.", category: "Minimalist" },
    { id: 2, name: "Professional Executive", desc: "Centered serif titles, deep navy accent lines.", category: "Corporate" },
    { id: 3, name: "Creative Teal Sidebar", desc: "Two-column grid layout with a colored sidebar.", category: "Creative" },
    { id: 4, name: "Classic Academic", desc: "Double-ruled horizontal lines, Georgia layout.", category: "Academic" },
    { id: 5, name: "Developer Monospace", desc: "Dashed margins, monospace variables, tech-focused.", category: "Technical" },
    { id: 6, name: "Bold Coral Banner", desc: "Vibrant coral top block header with white text.", category: "Bold" },
    { id: 7, name: "Sleek Rose Burgundy", desc: "Burgundy borders, sophisticated margins, serif styling.", category: "Elegant" },
    { id: 8, name: "Startup Violet", desc: "Modern rounded boxes, micro-padding, violet accents.", category: "Modern" },
    { id: 9, name: "Compact Minimal", desc: "Compressed font-heights, dense structure for 1 page.", category: "Dense" },
    { id: 10, name: "Corporate Royal", desc: "Royal blue sidebar accent tabs, premium professional.", category: "Corporate" }
];

export default function Resume() {
    const [selectedTemplate, setSelectedTemplate] = useState(null); // null means template select grid screen
    const [downloading, setDownloading] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    // Form data states
    const [personalInfo, setPersonalInfo] = useState({
        name: "Aarav Sharma",
        title: "Frontend Developer & UI/UX Designer",
        email: "aarav.sharma@example.com",
        phone: "+91 98765 43210",
        location: "Bangalore, India",
        website: "github.com/aaravsharma"
    });

    const [summary, setSummary] = useState("Result-oriented Frontend Developer with 2+ years of experience building high-performance, responsive web applications. Expert in React, JavaScript, and modern CSS frameworks, with a passion for clean code and user-centered design.");

    const [experienceList, setExperienceList] = useState([
        {
            id: 1,
            role: "Software Engineering Intern",
            company: "TechCorp Solutions",
            duration: "June 2025 - Dec 2025",
            description: "Developed and optimized 10+ frontend features using React.js and Tailwind CSS.\nCollaborated in an agile team of 5 to integrate RESTful backend API endpoints.\nReduced page load times by 25% through lazy loading and bundle size analysis."
        },
        {
            id: 2,
            role: "Frontend Developer",
            company: "Freelance & Open Source",
            duration: "2024 - Present",
            description: "Built responsive landing pages and web apps for local businesses and startups.\nContributed to public repositories, improving accessibility (a11y) and SEO rankings."
        }
    ]);

    const [educationList, setEducationList] = useState([
        {
            id: 1,
            degree: "Bachelor of Technology in Computer Science",
            school: "Indian Institute of Technology, Bangalore",
            duration: "2022 - 2026",
            gpa: "9.2 CGPA"
        }
    ]);

    const [projectsList, setProjectsList] = useState([
        {
            id: 1,
            title: "ShikshaSetu",
            role: "Core Developer",
            description: "An AI-powered placement platform providing career roadmaps, job listings, and dynamic resume builders.",
            link: "github.com/shikshasetu"
        }
    ]);

    const [skillsInput, setSkillsInput] = useState("React, JavaScript, CSS, HTML, Tailwind CSS, Python, Django, Git");

    // Handlers
    const addExperience = () => {
        setExperienceList([...experienceList, {
            id: Date.now(),
            role: "",
            company: "",
            duration: "",
            description: ""
        }]);
    };

    const removeExperience = (id) => {
        setExperienceList(experienceList.filter(item => item.id !== id));
    };

    const updateExperience = (id, key, val) => {
        setExperienceList(experienceList.map(item => 
            item.id === id ? { ...item, [key]: val } : item
        ));
    };

    const addEducation = () => {
        setEducationList([...educationList, {
            id: Date.now(),
            degree: "",
            school: "",
            duration: "",
            gpa: ""
        }]);
    };

    const removeEducation = (id) => {
        setEducationList(educationList.filter(item => item.id !== id));
    };

    const updateEducation = (id, key, val) => {
        setEducationList(educationList.map(item => 
            item.id === id ? { ...item, [key]: val } : item
        ));
    };

    const addProject = () => {
        setProjectsList([...projectsList, {
            id: Date.now(),
            title: "",
            role: "",
            description: "",
            link: ""
        }]);
    };

    const removeProject = (id) => {
        setProjectsList(projectsList.filter(item => item.id !== id));
    };

    const updateProject = (id, key, val) => {
        setProjectsList(projectsList.map(item => 
            item.id === id ? { ...item, [key]: val } : item
        ));
    };

    const handleDownload = (e) => {
        if (e) e.preventDefault();
        setDownloading(true);

        setTimeout(() => {
            const printContent = document.getElementById("ats-resume-sheet-preview").innerHTML;
            const printPortal = document.createElement("div");
            printPortal.className = `resume-print-portal template-${selectedTemplate}`;
            printPortal.innerHTML = printContent;
            document.body.appendChild(printPortal);

            document.body.classList.add("printing-resume");
            
            setTimeout(() => {
                window.print();
                document.body.classList.remove("printing-resume");
                document.body.removeChild(printPortal);
                setDownloading(false);
                setShowSuccessToast(true);
                setTimeout(() => setShowSuccessToast(false), 3000);
            }, 150);
        }, 300);
    };

    const renderResumeSheetContent = () => {
        return (
            <div className="resume-grid-container">
                <div className="resume-left-column">
                    {/* Header info for templates that stack or show in sidebar */}
                    <div className="ats-contact-block">
                        <h4 className="sidebar-title">Contact</h4>
                        <div className="ats-contact-row">
                            {personalInfo.email && (
                                <span>
                                    <Mail size={12} style={{ marginRight: '6px', display: 'inline' }} />
                                    {personalInfo.email}
                                </span>
                            )}
                            {personalInfo.phone && (
                                <span>
                                    <Phone size={12} style={{ marginRight: '6px', display: 'inline' }} />
                                    {personalInfo.phone}
                                </span>
                            )}
                            {personalInfo.location && (
                                <span>
                                    <MapPin size={12} style={{ marginRight: '6px', display: 'inline' }} />
                                    {personalInfo.location}
                                </span>
                            )}
                            {personalInfo.website && (
                                <span>
                                    <Globe size={12} style={{ marginRight: '6px', display: 'inline' }} />
                                    {personalInfo.website}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="ats-skills-block" style={{ marginTop: '1.5rem' }}>
                        <h4 className="sidebar-title">Skills</h4>
                        <div className="ats-skills-grid">
                            {skillsInput ? (
                                skillsInput.split(",").map((s, idx) => (
                                    <span key={idx} className="ats-skill-pill">
                                        {s.trim()}
                                    </span>
                                ))
                            ) : (
                                <span className="placeholder-text">Add skills...</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="resume-right-column">
                    <div className="ats-header">
                        <h1 className="ats-name">{personalInfo.name || "Your Name"}</h1>
                        <div className="ats-title">{personalInfo.title || "Professional Title"}</div>
                        
                        {/* Inline contacts row for template structures that show it centered/top */}
                        <div className="ats-contact-row ats-header-contacts" style={{ marginTop: '0.5rem', display: 'none' }}>
                            {personalInfo.email && <span>{personalInfo.email}</span>}
                            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
                            {personalInfo.location && <span>• {personalInfo.location}</span>}
                            {personalInfo.website && <span>• {personalInfo.website}</span>}
                        </div>
                    </div>

                    {summary && (
                        <div className="ats-section">
                            <h2 className="ats-sec-title">Summary</h2>
                            <p className="ats-summary-text">{summary}</p>
                        </div>
                    )}

                    {experienceList.length > 0 && (
                        <div className="ats-section">
                            <h2 className="ats-sec-title">Experience</h2>
                            {experienceList.map((item) => (
                                <div key={item.id} className="ats-experience-block">
                                    <div className="ats-block-header">
                                        <span className="ats-block-title">{item.role || "Role"}</span>
                                        <span className="ats-block-subtitle">at {item.company || "Company"}</span>
                                        <span className="ats-block-date">{item.duration || "Duration"}</span>
                                    </div>
                                    {item.description && (
                                        <p className="ats-block-desc">{item.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {projectsList.length > 0 && (
                        <div className="ats-section">
                            <h2 className="ats-sec-title">Projects</h2>
                            {projectsList.map((item) => (
                                <div key={item.id} className="ats-project-block">
                                    <div className="ats-block-header">
                                        <span className="ats-block-title">{item.title || "Project Title"}</span>
                                        {item.role && <span className="ats-block-subtitle">({item.role})</span>}
                                        {item.link && <span className="ats-block-date">{item.link}</span>}
                                    </div>
                                    {item.description && (
                                        <p className="ats-block-desc">{item.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {educationList.length > 0 && (
                        <div className="ats-section">
                            <h2 className="ats-sec-title">Education</h2>
                            {educationList.map((item) => (
                                <div key={item.id} className="ats-education-block">
                                    <div className="ats-block-header">
                                        <span className="ats-block-title">{item.degree || "Degree"}</span>
                                        <span className="ats-block-subtitle">at {item.school || "School"}</span>
                                        <span className="ats-block-date">{item.duration || "Duration"}</span>
                                    </div>
                                    {item.gpa && (
                                        <p className="ats-block-desc">{item.gpa}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderMiniPreview = (tplId) => {
        return (
            <div className={`mini-preview-container template-${tplId}`}>
                <div className="mini-resume-sheet">
                    {tplId === 3 ? (
                        <div className="mini-two-col">
                            <div className="mini-sidebar-teal">
                                <div className="mini-circle"></div>
                                <div className="mini-line-short light"></div>
                                <div className="mini-line-short light"></div>
                            </div>
                            <div className="mini-main-col">
                                <div className="mini-line bold-teal"></div>
                                <div className="mini-line slim"></div>
                                <div className="mini-section-line"></div>
                                <div className="mini-line-short"></div>
                                <div className="mini-line-short"></div>
                            </div>
                        </div>
                    ) : tplId === 6 ? (
                        <div className="mini-coral-layout">
                            <div className="mini-coral-banner">
                                <div className="mini-line bold-white"></div>
                                <div className="mini-line-short light"></div>
                            </div>
                            <div className="mini-body-padding">
                                <div className="mini-section-line coral"></div>
                                <div className="mini-line-short"></div>
                                <div className="mini-line-short"></div>
                            </div>
                        </div>
                    ) : tplId === 2 ? (
                        <div className="mini-centered-layout">
                            <div className="mini-center-header">
                                <div className="mini-line bold center"></div>
                                <div className="mini-line-short center"></div>
                                <div className="mini-double-line"></div>
                            </div>
                            <div className="mini-body-padding">
                                <div className="mini-section-line"></div>
                                <div className="mini-line-short"></div>
                                <div className="mini-line-short"></div>
                            </div>
                        </div>
                    ) : tplId === 8 ? (
                        <div className="mini-startup-layout">
                            <div className="mini-startup-header">
                                <div>
                                    <div className="mini-line bold-purple"></div>
                                    <div className="mini-line-short"></div>
                                </div>
                                <div className="mini-circle-purple"></div>
                            </div>
                            <div className="mini-body-padding">
                                <div className="mini-section-line purple"></div>
                                <div className="mini-line-short"></div>
                                <div className="mini-line-short"></div>
                            </div>
                        </div>
                    ) : tplId === 5 ? (
                        <div className="mini-code-layout">
                            <div className="mini-code-header">
                                <div className="mini-line code-green"></div>
                                <div className="mini-line-short"></div>
                            </div>
                            <div className="mini-body-padding">
                                <div className="mini-section-line code-bg"></div>
                                <div className="mini-line-short"></div>
                                <div className="mini-line-short"></div>
                            </div>
                        </div>
                    ) : tplId === 7 ? (
                        <div className="mini-rose-layout">
                            <div className="mini-rose-header">
                                <div className="mini-line bold-rose"></div>
                                <div className="mini-line-short"></div>
                            </div>
                            <div className="mini-body-padding">
                                <div className="mini-section-line rose-dashed"></div>
                                <div className="mini-line-short"></div>
                                <div className="mini-line-short"></div>
                            </div>
                        </div>
                    ) : tplId === 10 ? (
                        <div className="mini-royal-layout">
                            <div className="mini-royal-header">
                                <div className="mini-line bold-royal"></div>
                                <div className="mini-line-short"></div>
                            </div>
                            <div className="mini-body-padding">
                                <div className="mini-section-line royal-border"></div>
                                <div className="mini-line-short"></div>
                                <div className="mini-line-short"></div>
                            </div>
                        </div>
                    ) : (
                        <div className="mini-standard-layout">
                            <div className="mini-standard-header">
                                <div className="mini-line bold"></div>
                                <div className="mini-line-short"></div>
                            </div>
                            <div className="mini-body-padding">
                                <div className="mini-section-line"></div>
                                <div className="mini-line-short"></div>
                                <div className="mini-line-short"></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Render template selection list
    if (selectedTemplate === null) {
        return (
            <div className="resume-view-container">
                <div className="section-header">
                    <h2>Select Resume Template</h2>
                    <p>Choose from our premium styled, applicant-tracking-system (ATS) optimized templates to get started.</p>
                </div>

                <div className="templates-selector-container">
                    <div className="templates-grid">
                        {TEMPLATES.map((tpl) => (
                            <div 
                                key={tpl.id} 
                                className="template-card"
                                onClick={() => setSelectedTemplate(tpl.id)}
                            >
                                <div className="template-card-preview">
                                    {renderMiniPreview(tpl.id)}
                                </div>
                                <div className="template-card-info">
                                    <h4>{tpl.name}</h4>
                                    <p>{tpl.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="resume-view-container">
            <div className="section-header">
                <h2>Resume Builder</h2>
                <p>Fill out the details on the left, and preview your premium styled resume on the right.</p>
            </div>

            <div className="resume-builder-layout">
                {/* Editor Section */}
                <div className="resume-editor-panel">
                    <div className="editor-card-header">
                        <div className="editor-card-header-info">
                            <Sparkles size={16} className="sparkle-icon" />
                            <h3>Resume Details</h3>
                        </div>
                        <button 
                            className="back-templates-btn flex items-center gap-1"
                            onClick={() => setSelectedTemplate(null)}
                        >
                            <ArrowLeft size={12} />
                            <span>Templates</span>
                        </button>
                    </div>

                    <form onSubmit={handleDownload} className="resume-form-inner">
                        {/* Personal Info */}
                        <div className="editor-form-group">
                            <label>
                                <User size={14} />
                                <span>Full Name</span>
                            </label>
                            <input
                                type="text"
                                value={personalInfo.name}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="editor-form-group">
                            <label>
                                <Briefcase size={14} />
                                <span>Professional Title</span>
                            </label>
                            <input
                                type="text"
                                value={personalInfo.title}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="editor-form-row">
                            <div className="editor-form-group">
                                <label>
                                    <Mail size={14} />
                                    <span>Email</span>
                                </label>
                                <input
                                    type="email"
                                    value={personalInfo.email}
                                    onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="editor-form-group">
                                <label>
                                    <Phone size={14} />
                                    <span>Phone</span>
                                </label>
                                <input
                                    type="text"
                                    value={personalInfo.phone}
                                    onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="editor-form-row">
                            <div className="editor-form-group">
                                <label>
                                    <MapPin size={14} />
                                    <span>Location</span>
                                </label>
                                <input
                                    type="text"
                                    value={personalInfo.location}
                                    onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                                />
                            </div>
                            <div className="editor-form-group">
                                <label>
                                    <Globe size={14} />
                                    <span>Portfolio / Website</span>
                                </label>
                                <input
                                    type="text"
                                    value={personalInfo.website}
                                    onChange={(e) => setPersonalInfo({ ...personalInfo, website: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="form-section-divider"></div>
                        <div className="form-section-title">Professional Summary</div>
                        <div className="editor-form-group">
                            <textarea
                                rows={3}
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                placeholder="Write a brief professional summary..."
                            />
                        </div>

                        {/* Skills */}
                        <div className="form-section-divider"></div>
                        <div className="form-section-title">Skills & Competencies</div>
                        <div className="editor-form-group">
                            <label>
                                <Wrench size={14} />
                                <span>Skills (Comma Separated)</span>
                            </label>
                            <input
                                type="text"
                                value={skillsInput}
                                onChange={(e) => setSkillsInput(e.target.value)}
                                required
                            />
                        </div>

                        {/* Experience */}
                        <div className="form-section-divider"></div>
                        <div className="form-section-title">
                            <span>Experience</span>
                            <button 
                                type="button" 
                                className="back-templates-btn" 
                                style={{ padding: '0.2rem 0.5rem' }} 
                                onClick={addExperience}
                            >
                                <Plus size={12} />
                            </button>
                        </div>
                        {experienceList.map((item) => (
                            <div key={item.id} className="dynamic-form-item">
                                <button 
                                    type="button" 
                                    className="remove-item-btn" 
                                    onClick={() => removeExperience(item.id)}
                                >
                                    <Trash size={14} />
                                </button>
                                <div className="editor-form-group mb-2">
                                    <input 
                                        type="text" 
                                        placeholder="Job Role / Title"
                                        value={item.role} 
                                        onChange={(e) => updateExperience(item.id, 'role', e.target.value)}
                                        style={{ width: '90%', padding: '6px 10px', fontSize: '0.85rem' }}
                                    />
                                </div>
                                <div className="editor-form-row mb-2">
                                    <input 
                                        type="text" 
                                        placeholder="Company"
                                        value={item.company} 
                                        onChange={(e) => updateExperience(item.id, 'company', e.target.value)}
                                        style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Duration (e.g. 2024 - Present)"
                                        value={item.duration} 
                                        onChange={(e) => updateExperience(item.id, 'duration', e.target.value)}
                                        style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                                    />
                                </div>
                                <div className="editor-form-group">
                                    <textarea 
                                        rows={2} 
                                        placeholder="Job description or bullet points..."
                                        value={item.description} 
                                        onChange={(e) => updateExperience(item.id, 'description', e.target.value)}
                                        style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                                    />
                                </div>
                            </div>
                        ))}

                        {/* Projects */}
                        <div className="form-section-divider"></div>
                        <div className="form-section-title">
                            <span>Projects</span>
                            <button 
                                type="button" 
                                className="back-templates-btn" 
                                style={{ padding: '0.2rem 0.5rem' }} 
                                onClick={addProject}
                            >
                                <Plus size={12} />
                            </button>
                        </div>
                        {projectsList.map((item) => (
                            <div key={item.id} className="dynamic-form-item">
                                <button 
                                    type="button" 
                                    className="remove-item-btn" 
                                    onClick={() => removeProject(item.id)}
                                >
                                    <Trash size={14} />
                                </button>
                                <div className="editor-form-group mb-2">
                                    <input 
                                        type="text" 
                                        placeholder="Project Title"
                                        value={item.title} 
                                        onChange={(e) => updateProject(item.id, 'title', e.target.value)}
                                        style={{ width: '90%', padding: '6px 10px', fontSize: '0.85rem' }}
                                    />
                                </div>
                                <div className="editor-form-row mb-2">
                                    <input 
                                        type="text" 
                                        placeholder="Role (e.g. Lead Developer)"
                                        value={item.role} 
                                        onChange={(e) => updateProject(item.id, 'role', e.target.value)}
                                        style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Link (e.g. github.com/...)"
                                        value={item.link} 
                                        onChange={(e) => updateProject(item.id, 'link', e.target.value)}
                                        style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                                    />
                                </div>
                                <div className="editor-form-group">
                                    <textarea 
                                        rows={2} 
                                        placeholder="Project description..."
                                        value={item.description} 
                                        onChange={(e) => updateProject(item.id, 'description', e.target.value)}
                                        style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                                    />
                                </div>
                            </div>
                        ))}

                        {/* Education */}
                        <div className="form-section-divider"></div>
                        <div className="form-section-title">
                            <span>Education</span>
                            <button 
                                type="button" 
                                className="back-templates-btn" 
                                style={{ padding: '0.2rem 0.5rem' }} 
                                onClick={addEducation}
                            >
                                <Plus size={12} />
                            </button>
                        </div>
                        {educationList.map((item) => (
                            <div key={item.id} className="dynamic-form-item">
                                <button 
                                    type="button" 
                                    className="remove-item-btn" 
                                    onClick={() => removeEducation(item.id)}
                                >
                                    <Trash size={14} />
                                </button>
                                <div className="editor-form-group mb-2">
                                    <input 
                                        type="text" 
                                        placeholder="Degree (e.g. B.Tech Computer Science)"
                                        value={item.degree} 
                                        onChange={(e) => updateEducation(item.id, 'degree', e.target.value)}
                                        style={{ width: '90%', padding: '6px 10px', fontSize: '0.85rem' }}
                                    />
                                </div>
                                <div className="editor-form-row mb-2">
                                    <input 
                                        type="text" 
                                        placeholder="School / University"
                                        value={item.school} 
                                        onChange={(e) => updateEducation(item.id, 'school', e.target.value)}
                                        style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Duration (e.g. 2022 - 2026)"
                                        value={item.duration} 
                                        onChange={(e) => updateEducation(item.id, 'duration', e.target.value)}
                                        style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                                    />
                                </div>
                                <div className="editor-form-group">
                                    <input 
                                        type="text" 
                                        placeholder="GPA / Score (e.g. 9.2 CGPA)"
                                        value={item.gpa} 
                                        onChange={(e) => updateEducation(item.id, 'gpa', e.target.value)}
                                        style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                                    />
                                </div>
                            </div>
                        ))}

                        <button 
                            type="submit" 
                            className="download-resume-btn" 
                            disabled={downloading}
                        >
                            <Download size={16} />
                            <span>{downloading ? "Exporting PDF..." : "Download Resume PDF"}</span>
                        </button>

                        {showSuccessToast && (
                            <div className="resume-success-toast">
                                <CheckCircle size={16} />
                                <span>PDF download started! Please save from print window.</span>
                            </div>
                        )}
                    </form>
                </div>

                {/* Live Preview Column */}
                <div className="resume-preview-panel">
                    <div className="preview-card-header">
                        <h3>Template Preview ({TEMPLATES.find(t => t.id === selectedTemplate)?.name})</h3>
                    </div>

                    <div className="preview-scale-wrapper">
                        <div 
                            id="ats-resume-sheet-preview"
                            className={`ats-resume-sheet template-${selectedTemplate}`}
                        >
                            {renderResumeSheetContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
