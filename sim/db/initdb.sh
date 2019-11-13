#!/bin/bash

curl -G http://localhost:8086/query --data-urlencode "q=CREATE DATABASE energy"
curl -G http://localhost:8086/query --data-urlencode "q=CREATE TABLE"
