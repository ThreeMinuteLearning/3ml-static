#!/bin/bash

set -e

# To run automatically on detected changes.
#
# Linux:
# while true; do inotifywait -e modify *.html templates/*; ./build.sh; done
#
# OSX:
#
# fswatch *.html templates/* | xargs -n1 -I{} ./build.sh

mkdir -p _site

export HELP_VIDEOS="$(while IFS=',' read -r heading vurl; do
  ./templates/help_video "$heading" $vurl
done < help_videos.txt)"


./templates/default "3ml Home" index.html > _site/index.html
./templates/default "About 3ml" about.html > _site/about.html
./templates/default "Review Questions - Curriculum Topics" curriculum.html > _site/curriculum.html
./templates/default "Review Questions - Researchers" researchers.html > _site/researchers.html
./templates/default "3ml Guidance" guidance.html > _site/guidance.html
