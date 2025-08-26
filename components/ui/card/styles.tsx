import { tva } from "@gluestack-ui/nativewind-utils/tva";
import { isWeb } from "@gluestack-ui/nativewind-utils/IsWeb";
const baseStyle = isWeb ? "flex flex-col relative z-0" : "";

export const cardStyle = tva({
  base: `${baseStyle} bg-[#FCFCFC] border-2 border-[#333333] rounded-xl shadow-[4px_4px_0_#333333] p-5`,
  variants: {
    size: {
      sm: "p-3",
      md: "p-5", // 20px from original
      lg: "p-6",
    },
    variant: {
      // Color variants matching react-retro
      primary: "bg-[#A2D8FF]",
      secondary: "bg-[#FCFCFC]", // Default grey
      success: "bg-[#98D19F]",
      warning: "bg-[#FFD966]",
      error: "bg-[#D9534F]",
      
      // Special variants
      flat: "shadow-none hover:shadow-none hover:transform-none",
      elevated: "bg-[#FCFCFC]", // Same as secondary for consistency
    },
  },
});
