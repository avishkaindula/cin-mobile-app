"use client";
import React from "react";
import { createButton } from "@gluestack-ui/button";
import { tva } from "@gluestack-ui/nativewind-utils/tva";
import {
  withStyleContext,
  useStyleContext,
} from "@gluestack-ui/nativewind-utils/withStyleContext";
import { cssInterop } from "nativewind";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import { PrimitiveIcon, UIIcon } from "@gluestack-ui/icon";

const SCOPE = "BUTTON";

const Root = withStyleContext(Pressable, SCOPE);

const UIButton = createButton({
  Root: Root,
  Text,
  Group: View,
  Spinner: ActivityIndicator,
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

const buttonStyle = tva({
  base: "group/button rounded-lg flex-row items-center justify-center gap-2 relative border-2 border-gray-800 data-[focus-visible=true]:web:outline-none data-[focus-visible=true]:web:ring-2 data-[focus-visible=true]:web:ring-blue-300 data-[disabled=true]:opacity-60 data-[disabled=true]:cursor-not-allowed shadow-retro data-[hover=true]:shadow-retro-hover data-[active=true]:shadow-retro-pressed data-[active=true]:web:transform data-[active=true]:web:translate-x-1 data-[active=true]:web:translate-y-1 transition-all duration-75",
  variants: {
    action: {
      primary:
        "bg-blue-200 data-[hover=true]:bg-blue-100",
      secondary:
        "bg-gray-200 data-[hover=true]:bg-white",
      positive:
        "bg-green-200 data-[hover=true]:bg-green-100",
      negative:
        "bg-red-500 data-[hover=true]:bg-red-400",
      warning:
        "bg-yellow-200 data-[hover=true]:bg-yellow-100",
      default:
        "bg-yellow-200 data-[hover=true]:bg-yellow-100",
    },
    variant: {
      link: "px-0 border-0 shadow-none bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent data-[hover=true]:shadow-none data-[active=true]:shadow-none data-[hover=true]:web:transform-none data-[active=true]:web:transform-none",
      outline:
        "bg-transparent data-[hover=true]:bg-gray-50 data-[active=true]:bg-transparent",
      solid: "",
    },

    size: {
      xs: "px-3.5 h-8 text-xs",
      sm: "px-4 h-9 text-sm",
      md: "px-5 h-10 text-base",
      lg: "px-6 h-11 text-lg",
      xl: "px-7 h-12 text-xl",
    },
  },
  compoundVariants: [
    {
      action: "primary",
      variant: "link",
      class:
        "px-0 bg-transparent border-0 shadow-none data-[hover=true]:bg-transparent data-[active=true]:bg-transparent data-[hover=true]:shadow-none data-[active=true]:shadow-none",
    },
    {
      action: "secondary",
      variant: "link",
      class:
        "px-0 bg-transparent border-0 shadow-none data-[hover=true]:bg-transparent data-[active=true]:bg-transparent data-[hover=true]:shadow-none data-[active=true]:shadow-none",
    },
    {
      action: "positive",
      variant: "link",
      class:
        "px-0 bg-transparent border-0 shadow-none data-[hover=true]:bg-transparent data-[active=true]:bg-transparent data-[hover=true]:shadow-none data-[active=true]:shadow-none",
    },
    {
      action: "negative",
      variant: "link",
      class:
        "px-0 bg-transparent border-0 shadow-none data-[hover=true]:bg-transparent data-[active=true]:bg-transparent data-[hover=true]:shadow-none data-[active=true]:shadow-none",
    },
    {
      action: "warning",
      variant: "link",
      class:
        "px-0 bg-transparent border-0 shadow-none data-[hover=true]:bg-transparent data-[active=true]:bg-transparent data-[hover=true]:shadow-none data-[active=true]:shadow-none",
    },
    {
      action: "primary",
      variant: "outline",
      class:
        "bg-transparent data-[hover=true]:bg-blue-50 data-[active=true]:bg-transparent",
    },
    {
      action: "secondary",
      variant: "outline",
      class:
        "bg-transparent data-[hover=true]:bg-gray-50 data-[active=true]:bg-transparent",
    },
    {
      action: "positive",
      variant: "outline",
      class:
        "bg-transparent data-[hover=true]:bg-green-50 data-[active=true]:bg-transparent",
    },
    {
      action: "negative",
      variant: "outline",
      class:
        "bg-transparent data-[hover=true]:bg-red-50 data-[active=true]:bg-transparent",
    },
    {
      action: "warning",
      variant: "outline",
      class:
        "bg-transparent data-[hover=true]:bg-yellow-50 data-[active=true]:bg-transparent",
    },
  ],
});

const buttonTextStyle = tva({
  base: "font-semibold web:select-none uppercase text-gray-800",
  parentVariants: {
    action: {
      primary:
        "text-gray-800",
      secondary:
        "text-gray-800",
      positive:
        "text-gray-800",
      negative:
        "text-white",
      warning:
        "text-gray-800",
    },
    variant: {
      link: "data-[hover=true]:underline data-[active=true]:underline normal-case",
      outline: "",
      solid: "",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    },
  },
  parentCompoundVariants: [
    {
      variant: "solid",
      action: "primary",
      class:
        "text-gray-800",
    },
    {
      variant: "solid",
      action: "secondary",
      class:
        "text-gray-800",
    },
    {
      variant: "solid",
      action: "positive",
      class:
        "text-gray-800",
    },
    {
      variant: "solid",
      action: "negative",
      class:
        "text-white",
    },
    {
      variant: "solid",
      action: "warning",
      class:
        "text-gray-800",
    },
    {
      variant: "outline",
      action: "primary",
      class:
        "text-blue-600",
    },
    {
      variant: "outline",
      action: "secondary",
      class:
        "text-gray-600",
    },
    {
      variant: "outline",
      action: "positive",
      class:
        "text-green-600",
    },
    {
      variant: "outline",
      action: "negative",
      class:
        "text-red-600",
    },
    {
      variant: "outline",
      action: "warning",
      class:
        "text-yellow-600",
    },
    {
      variant: "link",
      action: "primary",
      class:
        "text-blue-600 normal-case",
    },
    {
      variant: "link",
      action: "secondary",
      class:
        "text-gray-600 normal-case",
    },
    {
      variant: "link",
      action: "positive",
      class:
        "text-green-600 normal-case",
    },
    {
      variant: "link",
      action: "negative",
      class:
        "text-red-600 normal-case",
    },
    {
      variant: "link",
      action: "warning",
      class:
        "text-yellow-600 normal-case",
    },
  ],
});

const buttonIconStyle = tva({
  base: "fill-none",
  parentVariants: {
    variant: {
      link: "data-[hover=true]:underline data-[active=true]:underline",
      outline: "",
      solid: "",
    },
    size: {
      xs: "h-3.5 w-3.5",
      sm: "h-4 w-4",
      md: "h-[18px] w-[18px]",
      lg: "h-[18px] w-[18px]",
      xl: "h-5 w-5",
    },
    action: {
      primary: "text-gray-800",
      secondary: "text-gray-800",
      positive: "text-gray-800",
      negative: "text-white",
      warning: "text-gray-800",
    },
  },
  parentCompoundVariants: [
    {
      variant: "solid",
      action: "primary",
      class: "text-gray-800",
    },
    {
      variant: "solid",
      action: "secondary",
      class: "text-gray-800",
    },
    {
      variant: "solid",
      action: "positive",
      class: "text-gray-800",
    },
    {
      variant: "solid",
      action: "negative",
      class: "text-white",
    },
    {
      variant: "solid",
      action: "warning",
      class: "text-gray-800",
    },
    {
      variant: "outline",
      action: "primary",
      class: "text-blue-600",
    },
    {
      variant: "outline",
      action: "secondary",
      class: "text-gray-600",
    },
    {
      variant: "outline",
      action: "positive",
      class: "text-green-600",
    },
    {
      variant: "outline",
      action: "negative",
      class: "text-red-600",
    },
    {
      variant: "outline",
      action: "warning",
      class: "text-yellow-600",
    },
    {
      variant: "link",
      action: "primary",
      class: "text-blue-600",
    },
    {
      variant: "link",
      action: "secondary",
      class: "text-gray-600",
    },
    {
      variant: "link",
      action: "positive",
      class: "text-green-600",
    },
    {
      variant: "link",
      action: "negative",
      class: "text-red-600",
    },
    {
      variant: "link",
      action: "warning",
      class: "text-yellow-600",
    },
  ],
});

const buttonGroupStyle = tva({
  base: "",
  variants: {
    space: {
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-4",
      xl: "gap-5",
      "2xl": "gap-6",
      "3xl": "gap-7",
      "4xl": "gap-8",
    },
    isAttached: {
      true: "gap-0",
    },
    flexDirection: {
      row: "flex-row",
      column: "flex-col",
      "row-reverse": "flex-row-reverse",
      "column-reverse": "flex-col-reverse",
    },
  },
});

type IButtonProps = Omit<
  React.ComponentPropsWithoutRef<typeof UIButton>,
  "context"
> &
  VariantProps<typeof buttonStyle> & { className?: string };

const Button = React.forwardRef<
  React.ComponentRef<typeof UIButton>,
  IButtonProps
>(function Button(
  { className, variant = "solid", size = "md", action = "primary", ...props },
  ref
) {
  return (
    <UIButton
      ref={ref}
      {...props}
      className={buttonStyle({ variant, size, action, class: className })}
      context={{ variant, size, action }}
    />
  );
});

type IButtonTextProps = React.ComponentPropsWithoutRef<typeof UIButton.Text> &
  VariantProps<typeof buttonTextStyle> & { className?: string };

const ButtonText = React.forwardRef<
  React.ComponentRef<typeof UIButton.Text>,
  IButtonTextProps
>(function ButtonText({ className, variant, size, action, ...props }, ref) {
  const {
    variant: parentVariant,
    size: parentSize,
    action: parentAction,
  } = useStyleContext(SCOPE);

  return (
    <UIButton.Text
      ref={ref}
      {...props}
      className={buttonTextStyle({
        parentVariants: {
          variant: parentVariant,
          size: parentSize,
          action: parentAction,
        },
        variant,
        size,
        action,
        class: className,
      })}
    />
  );
});

const ButtonSpinner = UIButton.Spinner;

type IButtonIcon = React.ComponentPropsWithoutRef<typeof UIButton.Icon> &
  VariantProps<typeof buttonIconStyle> & {
    className?: string | undefined;
    as?: React.ElementType;
    height?: number;
    width?: number;
  };

const ButtonIcon = React.forwardRef<
  React.ComponentRef<typeof UIButton.Icon>,
  IButtonIcon
>(function ButtonIcon({ className, size, ...props }, ref) {
  const {
    variant: parentVariant,
    size: parentSize,
    action: parentAction,
  } = useStyleContext(SCOPE);

  if (typeof size === "number") {
    return (
      <UIButton.Icon
        ref={ref}
        {...props}
        className={buttonIconStyle({ class: className })}
        size={size}
      />
    );
  } else if (
    (props.height !== undefined || props.width !== undefined) &&
    size === undefined
  ) {
    return (
      <UIButton.Icon
        ref={ref}
        {...props}
        className={buttonIconStyle({ class: className })}
      />
    );
  }
  return (
    <UIButton.Icon
      {...props}
      className={buttonIconStyle({
        parentVariants: {
          size: parentSize,
          variant: parentVariant,
          action: parentAction,
        },
        size,
        class: className,
      })}
      ref={ref}
    />
  );
});

type IButtonGroupProps = React.ComponentPropsWithoutRef<typeof UIButton.Group> &
  VariantProps<typeof buttonGroupStyle>;

const ButtonGroup = React.forwardRef<
  React.ComponentRef<typeof UIButton.Group>,
  IButtonGroupProps
>(function ButtonGroup(
  {
    className,
    space = "md",
    isAttached = false,
    flexDirection = "column",
    ...props
  },
  ref
) {
  return (
    <UIButton.Group
      className={buttonGroupStyle({
        class: className,
        space,
        isAttached,
        flexDirection,
      })}
      {...props}
      ref={ref}
    />
  );
});

Button.displayName = "Button";
ButtonText.displayName = "ButtonText";
ButtonSpinner.displayName = "ButtonSpinner";
ButtonIcon.displayName = "ButtonIcon";
ButtonGroup.displayName = "ButtonGroup";

export { Button, ButtonText, ButtonSpinner, ButtonIcon, ButtonGroup };
