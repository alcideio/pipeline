"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("azure-pipelines-task-lib/task");
const path = require("path");
const clusterconnection_1 = __importDefault(require("./clusterconnection"));
const advisor_scan_1 = require("./advisor-scan");
tl.setResourcePath(path.join(__dirname, '.', 'task.json'));
// Change to any specified working directory
tl.cd(tl.getInput("cwd"));
//var command = tl.getInput("command", false);
const environmentVariableMaximumSize = 32766;
var kubeconfigfilePath;
// open kubectl connection and run the command
var connection = new clusterconnection_1.default(kubeconfigfilePath);
try {
    connection.open().then(() => { return run(connection, ""); }).then(() => {
        tl.setResult(tl.TaskResult.Succeeded, "");
        connection.close();
    }).catch((error) => {
        tl.setResult(tl.TaskResult.Failed, error.message);
        connection.close();
    });
}
catch (error) {
    tl.setResult(tl.TaskResult.Failed, error.message);
}
function run(clusterConnection, command) {
    return __awaiter(this, void 0, void 0, function* () {
        yield advisor_scan_1.AdvisorRunScan();
    });
}
