import { useToast, Toast, ToastTitle } from "@/components/ui/toast";

export interface ShowToastOptions {
  title: string;
  message: string;
  action?: "error" | "warning" | "success" | "info" | "muted";
  variant?: "solid" | "outline";
  placement?: "top" | "bottom";
}

export const useAppToast = () => {
  const toast = useToast();

  const showToast = ({
    title,
    message,
    action = "info",
    variant = "outline",
    placement = "top",
  }: ShowToastOptions) => {
    toast.show({
      placement,
      render: ({ id }) => (
        <Toast nativeID={`toast-${id}`} action={action} variant={variant}>
          <ToastTitle>{title}</ToastTitle>
          <ToastTitle>{message}</ToastTitle>
        </Toast>
      ),
    });
  };

  const showError = (title: string, message: string) => {
    showToast({ title, message, action: "error" });
  };

  const showSuccess = (title: string, message: string) => {
    showToast({ title, message, action: "success" });
  };

  const showWarning = (title: string, message: string) => {
    showToast({ title, message, action: "warning" });
  };

  const showInfo = (title: string, message: string) => {
    showToast({ title, message, action: "info" });
  };

  return {
    showToast,
    showError,
    showSuccess,
    showWarning,
    showInfo,
  };
};
