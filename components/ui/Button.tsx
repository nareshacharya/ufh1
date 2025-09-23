
import { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, icon, children, className = '', disabled, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap';
    
    const variants = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      outline: 'border border-rgb(var(--border-primary)) text-rgb(var(--fg-primary)) hover:bg-rgb(var(--bg-tertiary)) hover:border-rgb(var(--border-accent))',
      ghost: 'text-rgb(var(--fg-primary)) hover:bg-rgb(var(--bg-tertiary))',
      gradient: 'bg-gradient text-white hover:scale-105 hover:filter hover:brightness-105'
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        )}
        {icon && !loading && (
          <i className={`${icon} w-4 h-4 flex items-center justify-center`}></i>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';