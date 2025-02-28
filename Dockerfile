FROM frolvlad/alpine-oraclejdk8:slim

EXPOSE 8080

ENV TOMCAT_VERSION_MAJOR 8
ENV TOMCAT_VERSION_FULL  8.5.30
ENV CATALINA_HOME /usr/local/apache-tomcat-$TOMCAT_VERSION_FULL

RUN mkdir -p "$CATALINA_HOME" &&\
  apk add --update curl &&\
  curl -LO https://archive.apache.org/dist/tomcat/tomcat-${TOMCAT_VERSION_MAJOR}/v${TOMCAT_VERSION_FULL}/bin/apache-tomcat-${TOMCAT_VERSION_FULL}.tar.gz &&\
  gunzip -c apache-tomcat-${TOMCAT_VERSION_FULL}.tar.gz | tar -xf - -C /usr/local &&\
  rm -f apache-tomcat-${TOMCAT_VERSION_FULL}.tar.gz &&\
  rm -rf $CATALINA_HOME/webapps/examples $CATALINA_HOME/webapps/docs &&\
  apk del curl &&\
  rm -rf /var/cache/apk/*

COPY ./buddyadmin-api/target/buddyadmin-api.war $CATALINA_HOME/webapps/
COPY ./buddyadmin-presentation/target/buddyadmin.war $CATALINA_HOME/webapps/

CMD ${CATALINA_HOME}/bin/catalina.sh run