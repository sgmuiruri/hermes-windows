/*
 * This script sets the version number for the rest of the build.
 * After this script has run, other tasks can use the variable
 * to retreive the build number for their logic...
 * 
 * See: https://docs.microsoft.com/en-us/azure/devops/pipelines/build/variables?view=azure-devops&tabs=yaml
 * for environment variables used in this script to compute the version number.
 */ 
const env = process.env;

function main() {

    if (env["Build_Reason"] === "PullRequest") {
        throw new Error("Build script is intended for CI pipeline and should not be used for pull requests.");
    }

    const {semVersion, fileVersion} = computeVersion();
    console.log(`Semantic Version: ${semVersion}`);
    console.log(`Windows File Version: ${fileVersion}`);
    // Update the build number so the pipelines so we can easily correlate builds and releases.
    console.log(`##vso[build.updatebuildnumber]${semVersion} -- ${fileVersion}`);
}

function computeVersion() {
    // Compute base version;
    const sourceBranch = env["Build_SourceBranch"];
    switch (sourceBranch) {
        case "refs/heads/main":
            return computeMainVersion();

        // $TODO: VMoroz: Add logic for expected versions in release branches.

        default:
            throw new Error(`Build script does not support source branch '${sourceBranch}'.`)
    }
    
}

function computeMainVersion() {
    const buildNumber = env["Build_BuildNumber"];
    const buildNumberParts = buildNumber.split("-");
    if (buildNumberParts.length !== 2 && buildNumberParts[0] !== "Unversioned") {
        throw new Error(`Unexpected build number format encountered: ${buildNumber}`)
    }
    const sequenceNumber = buildNumberParts[1];

    // Explicitly use PST timezone.
    const pstDate = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"}));
    const year = pstDate.getFullYear();
    const monthNumber = pstDate.getMonth() + 1;
    const month = pad(monthNumber);
    const day = pad(pstDate.getDate());
    // Match office version logic:
    const relativeMonth = 100 + (year - 2018) * 12 + monthNumber;

    const shortGitHash = env["Build_SourceVersion"].substring(0, 8);

    return { 
        semVersion: `0.0.0-${year}${month}${day}-${sequenceNumber}-${shortGitHash}`,
        fileVersion: `0.0.${relativeMonth}${day}.${sequenceNumber}`
    }
}

function pad(value) {
    return value < 10 ? `0${value}` : value.toString()
}

main();