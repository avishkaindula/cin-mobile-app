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
  base: 'p-6 mx-4 mt-12 mb-4 rounded-xl gap-3 web:pointer-events-auto shadow-hard-5 border-outline-100 min-w-80 max-w-md',
  variants: {
    action: {
      error: 'bg-error-800 border-error-700',
      warning: 'bg-warning-700 border-warning-600',
      success: 'bg-success-700 border-success-600',
      info: 'bg-info-700 border-info-600',
      muted: 'bg-background-800 border-background-700',
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
      class: 'border-error-500 bg-error-50',
    },
    {
      variant: 'outline',
      action: 'warning',
      class: 'border-warning-500 bg-warning-50',
    },
    {
      variant: 'outline',
      action: 'success',
      class: 'border-success-500 bg-success-50',
    },
    {
      variant: 'outline',
      action: 'info',
      class: 'border-info-500 bg-info-50',
    },
    {
      variant: 'outline',
      action: 'muted',
      class: 'border-background-300 bg-background-50',
    },
  ],
});

const toastTitleStyle = tva({
  base: 'text-typography-0 font-medium font-body tracking-md text-left',
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
      error: '',
      warning: '',
      success: '',
      info: '',
      muted: '',
    },
  },
  parentCompoundVariants: [
    {
      variant: 'outline',
      action: 'error',
      class: 'text-error-900 font-semibold',
    },
    {
      variant: 'outline',
      action: 'warning',
      class: 'text-warning-900 font-semibold',
    },
    {
      variant: 'outline',
      action: 'success',
      class: 'text-success-900 font-semibold',
    },
    {
      variant: 'outline',
      action: 'info',
      class: 'text-info-900 font-semibold',
    },
    {
      variant: 'outline',
      action: 'muted',
      class: 'text-background-900 font-semibold',
    },
  ],
});

const toastDescriptionStyle = tva({
  base: 'font-normal font-body tracking-md text-left',
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
      solid: 'text-typography-50',
      outline: 'text-typography-900',
    },
  },
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

    // Icon color mapping based on variant
    const getIconColor = () => {
      if (variant === 'outline') {
        switch (action) {
          case 'error': return '#dc2626'; // red-600
          case 'success': return '#059669'; // green-600
          case 'warning': return '#d97706'; // yellow-600
          case 'info': return '#2563eb'; // blue-600
          default: return '#6b7280'; // gray-500
        }
      }
      return '#ffffff'; // white for solid variant
    };

    return (
      <Root
        ref={ref}
        className={toastStyle({ variant, action, class: className })}
        context={{ variant, action }}
        {...props}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', flex: 1, gap: 12 }}>
          <View style={{ marginTop: 2 }}>
            <IconComponent 
              size={20} 
              color={getIconColor()}
            />
          </View>
          <View style={{ flex: 1 }}>
            {children}
          </View>
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
