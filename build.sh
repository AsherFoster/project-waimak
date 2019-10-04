BRANCH_ENV=$([ $TRAVIS_BRANCH == "develop"] && echo "beta" || echo "production")

NODE_ENV=$BRANCH_ENV npm run build
