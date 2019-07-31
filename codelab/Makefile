
.SECONDARY:
.SECONDEXPANSION:

VERSION ?= 1.0.0

.phony: help advisor-codelab-image advisor-codelab-serve advisor-codelab-run

prepare:
	claat export -f html advisor-codelab.md
	zip -r 24242/tutorial.zip playbook/*


advisor-codelab-image:  prepare ##@Build Build Training Contaimner
	docker build -t alcide.io/codelab:$(VERSION) .
	docker tag alcide.io/codelab:$(VERSION) alcide.io/codelab:latest

advisor-codelab-serve: prepare ##@Local Serve locally
	cd 24242 && claat serve | cd ..

advisor-codelab-run: ##@Local Docker run
	docker run --rm --name advisor-codelab -p 9090:9090 alcide.io/codelab:latest   



HELP_FUN = \
         %help; \
         while(<>) { push @{$$help{$$2 // 'options'}}, [$$1, $$3] if /^(.+)\s*:.*\#\#(?:@(\w+))?\s(.*)$$/ }; \
         print "Usage: make [options] [target] ...\n\n"; \
     for (sort keys %help) { \
         print "$$_:\n"; \
         for (sort { $$a->[0] cmp $$b->[0] } @{$$help{$$_}}) { \
             $$sep = " " x (30 - length $$_->[0]); \
             print "  $$_->[0]$$sep$$_->[1]\n" ; \
         } print "\n"; }

help: ##@Misc Show this help
	@perl -e '$(HELP_FUN)' $(MAKEFILE_LIST)	

.DEFAULT_GOAL := help

USERID=$(shell id -u)	