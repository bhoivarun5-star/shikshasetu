import { useState } from "react";
import { Search, Briefcase, MapPin, CreditCard, Calendar, CheckCircle2, X, Info, ChevronRight } from "lucide-react";
import "./jobs.css";

export default function Jobs() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all"); // "all" | "remote" | "onsite"
    const [appliedJobs, setAppliedJobs] = useState({}); // { jobId: true }
    const [successJob, setSuccessJob] = useState(null);

    const jobs = [
        { id: 1, role: "Frontend Development Intern", company: "TechCorp", pay: "₹20,000/mo", type: "Remote", duration: "6 Months", tag: "remote" },
        { id: 2, role: "Junior Software Engineer", company: "DevStudio", pay: "₹6.5 LPA", type: "On-site (Bangalore)", duration: "Full-time", tag: "onsite" },
        { id: 3, role: "Product Design Intern", company: "Designly", pay: "₹15,000/mo", type: "Remote", duration: "3 Months", tag: "remote" },
    ];

    const filteredJobs = jobs.filter(job => {
        const query = searchQuery.toLowerCase();
        const matchesQuery = 
            (job.role && job.role.toLowerCase().includes(query)) ||
            (job.company && job.company.toLowerCase().includes(query)) ||
            (job.type && job.type.toLowerCase().includes(query));

        const matchesFilter = 
            activeFilter === "all" ||
            job.tag === activeFilter;

        return matchesQuery && matchesFilter;
    });

    const handleApply = (job) => {
        setAppliedJobs({
            ...appliedJobs,
            [job.id]: true
        });
        setSuccessJob(job);
    };

    return (
        <div className="jobs-view-container">
            <div className="section-header">
                <h2>Jobs & Internships</h2>
                <p>Find placement matches matching your skillset. Apply instantly with your profile card.</p>
            </div>

            {/* Filter controls */}
            <div className="jobs-controls-bar">
                <div className="search-box-wrapper">
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search by title, company or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="jobs-search-input"
                    />
                </div>

                <div className="filter-tabs-wrapper">
                    <button 
                        className={`filter-tab-btn ${activeFilter === "all" ? "active" : ""}`}
                        onClick={() => setActiveFilter("all")}
                    >
                        All Positions
                    </button>
                    <button 
                        className={`filter-tab-btn ${activeFilter === "remote" ? "active" : ""}`}
                        onClick={() => setActiveFilter("remote")}
                    >
                        Remote
                    </button>
                    <button 
                        className={`filter-tab-btn ${activeFilter === "onsite" ? "active" : ""}`}
                        onClick={() => setActiveFilter("onsite")}
                    >
                        On-Site
                    </button>
                </div>
            </div>

            {/* Jobs list grid */}
            {filteredJobs.length > 0 ? (
                <div className="jobs-grid">
                    {filteredJobs.map((job) => {
                        const isApplied = appliedJobs[job.id];
                        return (
                            <div key={job.id} className="job-card-styled">
                                <div className="job-card-header">
                                    <div className="company-logo-badge">
                                        {job.company[0]}
                                    </div>
                                    <span className="job-type-pill">{job.type}</span>
                                </div>

                                <div className="job-card-body">
                                    <h3 className="job-role-title">{job.role}</h3>
                                    <p className="job-company-name">{job.company}</p>

                                    <div className="job-metadata-badges">
                                        <div className="job-meta-pill">
                                            <CreditCard size={13} />
                                            <span>{job.pay}</span>
                                        </div>
                                        <div className="job-meta-pill">
                                            <Calendar size={13} />
                                            <span>{job.duration}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="job-footer-divider"></div>

                                <div className="job-card-footer">
                                    {isApplied ? (
                                        <button className="applied-btn-styled" disabled>
                                            <CheckCircle2 size={14} />
                                            <span>Applied</span>
                                        </button>
                                    ) : (
                                        <button className="easy-apply-btn" onClick={() => handleApply(job)}>
                                            <span>Easy Apply</span>
                                            <ChevronRight size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="no-jobs-card">
                    <Info size={24} />
                    <p>No job placements found matching your filters.</p>
                </div>
            )}

            {/* Success apply modal */}
            {successJob && (
                <div className="modal-overlay">
                    <div className="modal-dialog-box success-dialog">
                        <div className="success-lottie-mock">
                            <CheckCircle2 size={48} className="success-checkmark-glow" />
                        </div>
                        <h3>Application Successful!</h3>
                        <p>
                            Your profile, skills credentials, and resume have been submitted to <strong>{successJob.company}</strong> for the <strong>{successJob.role}</strong> position.
                        </p>
                        <div className="application-timeline-mock">
                            <div className="timeline-step done">
                                <span className="dot"></span>
                                <span className="label">Profile Sent</span>
                            </div>
                            <div className="timeline-step active">
                                <span className="dot"></span>
                                <span className="label">Recruiter Review</span>
                            </div>
                        </div>
                        <button className="dismiss-dialog-btn" onClick={() => setSuccessJob(null)}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

