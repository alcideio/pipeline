"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var https = require('https');
var fs = require('fs');
const path = __importStar(require("path"));
const tl = __importStar(require("azure-pipelines-task-lib/task"));
const os = __importStar(require("os"));
const toolLib = __importStar(require("vsts-task-tool-lib/tool"));
function getTempDirectory() {
    return tl.getVariable('agent.tempDirectory') || os.tmpdir();
}
exports.getTempDirectory = getTempDirectory;
function getCurrentTime() {
    return new Date().getTime();
}
exports.getCurrentTime = getCurrentTime;
function getNewUserDirPath() {
    var userDir = path.join(getTempDirectory(), "kubectlTask");
    ensureDirExists(userDir);
    userDir = path.join(userDir, getCurrentTime().toString());
    ensureDirExists(userDir);
    return userDir;
}
exports.getNewUserDirPath = getNewUserDirPath;
function ensureDirExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
}
function sanitizeVersionString(versions, inputVersion) {
    var version = toolLib.evaluateVersions(versions, inputVersion);
    if (!version) {
        throw new Error(tl.loc("NotAValidVersion", JSON.stringify(versions)));
    }
    return version;
}
exports.sanitizeVersionString = sanitizeVersionString;
function assertFileExists(path) {
    if (!fs.existsSync(path)) {
        tl.error(tl.loc('FileNotFoundException', path));
        throw new Error(tl.loc('FileNotFoundException', path));
    }
}
exports.assertFileExists = assertFileExists;
function writeInlineConfigInTempPath(inlineConfig) {
    var tempInlinePath = getNewUserDirPath();
    tempInlinePath = path.join(tempInlinePath, "inlineconfig.yaml");
    fs.writeFileSync(tempInlinePath, inlineConfig);
    return tempInlinePath;
}
exports.writeInlineConfigInTempPath = writeInlineConfigInTempPath;
