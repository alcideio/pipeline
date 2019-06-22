"use strict";

import tl = require('azure-pipelines-task-lib/task');
import path = require('path');

import ClusterConnection from "./clusterconnection";
import { AdvisorRunScan } from './advisor-scan';


tl.setResourcePath(path.join(__dirname, '.' , 'task.json'));

// Change to any specified working directory
tl.cd(tl.getInput("cwd"));

//var command = tl.getInput("command", false);
const environmentVariableMaximumSize = 32766;

var kubeconfigfilePath;


// open kubectl connection and run the command
var connection = new ClusterConnection(kubeconfigfilePath);
try
{
    connection.open().then(  
        () => { return run(connection, "") }
    ).then(
       () =>  {
           tl.setResult(tl.TaskResult.Succeeded, "");
           connection.close();
       }
    ).catch((error) => {
       tl.setResult(tl.TaskResult.Failed, error.message)
       connection.close();
    });
}
catch (error)
{
    tl.setResult(tl.TaskResult.Failed, error.message);
}

async function run(clusterConnection: ClusterConnection, command: string) 
{
    await AdvisorRunScan();
}
