export const availablePackages = [
//   "prisma",
//   "drizzle",
  "tailwind",
//   "trpc",
  "envVariables",
  "eslint",
//   "dbContainer",
] as const;

export type AvailablePackages = (typeof availablePackages)[number];

export type PkgInstallerMap = {
    [pkg in AvailablePackages]: {
        inUse: boolean;
    //   installer: Installer;
    };
};

export const buildPkgInstallerMap = (
    packages: AvailablePackages[],
  ): PkgInstallerMap => ({
    tailwind: {
      inUse: packages.includes("tailwind"),
    //   installer: tailwindInstaller,
    },
    envVariables: {
      inUse: true,
    //   installer: envVariablesInstaller,
    },
    eslint: {
      inUse: true,
    //   installer: dynamicEslintInstaller,
    },
  });
  