import { runCli } from "~/cli/index.js";

const main = async () => {

    const {
        appName,
        flags: { noGit, noInstall, importAlias },
    } = await runCli();

    console.log(appName, noGit, noInstall, importAlias);

    process.exit(0);
};

main().catch((err) => {
    console.log(err);
    process.exit(1);
  });