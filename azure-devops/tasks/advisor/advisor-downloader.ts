import fs = require("fs");
import path = require("path");
import * as os from 'os';
import * as util from 'util';
import tl = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');

import * as toolLib from 'vsts-task-tool-lib/tool';
import * as advisorutils from "./utilities";

const advisorBinaryName = 'advisor';
export const advisorBinaryVersion = 'stable';

export async function DownloadAdvisor(version?: string): Promise<string> {

    if (version === undefined || version === null || version === "") {
        version = advisorBinaryVersion;
    }

    let advisorDownloadPath = await toolLib.downloadTool(getAdvisorDownloadURL(version));
    //const advisorPathTmp = path.join(advisorutils.getTempDirectory(), advisorBinaryName);

    //tl.cp(advisorDownloadPath, advisorPathTmp, '-f');
    fs.chmodSync(advisorDownloadPath, '777');

    tl.debug("Download path " + advisorDownloadPath);
    return advisorDownloadPath;
}

function getAdvisorDownloadURL(version: string): string {
    return util.format('https://alcide.blob.core.windows.net/generic/%s/linux/advisor', version);
}
