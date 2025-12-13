
import React, { useEffect } from 'react';

interface FloatingHeartProps {
    x: number;
    y: number;
    onComplete: () => void;
}

export const FloatingHeart: React.FC<FloatingHeartProps> = ({ x, y, onComplete }) => {
    useEffect(() => {
        // Automatically remove self after animation duration (800ms)
        const timer = setTimeout(onComplete, 800);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div 
            className="absolute pointer-events-none z-50 animate-heart-pop"
            style={{ 
                left: x, 
                top: y,
                marginLeft: -50, // Center the 100px heart
                marginTop: -50
            }}
        >
             {/* Large Filled Heart SVG */}
             <svg width="100" height="100" viewBox="0 0 24 24" fill="#FF0050" stroke="none" style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.3))' }}>
                 <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
             </svg>
             <style>{`
                @keyframes heart-pop {
                    0% { transform: scale(0) rotate(-15deg); opacity: 0; }
                    20% { transform: scale(1.3) rotate(0deg); opacity: 1; }
                    40% { transform: scale(1) rotate(0deg); opacity: 1; }
                    100% { transform: scale(0.8) translateY(-100px) rotate(0deg); opacity: 0; }
                }
                .animate-heart-pop {
                    animation: heart-pop 0.8s ease-out forwards;
                }
             `}</style>
        </div>
    );
};
