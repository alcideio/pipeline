#!/usr/bin/env bash

#
# Requires:
# AWS CLI
# service account wired with permissions to get EKS cluster credentials and set the default region
#

# Get All Cluster Names
#
CLUSTER_NAMES=`aws eks list-clusters | jq -c '.[][]' | tr -d '"'`

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

scan_eks_clusters(){
    local outdir=$1
    local CLUSTER_NAMES=`aws eks list-clusters | jq -c '.[][]' | tr -d '"'`
    local KUBECONFIG=$outdir/advisor-config

    #echo ${CLUSTER_NAMES}
    for cluster in ${CLUSTER_NAMES}
    do
        aws eks update-kubeconfig --name $cluster --alias $cluster
        alcide_scan_current_cluster $outdir
    done  
}



outdir=$(mktemp -d -t alcide-advisor-XXXXXXXXXX)


pushd $outdir
alcide_download_advisor
scan_eks_clusters $outdir
popd
