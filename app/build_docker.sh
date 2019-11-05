#!/bin/bash

docker stop m7011e-web-app
docker rm m7011e-web-app
docker build -t m7011e-web-app .
docker run -p 8080:8080 -d --name m7011e-web-app m7011e-web-app
