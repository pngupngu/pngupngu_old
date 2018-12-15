#!/bin/bash

set -euxo pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

mkdir -p dist
pushd dist

git init
git remote add origin git@github.com:pngupngu/pngupngu.github.io.git
git remote update
git merge origin/master #--allow-unrelated-histories -X ours --no-edit

ls -1 | xargs -I {} rm -f {}

cp -R ../out/* .
echo pngupngu.com > CNAME

git add -A
git commit -m "Site updated at $(date +%Y-%m-%dT%H:%M:%S)"
git push origin master