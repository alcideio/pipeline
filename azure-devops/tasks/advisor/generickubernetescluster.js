"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("azure-pipelines-task-lib/task");
const kubectlutility = require("kubernetes-common-v2/kubectlutility");
function getKubeConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        var kubernetesServiceEndpoint = tl.getInput("kubernetesServiceEndpoint", true);
        var authorizationType = tl.getEndpointDataParameter(kubernetesServiceEndpoint, 'authorizationType', true);
        if (!authorizationType || authorizationType === "Kubeconfig") {
            return kubectlutility.getKubeconfigForCluster(kubernetesServiceEndpoint);
        }
        else if (authorizationType === "ServiceAccount" || authorizationType === "AzureSubscription") {
            return kubectlutility.createKubeconfig(kubernetesServiceEndpoint);
        }
    });
}
exports.getKubeConfig = getKubeConfig;
