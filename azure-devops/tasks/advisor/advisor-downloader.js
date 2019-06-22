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
const fs = require("fs");
const util = __importStar(require("util"));
const tl = require("azure-pipelines-task-lib/task");
const toolLib = __importStar(require("vsts-task-tool-lib/tool"));
const advisorBinaryName = 'advisor';
exports.advisorBinaryVersion = '2.1';
function DownloadAdvisor(version) {
    return __awaiter(this, void 0, void 0, function* () {
        if (version === undefined || version === null || version === "") {
            version = exports.advisorBinaryVersion;
        }
        let advisorDownloadPath = yield toolLib.downloadTool(getAdvisorDownloadURL(version));
        //const advisorPathTmp = path.join(advisorutils.getTempDirectory(), advisorBinaryName);
        //tl.cp(advisorDownloadPath, advisorPathTmp, '-f');
        fs.chmodSync(advisorDownloadPath, '777');
        tl.debug("Download path " + advisorDownloadPath);
        return advisorDownloadPath;
    });
}
exports.DownloadAdvisor = DownloadAdvisor;
function getAdvisorDownloadURL(version) {
    return util.format('https://alcide.blob.core.windows.net/generic/DCV-%s/linux/advisor', version);
}
