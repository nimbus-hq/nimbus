export const availablePackages = [
  "nextAuth",
  "prisma",
  "drizzle",
  "tailwind",
  "trpc",
  "envVariables",
  "eslint",
  "dbContainer",
] as const;
export type AvailablePackages = (typeof availablePackages)[number];
