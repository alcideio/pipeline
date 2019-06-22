"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("azure-pipelines-task-lib/task");
const gitUtils = require("./gitutils");
function getSourceTags() {
    var tags;
    var sourceProvider = tl.getVariable("Build.Repository.Provider");
    if (!sourceProvider) {
        tl.warning("Cannot retrieve source tags because Build.Repository.Provider is not set.");
        return [];
    }
    if (sourceProvider === "TfsVersionControl") {
        // TFVC has no concept of source tags
        return [];
    }
    var sourceVersion = tl.getVariable("Build.SourceVersion");
    if (!sourceVersion) {
        tl.warning("Cannot retrieve source tags because Build.SourceVersion is not set.");
        return [];
    }
    switch (sourceProvider) {
        case "TfsGit":
        case "GitHub":
        case "Git":
            tags = gitUtils.tagsAt(sourceVersion);
            break;
        case "Subversion":
            // TODO: support subversion tags
            tl.warning("Retrieving Subversion tags is not currently supported.");
            break;
    }
    return tags || [];
}
exports.getSourceTags = getSourceTags;
