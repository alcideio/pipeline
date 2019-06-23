import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '.', 'advisor-task.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput('kubernetesCluster', 'minikube');
tmr.setInput('advisorScanReport', '/tmp/advisor-report.html');
tmr.setInput('advisorProfile', '/tmp');


tmr.run();
