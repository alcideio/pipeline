"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const util = __importStar(require("util"));
const toolLib = __importStar(require("vsts-task-tool-lib/tool"));
const kubectlutility = require("kubernetes-common-v2/kubectlutility");
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
function getKubectlVersion(versionSpec, checkLatest) {
    return __awaiter(this, void 0, void 0, function* () {
        if (checkLatest) {
            return yield kubectlutility.getStableKubectlVersion();
        }
        else if (versionSpec) {
            if (versionSpec === "1.7") {
                // Backward compat handle
                tl.warning(tl.loc("UsingLatestStableVersion"));
                return kubectlutility.getStableKubectlVersion();
            }
            else if ("v".concat(versionSpec) === kubectlutility.stableKubectlVersion) {
                tl.debug(util.format("Using default versionSpec:%s.", versionSpec));
                return kubectlutility.stableKubectlVersion;
            }
            else {
                // Do not check for validity of the version here,
                // We'll return proper error message when the download fails
                if (!versionSpec.startsWith("v")) {
                    return "v".concat(versionSpec);
                }
                else {
                    return versionSpec;
                }
            }
        }
        return kubectlutility.stableKubectlVersion;
    });
}
exports.getKubectlVersion = getKubectlVersion;
function downloadKubectl(version) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield kubectlutility.downloadKubectl(version);
    });
}
exports.downloadKubectl = downloadKubectl;
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
