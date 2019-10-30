#!/usr/bin/env bash

#
# Requires:
# gcloud SDK
# service account wired with permissions to get GKE cluster credentials
#

# Get All Cluster Names
#
CLUSTER_NAMES=`gcloud container clusters list --sort-by=NUM_NODES 2> /dev/null  | awk '{ print $1 }' | grep -v NAME`

echo ${CLUSTER_NAMES}

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
    
    ./kube-advisor --eula-sign validate cluster --cluster-context $context --namespace-include="*" --outfile $outdir/$context.html
}

scan_gke_clusters(){
    local outdir=$1
    local CLUSTER_NAMES=`gcloud container clusters list --sort-by=NUM_NODES 2> /dev/null  | awk '{ print $1 }' | grep -v NAME`
    local KUBECONFIG=$outdir/advisor-config

    #echo ${CLUSTER_NAMES}
    for cluster in ${CLUSTER_NAMES}
    do
        local region=`gcloud container clusters list --filter=name:$cluster | awk '{ print $2}' | grep -v LOCATION`
        gcloud --quiet container clusters get-credentials --region $region $cluster
        alcide_scan_current_cluster $outdir
    done  
}



outdir=$(mktemp -d -t alcide-advisor-XXXXXXXXXX)


pushd $outdir
alcide_download_advisor
scan_gke_clusters $outdir
popd
