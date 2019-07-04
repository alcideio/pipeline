# Task for security scanning kubernetes cluster & workloads hygiene

Alcide Advisor is an agentless Kubernetes audit, compliance and hygiene scanner that’s built to ensure a friciton free DevSecOps workflows. Alcide Advisor can be plugged early in the development process and before moving to production.

With Alcide Advisor, the security checks you can cover includes:

- Kubernetes infrastructure vulnerability scanning.
- Hunting misplaced secrets, or excessive priviliges for secret access.
- Workload hardening from Pod Security to network policies.
- Istio security configuration and best practices.
- Ingress Controllers for security best practices.
- Kubernetes API server access privileges.
- Kubernetes operators security best practices.
- Deployment conformance to labeling, annotating, resource limits and much more ...

Alcide Advisor security checks are being added and updated on a regular basis.

[VIDEO: Alcide Advisor Overview](https://youtu.be/UXNPMzCtG84)

## Azure DevOps Pipeline Integration

A short video that walk you through the integration can be found here [VIDEO: Azure DevOps Pipeline Integration](https://youtu.be/dFU4fbWdtg0)

## Use Case Examples

### Hunting Misplaced Secrets, or Excessive Secret Access
The Kubernetes secret object is designed to store and manage sensitive information, such as passwords, OAuth tokens, and SSH keys. Placing this information in plain text or in the wild (such as config maps) makes it easily exposed to unauthorized users, and is a greater risk for your Kubernetes and cloud provider environments.

Alcide Advisor scans for any secrets, API keys, and passwords that may have been wrongfully misplaced in pod environment variables, as well as in config maps. In addition, it verifies the use of RBAC permissions that defines who can read secret objects.

![Secrets found in Pod environment variables](https://d2908q01vomqb2.cloudfront.net/77de68daecd823babbb58edb1c8e14d7106e83bb/2019/06/19/Alcide-Advisor-Amazon-EKS-2.png "Secrets found in Pod environment variables.")

### Kubernetes Vulnerabilities Scan
While Kubernetes drastically simplifies the orchestration of your most sensitive containerized environments, it’s not bulletproof to critical security vulnerabilities that require quick detection and response.

An example of a serious vulnerability that was recently found is the privilege escalation vulnerability, tracked as [CVE-2018-1002105](https://nvd.nist.gov/vuln/detail/CVE-2018-1002105). This vulnerability allows users, through a specially crafted request, to establish a connection through the Kubernetes API server and send arbitrary requests over the same connection directly to that backend. It was authenticated with the Kubernetes API server’s TLS credentials that were used to establish the backend connection.


`Alcide Advisor` scans your cluster for known vulnerabilities on the master API server and worker node components, including container runtime. This has great benefit for teams using both managed clusters like Kops, AKS-Engine or the managed kubernetes services like AKS.

### App-Formation
The App-formation feature ([requires regsitration](https://www.alcide.io/advisor-free-trial/)) allows you to create a baseline profile on a specific cluster, and get scan results only on issues that deviate from the baseline. This helps DevOps focus on relevant issues and assets that require attention.


## Available tasks

Azure DevOps

**Alcide Advisor Kubernetes Scan** which scans kubernetes cluster(s) for security & hygiene drifts.

To publish a scan report either to `Azure Pipeline` or `File Share` use the **Publish build artifacts** task

## Feedback and issues

If you have feedback or issues, please email to our [Support](mailto:support@alcide.io)

## Start your risk-free trial now

![Alcide Kubernetes Advisor](https://d2908q01vomqb2.cloudfront.net/77de68daecd823babbb58edb1c8e14d7106e83bb/2019/06/19/Alcide-Advisor-Amazon-EKS-1.png "Alcide Kubernetes Advisor")

To get a tailor made exprience with **Alcide Kubernetes Advisor** start your risk-free [trial now](https://www.alcide.io/advisor-free-trial/)

Try all features free for 30 days
100% risk free - no automatic purchase after trial ends

or, [request a demo](https://get.alcide.io/request-demo)
