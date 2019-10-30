#!/usr/bin/env bash

#
# Requires:
# Azure CLI
# Service account wired with permissions to get GKE cluster credentials
#

alcide_download_advisor(){
    echo "Downloading Alcide Advisor"
    if [[ "$OSTYPE" == "linux-gnu" ]]; then
        # Linux
        local os="linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # Mac OSX
        local os="darwin"
    else
        echo "Unsupported OS, Currently Alcide Advisor is supported on Linux or MacOS only"
        exit
    fi

    curl -o kube-advisor https://alcide.blob.core.windows.net/generic/stable/$os/advisor
    chmod +x kube-advisor
}

alcide_scan_current_cluster(){
    local outdir=$1
    local CURRENT_CONTEXT=`kubectl config current-context`

    if [[ $(kubectl auth can-i get po 2> /dev/null) == "yes" ]]; then
        echo Scanning $cluster
        alcide_scan_cluster $outdir ${CURRENT_CONTEXT}
    else
        echo "The current user doesn't have read permissions to the cluster: ${CURRENT_CONTEXT}"
    fi

}

alcide_scan_cluster(){
    local outdir=$1
    local context=$2
    
    echo "Running: './kube-advisor --eula-sign validate cluster --cluster-context $context --namespace-include=\"*\" --outfile $outdir/$context.html'"
    ./kube-advisor --eula-sign validate cluster --cluster-context $context --namespace-include="*" --outfile $outdir/$context.html
}

scan_aks_clusters(){
    local outdir=$1
    local CLUSTERS=`az aks list | jq -r '.[] | "\(.name):\(.resourceGroup)" '`
    local KUBECONFIG=$outdir/advisor-config

    for cluster in ${CLUSTERS}
    do
        local cluster_name=`echo $cluster | tr ':' ' ' | awk '{ print $1}'`
        local cluster_rg=`echo $cluster | tr ':' ' '  | awk '{ print $2}'`

        az aks get-credentials --overwrite-existing --name $cluster_name  --resource-group $cluster_rg
        alcide_scan_current_cluster $outdir $cluster_name
    done  
}



outdir=$(mktemp -d -t alcide-advisor-XXXXXXXXXX)


pushd $outdir
alcide_download_advisor
scan_aks_clusters $outdir
popd
