import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', fullWidth, children, ...props }, ref) => {

        const variants = {
            primary: "bg-gradient-to-r from-teal-400 to-lime-400 text-white shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 hover:scale-[1.01]",
            secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
            ghost: "bg-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
        };

        return (
            <button
                ref={ref}
                className={twMerge(
                    "px-6 py-3 rounded-xl font-bold transition-all duration-200 active:scale-[0.98]",
                    "flex items-center justify-center gap-2",
                    variants[variant],
                    fullWidth && "w-full",
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);
