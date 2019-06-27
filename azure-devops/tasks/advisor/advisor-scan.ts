import fs = require("fs");
import path = require("path");
import * as os from 'os';
import * as util from 'util';
import tl = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');

import * as toolLib from 'vsts-task-tool-lib/tool';
import * as advisorutils from "./utilities";
import * as advisordownloader from "./advisor-downloader";

function getClusterContextName(connectionType: string): string {
    if(connectionType === "Azure Resource Manager") {
        return tl.getInput('kubernetesCluster', true);
    }
    else {
        var kubernetesServiceEndpoint = tl.getInput("kubernetesServiceEndpoint", true);
        var clusterContext = tl.getEndpointAuthorizationParameter(kubernetesServiceEndpoint, 'clusterContext', true);

        return clusterContext;
    }

    return "<missing-cluster-context>";
}

// Simple wrapper around Alcide Advisor Scanner
export async function AdvisorRunScan() {
    try {

        let advisorPath: string = await advisordownloader.DownloadAdvisor();    

        // Construct the CLI.
        //let advisorPath: string = tl.which('advisor', true);
        let advisorCli = tl.tool(advisorPath);

        advisorCli.arg(["--eula-sign", "validate", "cluster"]);
        advisorCli.arg(['--cluster-context', getClusterContextName(tl.getInput("connectionType", true))]);

        if (tl.getBoolInput('failOnCritical', false)) {
            advisorCli.arg([ "--run-mode", "pipeline"]);
        }

        let advisorProfile = tl.getInput('advisorProfile', false)
        
        if ( advisorProfile != null && advisorProfile != undefined && advisorProfile != '') {
            if (tl.stats(advisorProfile).isFile()) {
                advisorCli.arg(['--policy-profile', advisorProfile]);
            } else {
                tl.warning("Advisor Profile is not a file " + advisorProfile);
            }
        }  
        
        advisorCli.arg(['--outfile', tl.getInput('advisorScanReport', true)]);

        var errlines = [];

        advisorCli.on("errline", line => {
            errlines.push(line);
        });

        tl.debug(" ** before command");
        var exitCode: number
        
        let promise = await advisorCli.exec(<tr.IExecOptions><unknown>{
            cwd: ".",
            failOnStdErr: false,
            errStream: process.stderr,
            outStream: process.stdout,
            ignoreReturnCode: true,
            //env: process.env,
            silent: false,
            windowsVerbatimArguments: false,
            debug: true,
        })
        .fail(error => {
            tl.debug(" ** in fail command");
            errlines.forEach(line => tl.error(line));
            throw error;
        })
        .then(function(result){
            tl.debug(" ** in then command");

            exitCode = result; // Now you can use res everywhere
            tl.debug("Command exit: " + exitCode);   
        });

        tl.debug(" ** after command");

        if (exitCode == 0) {
            tl.setResult(tl.TaskResult.Succeeded, '');
        } else {
            tl.setResult(tl.TaskResult.Failed, 'Either Alcide Advisor scanning failed or critical finding found. Review the findings in advisor-report.html.');
        }
    }
    catch (err) {
        tl.debug(" ** in catch");
        tl.setResult(tl.TaskResult.Failed, err);
    }
}


