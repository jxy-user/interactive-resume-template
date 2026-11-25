"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  className?: string;
  children?: React.ReactNode;
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ open, onClose, className, children, ...props }, ref) => {
    if (!open) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);
Modal.displayName = "Modal";

export { Modal };