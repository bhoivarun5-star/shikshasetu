import "./scholarship.css";

export default function Scholarship({ t = (k, fallback) => fallback || k }) {
    return (
        <div className="module-view">
            <div className="section-header">
                <h2>{t("scholarships_title", "Scholarship & Fellowships")}</h2>
                <p>{t("scholarships_desc", "Apply for financial aid and education rewards tailored for you.")}</p>
            </div>
            <div className="content-grid">
                {[
                    { title: t("sch_title_1", "National Innovation Scholarship"), reward: t("sch_reward_1", "₹50,000"), deadline: "15 July 2026", criteria: t("sch_criteria_1", "Engineering Students") },
                    { title: t("sch_title_2", "Women in Tech Fellowship"), reward: t("sch_reward_2", "Full Tuition"), deadline: "28 July 2026", criteria: t("sch_criteria_2", "Female CS Students") },
                    { title: t("sch_title_3", "E-Learn Merit Reward"), reward: t("sch_reward_3", "₹25,000"), deadline: "10 August 2026", criteria: t("sch_criteria_3", "GPA > 8.5") },
                ].map((scholarship, i) => (
                    <div key={i} className="content-card scholarship-card">
                        <h3>{scholarship.title}</h3>
                        <div className="price-tag">{scholarship.reward}</div>
                        <p className="card-desc">{t("eligibility", "Eligibility")}: {scholarship.criteria}</p>
                        <div className="card-footer">
                            <span className="card-meta">{t("deadline", "Deadline")}: {scholarship.deadline}</span>
                            <button className="card-btn secondary">{t("apply_now", "Apply Now")}</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
