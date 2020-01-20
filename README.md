# M7011E
Project for the course Design of Dynamic Web Systems

Starts the web app on port `8080` and the api on port `8081`
The website will start with an admin account with the credentials `admin` `admin`

### Prerequisites

* `docker`
* `docker-compose`

### Build and run docker-compose

`docker-compose build && docker-compose down && docker-compose up -d`

### Build for development
For development it is recommended to run
`docker-compose build && docker-compose up`
in either the website or sim folders to do one at a time
