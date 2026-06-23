import { useState } from "react";
import { Plus, MessageSquare, ThumbsUp, X, FileText, Tag, User } from "lucide-react";
import "./community.css";

export default function Community() {
    const [posts, setPosts] = useState([
        { id: 1, title: "How to prepare for coding interviews in 3 months?", author: "Rohan Patel", tags: ["interviews", "dsa"], replies: 14, likes: 32, liked: false },
        { id: 2, title: "Best online courses/books for learning React Hooks?", author: "Deepa Verma", tags: ["react", "frontend"], replies: 8, likes: 19, liked: false },
        { id: 3, title: "My experience applying to remote frontend internships", author: "Aarav Sharma", tags: ["internship", "remote"], replies: 22, likes: 54, liked: false },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newTags, setNewTags] = useState("");
    const [newAuthor, setNewAuthor] = useState("Aarav Sharma");

    const handleLike = (id) => {
        setPosts(prev => prev.map(post => {
            if (post.id === id) {
                return {
                    ...post,
                    likes: post.liked ? post.likes - 1 : post.likes + 1,
                    liked: !post.liked
                };
            }
            return post;
        }));
    };

    const handleCreateTopic = (e) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        const parsedTags = newTags
            .split(",")
            .map(t => t.trim().toLowerCase())
            .filter(t => t.length > 0);

        const newPost = {
            id: Date.now(),
            title: newTitle,
            author: newAuthor || "Anonymous User",
            tags: parsedTags.length > 0 ? parsedTags : ["discussion"],
            replies: 0,
            likes: 0,
            liked: false
        };

        setPosts([newPost, ...posts]);
        setNewTitle("");
        setNewTags("");
        setShowModal(false);
    };

    return (
        <div className="community-view-container">
            <div className="section-header">
                <h2>Community Forum</h2>
                <p>Interact with peers, ask questions, and share knowledge with other learners.</p>
            </div>

            <div className="forum-actions-bar">
                <button className="add-post-btn-premium" onClick={() => setShowModal(true)}>
                    <Plus size={16} />
                    <span>Start a New Topic</span>
                </button>
            </div>

            <div className="forum-posts-list">
                {posts.map((post) => (
                    <div key={post.id} className="forum-card-styled">
                        <div className="forum-card-main">
                            <div className="author-avatar-badge">
                                {post.author.split(" ").map(w => w[0]).join("").toUpperCase()}
                            </div>
                            <div className="forum-card-content">
                                <h3 className="forum-card-title">{post.title}</h3>
                                <p className="forum-meta-text">
                                    <span>Posted by:</span> <strong>{post.author}</strong>
                                </p>
                            </div>
                        </div>

                        <div className="forum-footer-divider"></div>

                        <div className="forum-card-footer">
                            <div className="forum-tags-list">
                                {post.tags.map((t, idx) => (
                                    <span key={idx} className="tag-badge">#{t}</span>
                                ))}
                            </div>
                            <div className="forum-stats-actions">
                                <button 
                                    className={`like-action-btn ${post.liked ? "liked" : ""}`}
                                    onClick={() => handleLike(post.id)}
                                >
                                    <ThumbsUp size={14} />
                                    <span>{post.likes}</span>
                                </button>
                                <div className="reply-stat-badge">
                                    <MessageSquare size={14} />
                                    <span>{post.replies} Replies</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Start Topic Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-dialog-box">
                        <div className="modal-header">
                            <h3>Create New Topic</h3>
                            <button className="close-modal-btn" onClick={() => setShowModal(false)}>
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateTopic} className="modal-form">
                            <div className="form-group">
                                <label>
                                    <FileText size={14} />
                                    <span>Topic Title / Question</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="What is your question or topic?"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    <Tag size={14} />
                                    <span>Tags (Comma Separated)</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. react, hooks, interviews"
                                    value={newTags}
                                    onChange={(e) => setNewTags(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    <User size={14} />
                                    <span>Your Name</span>
                                </label>
                                <input
                                    type="text"
                                    value={newAuthor}
                                    onChange={(e) => setNewAuthor(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="submit-topic-btn">
                                    Publish Topic
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

