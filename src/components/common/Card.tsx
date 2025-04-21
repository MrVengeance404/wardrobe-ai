import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  isHoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  isHoverable = false,
  className = '',
  ...rest
}) => {
  const baseClasses = 'card rounded-xl overflow-hidden bg-white';
  
  const variantClasses = {
    default: 'shadow-md',
    outlined: 'border border-gray-200 shadow-sm',
    elevated: 'shadow-lg',
  };
  
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const hoverClass = isHoverable ? 'transition-all duration-200 hover:shadow-lg' : '';
  
  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClass} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Card; 