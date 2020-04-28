

<img src="https://landscape.cncf.io/logos/argo.svg" alt="argocd" width="96"/>

# ArgoCD | Security Scanning Kubernetes Cluster & Workloads Hygiene


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

## ArgoCD Integration

During a Sync operation into the cluster, Argo CD of offers synchronization hooks to control and validate the synchornization event.

Synchronization can be configured using resource hooks. Hooks are ways to run scripts before, during, and after a Sync operation. Hooks can also be run if a Sync operation fails at any point. Some use cases for hooks are:

- Using a PreSync hook to perform a database schema migration before deploying a new version of the app.
- Using a Sync hook to orchestrate a complex deployment requiring more sophistication than the Kubernetes rolling update strategy.
- Using a **PostSync** hook to run integration and health checks after a deployment.
- Using a SyncFail hook to run clean-up or finalizer logic if a Sync operation fails. SyncFail hooks are only available starting in v1.2

The documentation for this Argo CD feature can be found [here](https://argoproj.github.io/argo-cd/user-guide/resource_hooks/)

**Alcide Advisor** can scan the deployed configurations, detect security drifts, by running as a **PostSync** hook as part of "last" wave of hooks.

#### *Argo CD* Hook Example (Job)

Full deployment resources can be found in [argocd-example.yaml](argocd-example.yaml)

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: alcide-advisor-job-argocd-security-hook
  namespace: alcide-advisor
  labels:
    app.kubernetes.io/name: alcide-advisor-job
    app.kubernetes.io/instance: argocd-security-hook
    app.kubernetes.io/version: "2.12.0"
  annotations:
    alcide.io/advisor: "job"
    argocd.argoproj.io/sync-wave: "99"
    argocd.argoproj.io/hook: PostSync
    argocd.argoproj.io/hook-delete-policy: HookSucceeded

spec:
    backoffLimit: 1
    template:
      spec:
          serviceAccountName: alcide-advisor-job-argocd-security-hook
          volumes:
          containers:
          - name: advisor
            image: alcide/advisor:stable
            imagePullPolicy: Always
            volumeMounts:
            args:
              - --eula-sign
              - validate
              - cluster
              - --inCluster
              - --outfile
              - /dev/null

              #
              # Uncomment these lines if you wish to fail the Sync operation upon the presence of critical findings
              #
              #- --run-mode
              #- pipeline

              - --slack-api-token
              - $(ALCIDE_ADVISOR_EXPORT_SLACK_API_TOKEN)
              - --slack-channel
              - "@someuser"
              #
              # Create Alcide Account to perform congure the scan policy
              #
              #- --profile-id
              #- "11111111-1111-1111-aaaa-bbbbbbbbbbbb"  
              #- --organization
              #- "myaccount"
              #- --alcide-api-server
              #- "myaccount.cloud.alcide.io"
              #- --alcide-api-key
              #- $(ALCIDE_API_KEY)
              #- --debug
            securityContext:
              allowPrivilegeEscalation: false
              capabilities:
                drop:
                - ALL
              runAsNonRoot: true
              runAsUser: 10001
              readOnlyRootFilesystem: true
            env:
              - name: ALCIDE_API_KEY
                valueFrom:
                  secretKeyRef:
                    name: alcide-advisor-job-argocd-security-hook-exports
                    key: alcideApiKey
              - name: ALCIDE_ADVISOR_EXPORT_SLACK_API_TOKEN
                valueFrom:
                  secretKeyRef:
                    name: alcide-advisor-job-argocd-security-hook-exports
                    key: slackApiToken

          restartPolicy: Never
```

## Feedback and issues

If you have feedback or issues, please submit a github issue

## Create Free-Forever Account

![Alcide Kubernetes Advisor](https://d2908q01vomqb2.cloudfront.net/77de68daecd823babbb58edb1c8e14d7106e83bb/2019/06/19/Alcide-Advisor-Amazon-EKS-1.png "Alcide Kubernetes Advisor")

To unlock your **Alcide Kubernetes Advisor** create your [free-forever account](https://www.alcide.io/pricing#free-forever)

Enjoy all features free for up to 3 nodes, for unlimited time, or [request a demo](https://get.alcide.io/request-demo)
