"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("azure-pipelines-task-lib/task");
const registryauthenticationtoken_1 = require("./registryauthenticationtoken");
const authenticationtokenprovider_1 = require("./authenticationtokenprovider");
class ACRAuthenticationTokenProvider extends authenticationtokenprovider_1.default {
    constructor(endpointName, registerNameValue) {
        super();
        if (endpointName && registerNameValue) {
            try {
                tl.debug("Reading the acr registry in old versions");
                var obj = JSON.parse(registerNameValue);
                this.registryURL = obj.loginServer;
                this.acrFragmentUrl = obj.id;
            }
            catch (e) {
                tl.debug("Reading the acr registry in kubernetesV1");
                this.registryURL = registerNameValue;
            }
            this.endpointName = endpointName;
        }
    }
    getAuthenticationToken() {
        if (this.registryURL && this.endpointName) {
            return new registryauthenticationtoken_1.default(tl.getEndpointAuthorizationParameter(this.endpointName, 'serviceprincipalid', true), tl.getEndpointAuthorizationParameter(this.endpointName, 'serviceprincipalkey', true), this.registryURL, "ServicePrincipal@AzureRM", this.getXMetaSourceClient());
        }
        return null;
    }
}
exports.default = ACRAuthenticationTokenProvider;
