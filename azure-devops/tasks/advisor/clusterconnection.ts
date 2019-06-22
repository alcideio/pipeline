"use strict";

import * as fs from "fs";
import * as path from "path";
import * as url from "url";
import * as tl from "azure-pipelines-task-lib/task";
import * as tr from "azure-pipelines-task-lib/toolrunner";
import * as utils from "./utilities";

export default class ClusterConnection {
    private kubectlPath: string;
    private kubeconfigFile: string;
    private userDir: string;

    constructor(existingKubeConfigPath?: string) {
        this.kubectlPath = tl.which("kubectl", false);
        this.userDir = utils.getNewUserDirPath();
        if (existingKubeConfigPath) {
            this.kubeconfigFile = existingKubeConfigPath;
        } else {
            this.kubeconfigFile = ""
        }
    }

   
    // get kubeconfig file path
    private async getKubeConfig(): Promise<string> {
        var armkubernetescluster      = require('./armkubernetescluster');

        return armkubernetescluster.getKubeConfig()
    }

    public createCommand(): tr.ToolRunner {
        var command = tl.tool(this.kubectlPath);
        return command;
    }

    // open kubernetes connection
    public async open() {
        var kubeconfig;

        if (!this.kubeconfigFile) {
            kubeconfig = await this.getKubeConfig();
        }


        if (kubeconfig)
        {
            this.kubeconfigFile = path.join(this.userDir, "config");
            fs.writeFileSync(this.kubeconfigFile, kubeconfig);
        }

        process.env["KUBECONFIG"] = this.kubeconfigFile;
    }

    // close kubernetes connection
    public close(): void {
        if (this.kubeconfigFile != null && fs.existsSync(this.kubeconfigFile))
        {
           delete process.env["KUBECONFIG"];
           fs.unlinkSync(this.kubeconfigFile);
        }    
    }

    public setKubeConfigEnvVariable() {
        if (this.kubeconfigFile && fs.existsSync(this.kubeconfigFile)) {
            tl.setVariable("KUBECONFIG", this.kubeconfigFile);
        }
        else {
            tl.error(tl.loc('KubernetesServiceConnectionNotFound'));
            throw new Error(tl.loc('KubernetesServiceConnectionNotFound'));
        }
    }
    
    public unsetKubeConfigEnvVariable() {
        var kubeConfigPath = tl.getVariable("KUBECONFIG");
        if (kubeConfigPath) {
            tl.setVariable("KUBECONFIG", "");
        }
    }
}
