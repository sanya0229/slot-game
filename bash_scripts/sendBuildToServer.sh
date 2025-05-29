#!/bin/bash

cd ./build ||  exit

sshpass -p 'Cthdth40Yjvflf7077' rsync -av --quiet -e 'ssh ' . root@81.28.6.38:/var/www/nomad/slots
