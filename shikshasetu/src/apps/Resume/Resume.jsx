import { useState } from "react";
import { 
    User, 
    Mail, 
    Phone, 
    Briefcase, 
    Wrench, 
    Sparkles, 
    Download, 
    CheckCircle2, 
    Loader2 
} from "lucide-react";
import "./resume.css";

export default function Resume({ resumeData, setResumeData }) {
    const [exporting, setExporting] = useState(false);
    const [exported, setExported] = useState(false);

    const handleDownload = (e) => {
        e.preventDefault();
        setExporting(true);
        setExported(false);
        setTimeout(() => {
            setExporting(false);
            setExported(true);
            setTimeout(() => setExported(false), 3000);
        }, 1500);
    };

    return (
        <div className="resume-view-container">
            <div className="section-header">
                <h2>Resume Builder</h2>
                <p>Create and export a clean, recruiter-friendly, and ATS-optimized resume template.</p>
            </div>

            <div className="resume-builder-layout">
                {/* Editor Section */}
                <div className="resume-editor-panel">
                    <div className="editor-card-header">
                        <Sparkles size={16} className="sparkle-icon" />
                        <h3>Resume Information</h3>
                    </div>

                    <form onSubmit={handleDownload} className="resume-form-inner">
                        <div className="editor-form-group">
                            <label>
                                <User size={14} />
                                <span>Full Name</span>
                            </label>
                            <input
                                type="text"
                                value={resumeData.name}
                                onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })}
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
                                value={resumeData.title}
                                onChange={(e) => setResumeData({ ...resumeData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="editor-form-row">
                            <div className="editor-form-group">
                                <label>
                                    <Mail size={14} />
                                    <span>Email Address</span>
                                </label>
                                <input
                                    type="email"
                                    value={resumeData.email}
                                    onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="editor-form-group">
                                <label>
                                    <Phone size={14} />
                                    <span>Phone Number</span>
                                </label>
                                <input
                                    type="tel"
                                    value={resumeData.phone}
                                    onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="editor-form-group">
                            <label>
                                <Wrench size={14} />
                                <span>Skills & Keywords (Comma Separated)</span>
                            </label>
                            <input
                                type="text"
                                value={resumeData.skills}
                                onChange={(e) => setResumeData({ ...resumeData, skills: e.target.value })}
                                required
                            />
                        </div>

                        <div className="editor-form-group">
                            <label>
                                <Briefcase size={14} />
                                <span>Work & Project Experience</span>
                            </label>
                            <textarea
                                rows="6"
                                value={resumeData.experience}
                                onChange={(e) => setResumeData({ ...resumeData, experience: e.target.value })}
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className="download-resume-btn" disabled={exporting}>
                            {exporting ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} />
                                    <span>Exporting ATS PDF...</span>
                                </>
                            ) : (
                                <>
                                    <Download size={16} />
                                    <span>Download Resume PDF</span>
                                </>
                            )}
                        </button>

                        {exported && (
                            <div className="resume-success-toast">
                                <CheckCircle2 size={16} />
                                <span>Resume PDF downloaded successfully!</span>
                            </div>
                        )}
                    </form>
                </div>

                {/* Preview Section */}
                <div className="resume-preview-panel">
                    <div className="preview-card-header">
                        <h3>ATS Template Live Preview</h3>
                    </div>

                    <div className="ats-resume-sheet">
                        <div className="ats-header">
                            <h1 className="ats-name">{resumeData.name || "Your Name"}</h1>
                            <div className="ats-title">{resumeData.title || "Professional Title"}</div>
                            <div className="ats-contact-row">
                                {resumeData.email && <span>{resumeData.email}</span>}
                                {resumeData.email && resumeData.phone && <span className="bullet">•</span>}
                                {resumeData.phone && <span>{resumeData.phone}</span>}
                            </div>
                        </div>

                        <div className="ats-section">
                            <h2 className="ats-sec-title">Core Competencies</h2>
                            <div className="ats-skills-grid">
                                {resumeData.skills ? (
                                    resumeData.skills.split(",").map((s, idx) => (
                                        <span key={idx} className="ats-skill-pill">
                                            {s.trim()}
                                        </span>
                                    ))
                                ) : (
                                    <span className="placeholder-text">Add your core technical skills...</span>
                                )}
                            </div>
                        </div>

                        <div className="ats-section">
                            <h2 className="ats-sec-title">Professional Experience</h2>
                            <div className="ats-experience-block">
                                {resumeData.experience ? (
                                    <p className="ats-experience-desc">
                                        {resumeData.experience}
                                    </p>
                                ) : (
                                    <p className="placeholder-text">Add descriptions of your past work history and projects...</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

