#!/bin/bash

# Run automatically on detected changes.
#
# Linux:
# while true; do inotifywait -e modify *.html templates/*; ./build.sh; done
#
# OSX:
#
# fswatch *.html templates/* | xargs -n1 -I{} ./build.sh

mkdir -p _site

./templates/default "3ml Home" index.html > _site/index.html
./templates/default "About 3ml" about.html > _site/about.html
./templates/default "3ml Resources" resources.html > _site/resources.html
./templates/default "3ml Guidance" resources.html > _site/guidance.html
