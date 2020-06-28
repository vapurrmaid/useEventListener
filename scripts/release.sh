
#!/bin/bash

set -eoux pipefail

cd $(git rev-parse --show-toplevel)

BETA=${1:-}

yarn install
yarn lint
yarn test
yarn build:clean

if [ "$BETA" == "" ]; then
  ./node_modules/.bin/release-it
elif [ "$BETA" == "--beta" ]; then
  ./node_modules/.bin/release-it --preRelease=beta
else
  echo "$BETA is not a recognized option"
  exit 1
fi