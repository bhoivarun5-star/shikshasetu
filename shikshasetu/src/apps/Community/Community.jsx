import { useState } from "react";
import { Plus, MessageSquare, ThumbsUp, X, FileText, Tag, User } from "lucide-react";
import "./community.css";

export default function Community({ userName = "Aarav Sharma" }) {
    const [posts, setPosts] = useState([
        { 
            id: 1, 
            title: "How to prepare for coding interviews in 3 months?", 
            author: "Rohan Patel", 
            tags: ["interviews", "dsa"], 
            likes: 32, 
            liked: false,
            repliesList: [
                { id: 1, author: "Aarav Sharma", text: "Start by mastering DSA fundamentals. Focus on Arrays, Linked Lists, Trees, and DP." },
                { id: 2, author: "Deepa Verma", text: "Do LeetCode Blind 75. It covers almost all patterns." }
            ]
        },
        { 
            id: 2, 
            title: "Best online courses/books for learning React Hooks?", 
            author: "Deepa Verma", 
            tags: ["react", "frontend"], 
            likes: 19, 
            liked: false,
            repliesList: [
                { id: 1, author: "Rohan Patel", text: "Check out the official React documentation. The new docs are extremely detailed." }
            ]
        },
        { 
            id: 3, 
            title: "My experience applying to remote frontend internships", 
            author: "Aarav Sharma", 
            tags: ["internship", "remote"], 
            likes: 54, 
            liked: false,
            repliesList: [
                { id: 1, author: "Rohan Patel", text: "Congratulations! Thanks for sharing your tips." }
            ]
        },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newTags, setNewTags] = useState("");
    const [selectedPost, setSelectedPost] = useState(null);
    const [newReplyText, setNewReplyText] = useState("");

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
            author: userName || "Anonymous User",
            tags: parsedTags.length > 0 ? parsedTags : ["discussion"],
            likes: 0,
            liked: false,
            repliesList: []
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
                    <div key={post.id} className="forum-card-styled" onClick={() => setSelectedPost(post)} style={{ cursor: 'pointer' }}>
                        <div className="forum-card-main">
                            <div className="author-avatar-badge">
                                {post.author.split(" ").map(w => w[0]).join("").toUpperCase()}
                            </div>
                            <div className="forum-card-content text-left">
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
                            <div className="forum-stats-actions" onClick={(e) => e.stopPropagation()}>
                                <button 
                                    className={`like-action-btn ${post.liked ? "liked" : ""}`}
                                    onClick={() => handleLike(post.id)}
                                >
                                    <ThumbsUp size={14} />
                                    <span>{post.likes}</span>
                                </button>
                                <button 
                                    className="reply-stat-badge-clickable"
                                    onClick={() => setSelectedPost(post)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                                >
                                    <MessageSquare size={14} />
                                    <span>{post.repliesList ? post.repliesList.length : 0} Replies</span>
                                </button>
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
                            <div className="form-group text-left">
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

                            <div className="form-group text-left">
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

                            <div className="form-group text-left">
                                <label>
                                    <User size={14} />
                                    <span>Posting As</span>
                                </label>
                                <input
                                    type="text"
                                    value={userName}
                                    disabled
                                    className="disabled-input-name"
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

            {/* Replies Thread Modal */}
            {selectedPost && (
                <div className="modal-overlay">
                    <div className="modal-dialog-box replies-dialog-box">
                        <div className="modal-header text-left">
                            <div className="modal-header-text">
                                <span className="modal-subtitle">Discussion Thread</span>
                                <h3 className="modal-title-bold">{selectedPost.title}</h3>
                            </div>
                            <button className="close-modal-btn" onClick={() => {
                                setSelectedPost(null);
                                setNewReplyText("");
                            }}>
                                <X size={18} />
                            </button>
                        </div>
                        
                        <div className="replies-modal-body">
                            <div className="original-author-banner text-left">
                                <span>Asked by <strong>{selectedPost.author}</strong></span>
                                <div className="forum-tags-list mt-1.5">
                                    {selectedPost.tags.map((t, idx) => (
                                        <span key={idx} className="tag-badge">#{t}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="replies-thread-list">
                                {selectedPost.repliesList && selectedPost.repliesList.length > 0 ? (
                                    selectedPost.repliesList.map((reply) => (
                                        <div key={reply.id} className="reply-row-card">
                                            <div className="reply-row-header">
                                                <div className="reply-avatar-badge">
                                                    {reply.author.split(" ").map(w => w[0]).join("").toUpperCase()}
                                                </div>
                                                <span className="reply-row-author">{reply.author}</span>
                                            </div>
                                            <p className="reply-row-content">{reply.text}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-replies-placeholder">
                                        No replies yet. Be the first to answer!
                                    </div>
                                )}
                            </div>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            if (!newReplyText.trim()) return;

                            const newReply = {
                                id: Date.now(),
                                author: userName,
                                text: newReplyText
                            };

                            setPosts(prevPosts => prevPosts.map(post => {
                                if (post.id === selectedPost.id) {
                                    const updatedList = [...(post.repliesList || []), newReply];
                                    setSelectedPost({
                                        ...post,
                                        repliesList: updatedList
                                    });
                                    return {
                                        ...post,
                                        repliesList: updatedList
                                    };
                                }
                                return post;
                            }));
                            setNewReplyText("");
                        }} className="modal-form reply-form-inner text-left">
                            <div className="form-group">
                                <label className="posting-as-reply-label">Add a reply as <strong>{userName}</strong></label>
                                <textarea
                                    rows={2}
                                    placeholder="Share your response..."
                                    value={newReplyText}
                                    onChange={(e) => setNewReplyText(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="modal-actions flex justify-end">
                                <button type="submit" className="submit-topic-btn reply-submit-btn">
                                    Post Reply
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
