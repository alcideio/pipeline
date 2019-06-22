"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cp = require("child_process");
const tl = require("azure-pipelines-task-lib/task");
function tagsAt(commit) {
    var git = tl.which("git", true);
    var args = ["tag", "--points-at", commit];
    var gitDir = tl.getVariable("Build.Repository.LocalPath");
    console.log("[command]" + git + " " + args.join(" "));
    var result = cp.execFileSync(git, args, {
        encoding: "utf8",
        cwd: gitDir
    }).trim();
    console.log(result);
    return result.length ? result.split("\n") : [];
}
exports.tagsAt = tagsAt;
