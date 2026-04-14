import React, { forwardRef } from "react";

type FocusableButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  index: number;
};

export const FocusableButton = forwardRef<HTMLButtonElement, FocusableButtonProps>(
  ({ index, className, type = "button", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        data-blink-focusable="true"
        data-focus-index={index}
        className={className}
        {...props}
      >
        {children}
      </button>
    );
  }
);

FocusableButton.displayName = "FocusableButton";