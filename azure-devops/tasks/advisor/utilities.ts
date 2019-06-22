"use strict";

var https   = require('https');
var fs      = require('fs');
import * as path from "path";
import * as tl from "azure-pipelines-task-lib/task";
import * as os from "os";
import * as util from "util";
import * as toolLib from 'vsts-task-tool-lib/tool';


export function getTempDirectory(): string {
    return tl.getVariable('agent.tempDirectory') || os.tmpdir();
}

export function getCurrentTime(): number {
    return new Date().getTime();
}

export function getNewUserDirPath(): string {
    var userDir = path.join(getTempDirectory(), "kubectlTask");
    ensureDirExists(userDir);

    userDir = path.join(userDir, getCurrentTime().toString());
    ensureDirExists(userDir);

    return userDir;
}

function ensureDirExists(dirPath : string) : void
{
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
}

export function sanitizeVersionString(versions: string[], inputVersion: string): string {
    var version = toolLib.evaluateVersions(versions, inputVersion);
    if (!version) {
        throw new Error(tl.loc("NotAValidVersion", JSON.stringify(versions)));
    }

    return version;
}

export function assertFileExists(path: string) {
    if(!fs.existsSync(path)) {
        tl.error(tl.loc('FileNotFoundException', path));
        throw new Error(tl.loc('FileNotFoundException', path));
    }
}

export function writeInlineConfigInTempPath(inlineConfig: string): string {
    var tempInlinePath = getNewUserDirPath();
    tempInlinePath = path.join(tempInlinePath, "inlineconfig.yaml");
    fs.writeFileSync(tempInlinePath, inlineConfig);
    return tempInlinePath;
}