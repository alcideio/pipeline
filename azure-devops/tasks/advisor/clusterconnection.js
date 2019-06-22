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
    // get kubeconfig file path
    getKubeConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            var armkubernetescluster = require('./armkubernetescluster');
            return armkubernetescluster.getKubeConfig();
        });
    }
    createCommand() {
        var command = tl.tool(this.kubectlPath);
        return command;
    }
    // open kubernetes connection
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            var kubeconfig;
            if (!this.kubeconfigFile) {
                kubeconfig = yield this.getKubeConfig();
            }
            if (kubeconfig) {
                this.kubeconfigFile = path.join(this.userDir, "config");
                fs.writeFileSync(this.kubeconfigFile, kubeconfig);
            }
            process.env["KUBECONFIG"] = this.kubeconfigFile;
        });
    }
    // close kubernetes connection
    close() {
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
}
exports.default = ClusterConnection;
