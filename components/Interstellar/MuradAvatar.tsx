
import React from 'react';

export const MuradAvatar: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <img 
            src="/murad-car-selfie.jpg" 
            alt="Murad Aljohani" 
            className={`object-cover ${className || 'w-full h-full'}`} 
            onError={(e) => {
                e.currentTarget.src = "https://api.dicebear.com/7.x/initials/svg?seed=Murad";
            }}
        />
    );
};
