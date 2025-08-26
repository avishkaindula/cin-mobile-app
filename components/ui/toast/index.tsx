'use client';
import React from 'react';
import { createToastHook } from '@gluestack-ui/toast';
import { AccessibilityInfo, Text, View, ViewStyle } from 'react-native';
import { tva } from '@gluestack-ui/nativewind-utils/tva';
import { cssInterop } from 'nativewind';
import {
  Motion,
  AnimatePresence,
  MotionComponentProps,
} from '@legendapp/motion';
import {
  withStyleContext,
  useStyleContext,
} from '@gluestack-ui/nativewind-utils/withStyleContext';
import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import { AlertCircle, CheckCircle, Info, AlertTriangle, MessageSquare } from 'lucide-react-native';

type IMotionViewProps = React.ComponentProps<typeof View> &
  MotionComponentProps<typeof View, ViewStyle, unknown, unknown, unknown>;

const MotionView = Motion.View as React.ComponentType<IMotionViewProps>;

const useToast = createToastHook(MotionView, AnimatePresence);
const SCOPE = 'TOAST';

cssInterop(MotionView, { className: 'style' });

const toastStyle = tva({
  base: 'p-4 px-5 mx-4 mt-12 mb-4 rounded-lg web:pointer-events-auto border-2 border-[#333333] shadow-retro-sharp min-w-80 max-w-md flex-row gap-4 relative',
  variants: {
    action: {
      error: 'bg-[#D9534F] border-[#4B4B4B]',
      warning: 'bg-[#FFD966] border-[#4B4B4B]',
      success: 'bg-[#98D19F] border-[#4B4B4B]',
      info: 'bg-[#A2D8FF] border-[#4B4B4B]', // Primary blue from alert.css
      muted: 'bg-[#ECECEC] border-[#4B4B4B]', // Secondary grey from alert.css
    },

    variant: {
      solid: '',
      outline: 'border-2 bg-background-0',
    },
  },
  compoundVariants: [
    {
      variant: 'outline',
      action: 'error',
      class: 'border-[#4B4B4B] bg-[#D9534F]',
    },
    {
      variant: 'outline',
      action: 'warning',
      class: 'border-[#4B4B4B] bg-[#FFD966]',
    },
    {
      variant: 'outline',
      action: 'success',
      class: 'border-[#4B4B4B] bg-[#98D19F]',
    },
    {
      variant: 'outline',
      action: 'info',
      class: 'border-[#4B4B4B] bg-[#A2D8FF]',
    },
    {
      variant: 'outline',
      action: 'muted',
      class: 'border-[#4B4B4B] bg-[#ECECEC]',
    },
  ],
});

const toastTitleStyle = tva({
  base: 'text-[#333333] font-bold text-left flex-wrap text-base mb-1',
  variants: {
    isTruncated: {
      true: '',
    },
    bold: {
      true: 'font-bold',
    },
    underline: {
      true: 'underline',
    },
    strikeThrough: {
      true: 'line-through',
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
  parentVariants: {
    variant: {
      solid: '',
      outline: '',
    },
    action: {
      error: 'text-white', // White text for error (red background)
      warning: 'text-[#333333]', // Dark text for warning (yellow background)
      success: 'text-[#333333]', // Dark text for success (green background)
      info: 'text-[#333333]', // Dark text for info (blue background)
      muted: 'text-[#333333]', // Dark text for muted (grey background)
    },
  },
  parentCompoundVariants: [
    {
      variant: 'outline',
      action: 'error',
      class: 'text-white font-bold',
    },
    {
      variant: 'outline',
      action: 'warning',
      class: 'text-[#333333] font-bold',
    },
    {
      variant: 'outline',
      action: 'success',
      class: 'text-[#333333] font-bold',
    },
    {
      variant: 'outline',
      action: 'info',
      class: 'text-[#333333] font-bold',
    },
    {
      variant: 'outline',
      action: 'muted',
      class: 'text-[#333333] font-bold',
    },
  ],
});

const toastDescriptionStyle = tva({
  base: 'font-normal text-left flex-wrap text-sm',
  variants: {
    isTruncated: {
      true: '',
    },
    bold: {
      true: 'font-bold',
    },
    underline: {
      true: 'underline',
    },
    strikeThrough: {
      true: 'line-through',
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
  parentVariants: {
    variant: {
      solid: 'text-[#333333]',
      outline: 'text-[#333333]',
    },
    action: {
      error: 'text-white', // White text for error (red background)
      warning: 'text-[#333333]', // Dark text for warning (yellow background)
      success: 'text-[#333333]', // Dark text for success (green background)
      info: 'text-[#333333]', // Dark text for info (blue background)
      muted: 'text-[#333333]', // Dark text for muted (grey background)
    },
  },
  parentCompoundVariants: [
    {
      variant: 'outline',
      action: 'error',
      class: 'text-white',
    },
  ],
});

const Root = withStyleContext(View, SCOPE);
type IToastProps = React.ComponentProps<typeof Root> & {
  className?: string;
} & VariantProps<typeof toastStyle>;

const Toast = React.forwardRef<React.ComponentRef<typeof Root>, IToastProps>(
  function Toast(
    { className, variant = 'solid', action = 'muted', children, ...props },
    ref
  ) {
    // Icon mapping for different actions
    const iconMap = {
      error: AlertCircle,
      success: CheckCircle,
      warning: AlertTriangle,
      info: Info,
      muted: MessageSquare,
    };

    const IconComponent = iconMap[action];

    // Icon color mapping based on variant - matching react-retro alert colors
    const getIconColor = () => {
      switch (action) {
        case 'error': return '#ffffff'; // White for error (red background)
        case 'success': return '#333333'; // Dark grey for success (green background)
        case 'warning': return '#333333'; // Dark grey for warning (yellow background)
        case 'info': return '#333333'; // Dark grey for info (blue background)
        default: return '#333333'; // Dark grey for muted (grey background)
      }
    };

    return (
      <Root
        ref={ref}
        className={toastStyle({ variant, action, class: className })}
        context={{ variant, action }}
        {...props}
      >
        <View className="mt-0.5">
          <IconComponent 
            size={20} 
            color={getIconColor()}
          />
        </View>
        <View className="flex-1">
          {children}
        </View>
      </Root>
    );
  }
);

type IToastTitleProps = React.ComponentProps<typeof Text> & {
  className?: string;
} & VariantProps<typeof toastTitleStyle>;

const ToastTitle = React.forwardRef<
  React.ComponentRef<typeof Text>,
  IToastTitleProps
>(function ToastTitle({ className, size = 'md', children, ...props }, ref) {
  const { variant: parentVariant, action: parentAction } =
    useStyleContext(SCOPE);
  React.useEffect(() => {
    // Issue from react-native side
    // Hack for now, will fix this later
    AccessibilityInfo.announceForAccessibility(children as string);
  }, [children]);

  return (
    <Text
      {...props}
      ref={ref}
      aria-live="assertive"
      aria-atomic="true"
      role="alert"
      className={toastTitleStyle({
        size,
        class: className,
        parentVariants: {
          variant: parentVariant,
          action: parentAction,
        },
      })}
    >
      {children}
    </Text>
  );
});

type IToastDescriptionProps = React.ComponentProps<typeof Text> & {
  className?: string;
} & VariantProps<typeof toastDescriptionStyle>;

const ToastDescription = React.forwardRef<
  React.ComponentRef<typeof Text>,
  IToastDescriptionProps
>(function ToastDescription({ className, size = 'md', ...props }, ref) {
  const { variant: parentVariant } = useStyleContext(SCOPE);
  return (
    <Text
      ref={ref}
      {...props}
      className={toastDescriptionStyle({
        size,
        class: className,
        parentVariants: {
          variant: parentVariant,
        },
      })}
    />
  );
});

Toast.displayName = 'Toast';
ToastTitle.displayName = 'ToastTitle';
ToastDescription.displayName = 'ToastDescription';

export { useToast, Toast, ToastTitle, ToastDescription };
