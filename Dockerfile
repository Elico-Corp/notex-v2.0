## --------------------------------------------------------------------------------------------
## ############################################################################################
## --------------------------------------------------------------------------------------------

FROM ubuntu:quantal
MAINTAINER Hasan Karahan <hasan.karahan81@gmail.com>

## --------------------------------------------------------------------------------------------
## Part (a): `notex:nil` ######################################################################
## --------------------------------------------------------------------------------------------

# ubuntu: updates & upgrades
RUN apt-get -y update && \
    apt-get -y upgrade

# locale: `en_US.UTF-8`
RUN locale-gen en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US.UTF-8
ENV LC_ALL en_US.UTF-8

# basic tools
RUN apt-get -y install \
    build-essential git zip unzip \
    wget curl nano sudo

# java: 7u40
RUN wget -O jdk-7u40-linux-x64.tar.gz https://db.tt/9z8ZYIJU && \
    tar -xvf *-linux-x64.tar.gz && \
    mkdir -p /usr/lib/jvm && \
    mv ./jdk1.7.0_40 /usr/lib/jvm/jdk1.7.0 && \
    \
    update-alternatives --install "/usr/bin/java" "java" "/usr/lib/jvm/jdk1.7.0/bin/java" 1 && \
    update-alternatives --install "/usr/bin/javac" "javac" "/usr/lib/jvm/jdk1.7.0/bin/javac" 1 && \
    update-alternatives --install "/usr/bin/javaws" "javaws" "/usr/lib/jvm/jdk1.7.0/bin/javaws" 1 && \
    \
    chmod a+x /usr/bin/java /usr/bin/javac /usr/bin/javaws && \
    chown -R root:root /usr/lib/jvm/jdk1.7.0

# ruby: 1.9.3
RUN apt-get -y install ruby

# sencha command: 3.0.2.288
RUN wget -O 3.0.2.288-linux-x64.run.zip https://db.tt/KEVpOKtG && \
    unzip *.run.zip && rm *.run.zip && chmod +x *.run && \
    mkdir -p /opt/Sencha/Cmd && mv *.run /opt/Sencha/Cmd && \
    /opt/Sencha/Cmd/3.0.2.288-linux-x64.run --prefix /opt --mode unattended

# memcached: 1.4.14
RUN apt-get -y install memcached && \
    apt-get -y install libmemcached-dev

# redis: 2.8.3
RUN echo "deb http://packages.dotdeb.org squeeze all" >> \
    /etc/apt/sources.list.d/dotdeb.org.list && \
    echo "deb-src http://packages.dotdeb.org squeeze all" >> \
    /etc/apt/sources.list.d/dotdeb.org.list && \
    wget -q -O - http://www.dotdeb.org/dotdeb.gpg | apt-key add - && \
    \
    apt-get -y update && \
    apt-get -y install redis-server

# postgresql: 9.3
RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ precise-pgdg main" >> \
    /etc/apt/sources.list.d/pgdg.list && \
    wget --quiet -O - http://apt.postgresql.org/pub/repos/apt/ACCC4CF8.asc | apt-key add - && \
    \
    apt-get -y update && \
    apt-get -y install libpq-dev && \
    apt-get -y install postgresql-9.3

# python: 2.7.3, pip: 1.5, virtualenv: 1.11, sphinx: 1.1.3
RUN apt-get -y install python2.7 python2.7-dev python-setuptools python-sphinx && \
    easy_install pip && pip2 install virtualenv

# clean & remove
RUN apt-get -y clean && \
    apt-get -y autoclean && \
    apt-get -y autoremove

## --------------------------------------------------------------------------------------------
## Part (b): `notex:dev` ######################################################################
## --------------------------------------------------------------------------------------------

# notex: fetch latest tag
RUN git clone https://github.com/hsk81/notex /srv/notex.git && \
    cd /srv/notex.git && \
    git submodule update --init --recursive && \
    git checkout $(git tag | tail -n1) && \
    git checkout -b tag-$(git tag | tail -n1)

# notex: setup postgres
RUN /etc/init.d/postgresql start ; cd /srv/notex.git ; \
    sudo -u postgres -g postgres psql -f webed/config/pg.sql ; \
    sudo -u postgres -g postgres psql -f webed/config/test.sql ; \
    sudo -u postgres -g postgres psql -f webed/config/production.sql 

# notex: setup sencha & python env
RUN cd /srv/notex.git && \
    /bin/bash -c 'source /.bashrc && ./setup.sh' && \
    /bin/bash -c 'source /.bashrc && source bin/activate && ./setup.py install' && \
    /bin/bash -c 'mkdir -p .python-eggs'

# notex: setup dirs & owners
RUN mkdir -p /var/www/webed && \
    chown www-data:www-data /var/www/webed -R && \
    chown www-data:www-data /srv/notex.git -R

# notex: execute `reset`
RUN /etc/init.d/memcached start && \
    /etc/init.d/redis-server start && \
    /etc/init.d/postgresql start && \
    \
    cd /srv/notex.git && /bin/bash -c 'source bin/activate && \
        /usr/bin/sudo -u www-data -g www-data PYTHON_EGG_CACHE=.python-eggs \
            WEBED_SETTINGS=/srv/notex.git/webed/config/production.py ./webed.py reset'

## --------------------------------------------------------------------------------------------
## Part (c): `notex:pro` ######################################################################
## --------------------------------------------------------------------------------------------

# nginx: 1.4.4
RUN apt-get -y install nginx-full && \
    rm -rf /etc/nginx/sites-enabled/* && \
    rm -rf /etc/nginx/conf.d/*

# notex: execute `assets build`
RUN cd /srv/notex.git && /bin/bash -c 'source bin/activate && \
        /usr/bin/sudo -u www-data -g www-data PYTHON_EGG_CACHE=.python-eggs \
            WEBED_SETTINGS=/srv/notex.git/webed/config/production.py ./webed.py assets build'

# notex: execute `assets-gzip`
RUN cd /srv/notex.git && /bin/bash -c 'source bin/activate && \
        /usr/bin/sudo -u www-data -g www-data PYTHON_EGG_CACHE=.python-eggs \
            WEBED_SETTINGS=/srv/notex.git/webed/config/production.py ./webed.py assets-gzip'

## --------------------------------------------------------------------------------------------
## Part (d): `notex:run` ######################################################################
## --------------------------------------------------------------------------------------------

# notex: `webed.run`
RUN cd /srv/notex.git && echo '#!/bin/bash\n\
if [[ $@ =~ NGINX=(1|true) ]] ; then /etc/init.d/nginx start ; fi\n\
if [[ $@ =~ REDIS=(1|true) ]] ; then /etc/init.d/redis-server start ; fi\n\
if [[ $@ =~ MEMCACHED=(1|true) ]] ; then /etc/init.d/memcached start ; fi\n\
if [[ $@ =~ POSTGRESQL=(1|true) ]] ; then /etc/init.d/postgresql start ; fi\n\
\n\
cd /srv/notex.git && CMD=$@ && /usr/bin/sudo -u www-data -g www-data \
    /bin/bash -c "source bin/activate && PYTHON_EGG_CACHE=.python-eggs \
        WEBED_SETTINGS=/srv/notex.git/webed/config/production.py $CMD"\n\
' > webed.run && chmod +x webed.run

# notex: execute `webed.run`
ENTRYPOINT ["/srv/notex.git/webed.run"]

## --------------------------------------------------------------------------------------------
## Part (e): `notex:tex` ######################################################################
## --------------------------------------------------------------------------------------------

RUN apt-get -y install \
 texlive \
 texlive-bibtex-extra \
 texlive-fonts-extra \
 texlive-formats-extra \
 texlive-games \
 texlive-generic-extra \
 texlive-humanities \
 texlive-latex-extra \
 texlive-latex3 \
 texlive-math-extra \
 texlive-metapost \
 texlive-music \
 texlive-omega \
 texlive-plain-extra \
 texlive-publishers \
 texlive-science \
 texlive-xetex

## --------------------------------------------------------------------------------------------
## Part (f): `notex:cfg` ######################################################################
## --------------------------------------------------------------------------------------------

ADD nginx.conf /etc/nginx/conf.d/webed.conf
ADD robots.txt /etc/nginx/conf.d/robots.txt

ADD webed/config/default.py /srv/notex.git/webed/config/default.py
ADD webed/config/production.py /srv/notex.git/webed/config/production.py

## --------------------------------------------------------------------------------------------
## ############################################################################################
## --------------------------------------------------------------------------------------------
