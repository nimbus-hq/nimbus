#!/usr/bin/env node

import * as p from "@clack/prompts";
import { Command } from "commander";

import { DEFAULT_APP_NAME } from "~/consts.js";
import { validateAppName } from "~/utils/validateAppName.js";
import { validateImportAlias } from "~/utils/validateImportAlias.js";

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
    flags: CliFlags;
}

const defaultOptions: CliResults = {
    appName: DEFAULT_APP_NAME,
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
        .argument(
            "[dir]",
            "The name of the application, as well as the name of the directory to create"
        )
        .parse(process.argv);

    const cliProvidedName = program.args[0];
    if (cliProvidedName) {
        cliResults.appName = cliProvidedName;
    }

    try {

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
                trpc: () => {
                    return p.confirm({
                      message: "Would you like to use tRPC?",
                    });
                },
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
        
        return {
            appName: project.name ?? cliResults.appName,
            flags: {
                ...cliResults.flags
            }
        }

    } catch (err) {
        throw err;
    }
}