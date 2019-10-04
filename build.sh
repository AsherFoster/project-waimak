export NODE_ENV=$([[ $TRAVIS_BRANCH == "develop" ]] && echo "beta" || echo "production")

npm run build
