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
  base: "group/button rounded-lg flex-row items-center justify-center data-[focus-visible=true]:web:outline-none data-[focus-visible=true]:web:ring-2 data-[focus-visible=true]:web:ring-blue-300/70 data-[disabled=true]:opacity-60 gap-2.5 border-2 border-[#333333] transition-all duration-200 relative m-1.5 web:shadow-[2px_2px_0_#333333] ios:shadow-color-gray-800 ios:shadow-offset-2/2 ios:shadow-opacity-100 ios:shadow-radius-0 android:elevation-3 android:shadow-color-gray-800 bg-transparent",
  variants: {
    action: {
      primary:
        "bg-[#A2D8FF] border-[#333333] data-[hover=true]:bg-[#D6F0FF] data-[active=true]:bg-[#A2D8FF] web:data-[hover=true]:shadow-[4px_4px_0_#333333] data-[hover=true]:translate-x-[-1px] data-[hover=true]:translate-y-[-1px] web:data-[active=true]:shadow-[1.5px_1.5px_0_#333333_inset] data-[active=true]:translate-x-[2px] data-[active=true]:translate-y-[2px] ios:data-[hover=true]:shadow-offset-4/4 android:data-[hover=true]:elevation-5 ios:data-[active=true]:shadow-opacity-50 android:data-[active=true]:elevation-1",
      secondary:
        "bg-[#ECECEC] border-[#333333] data-[hover=true]:bg-white data-[active=true]:bg-[#ECECEC] web:data-[hover=true]:shadow-[4px_4px_0_#333333] data-[hover=true]:translate-x-[-1px] data-[hover=true]:translate-y-[-1px] web:data-[active=true]:shadow-[1.5px_1.5px_0_#333333_inset] data-[active=true]:translate-x-[2px] data-[active=true]:translate-y-[2px] ios:data-[hover=true]:shadow-offset-4/4 android:data-[hover=true]:elevation-5 ios:data-[active=true]:shadow-opacity-50 android:data-[active=true]:elevation-1",
      positive:
        "bg-[#98D19F] border-[#333333] data-[hover=true]:bg-[#C0EAC4] data-[active=true]:bg-[#98D19F] web:data-[hover=true]:shadow-[4px_4px_0_#333333] data-[hover=true]:translate-x-[-1px] data-[hover=true]:translate-y-[-1px] web:data-[active=true]:shadow-[1.5px_1.5px_0_#333333_inset] data-[active=true]:translate-x-[2px] data-[active=true]:translate-y-[2px] ios:data-[hover=true]:shadow-offset-4/4 android:data-[hover=true]:elevation-5 ios:data-[active=true]:shadow-opacity-50 android:data-[active=true]:elevation-1",
      negative:
        "bg-[#D9534F] border-[#333333] data-[hover=true]:bg-[#E57373] data-[active=true]:bg-[#D9534F] web:data-[hover=true]:shadow-[4px_4px_0_#333333] data-[hover=true]:translate-x-[-1px] data-[hover=true]:translate-y-[-1px] web:data-[active=true]:shadow-[1.5px_1.5px_0_#333333_inset] data-[active=true]:translate-x-[2px] data-[active=true]:translate-y-[2px] ios:data-[hover=true]:shadow-offset-4/4 android:data-[hover=true]:elevation-5 ios:data-[active=true]:shadow-opacity-50 android:data-[active=true]:elevation-1",
      warning:
        "bg-[#FFD966] border-[#333333] data-[hover=true]:bg-[#FFEB99] data-[active=true]:bg-[#FFD966] web:data-[hover=true]:shadow-[4px_4px_0_#333333] data-[hover=true]:translate-x-[-1px] data-[hover=true]:translate-y-[-1px] web:data-[active=true]:shadow-[1.5px_1.5px_0_#333333_inset] data-[active=true]:translate-x-[2px] data-[active=true]:translate-y-[2px] ios:data-[hover=true]:shadow-offset-4/4 android:data-[hover=true]:elevation-5 ios:data-[active=true]:shadow-opacity-50 android:data-[active=true]:elevation-1",
      default:
        "bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent web:data-[hover=true]:shadow-[4px_4px_0_#333333] data-[hover=true]:translate-x-[-1px] data-[hover=true]:translate-y-[-1px] web:data-[active=true]:shadow-[1.5px_1.5px_0_#333333_inset] data-[active=true]:translate-x-[2px] data-[active=true]:translate-y-[2px] ios:data-[hover=true]:shadow-offset-4/4 android:data-[hover=true]:elevation-5 ios:data-[active=true]:shadow-opacity-50 android:data-[active=true]:elevation-1",
    },
    variant: {
      link: "px-0 border-0",
      outline:
        "bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent",
      solid: "",
    },

    size: {
      xs: "px-3.5 py-2 min-h-[32px]",
      sm: "px-4 py-2.5 min-h-[36px]",
      md: "px-5 py-2.5 min-h-[40px]",
      lg: "px-5 py-2.5 min-h-[40px]",
      xl: "px-5 py-2.5 min-h-[40px]",
    },
  },
  compoundVariants: [
    {
      action: "primary",
      variant: "link",
      class:
        "px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent border-0",
    },
    {
      action: "secondary",
      variant: "link",
      class:
        "px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent border-0",
    },
    {
      action: "positive",
      variant: "link",
      class:
        "px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent border-0",
    },
    {
      action: "negative",
      variant: "link",
      class:
        "px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent border-0",
    },
    {
      action: "warning",
      variant: "link",
      class:
        "px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent border-0",
    },
    {
      action: "primary",
      variant: "outline",
      class:
        "bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent",
    },
    {
      action: "secondary",
      variant: "outline",
      class:
        "bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent",
    },
    {
      action: "positive",
      variant: "outline",
      class:
        "bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent",
    },
    {
      action: "negative",
      variant: "outline",
      class:
        "bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent",
    },
    {
      action: "warning",
      variant: "outline",
      class:
        "bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent",
    },
    // Disabled state overrides
    {
      disabled: true,
      class: "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-60 data-[disabled=true]:web:shadow-none data-[disabled=true]:ios:shadow-opacity-0 data-[disabled=true]:android:elevation-0 data-[disabled=true]:translate-x-0 data-[disabled=true]:translate-y-0 data-[hover=true]:data-[disabled=true]:web:shadow-none data-[hover=true]:data-[disabled=true]:ios:shadow-opacity-0 data-[hover=true]:data-[disabled=true]:android:elevation-0 data-[hover=true]:data-[disabled=true]:translate-x-0 data-[hover=true]:data-[disabled=true]:translate-y-0 data-[active=true]:data-[disabled=true]:web:shadow-none data-[active=true]:data-[disabled=true]:ios:shadow-opacity-0 data-[active=true]:data-[disabled=true]:android:elevation-0 data-[active=true]:data-[disabled=true]:translate-x-0 data-[active=true]:data-[disabled=true]:translate-y-0 data-[disabled=true]:web:transform-none data-[hover=true]:data-[disabled=true]:web:transform-none data-[active=true]:data-[disabled=true]:web:transform-none",
    },
  ],
});

const buttonTextStyle = tva({
  base: "font-semibold web:select-none uppercase tracking-wide text-[#333333] web:text-shadow-none ios:shadow-opacity-0 android:text-shadow-radius-0",
  parentVariants: {
    action: {
      primary:
        "text-[rgb(51,51,51)] data-[hover=true]:text-[rgb(51,51,51)] data-[active=true]:text-[rgb(51,51,51)]",
      secondary:
        "text-[rgb(51,51,51)] data-[hover=true]:text-[rgb(51,51,51)] data-[active=true]:text-[rgb(51,51,51)]",
      positive:
        "text-[rgb(51,51,51)] data-[hover=true]:text-[rgb(51,51,51)] data-[active=true]:text-[rgb(51,51,51)]",
      negative:
        "text-white data-[hover=true]:text-white data-[active=true]:text-white",
      warning:
        "text-[rgb(51,51,51)] data-[hover=true]:text-[rgb(51,51,51)] data-[active=true]:text-[rgb(51,51,51)]",
    },
    variant: {
      link: "data-[hover=true]:underline data-[active=true]:underline normal-case",
      outline: "text-gray-800 data-[hover=true]:text-gray-800 data-[active=true]:text-gray-800",
      solid: "",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm", 
      md: "text-[14px]",
      lg: "text-[14px]",
      xl: "text-[14px]",
    },
  },
  parentCompoundVariants: [
    {
      variant: "solid",
      action: "primary",
      class:
        "text-gray-800 data-[hover=true]:text-gray-800 data-[active=true]:text-gray-800",
    },
    {
      variant: "solid",
      action: "secondary",
      class:
        "text-gray-800 data-[hover=true]:text-gray-800 data-[active=true]:text-gray-800",
    },
    {
      variant: "solid",
      action: "positive",
      class:
        "text-gray-800 data-[hover=true]:text-gray-800 data-[active=true]:text-gray-800",
    },
    {
      variant: "solid",
      action: "negative",
      class:
        "text-white data-[hover=true]:text-white data-[active=true]:text-white",
    },
    {
      variant: "solid",
      action: "warning",
      class:
        "text-gray-800 data-[hover=true]:text-gray-800 data-[active=true]:text-gray-800",
    },
    {
      variant: "outline",
      action: "primary",
      class:
        "text-gray-800 data-[hover=true]:text-gray-800 data-[active=true]:text-gray-800",
    },
    {
      variant: "outline",
      action: "secondary",
      class:
        "text-gray-800 data-[hover=true]:text-gray-800 data-[active=true]:text-gray-800",
    },
    {
      variant: "outline",
      action: "positive",
      class:
        "text-gray-800 data-[hover=true]:text-gray-800 data-[active=true]:text-gray-800",
    },
    {
      variant: "outline",
      action: "negative",
      class:
        "text-gray-800 data-[hover=true]:text-gray-800 data-[active=true]:text-gray-800",
    },
    {
      variant: "outline",
      action: "warning",
      class:
        "text-gray-800 data-[hover=true]:text-gray-800 data-[active=true]:text-gray-800",
    },
    {
      variant: "link",
      action: "primary",
      class:
        "text-sky-600 data-[hover=true]:text-sky-700 data-[active=true]:text-sky-800 normal-case",
    },
    {
      variant: "link",
      action: "secondary",
      class:
        "text-gray-600 data-[hover=true]:text-gray-700 data-[active=true]:text-gray-800 normal-case",
    },
    {
      variant: "link",
      action: "positive",
      class:
        "text-green-600 data-[hover=true]:text-green-700 data-[active=true]:text-green-800 normal-case",
    },
    {
      variant: "link",
      action: "negative",
      class:
        "text-red-600 data-[hover=true]:text-red-700 data-[active=true]:text-red-800 normal-case",
    },
    {
      variant: "link",
      action: "warning",
      class:
        "text-yellow-600 data-[hover=true]:text-yellow-700 data-[active=true]:text-yellow-800 normal-case",
    },
  ],
});

const buttonIconStyle = tva({
  base: "fill-none",
  parentVariants: {
    variant: {
      link: "",
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
      primary:
        "text-gray-800 data-[hover=true]:text-gray-800 data-[active=true]:text-gray-800",
      secondary:
        "text-gray-800 data-[hover=true]:text-gray-800 data-[active=true]:text-gray-800",
      positive:
        "text-gray-800 data-[hover=true]:text-gray-800 data-[active=true]:text-gray-800",
      negative:
        "text-white data-[hover=true]:text-white data-[active=true]:text-white",
      warning:
        "text-gray-800 data-[hover=true]:text-gray-800 data-[active=true]:text-gray-800",
    },
  },
  parentCompoundVariants: [
    {
      variant: "solid",
      action: "primary",
      class:
        "text-gray-800 data-[hover=true]:text-gray-800 data-[active=true]:text-gray-800",
    },
    {
      variant: "solid",
      action: "secondary",
      class:
        "text-gray-800 data-[hover=true]:text-gray-800 data-[active=true]:text-gray-800",
    },
    {
      variant: "solid",
      action: "positive",
      class:
        "text-gray-800 data-[hover=true]:text-gray-800 data-[active=true]:text-gray-800",
    },
    {
      variant: "solid",
      action: "negative",
      class:
        "text-white data-[hover=true]:text-white data-[active=true]:text-white",
    },
    {
      variant: "solid",
      action: "warning",
      class:
        "text-gray-800 data-[hover=true]:text-gray-800 data-[active=true]:text-gray-800",
    },
    {
      variant: "outline",
      action: "primary",
      class:
        "text-gray-800 data-[hover=true]:text-gray-800 data-[active=true]:text-gray-800",
    },
    {
      variant: "outline",
      action: "secondary",
      class:
        "text-gray-800 data-[hover=true]:text-gray-800 data-[active=true]:text-gray-800",
    },
    {
      variant: "outline",
      action: "positive",
      class:
        "text-gray-800 data-[hover=true]:text-gray-800 data-[active=true]:text-gray-800",
    },
    {
      variant: "outline",
      action: "negative",
      class:
        "text-gray-800 data-[hover=true]:text-gray-800 data-[active=true]:text-gray-800",
    },
    {
      variant: "outline",
      action: "warning",
      class:
        "text-gray-800 data-[hover=true]:text-gray-800 data-[active=true]:text-gray-800",
    },
    {
      variant: "link",
      action: "primary",
      class:
        "text-sky-600 data-[hover=true]:text-sky-700 data-[active=true]:text-sky-800",
    },
    {
      variant: "link",
      action: "secondary",
      class:
        "text-gray-600 data-[hover=true]:text-gray-700 data-[active=true]:text-gray-800",
    },
    {
      variant: "link",
      action: "positive",
      class:
        "text-green-600 data-[hover=true]:text-green-700 data-[active=true]:text-green-800",
    },
    {
      variant: "link",
      action: "negative",
      class:
        "text-red-600 data-[hover=true]:text-red-700 data-[active=true]:text-red-800",
    },
    {
      variant: "link",
      action: "warning",
      class:
        "text-yellow-600 data-[hover=true]:text-yellow-700 data-[active=true]:text-yellow-800",
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
