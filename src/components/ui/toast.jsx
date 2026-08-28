"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { motion } from "framer-motion";
import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const variantStyles = {
  default: "border-line bg-surface text-ink",
  success: "border-status-ok/50 bg-surface text-ink",
  error: "border-status-alert/50 bg-surface text-ink",
  warning: "border-status-warn/50 bg-surface text-ink",
};

const titleColor = {
  default: "text-ink",
  success: "text-status-ok",
  error: "text-status-alert",
  warning: "text-status-warn",
};

const iconColor = {
  default: "text-ink-muted",
  success: "text-status-ok",
  error: "text-status-alert",
  warning: "text-status-warn",
};

const variantIcons = {
  default: Info,
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
};

const toastAnimation = {
  initial: { opacity: 0, y: 50, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 50, scale: 0.95 },
};

const Toaster = forwardRef(function Toaster(
  { defaultPosition = "bottom-right" },
  ref,
) {
  const toastReference = useRef(null);

  useImperativeHandle(ref, () => ({
    show({
      title,
      message,
      variant = "default",
      duration = 4000,
      position = defaultPosition,
      actions,
      onDismiss,
      highlightTitle = false,
    }) {
      const Icon = variantIcons[variant] ?? variantIcons.default;
      const selectedVariant = variantStyles[variant] ? variant : "default";

      toastReference.current = sonnerToast.custom(
        (toastId) => (
          <motion.div
            variants={toastAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
              "flex w-[min(22rem,calc(100vw-2rem))] items-start justify-between gap-3 rounded-xl border p-3 shadow-md",
              variantStyles[selectedVariant],
            )}
          >
            <div className="flex min-w-0 items-start gap-2">
              <Icon
                aria-hidden="true"
                className={cn(
                  "mt-0.5 size-4 shrink-0",
                  iconColor[selectedVariant],
                )}
              />

              <div className="flex min-w-0 flex-col gap-1">
                {title ? (
                  <h3
                    className={cn(
                      "text-xs font-semibold leading-none",
                      highlightTitle
                        ? titleColor.success
                        : titleColor[selectedVariant],
                    )}
                  >
                    {title}
                  </h3>
                ) : null}
                <p className="text-xs leading-5 text-ink-muted">{message}</p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              {actions?.label ? (
                <Button
                  variant={actions.variant || "outline"}
                  size="sm"
                  onClick={() => {
                    actions.onClick();
                    sonnerToast.dismiss(toastId);
                  }}
                >
                  {actions.label}
                </Button>
              ) : null}

              <button
                type="button"
                onClick={() => {
                  sonnerToast.dismiss(toastId);
                  onDismiss?.();
                }}
                className="flex size-7 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20"
                aria-label="Cerrar notificación"
              >
                <X aria-hidden="true" className="size-3.5" />
              </button>
            </div>
          </motion.div>
        ),
        { duration, position },
      );

      return toastReference.current;
    },
  }));

  return (
    <SonnerToaster
      position={defaultPosition}
      toastOptions={{ unstyled: true, className: "flex justify-end" }}
    />
  );
});

Toaster.displayName = "Toaster";

export default Toaster;
