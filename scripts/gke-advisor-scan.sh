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
    curl -o kube-advisor https://alcide.blob.core.windows.net/generic/stable/linux/advisor
    chmod +x kube-advisor  
}

alcide_scan_current_cluster(){
    local outdir=$1

    CURRENT_CONTEXT=`kubectl config current-context`
    alcide_scan_cluster $outdir ${CURRENT_CONTEXT}
}

alcide_scan_cluster(){
    local outdir=$1
    local context=$2
    
    ./kube-advisor --eula-sign validate cluster --cluster-context $context --namespace-include="*" --outfile $outdir/$context.html
}

scan_gke_clusters(){
    local outdir=$1
    local CLUSTER_NAMES=`gcloud container clusters list --sort-by=NUM_NODES 2> /dev/null  | awk '{ print $1 }' | grep -v NAME`

    #echo ${CLUSTER_NAMES}
    for cluster in ${CLUSTER_NAMES}
    do
        local region=`gcloud container clusters list --filter=$cluster | awk '{ print $2}' | grep -v LOCATION`
        echo Scanning $cluster
        gcloud --quiet container clusters get-credentials --region $region $cluster
        alcide_scan_current_cluster $outdir
    done  
}



outdir=$(mktemp -d -t alcide-advisor-XXXXXXXXXX)


pushd $outdir
alcide_download_advisor
scan_gke_clusters $outdir
popd
