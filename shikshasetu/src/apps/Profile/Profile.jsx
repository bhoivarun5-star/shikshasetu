import { useState, useEffect } from "react";
import { User, Mail, Phone, Info, Save, Check, Plus, X, GraduationCap, Briefcase, Video, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./profile.css";

export default function Profile({ profileData, setProfileData }) {
    const [profileSaved, setProfileSaved] = useState(false);
    const [newSkill, setNewSkill] = useState("");
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    useEffect(() => {
        const fetchEnrolledCourses = async () => {
            try {
                const response = await fetch("/api/courses/videos/");
                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        const enrolled = data.videos.filter(v => v.is_enrolled);
                        setEnrolledCourses(enrolled);
                    }
                }
            } catch (err) {
                console.error("Error fetching enrolled courses for profile:", err);
            }
        };
        fetchEnrolledCourses();
    }, []);

    const handleProfileSave = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/profile/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profileData),
            });
            const data = await response.json();
            if (data.success) {
                setProfileSaved(true);
                setTimeout(() => setProfileSaved(false), 3000);
            } else {
                alert(data.message || "Failed to save profile.");
            }
        } catch (err) {
            console.error(err);
            alert("Error saving profile details.");
        }
    };

    const handleAddSkill = (e) => {
        e.preventDefault();
        if (!newSkill.trim()) return;

        const currentSkills = profileData.skills 
            ? profileData.skills.split(",").map(s => s.trim()).filter(Boolean)
            : [];
        
        if (!currentSkills.includes(newSkill.trim())) {
            const updated = [...currentSkills, newSkill.trim()].join(", ");
            setProfileData({
                ...profileData,
                skills: updated
            });
        }
        setNewSkill("");
    };

    const handleRemoveSkill = (skillToRemove) => {
        const currentSkills = profileData.skills 
            ? profileData.skills.split(",").map(s => s.trim()).filter(Boolean)
            : [];
        
        const updated = currentSkills.filter(s => s !== skillToRemove).join(", ");
        setProfileData({
            ...profileData,
            skills: updated
        });
    };

    const skillList = profileData.skills 
        ? profileData.skills.split(",").map(s => s.trim()).filter(Boolean)
        : [];

    return (
        <div className="profile-view-container">
            <div className="section-header">
                <h2>Profile Settings</h2>
                <p>Manage your academic details, bios, and verify skill portfolios.</p>
            </div>

            <div className="profile-dashboard-layout">

                {/* Profile Card View */}
                <div className="profile-preview-card">
                    <div className="student-profile-card">
                        <div className="card-top-decoration"></div>
                        <div className="student-avatar-big">
                            {profileData.name ? profileData.name.split(" ").map(w => w[0]).join("").toUpperCase() : "AS"}
                        </div>
                        <h2 className="student-name">{profileData.name || "Your Name"}</h2>
                        <p className="student-email">{profileData.email || "email@example.com"}</p>
                        {profileData.phone && <p className="student-phone">{profileData.phone}</p>}

                        <div className="student-card-divider"></div>

                        <div className="student-bio-block">
                            <h4>About Me</h4>
                            <p>{profileData.bio || "No summary provided yet. Add your professional summary in the form."}</p>
                        </div>

                        <div className="student-card-divider"></div>

                        <div className="student-skills-block">
                            <h4>Skills & Badges</h4>
                            <div className="student-skills-badge-list">
                                {skillList.length > 0 ? (
                                    skillList.map((skill, i) => (
                                        <span key={i} className="student-badge-pill">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <span className="no-skills-msg">No skills listed yet.</span>
                                )}
                            </div>
                        </div>

                        <div className="student-card-divider"></div>

                        <div className="student-courses-block" style={{ marginTop: "1rem" }}>
                            <h4 style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.92rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "0.75rem" }}>
                                <GraduationCap size={15} style={{ color: "#E8773F" }} /> Enrolled Courses & Progress
                            </h4>
                            <div className="student-courses-progress-list" style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                                {enrolledCourses.length > 0 ? (
                                    enrolledCourses.map((course) => (
                                        <div key={course.id} style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", fontWeight: "600" }}>
                                                <span style={{ color: "var(--text-main)", fontWeight: "650", fontSize: "0.85rem" }} title={course.title}>
                                                    {course.title}
                                                </span>
                                                <span style={{ color: "#E8773F" }}>{course.percentage}%</span>
                                            </div>
                                            <div style={{ height: "6px", background: "var(--border-color)", borderRadius: "3px", overflow: "hidden", width: "100%" }}>
                                                <div style={{ height: "100%", width: `${course.percentage}%`, background: "linear-gradient(90deg, #E8773F, #F2B345)", borderRadius: "3px", transition: "width 0.4s ease-out" }}></div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <span style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>No active course enrollments yet.</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

