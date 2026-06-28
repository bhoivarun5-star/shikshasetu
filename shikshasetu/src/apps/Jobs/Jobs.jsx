import { useState } from "react";
import { Search, Briefcase, MapPin, CreditCard, Calendar, Info, ExternalLink, Loader2, Sparkles } from "lucide-react";
import "./jobs.css";

export default function Jobs() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all"); // "all" | "remote" | "onsite"
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [jobsList, setJobsList] = useState([]);

    const handleSearchSubmit = async (e) => {
        if (e) e.preventDefault();
        const query = searchQuery.trim();
        if (!query) return;

        setIsLoading(true);
        setError("");

        const prompt = `Return a list of 6-8 real jobs or internships available on platforms like Indeed, Glassdoor, Wellfound, Foundit, and Hirect matching the search query: "${query}".
For each job, output a JSON object with keys:
- "id": A unique integer (1, 2, 3, etc.)
- "role": Name of the job role (e.g. Frontend Developer, Data Analyst Intern)
- "company": Name of the hiring company
- "pay": Salary or stipend range (e.g., ₹25,000/mo, ₹8-10 LPA)
- "type": Mode of work (e.g., Remote, On-site (Bangalore), Hybrid (Mumbai))
- "duration": Duration or job type (e.g., 6 Months, Full-time)
- "platform": The platform where it is available (must be one of: Indeed, Glassdoor, Wellfound, Foundit, Hirect)
- "tag": either "remote" or "onsite" based on the work type (remote/hybrid -> "remote", on-site -> "onsite")
- "link": A realistic URL link to apply for this job on the respective platform (e.g., https://www.indeed.com/viewjob..., https://www.glassdoor.com/Job/..., https://wellfound.com/jobs/..., https://foundit.in/..., https://hirect.in/...)

Format the output strictly as a JSON array. Do not wrap the JSON in markdown code blocks like \`\`\`json. Return only the JSON string.`;

        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer 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",
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
            let text = data.choices[0].message.content.trim();
            
            if (text.startsWith("```")) {
                text = text.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
            }

            const parsed = JSON.parse(text);
            if (Array.isArray(parsed) && parsed.length > 0) {
                setJobsList(parsed);
            } else {
                throw new Error("Response is not a valid JSON array.");
            }
        } catch (err) {
            console.error("OpenRouter API error:", err);
            setError("Failed to fetch jobs. Please check your query or try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredJobs = jobsList.filter(job => {
        const query = searchQuery.toLowerCase();
        const matchesQuery = 
            (job.role && job.role.toLowerCase().includes(query)) ||
            (job.company && job.company.toLowerCase().includes(query)) ||
            (job.type && job.type.toLowerCase().includes(query)) ||
            (job.platform && job.platform.toLowerCase().includes(query));

        const matchesFilter = 
            activeFilter === "all" ||
            job.tag === activeFilter;

        return matchesQuery && matchesFilter;
    });

    return (
        <div className="jobs-view-container">
            <div className="section-header">
                <h2>Jobs & Internships</h2>
                <p>Find placement matches matching your skillset. Apply instantly on original platform.</p>
            </div>

            {/* Filter controls */}
            <div className="jobs-controls-bar">
                <form onSubmit={handleSearchSubmit} className="search-box-wrapper flex items-center gap-2 flex-grow max-w-lg">
                    <div className="relative flex-grow">
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Search jobs (e.g. React Developer, Data Analyst...)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="jobs-search-input pl-10 pr-4 py-2 border rounded-xl w-full text-sm focus:outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || !searchQuery.trim()}
                        className="py-2.5 px-4 bg-[#e8773f] text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[#d6652e] disabled:opacity-50"
                        style={{ height: '46px', border: 'none', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={16} />
                                Searching...
                            </>
                        ) : (
                            <>
                                <Search size={16} />
                                Find Jobs
                            </>
                        )}
                    </button>
                </form>

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

            {error && (
                <div className="error-msg-box text-red-500 bg-red-50 dark:bg-red-950/30 p-4 rounded-xl border border-red-200 dark:border-red-900 text-sm mb-4">
                    {error}
                </div>
            )}

            {/* Jobs list grid */}
            {filteredJobs.length > 0 ? (
                <div className="jobs-grid">
                    {filteredJobs.map((job) => (
                        <div key={job.id} className="job-card-styled">
                            <div className="job-card-header flex justify-between items-start">
                                <div className="company-logo-badge">
                                    {job.company ? job.company[0] : "J"}
                                </div>
                                <div className="flex flex-col items-end gap-1.5">
                                    <span className={`platform-pill ${job.platform ? job.platform.toLowerCase() : "other"}`}>
                                        {job.platform || "Direct"}
                                    </span>
                                    <span className="job-type-pill">{job.type}</span>
                                </div>
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

                            <div className="job-card-footer flex justify-end w-full">
                                <a
                                    href={job.link || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="easy-apply-btn flex items-center gap-1.5 py-2 px-4 text-xs font-bold"
                                    style={{ textDecoration: 'none' }}
                                >
                                    <span>Apply on {job.platform || "Platform"}</span>
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-jobs-card">
                    <Briefcase size={24} />
                    <p>
                        {searchQuery 
                            ? "No job placements found matching your filters." 
                            : "Search for job roles, skills, or platforms to find active opportunities."
                        }
                    </p>
                </div>
            )}
        </div>
    );
}
