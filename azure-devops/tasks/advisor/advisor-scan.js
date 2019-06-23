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
const tl = require("azure-pipelines-task-lib/task");
const advisordownloader = __importStar(require("./advisor-downloader"));
// Simple wrapper around Alcide Advisor Scanner
function AdvisorRunScan() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let advisorPath = yield advisordownloader.DownloadAdvisor();
            // Construct the CLI.
            //let advisorPath: string = tl.which('advisor', true);
            let advisorCli = tl.tool(advisorPath);
            advisorCli.arg(["--eula-sign", "validate", "cluster"]);
            advisorCli.arg(['--cluster-context', tl.getInput('kubernetesCluster', true)]);
            if (tl.getBoolInput('failOnCritical', false)) {
                advisorCli.arg(["--run-mode", "pipeline"]);
            }
            let advisorProfile = tl.getInput('advisorProfile', false);
            if (advisorProfile != null && advisorProfile != undefined && advisorProfile != '') {
                if (tl.stats(advisorProfile).isFile()) {
                    advisorCli.arg(['--policy-profile', advisorProfile]);
                }
                else {
                    tl.warning("Advisor Profile is not a file " + advisorProfile);
                }
            }
            advisorCli.arg(['--outfile', tl.getInput('advisorScanReport', true)]);
            var errlines = [];
            advisorCli.on("errline", line => {
                errlines.push(line);
            });
            tl.debug(" ** before command");
            var exitCode;
            let promise = yield advisorCli.exec({
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
                .then(function (result) {
                tl.debug(" ** in then command");
                exitCode = result; // Now you can use res everywhere
                tl.debug("Command exit: " + exitCode);
            });
            tl.debug(" ** after command");
            if (exitCode == 0) {
                tl.setResult(tl.TaskResult.Succeeded, '');
            }
            else {
                tl.setResult(tl.TaskResult.Failed, 'Either Alcide Advisor scanning failed or critical finding found. Review the findings in advisor-report.html.');
            }
        }
        catch (err) {
            tl.debug(" ** in catch");
            tl.setResult(tl.TaskResult.Failed, err);
        }
    });
}
exports.AdvisorRunScan = AdvisorRunScan;
