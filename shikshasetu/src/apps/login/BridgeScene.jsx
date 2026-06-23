import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * BridgeScene
 * The signature visual for ShikshaSetu: a bridge arcing from a deep
 * indigo "dusk" side toward a warm gold "dawn" side, with small lights
 * travelling the span — students crossing from where they are to where
 * they're going. Renders as a full-bleed background illustration.
 */
export default function BridgeScene({ className = "" }) {
    const uid = useId().replace(/:/g, "");
    const reduceMotion = useReducedMotion();

    const stars = [
        { x: 60, y: 60, r: 1.6, delay: 0 },
        { x: 110, y: 110, r: 1.2, delay: 0.4 },
        { x: 40, y: 150, r: 1.4, delay: 0.8 },
        { x: 160, y: 50, r: 1.1, delay: 1.2 },
        { x: 200, y: 130, r: 1.6, delay: 0.2 },
        { x: 90, y: 200, r: 1.2, delay: 1.6 },
        { x: 240, y: 70, r: 1.3, delay: 0.6 },
    ];

    return (
        <svg
            viewBox="0 0 600 400"
            preserveAspectRatio="xMidYMid slice"
            className={className}
            role="img"
            aria-label="Illustration of a bridge arcing from dusk into a golden dawn"
        >
            <defs>
                <linearGradient id={`sky-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#181734" />
                    <stop offset="45%" stopColor="#2C2A5E" />
                    <stop offset="78%" stopColor="#5B3D78" />
                    <stop offset="100%" stopColor="#F2A93B" />
                </linearGradient>
                <linearGradient id={`bridge-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6C6AAE" />
                    <stop offset="60%" stopColor="#E08A4B" />
                    <stop offset="100%" stopColor="#F5BE5C" />
                </linearGradient>
                <filter id={`glow-${uid}`} x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="14" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <filter id={`dotglow-${uid}`} x="-200%" y="-200%" width="500%" height="500%">
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            <rect x="0" y="0" width="600" height="400" fill={`url(#sky-${uid})`} />

            {/* stars, dusk side only */}
            {stars.map((s, i) =>
                reduceMotion ? (
                    <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#E9E7FF" opacity="0.55" />
                ) : (
                    <motion.circle
                        key={i}
                        cx={s.x}
                        cy={s.y}
                        r={s.r}
                        fill="#E9E7FF"
                        animate={{ opacity: [0.15, 0.9, 0.15] }}
                        transition={{ duration: 3, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
                    />
                )
            )}

            {/* sun / dawn glow, gold side */}
            {reduceMotion ? (
                <circle cx="500" cy="95" r="46" fill="#F7C873" opacity="0.55" filter={`url(#glow-${uid})`} />
            ) : (
                <motion.circle
                    cx="500"
                    cy="95"
                    r="46"
                    fill="#F7C873"
                    filter={`url(#glow-${uid})`}
                    animate={{ opacity: [0.4, 0.65, 0.4], scale: [1, 1.06, 1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ transformOrigin: "500px 95px" }}
                />
            )}

            {/* bridge cables + pylons */}
            <g stroke={`url(#bridge-${uid})`} strokeWidth="1.6" strokeLinecap="round" opacity="0.85">
                <line x1="155" y1="135" x2="60" y2="298" />
                <line x1="155" y1="135" x2="120" y2="300" />
                <line x1="155" y1="135" x2="190" y2="296" />
                <line x1="155" y1="135" x2="250" y2="290" />
                <line x1="445" y1="120" x2="350" y2="288" />
                <line x1="445" y1="120" x2="410" y2="294" />
                <line x1="445" y1="120" x2="480" y2="297" />
                <line x1="445" y1="120" x2="555" y2="300" />
            </g>
            <rect x="148" y="130" width="14" height="172" rx="3" fill={`url(#bridge-${uid})`} />
            <rect x="438" y="116" width="14" height="180" rx="3" fill={`url(#bridge-${uid})`} />

            {/* deck */}
            <path
                d="M30,300 Q300,272 570,300"
                fill="none"
                stroke={`url(#bridge-${uid})`}
                strokeWidth="6"
                strokeLinecap="round"
            />

            {/* lights crossing the deck, dusk to dawn */}
            {!reduceMotion &&
                [0, 1.4, 2.8, 4.2].map((begin, i) => (
                    <circle key={i} r="3.4" fill="#FFE6A8" filter={`url(#dotglow-${uid})`}>
                        <animateMotion
                            dur="7s"
                            repeatCount="indefinite"
                            begin={`${begin}s`}
                            path="M30,300 Q300,272 570,300"
                        />
                        <animate
                            attributeName="opacity"
                            values="0;1;1;0"
                            keyTimes="0;0.08;0.85;1"
                            dur="7s"
                            repeatCount="indefinite"
                            begin={`${begin}s`}
                        />
                    </circle>
                ))}

            {/* horizon haze for grounding */}
            <rect x="0" y="320" width="600" height="80" fill={`url(#bridge-${uid})`} opacity="0.06" />
        </svg>
    );
}
