import { Video, Search, X, Play, Clock, Compass, ExternalLink, Loader2, Sparkles, ArrowRight } from "lucide-react";

export default function CoursesSection({
    t,
    videoSearchQuery,
    setVideoSearchQuery,
    filteredVideoLectures,
    setSelectedVideo,
    setWatchProgressPercent,
    setEnrollingVideo,
    getYouTubeId,
    exploreQuery,
    setExploreQuery,
    isExploring,
    exploreError,
    exploreCourses,
    fetchAICourses,
    onAttemptAssessment
}) {
    return (
        <div className="courses-tab-view">
            {/* Recommended Video Lectures */}
            <div className="lectures-grid-section mt-10">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Video className="text-[#e8773f]" size={20} />
                    {t("recommended_lectures_title", "Recommended Video Lectures")}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                    {t("recommended_lectures_desc", "Directly stream course lectures and track your progress in real-time.")}
                </p>

                <form onSubmit={(e) => e.preventDefault()} className="explore-search-bar mt-6 flex gap-3">
                    <div className="explore-input-wrapper relative flex-1">
                        <Search className="explore-search-icon absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder={t("search_lectures_placeholder", "Search lectures...")}
                            value={videoSearchQuery}
                            onChange={(e) => setVideoSearchQuery(e.target.value)}
                            className="explore-search-input w-full py-3 pl-12 pr-12 rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none focus:border-[#e8773f]"
                        />
                        {videoSearchQuery && (
                            <button
                                type="button"
                                onClick={() => setVideoSearchQuery("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                title="Clear search"
                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="explore-search-btn px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl flex items-center gap-2"
                    >
                        <Search size={16} />
                        <span>Search</span>
                    </button>
                </form>
                
                <div className="content-grid mt-4">
                    {filteredVideoLectures.map((video) => (
                        <div key={video.id} className="content-card relative group" style={{ cursor: "pointer" }} onClick={() => {
                            if (video.is_enrolled) {
                                setSelectedVideo(video);
                                setWatchProgressPercent(video.percentage || 0);
                            } else {
                                setEnrollingVideo(video);
                            }
                        }}>
                            <div className="video-thumbnail-container">
                                {video.thumbnail_url ? (
                                    <img src={video.thumbnail_url} alt={video.title} />
                                ) : getYouTubeId(video.video_url) ? (
                                    <img src={`https://img.youtube.com/vi/${getYouTubeId(video.video_url)}/hqdefault.jpg`} alt={video.title} />
                                ) : (
                                    <div className="flex items-center justify-center h-full w-full bg-slate-900/60">
                                        <Video size={40} className="text-slate-600" />
                                    </div>
                                )}
                                <span className="video-card-badge">{video.category}</span>
                                <div className="play-overlay-btn">
                                    <div className="play-icon-circle">
                                        <Play size={20} fill="white" />
                                    </div>
                                </div>
                            </div>
                            
                            <h3 className="mt-3 text-base font-bold leading-snug">{video.title}</h3>
                            
                            <div className="progress-container mt-3">
                                <div className="progress-bar-bg">
                                    <div className="progress-bar-fill orange" style={{ width: `${video.percentage}%` }}></div>
                                </div>
                                <span className="text-xs font-semibold text-slate-500">{video.percentage}% Completed</span>
                            </div>
                            
                            {video.percentage === 100 && (
                                <div className="mt-2 flex items-center justify-between p-2 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 rounded-xl" onClick={(e) => e.stopPropagation()}>
                                    <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">Ready for Assessment!</span>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (onAttemptAssessment) {
                                                onAttemptAssessment(video);
                                            }
                                        }}
                                        className="py-1 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 border-none cursor-pointer"
                                    >
                                        <span>Go</span>
                                        <ArrowRight size={12} />
                                    </button>
                                </div>
                            )}
                            
                            <div className="card-footer mt-4 flex justify-between items-center w-full">
                                <span className="card-meta flex items-center gap-1 text-xs text-slate-500">
                                    <Clock size={12} /> {video.duration}
                                </span>
                                <button className="card-btn py-1.5 px-4 text-xs font-bold">
                                    {video.percentage > 0 ? t("resume", "Resume") : t("play_now", "Play")}
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredVideoLectures.length === 0 && (
                        <div className="col-span-full text-center py-8 text-slate-500">
                            {videoSearchQuery ? t("no_matching_lectures", "No lectures match your search query.") : t("no_lectures_yet", "No recommended video lectures uploaded yet.")}
                        </div>
                    )}
                </div>
            </div>

            {/* Explore Online Courses (AI Search) */}
            <div className="explore-courses-section mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <Compass className="text-indigo-500" size={20} />
                        {t("explore_courses_title", "Explore Online Courses (AI Search)")}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        {t("explore_courses_desc", "Search and discover real, active courses from Coursera, Udemy, edX, and more, recommended in real-time by AI.")}
                    </p>
                </div>

                {/* AI Search input */}
                <form onSubmit={fetchAICourses} className="explore-search-bar mt-6 flex gap-3">
                    <div className="explore-input-wrapper relative flex-1">
                        <Search className="explore-search-icon absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder={t("explore_search_placeholder", "Enter a topic (e.g., Python, React, UI/UX, Cybersecurity)...")}
                            value={exploreQuery}
                            onChange={(e) => setExploreQuery(e.target.value)}
                            className="explore-search-input w-full py-3 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
                            disabled={isExploring}
                        />
                    </div>
                    <button
                        type="submit"
                        className="explore-search-btn px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl flex items-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                        disabled={isExploring || !exploreQuery.trim()}
                    >
                        {isExploring ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                <span>{t("searching", "Searching...")}</span>
                            </>
                        ) : (
                            <>
                                <Sparkles size={16} />
                                <span>{t("explore_ai", "Find Courses")}</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Error Box */}
                {exploreError && (
                    <div className="explore-error-box mt-4 p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl text-sm">
                        {exploreError}
                    </div>
                )}

                {/* Results Grid */}
                <div className="content-grid mt-8">
                    {isExploring ? (
                        Array.from({ length: 3 }).map((_, idx) => (
                            <div key={idx} className="content-card explore-card skeleton animate-pulse border border-slate-100 dark:border-slate-800">
                                <div className="flex justify-between items-start">
                                    <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                                    <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                                </div>
                                <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg mt-4"></div>
                                <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-lg mt-3"></div>
                                <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded-lg mt-2"></div>
                                <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                                    <div className="h-9 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                                </div>
                            </div>
                        ))
                    ) : (
                        exploreCourses.map((course, idx) => (
                            <div key={idx} className={`content-card explore-card border-t-4 platform-${course.platform.toLowerCase()}`}>
                                <div className="flex justify-between items-start">
                                    <span className={`explore-platform-badge ${course.platform.toLowerCase()}`}>
                                        {course.platform}
                                    </span>
                                    <span className="card-badge bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                        {course.category}
                                    </span>
                                </div>
                                <h3 className="mt-4 text-base font-bold leading-snug line-clamp-2">{course.title}</h3>
                                <p className="card-desc mt-2 text-xs line-clamp-3 leading-relaxed">{course.description}</p>
                                <div className="card-footer mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center w-full">
                                    <span className="card-meta text-xs font-semibold">{course.level}</span>
                                    <a
                                        href={course.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="card-btn flex items-center gap-1.5 py-2 px-4 text-xs font-bold"
                                        style={{ textDecoration: 'none', display: 'inline-flex' }}
                                    >
                                        <span>{t("view_course", "View")}</span>
                                        <ExternalLink size={12} />
                                    </a>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
