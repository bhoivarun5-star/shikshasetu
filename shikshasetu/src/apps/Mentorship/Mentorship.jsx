import { useState } from "react";
import { Calendar, Clock, Star, X, MessageSquare, CheckCircle2, Video, Award, Users } from "lucide-react";
import "./mentorship.css";

export default function Mentorship() {
    const [mentors] = useState([
        { id: 1, name: "Dr. Sarah Connor", role: "Senior ML Engineer at Google", rating: "4.9", reviews: 42, domain: "Artificial Intelligence", gender: "F" },
        { id: 2, name: "Alex Rivera", role: "Product Lead at Stripe", rating: "4.8", reviews: 29, domain: "Product Management", gender: "M" },
        { id: 3, name: "Tanya Sen", role: "UX Design Consultant", rating: "5.0", reviews: 54, domain: "UI/UX Design", gender: "F" },
    ]);

    const [activeMentor, setActiveMentor] = useState(null);
    const [bookingDate, setBookingDate] = useState("");
    const [bookingTime, setBookingTime] = useState("10:00 AM");
    const [bookingNote, setBookingNote] = useState("");
    const [confirmedSession, setConfirmedSession] = useState(null);

    const handleOpenBooking = (mentor) => {
        setActiveMentor(mentor);
        setBookingDate("");
        setBookingTime("10:00 AM");
        setBookingNote("");
    };

    const handleConfirmBooking = (e) => {
        e.preventDefault();
        if (!bookingDate) return;

        setConfirmedSession({
            mentor: activeMentor,
            date: bookingDate,
            time: bookingTime,
            note: bookingNote
        });
        setActiveMentor(null);
        // Clear message after 5 seconds
        setTimeout(() => setConfirmedSession(null), 8000);
    };

    return (
        <div className="mentorship-view-container">
            <div className="section-header">
                <h2>Mentor Connect</h2>
                <p>Book 1-on-1 calls with experienced industry professionals in your field.</p>
            </div>

            {/* Confirmed booking card */}
            {confirmedSession && (
                <div className="booking-success-alert-card">
                    <div className="success-icon-badge">
                        <CheckCircle2 size={24} />
                    </div>
                    <div className="success-alert-content">
                        <h3>Mentorship Session Booked!</h3>
                        <p>
                            Your 1-on-1 mentorship call with <strong>{confirmedSession.mentor.name}</strong> is scheduled for{" "}
                            <strong>{confirmedSession.date}</strong> at <strong>{confirmedSession.time}</strong>.
                        </p>
                        <div className="video-join-box">
                            <Video size={16} />
                            <span>A video link has been emailed to you and added to your Google Calendar.</span>
                        </div>
                    </div>
                    <button className="close-alert-btn" onClick={() => setConfirmedSession(null)}>
                        <X size={16} />
                    </button>
                </div>
            )}

            <div className="mentorship-grid">
                {mentors.map((mentor) => (
                    <div key={mentor.id} className="mentor-card-styled">
                        <div className="mentor-card-header">
                            <div className="mentor-avatar-initials">
                                {mentor.name.split(" ").map(w => w[0]).join("")}
                            </div>
                            <div className="rating-pill">
                                <Star size={12} className="star-icon" />
                                <span>{mentor.rating}</span>
                            </div>
                        </div>

                        <div className="mentor-card-body">
                            <h3>{mentor.name}</h3>
                            <p className="mentor-role-text">{mentor.role}</p>
                            <span className="mentor-domain-tag">{mentor.domain}</span>
                        </div>

                        <div className="mentor-footer-divider"></div>

                        <div className="mentor-card-footer">
                            <div className="reviews-count-badge">
                                <Users size={14} />
                                <span>{mentor.reviews} reviews</span>
                            </div>
                            <button className="book-session-btn" onClick={() => handleOpenBooking(mentor)}>
                                <span>Book Session</span>
                                <Calendar size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Booking Modal */}
            {activeMentor && (
                <div className="modal-overlay">
                    <div className="modal-dialog-box">
                        <div className="modal-header">
                            <h3>Schedule Call with {activeMentor.name}</h3>
                            <button className="close-modal-btn" onClick={() => setActiveMentor(null)}>
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleConfirmBooking} className="modal-form">
                            <div className="form-group">
                                <label>
                                    <Calendar size={14} />
                                    <span>Select Date</span>
                                </label>
                                <input
                                    type="date"
                                    value={bookingDate}
                                    onChange={(e) => setBookingDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    <Clock size={14} />
                                    <span>Select Time Slot</span>
                                </label>
                                <select
                                    value={bookingTime}
                                    onChange={(e) => setBookingTime(e.target.value)}
                                    className="time-slot-select"
                                >
                                    <option value="10:00 AM">10:00 AM - 10:30 AM</option>
                                    <option value="11:30 AM">11:30 AM - 12:00 PM</option>
                                    <option value="2:00 PM">2:00 PM - 2:30 PM</option>
                                    <option value="4:30 PM">4:30 PM - 5:00 PM</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>
                                    <MessageSquare size={14} />
                                    <span>Add a note for the Mentor</span>
                                </label>
                                <textarea
                                    rows="3"
                                    placeholder="Briefly explain what you would like to discuss (e.g. Resume advice, project feedback...)"
                                    value={bookingNote}
                                    onChange={(e) => setBookingNote(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setActiveMentor(null)}>
                                    Cancel
                                </button>
                                <button type="submit" className="confirm-booking-btn">
                                    Confirm Booking
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

