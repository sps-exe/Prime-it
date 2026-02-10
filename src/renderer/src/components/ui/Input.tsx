import React from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
    label?: string; // Optional label if needed elsewhere, though screens show placeholders mostly
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, icon, ...props }, ref) => {
        return (
            <div className="relative w-full group">
                <div className={twMerge(
                    "flex items-center w-full px-4 py-3 bg-white border border-gray-200 rounded-xl transition-all duration-200",
                    "focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10",
                    "hover:border-gray-300",
                    className
                )}>
                    {icon && (
                        <div className="mr-3 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className="w-full bg-transparent outline-none text-gray-800 placeholder:text-gray-400 font-medium"
                        {...props}
                    />
                </div>
            </div>
        );
    }
);
