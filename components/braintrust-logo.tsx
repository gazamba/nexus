"use client";

import { useTheme } from "next-themes";
import Image from "next/image";

export function BraintrustLogo() {
  const { theme } = useTheme();
  const logoSrc =
    theme === "dark"
      ? "/images/braintrust-white.jpeg"
      : "/images/braintrust-black.png";

  return (
    <Image
      src={logoSrc}
      alt="Braintrust Logo"
      width={20}
      height={20}
      className="h-5 w-5"
    />
  );
}
