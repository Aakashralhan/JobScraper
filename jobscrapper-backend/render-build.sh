#!/usr/bin/env bash

apt update && apt install -y wget unzip xvfb libxi6 libgconf-2-4
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
dpkg -i google-chrome*.deb || apt-get -f install -y