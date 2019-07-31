FROM alpine:3.10 AS build
RUN  apk --no-cache add wget

RUN wget -O /claat https://github.com/googlecodelabs/tools/releases/download/v2.2.0/claat-linux-amd64 &&\
  chmod +x /claat && /claat version

RUN mkdir -p /alcide/training/
ADD  24242 /alcide/training/advisor

FROM scratch

WORKDIR /alcide/training/advisor
COPY --from=build /alcide/training/advisor /alcide/training/advisor
COPY --from=build /claat /alcide/training/advisor/claat


ENTRYPOINT  ["/alcide/training/advisor/claat", "serve", "--addr", "0.0.0.0:9090"]
