"use client";
import { createAlert } from "@gluestack-ui/alert";
import { View, Text, Pressable } from "react-native";
import { tva } from "@gluestack-ui/nativewind-utils/tva";
import {
  withStyleContext,
  useStyleContext,
} from "@gluestack-ui/nativewind-utils/withStyleContext";
import React from "react";
import { cssInterop } from "nativewind";
import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import { PrimitiveIcon, UIIcon } from "@gluestack-ui/icon";

const SCOPE = "ALERT";

const alertStyle = tva({
  base: "flex-row items-center py-4 px-5 border-2 border-[#333333] rounded-lg my-2 relative",

  variants: {
    action: {
      primary: "bg-[#A2D8FF] border-[#4B4B4B] shadow-[4px_4px_0_#333333]",
      secondary: "bg-[#ECECEC] border-[#4B4B4B] shadow-[4px_4px_0_#333333]",
      success: "bg-[#98D19F] border-[#4B4B4B] shadow-[4px_4px_0_#333333]",
      warning: "bg-[#FFD966] border-[#4B4B4B] shadow-[4px_4px_0_#333333]",
      error: "bg-[#D9534F] border-[#4B4B4B] shadow-[4px_4px_0_#333333]",
    },

    variant: {
      solid: "",
      outline: "border bg-background-0",
    },
  },
});

const alertTextStyle = tva({
  base: "font-normal text-[#333333] flex-1",

  variants: {
    isTruncated: {
      true: "web:truncate",
    },
    bold: {
      true: "font-bold",
    },
    underline: {
      true: "underline",
    },
    strikeThrough: {
      true: "line-through",
    },
    size: {
      "2xs": "text-2xs",
      xs: "text-xs",
      sm: "text-sm",
      md: "text-sm", // Changed to match alert.css 14px
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
      "5xl": "text-5xl",
      "6xl": "text-6xl",
    },
    sub: {
      true: "text-xs",
    },
    italic: {
      true: "italic",
    },
    highlight: {
      true: "bg-yellow-500",
    },
    isTitle: {
      true: "font-bold text-base mb-1", // Matches alert-title in CSS
    },
  },
  parentVariants: {
    action: {
      primary: "text-[#333333]",
      secondary: "text-[#333333]",
      success: "text-[#333333]",
      warning: "text-[#333333]",
      error: "text-white", // White text for error variant
    },
  },
});

const alertIconStyle = tva({
  base: "fill-none mr-4 text-2xl leading-4",
  variants: {
    size: {
      "2xs": "h-3 w-3",
      xs: "h-3.5 w-3.5",
      sm: "h-4 w-4",
      md: "h-6 w-6", // Matches 24px from alert.css
      lg: "h-5 w-5",
      xl: "h-6 w-6",
    },
  },
  parentVariants: {
    action: {
      primary: "text-[#333333]",
      secondary: "text-[#333333]",
      success: "text-[#333333]",
      warning: "text-[#333333]",
      error: "text-white",
    },
  },
});

const alertCloseButtonStyle = tva({
  base: "absolute top-2 right-4 p-0 text-xl leading-4",
  parentVariants: {
    action: {
      primary: "text-[#333333]",
      secondary: "text-[#333333]",
      success: "text-[#333333]",
      warning: "text-[#333333]",
      error: "text-white",
    },
  },
});

export const UIAlert = createAlert({
  Root: withStyleContext(View, SCOPE),
  Text: Text,
  Icon: UIIcon,
});

cssInterop(PrimitiveIcon, {
  className: {
    target: "style",
    nativeStyleToProp: {
      height: true,
      width: true,
      fill: true,
      color: "classNameColor",
      stroke: true,
    },
  },
});

type IAlertProps = Omit<
  React.ComponentPropsWithoutRef<typeof UIAlert>,
  "context"
> &
  VariantProps<typeof alertStyle>;

const Alert = React.forwardRef<React.ComponentRef<typeof UIAlert>, IAlertProps>(
  function Alert(
    { className, variant = "solid", action = "primary", ...props },
    ref
  ) {
    return (
      <UIAlert
        className={alertStyle({ action, variant, class: className })}
        context={{ variant, action }}
        ref={ref}
        {...props}
      />
    );
  }
);

type IAlertTextProps = React.ComponentPropsWithoutRef<typeof UIAlert.Text> &
  VariantProps<typeof alertTextStyle>;

const AlertText = React.forwardRef<
  React.ComponentRef<typeof UIAlert.Text>,
  IAlertTextProps
>(function AlertText(
  {
    className,
    isTruncated,
    bold,
    underline,
    strikeThrough,
    size = "md",
    sub,
    italic,
    highlight,
    isTitle,
    ...props
  },
  ref
) {
  const { action: parentAction } = useStyleContext(SCOPE);
  return (
    <UIAlert.Text
      className={alertTextStyle({
        isTruncated,
        bold,
        underline,
        strikeThrough,
        size,
        sub,
        italic,
        highlight,
        isTitle,
        class: className,
        parentVariants: {
          action: parentAction,
        },
      })}
      {...props}
      ref={ref}
    />
  );
});

type IAlertIconProps = React.ComponentPropsWithoutRef<typeof UIAlert.Icon> &
  VariantProps<typeof alertIconStyle> & {
    height?: number;
    width?: number;
  };

const AlertIcon = React.forwardRef<
  React.ComponentRef<typeof UIAlert.Icon>,
  IAlertIconProps
>(function AlertIcon({ className, size = "md", ...props }, ref) {
  const { action: parentAction } = useStyleContext(SCOPE);

  if (typeof size === "number") {
    return (
      <UIAlert.Icon
        ref={ref}
        {...props}
        className={alertIconStyle({ class: className })}
        size={size}
      />
    );
  } else if (
    (props.height !== undefined || props.width !== undefined) &&
    size === undefined
  ) {
    return (
      <UIAlert.Icon
        ref={ref}
        {...props}
        className={alertIconStyle({ class: className })}
      />
    );
  }
  return (
    <UIAlert.Icon
      className={alertIconStyle({
        parentVariants: {
          action: parentAction,
        },
        size,
        class: className,
      })}
      {...props}
      ref={ref}
    />
  );
});

type IAlertCloseButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
  VariantProps<typeof alertCloseButtonStyle>;

const AlertCloseButton = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  IAlertCloseButtonProps
>(function AlertCloseButton({ className, children, ...props }, ref) {
  const { action: parentAction } = useStyleContext(SCOPE);
  
  return (
    <Pressable
      className={alertCloseButtonStyle({
        parentVariants: {
          action: parentAction,
        },
        class: className,
      })}
      {...props}
      ref={ref}
    >
      {children}
    </Pressable>
  );
});

Alert.displayName = "Alert";
AlertText.displayName = "AlertText";
AlertIcon.displayName = "AlertIcon";
AlertCloseButton.displayName = "AlertCloseButton";

export { Alert, AlertText, AlertIcon, AlertCloseButton };
