#!/bin/bash

mkdir -p _site

./templates/default "3ml Home" index.html > _site/index.html
./templates/default "About 3ml" about.html > _site/about.html
