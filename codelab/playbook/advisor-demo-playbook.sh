#!/usr/bin/env bash

#set -x

########################
# User conf
########################
KUBE_CLUSTER=${minikube:-}
DEFAULT_TEXT_EDITOR=${vim:-}
# For MacOSx value should be 'open'
# For other linux distros use 'firefox' or 'google-chrome' or another browser name within your machine $PATH
WEB_BROWSER=${google-chrome:-}

if [[ "$OSTYPE" == "darwin"* ]]; then
    # Mac OSX
    WEB_BROWSER=open
    DEFAULT_TEXT_EDITOR=edit
fi

if [ "${KUBE_CLUSTER}" == "" ]; then
    echo "You must specifiy a valid cluster context"
    exit 1
fi

ADVISOR=./advisor

########################
# include the player
########################
. player.sh


check_prerequisite ${DEFAULT_TEXT_EDITOR}
check_prerequisite ${WEB_BROWSER}

########################
# Configure the options
########################

#
# speed at which to simulate typing. bigger num = faster
#
TYPE_SPEED=100

#
# custom prompt
#
# see http://www.tldp.org/HOWTO/Bash-Prompt-HOWTO/bash-prompt-escape-sequences.html for escape sequences
#
DEMO_PROMPT="${GREEN} ${CYAN}\W "

# hide the evidence
clear

#p "Run kube-advisor scan against a cluster ... lets pick AKS running istio and scan istio control plane"
#pe "${ADVISOR} validate cluster --cluster-context k8s-istiodemo --namespace-include="istio-system"  --outfile istio-scan.html"
#pe "${WEB_BROWSER} istio-scan.html &"

#  lets set context on ${KUBE_CLUSTER}, and deploy nginx into the cluster
pe "kubectl config set-context ${KUBE_CLUSTER} && kubectl delete ns advisordemo || true && kubectl apply -f ./nginx-deployment.yaml"

pe "kubectl get deploy"
p ""
clear

p "Run kube-advisor scan against a cluster ... all you need is to specify the cluster context"

pe "${ADVISOR} validate cluster --cluster-context ${KUBE_CLUSTER} --namespace-include="*" --namespace-exclude="-" --outfile scan.html"
pe "${WEB_BROWSER} scan.html &"
clear

p "Let's create a blueprint/baseline from the cluster ..."
pe "${ADVISOR} generate kube-formation --cluster-context ${KUBE_CLUSTER} --namespace-include="*" --namespace-exclude="-" --outfile gold-profile.yaml"

#p "Scan the same cluster using the established baseline ... Supposably we should be in a better shape"
#pe "${ADVISOR} validate cluster --cluster-context ${KUBE_CLUSTER} --namespace-include="*" --namespace-exclude="-" --policy-profile gold-profile.yaml --outfile scan.html"
#pe "${WEB_BROWSER} scan.html &"

p "Let's make some changes - the application formation from expected workload perspective"
pe "kubectl delete deploy/nginx"
pe "${ADVISOR} validate cluster --cluster-context ${KUBE_CLUSTER} --namespace-include="*" --namespace-exclude="-" --policy-profile gold-profile.yaml --outfile scan.html"
pe "${WEB_BROWSER} scan.html &"

pe "${DEFAULT_TEXT_EDITOR} ./nginx-deployment.yaml"
pe "kubectl apply -f ./nginx-deployment.yaml"

pe "${ADVISOR} validate cluster --cluster-context ${KUBE_CLUSTER} --namespace-include="*" --namespace-exclude="-" --policy-profile gold-profile.yaml --outfile scan.html"
pe "${WEB_BROWSER} scan.html &"

pe "${ADVISOR} validate cluster --cluster-context ${KUBE_CLUSTER} --namespace-include="*"  --namespace-exclude="-" --outfile scan.html"
pe "${WEB_BROWSER} scan.html &"


#pe "${ADVISOR} validate cluster --cluster-context k8s-istiodemo --namespace-include="istio-system"  --outfile istio-scan.html"
#pe "${WEB_BROWSER} istio-scan.html &"


# show a prompt so as not to reveal our true nature after
# the demo has concluded
p ""

