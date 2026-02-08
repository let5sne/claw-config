import React from 'react';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = '', ...props }, ref) => {
    const classes = 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70';
    const fullClasses = `${classes} ${className}`;
    return <label ref={ref} className={fullClasses} {...props} />;
  }
);

Label.displayName = 'Label';

export { Label };
