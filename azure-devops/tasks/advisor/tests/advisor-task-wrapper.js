"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tmrm = require("azure-pipelines-task-lib/mock-run");
const path = require("path");
let taskPath = path.join(__dirname, '.', 'advisor-task.js');
let tmr = new tmrm.TaskMockRunner(taskPath);
tmr.setInput('kubernetesCluster', 'minikube');
tmr.setInput('advisorScanReport', '/tmp/advisor-report.html');
tmr.run();
