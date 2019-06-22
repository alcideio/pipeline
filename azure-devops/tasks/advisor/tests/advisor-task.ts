import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');
import advisorscan = require('../advisor-scan');

async function run() 
{
    await advisorscan.AdvisorRunScan();
}


run();