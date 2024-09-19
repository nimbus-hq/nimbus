#!/usr/bin/env node

import * as p from "@clack/prompts";
import { Command } from "commander";

import { DEFAULT_APP_NAME } from "~/consts.js";
import { validateAppName } from "~/utils/validateAppName.js";
import { validateImportAlias } from "~/utils/validateImportAlias.js";
import { getUserPkgManager } from "~/utils/getUserPkgManager.js";
import {
    type AvailablePackages,
  } from "~/installers/index.js";

interface CliFlags {
    noGit: boolean;
    noInstall: boolean;
    default: boolean;
    importAlias: string;
  
    /** @internal Used in CI. */
    CI: boolean;
    /** @internal Used in CI. */
    tailwind: boolean;
    /** @internal Used in CI. */
    trpc: boolean;
    /** @internal Used in CI. */
    prisma: boolean;
    /** @internal Used in CI. */
    drizzle: boolean;
    /** @internal Used in CI. */
    nextAuth: boolean;
}

interface CliResults {
    appName: string;
    packages: AvailablePackages[];
    flags: CliFlags;
}

const defaultOptions: CliResults = {
    appName: DEFAULT_APP_NAME,
    packages: ["tailwind"],
    flags: {
        noGit: false,
        noInstall: false,
        default: false,
        CI: false,
        tailwind: false,
        trpc: false,
        prisma: false,
        drizzle: false,
        nextAuth: false,
        importAlias: "~/",
    },
};

export const runCli = async (): Promise<CliResults> => {
    const cliResults = defaultOptions;
    
    const program = new Command();

    program
        .name("nimbus-app")
        .description("A CLI for creating web applications with the Nimbus stack")
        .parse(process.argv);

    const cliProvidedName = program.args[0];
    if (cliProvidedName) {
        cliResults.appName = cliProvidedName;
    }

    try {

        const pkgManager = getUserPkgManager();

        const project = await p.group(
            {
                ...(!cliProvidedName && {
                name: () =>
                    p.text({
                    message: "What will your project be called?",
                    defaultValue: cliProvidedName,
                    validate: validateAppName,
                    }),
                }),
                styling: () => {
                    return p.confirm({
                        message: "Will you be using Tailwind CSS for styling?",
                    });
                },
                ...(!cliResults.flags.noGit && {
                    git: () => {
                      return p.confirm({
                            message:
                                "Should we initialize a Git repository and stage the changes?",
                            initialValue: !defaultOptions.flags.noGit,
                        });
                    },
                }),
                ...(!cliResults.flags.noInstall && {
                    install: () => {
                        return p.confirm({
                            message:
                                `Should we run '${pkgManager}` +
                                (pkgManager === "yarn" ? `' for you?` : ` install' for you?`),
                            initialValue: !defaultOptions.flags.noInstall,
                        });
                    },
                }),
                importAlias: () => {
                    return p.text({
                        message: "What import alias would you like to use?",
                        defaultValue: defaultOptions.flags.importAlias,
                        placeholder: defaultOptions.flags.importAlias,
                        validate: validateImportAlias,
                    });
                },
            },
            {
                onCancel() {
                    process.exit(1);
                },
            });

            const packages: AvailablePackages[] = [];
            if (project.styling) packages.push("tailwind");
        
        return {
            appName: project.name ?? cliResults.appName,
            packages,
            flags: {
                ...cliResults.flags,
                noGit: !project.git || cliResults.flags.noGit,
                noInstall: !project.install || cliResults.flags.noInstall,
                importAlias: project.importAlias ?? cliResults.flags.importAlias,
            }
        }

    } catch (err) {
        throw err;
    }
}