"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("azure-pipelines-task-lib/task");
class AuthenticationTokenProvider {
    getXMetaSourceClient() {
        var serverType = tl.getVariable('System.ServerType');
        return (serverType && serverType.toLowerCase() === "hosted") ? "VSTS" : "TFS";
    }
}
exports.AuthenticationTokenProvider = AuthenticationTokenProvider;
exports.default = AuthenticationTokenProvider;
