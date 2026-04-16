import React from 'react';

interface LogoProps {
    className?: string;
    showText?: boolean;
    size?: number | string;
    theme?: 'dark' | 'light';
}

export function Logo({ className, showText = true, size = 40, theme = 'dark' }: LogoProps) {
    const textColor = theme === 'dark' ? 'text-white' : 'text-stone-900';

    return (
        <div className={`flex flex-col items-center gap-2 ${className}`}>
            <svg
                width={size}
                height={typeof size === 'number' ? (size as number) * 0.7 : 'auto'}
                viewBox="0 0 100 70"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-sm"
            >
                {/* Interlocking Links Icon */}
                <defs>
                    <linearGradient id="linkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#065f46" /> {/* Emerald 800 */}
                        <stop offset="50%" stopColor="#059669" /> {/* Emerald 600 */}
                        <stop offset="100%" stopColor="#10b981" /> {/* Emerald 500 */}
                    </linearGradient>

                    <pattern id="circuitPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="0.5" fill="white" opacity="0.2" />
                        <path d="M 2 2 L 10 2 M 10 2 L 10 10" stroke="white" strokeWidth="0.2" opacity="0.2" />
                    </pattern>

                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
                        <feOffset dx="0" dy="1" result="offsetblur" />
                        <feComponentTransfer>
                            <feFuncA type="linear" slope="0.3" />
                        </feComponentTransfer>
                        <feMerge>
                            <feMergeNode />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* First Link (Left/Bottom) */}
                <path
                    d="M 35 15 C 20 15 10 25 10 40 C 10 55 20 65 35 65 L 55 65 C 70 65 80 55 80 40 C 80 38 79.5 36 78.5 34"
                    stroke="url(#linkGradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    filter="url(#shadow)"
                />
                <path
                    d="M 35 15 C 20 15 10 25 10 40 C 10 55 20 65 35 65 L 55 65 C 70 65 80 55 80 40 C 80 38 79.5 36 78.5 34"
                    stroke="url(#circuitPattern)"
                    strokeWidth="12"
                    strokeLinecap="round"
                />

                {/* Second Link (Right/Top) - Interlocking shift */}
                <path
                    d="M 65 55 C 80 55 90 45 90 30 C 90 15 80 5 65 5 L 45 5 C 30 5 20 15 20 30 C 20 32 20.5 34 21.5 36"
                    stroke="url(#linkGradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    filter="url(#shadow)"
                />
                <path
                    d="M 65 55 C 80 55 90 45 90 30 C 90 15 80 5 65 5 L 45 5 C 30 5 20 15 20 30 C 20 32 20.5 34 21.5 36"
                    stroke="url(#circuitPattern)"
                    strokeWidth="12"
                    strokeLinecap="round"
                />

                {/* Connection point highlights/shading for 3D look */}
                <path d="M 40 15 A 6 6 0 0 1 42 25" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
            </svg>
            {showText && <span className={`text-2xl font-black tracking-tight ${textColor}`}>Wasla</span>}
        </div>
    );
}
