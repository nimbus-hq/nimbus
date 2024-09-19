import path from "path";
import { execa } from "execa";
import fs from "fs-extra";
import { type PackageJson } from "type-fest";

import { runCli } from "~/cli/index.js";
import { buildPkgInstallerMap } from "./installers/index.js";
import { parseNameAndPath } from "./utils/parseNameAndPath.js";
import { createProject } from "./helpers/createProject.js";
import { getUserPkgManager } from "./utils/getUserPkgManager.js";

const main = async () => {
    const pkgManager = getUserPkgManager();

    const {
        appName,
        packages,
        flags: { noGit, noInstall, importAlias },
    } = await runCli();

    console.log("\n",appName,packages,noGit,noInstall,importAlias);

    const usePackages = buildPkgInstallerMap(packages);

    const [scopedAppName, appDir] = parseNameAndPath(appName);

    const projectDir = await createProject({
        projectName: appDir,
        scopedAppName,
        packages: usePackages,
        importAlias,
        noInstall,
    });

    const pkgJson = fs.readJSONSync(
        path.join(projectDir, "package.json")
    ) as PackageJson;
    pkgJson.name = scopedAppName;
    
    // ? Bun doesn't support this field (yet)
    if (pkgManager !== "bun") {
        const { stdout } = await execa(pkgManager, ["-v"], {
            cwd: projectDir,
        });
        pkgJson.packageManager = `${pkgManager}@${stdout.trim()}`;
    }

    fs.writeJSONSync(path.join(projectDir, "package.json"), pkgJson, {
        spaces: 2,
    });

    // TODO
    
    if (importAlias !== "~/") {
    // setImportAlias(projectDir, importAlias);
    }
    
    if (!noInstall) {
    // await installDependencies({ projectDir });
    }
    
    if (!noGit) {
    // await initializeGit(projectDir);
    }
   
    process.exit(0);
};

main().catch((err) => {
    console.log(err);
    process.exit(1);
  });