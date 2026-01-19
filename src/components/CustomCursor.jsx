import React, { useState, useEffect } from 'react';

export const CustomCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dotPosition, setDotPosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });

            // Check if hovering over interactive elements
            const target = e.target;
            const isClickable = target.closest('button, a, input, [role="button"]');
            setIsPointer(!!isClickable);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Smooth following for the outer glow
    useEffect(() => {
        const followMouse = () => {
            setDotPosition(prev => ({
                x: prev.x + (position.x - prev.x) * 0.2,
                y: prev.y + (position.y - prev.y) * 0.2
            }));
            requestAnimationFrame(followMouse);
        };
        const animationId = requestAnimationFrame(followMouse);
        return () => cancelAnimationFrame(animationId);
    }, [position]);

    return (
        <div className="custom-cursor-wrapper">
            <div
                className={`cursor-dot ${isPointer ? 'pointer' : ''}`}
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`
                }}
            />
            <div
                className={`cursor-glow ${isPointer ? 'pointer' : ''}`}
                style={{
                    left: `${dotPosition.x}px`,
                    top: `${dotPosition.y}px`
                }}
            />
        </div>
    );
};
