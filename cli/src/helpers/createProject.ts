import fs from "fs";
import path from "path";

// import { scaffoldProject } from "~/helpers/scaffoldProject.js";
import {
  type PkgInstallerMap,
} from "~/installers/index.js";
import { getUserPkgManager } from "../utils/getUserPkgManager.js";

interface CreateProjectOptions {
  projectName: string;
  scopedAppName: string;
  packages: PkgInstallerMap;
  noInstall: boolean;
  importAlias: string;
}

export const createProject = async ({
  projectName,
  scopedAppName,
  packages,
  noInstall,
}: CreateProjectOptions) => {
  const pkgManager = getUserPkgManager();
  const projectDir = path.resolve(process.cwd(), projectName);

  // Bootstraps the base React.js application
//   await scaffoldProject({
//     projectName,
//     projectDir,
//     pkgManager,
//     scopedAppName,
//     noInstall,
//   });

  return projectDir;
}
