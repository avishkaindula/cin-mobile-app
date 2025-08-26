'use client';
import React from 'react';
import { createInput } from '@gluestack-ui/input';
import { View, Pressable, TextInput } from 'react-native';
import { tva } from '@gluestack-ui/nativewind-utils/tva';
import {
  withStyleContext,
  useStyleContext,
} from '@gluestack-ui/nativewind-utils/withStyleContext';
import { cssInterop } from 'nativewind';
import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import { PrimitiveIcon, UIIcon } from '@gluestack-ui/icon';

const SCOPE = 'INPUT';

const UIInput = createInput({
  Root: withStyleContext(View, SCOPE),
  Icon: UIIcon,
  Slot: Pressable,
  Input: TextInput,
});

cssInterop(PrimitiveIcon, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      height: true,
      width: true,
      fill: true,
      color: 'classNameColor',
      stroke: true,
    },
  },
});

const inputStyle = tva({
  base: 'border-[#333333] border-2 bg-[#FCFCFC] flex-row overflow-hidden content-center shadow-[2px_2px_0_#333333] data-[hover=true]:border-[#333333] data-[hover=true]:shadow-[3px_3px_0_#333333] data-[focus=true]:border-[#333333] data-[focus=true]:shadow-[3px_3px_0_#333333] data-[focus=true]:hover:border-[#333333] data-[disabled=true]:opacity-40 data-[disabled=true]:hover:border-[#333333] items-center',

  variants: {
    size: {
      xl: 'h-12',
      lg: 'h-11',
      md: 'h-10',
      sm: 'h-9',
    },

    variant: {
      underlined:
        'rounded-none border-b-2 border-[#333333] shadow-none data-[invalid=true]:border-b-2 data-[invalid=true]:border-[#D9534F] data-[invalid=true]:hover:border-[#D9534F] data-[invalid=true]:data-[focus=true]:border-[#D9534F] data-[invalid=true]:data-[focus=true]:hover:border-[#D9534F] data-[invalid=true]:data-[disabled=true]:hover:border-[#D9534F]',

      outline:
        'rounded-lg border-2 border-[#333333] shadow-[2px_2px_0_#333333] data-[invalid=true]:border-[#D9534F] data-[invalid=true]:shadow-[2px_2px_0_#D9534F] data-[invalid=true]:hover:border-[#D9534F] data-[invalid=true]:data-[focus=true]:border-[#D9534F] data-[invalid=true]:data-[focus=true]:hover:border-[#D9534F] data-[invalid=true]:data-[disabled=true]:hover:border-[#D9534F] data-[focus=true]:web:ring-0 data-[invalid=true]:web:ring-0',

      rounded:
        'rounded-full border-2 border-[#333333] shadow-[2px_2px_0_#333333] data-[invalid=true]:border-[#D9534F] data-[invalid=true]:shadow-[2px_2px_0_#D9534F] data-[invalid=true]:hover:border-[#D9534F] data-[invalid=true]:data-[focus=true]:border-[#D9534F] data-[invalid=true]:data-[focus=true]:hover:border-[#D9534F] data-[invalid=true]:data-[disabled=true]:hover:border-[#D9534F] data-[focus=true]:web:ring-0 data-[invalid=true]:web:ring-0',
    },
  },
});

const inputIconStyle = tva({
  base: 'justify-center items-center text-[#333333] fill-none',
  parentVariants: {
    size: {
      '2xs': 'h-3 w-3',
      'xs': 'h-3.5 w-3.5',
      'sm': 'h-4 w-4',
      'md': 'h-[18px] w-[18px]',
      'lg': 'h-5 w-5',
      'xl': 'h-6 w-6',
    },
  },
});

const inputSlotStyle = tva({
  base: 'justify-center items-center web:disabled:cursor-not-allowed',
});

const inputFieldStyle = tva({
  base: 'flex-1 text-[#333333] font-semibold py-0 px-3 placeholder:text-[#666666] h-full ios:leading-[0px] web:cursor-text web:data-[disabled=true]:cursor-not-allowed',

  parentVariants: {
    variant: {
      underlined: 'web:outline-0 web:outline-none px-0',
      outline: 'web:outline-0 web:outline-none',
      rounded: 'web:outline-0 web:outline-none px-4',
    },

    size: {
      '2xs': 'text-2xs',
      'xs': 'text-xs',
      'sm': 'text-sm',
      'md': 'text-base',
      'lg': 'text-lg',
      'xl': 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
      '6xl': 'text-6xl',
    },
  },
});

type IInputProps = React.ComponentProps<typeof UIInput> &
  VariantProps<typeof inputStyle> & { className?: string };
const Input = React.forwardRef<React.ComponentRef<typeof UIInput>, IInputProps>(
  function Input(
    { className, variant = 'outline', size = 'md', ...props },
    ref
  ) {
    return (
      <UIInput
        ref={ref}
        {...props}
        className={inputStyle({ variant, size, class: className })}
        context={{ variant, size }}
      />
    );
  }
);

type IInputIconProps = React.ComponentProps<typeof UIInput.Icon> &
  VariantProps<typeof inputIconStyle> & {
    className?: string;
    height?: number;
    width?: number;
  };

const InputIcon = React.forwardRef<
  React.ComponentRef<typeof UIInput.Icon>,
  IInputIconProps
>(function InputIcon({ className, size, ...props }, ref) {
  const { size: parentSize } = useStyleContext(SCOPE);

  if (typeof size === 'number') {
    return (
      <UIInput.Icon
        ref={ref}
        {...props}
        className={inputIconStyle({ class: className })}
        size={size}
      />
    );
  } else if (
    (props.height !== undefined || props.width !== undefined) &&
    size === undefined
  ) {
    return (
      <UIInput.Icon
        ref={ref}
        {...props}
        className={inputIconStyle({ class: className })}
      />
    );
  }
  return (
    <UIInput.Icon
      ref={ref}
      {...props}
      className={inputIconStyle({
        parentVariants: {
          size: parentSize,
        },
        class: className,
      })}
    />
  );
});

type IInputSlotProps = React.ComponentProps<typeof UIInput.Slot> &
  VariantProps<typeof inputSlotStyle> & { className?: string };

const InputSlot = React.forwardRef<
  React.ComponentRef<typeof UIInput.Slot>,
  IInputSlotProps
>(function InputSlot({ className, ...props }, ref) {
  return (
    <UIInput.Slot
      ref={ref}
      {...props}
      className={inputSlotStyle({
        class: className,
      })}
    />
  );
});

type IInputFieldProps = React.ComponentProps<typeof UIInput.Input> &
  VariantProps<typeof inputFieldStyle> & { className?: string };

const InputField = React.forwardRef<
  React.ComponentRef<typeof UIInput.Input>,
  IInputFieldProps
>(function InputField({ className, ...props }, ref) {
  const { variant: parentVariant, size: parentSize } = useStyleContext(SCOPE);

  return (
    <UIInput.Input
      ref={ref}
      {...props}
      className={inputFieldStyle({
        parentVariants: {
          variant: parentVariant,
          size: parentSize,
        },
        class: className,
      })}
    />
  );
});

Input.displayName = 'Input';
InputIcon.displayName = 'InputIcon';
InputSlot.displayName = 'InputSlot';
InputField.displayName = 'InputField';

export { Input, InputField, InputIcon, InputSlot };
