export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon: Icon,
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90 focus:ring-primary shadow-sm",
    secondary: "bg-secondary text-dark hover:bg-secondary/80 focus:ring-secondary shadow-sm",
    outline: "border border-secondary/60 bg-transparent text-dark hover:bg-light focus:ring-secondary",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 shadow-sm",
    ghost: "bg-transparent text-dark/70 hover:text-primary hover:bg-light focus:ring-secondary",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
    icon: "p-2"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className={`${children ? 'mr-2' : ''} w-4 h-4`} />}
      {children}
    </button>
  );
}
