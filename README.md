# M7011E
Project for the course Design of Dynamic Web Systems

Starts the web app on port `8080`

### Prerequisites

* `docker`
* `docker-compose`

### Build and run docker-compose

`docker-compose build && docker-compose down && docker-compose up -d`

### Copy files to container while running

When running compose, the server uses nodemon which updates the website without restarting the service when code is changed.
This means you need to copy the code to the container which is why I wrote this simple script.

`./copy.sh`

### Build and run image

This script first shuts down the current session of the image and then builds a new one and starts it.

`./build_docker.sh`