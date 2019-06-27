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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const tl = __importStar(require("azure-pipelines-task-lib/task"));
const utils = __importStar(require("./utilities"));
class ClusterConnection {
    constructor(existingKubeConfigPath) {
        this.kubectlPath = tl.which("kubectl", false);
        this.userDir = utils.getNewUserDirPath();
        if (existingKubeConfigPath) {
            this.kubeconfigFile = existingKubeConfigPath;
        }
        else {
            this.kubeconfigFile = "";
        }
    }
    loadClusterType(connectionType) {
        if (connectionType === "Azure Resource Manager") {
            return require("./armkubernetescluster");
        }
        else {
            return require("./generickubernetescluster");
        }
    }
    // get kubeconfig file path
    getKubeConfig(connectionType) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.loadClusterType(connectionType).getKubeConfig().then((config) => {
                return config;
            });
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getKubectl().then((kubectlpath) => {
                this.kubectlPath = kubectlpath;
                // prepend the tools path. instructs the agent to prepend for future tasks
                // if(!process.env['PATH'].toLowerCase().startsWith(path.dirname(this.kubectlPath.toLowerCase()))) {
                //     toolLib.prependPath(path.dirname(this.kubectlPath));
                // }     
            });
        });
    }
    createCommand() {
        var command = tl.tool(this.kubectlPath);
        return command;
    }
    // open kubernetes connection
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            var connectionType = tl.getInput("connectionType", true);
            if (connectionType === "None") {
                return this.initialize();
            }
            var kubeconfig;
            if (!this.kubeconfigFile) {
                kubeconfig = yield this.getKubeConfig(connectionType);
            }
            return this.initialize().then(() => {
                if (kubeconfig) {
                    this.kubeconfigFile = path.join(this.userDir, "config");
                    fs.writeFileSync(this.kubeconfigFile, kubeconfig);
                }
                process.env["KUBECONFIG"] = this.kubeconfigFile;
            });
        });
    }
    // close kubernetes connection
    close() {
        var connectionType = tl.getInput("connectionType", true);
        if (connectionType === "None") {
            return;
        }
        if (this.kubeconfigFile != null && fs.existsSync(this.kubeconfigFile)) {
            delete process.env["KUBECONFIG"];
            fs.unlinkSync(this.kubeconfigFile);
        }
    }
    setKubeConfigEnvVariable() {
        if (this.kubeconfigFile && fs.existsSync(this.kubeconfigFile)) {
            tl.setVariable("KUBECONFIG", this.kubeconfigFile);
        }
        else {
            tl.error(tl.loc('KubernetesServiceConnectionNotFound'));
            throw new Error(tl.loc('KubernetesServiceConnectionNotFound'));
        }
    }
    unsetKubeConfigEnvVariable() {
        var kubeConfigPath = tl.getVariable("KUBECONFIG");
        if (kubeConfigPath) {
            tl.setVariable("KUBECONFIG", "");
        }
    }
    getKubectl() {
        return __awaiter(this, void 0, void 0, function* () {
            // let versionOrLocation = tl.getInput("versionOrLocation");
            // if( versionOrLocation === "location") {
            //     let pathToKubectl = tl.getPathInput("specifyLocation", true, true);
            //     try {
            //         fs.chmodSync(pathToKubectl, "777");
            //     } catch (ex) {
            //         tl.debug(`Could not chmod ${pathToKubectl}, exception: ${JSON.stringify(ex)}`)
            //     }
            //     return pathToKubectl;
            // }
            // else if (versionOrLocation === "version") {
            //     var defaultVersionSpec = "1.13.2";
            //     let versionSpec = tl.getInput("versionSpec");
            //     let checkLatest: boolean = tl.getBoolInput('checkLatest', false);
            //     var version = await utils.getKubectlVersion(versionSpec, checkLatest);
            //     if (versionSpec != defaultVersionSpec || checkLatest)
            //     {
            //        tl.debug(tl.loc("DownloadingClient"));
            //        return await utils.downloadKubectl(version); 
            //     }
            //     // Reached here => default version
            //     // Now to handle back-compat, return the version installed on the machine
            //     if(this.kubectlPath && fs.existsSync(this.kubectlPath))
            //     {
            //         return this.kubectlPath;
            //     }
            //    // Download the default version
            //    tl.debug(tl.loc("DownloadingClient"));
            //    return await utils.downloadKubectl(version); 
            // }
            return "";
        });
    }
}
exports.default = ClusterConnection;
