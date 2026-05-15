const GradientButton = ({
  children,
  width = '300px',
  height = '60px',
  className = '',
  onClick,
  disabled = false,
  ...props
}) => {
  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      className={`rotatingGradient relative rounded-[50px] cursor-pointer flex items-center justify-center
        after:content-[''] after:block after:absolute after:bg-[var(--color-background)]
        after:inset-[4px] after:rounded-[46px] after:z-[1]
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}`}
      style={{ minWidth: width, height }}
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      aria-disabled={disabled}
      {...props}
    >
      <span className="relative z-10 text-white flex items-center justify-center gap-2 font-bold text-lg">
        {children}
      </span>
    </div>
  );
};

export default GradientButton;
