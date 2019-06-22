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
const azure_arm_aks_service_1 = require("azure-arm-rest-v2/azure-arm-aks-service");
const azure_arm_endpoint_1 = require("azure-arm-rest-v2/azure-arm-endpoint");
// get kubeconfig file content
function getKubeConfigFromAKS(azureSubscriptionEndpoint, resourceGroup, clusterName, useClusterAdmin) {
    return __awaiter(this, void 0, void 0, function* () {
        var azureEndpoint = yield (new azure_arm_endpoint_1.AzureRMEndpoint(azureSubscriptionEndpoint)).getEndpoint();
        var aks = new azure_arm_aks_service_1.AzureAksService(azureEndpoint);
        tl.debug(tl.loc("KubernetesClusterResourceGroup", clusterName, resourceGroup));
        var clusterInfo = yield aks.getAccessProfile(resourceGroup, clusterName, useClusterAdmin);
        var base64Kubeconfig = Buffer.from(clusterInfo.properties.kubeConfig, 'base64');
        return base64Kubeconfig.toString();
    });
}
function getKubeConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        var azureSubscriptionEndpoint = tl.getInput("azureSubscriptionEndpoint", true);
        var resourceGroup = tl.getInput("azureResourceGroup", true);
        var clusterName = tl.getInput("kubernetesCluster", true);
        var useClusterAdmin = tl.getBoolInput('useClusterAdmin');
        return getKubeConfigFromAKS(azureSubscriptionEndpoint, resourceGroup, clusterName, useClusterAdmin);
    });
}
exports.getKubeConfig = getKubeConfig;
