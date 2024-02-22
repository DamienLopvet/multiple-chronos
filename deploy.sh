
#!/usr/bin/env bash
set -e

# Build Step

docker build -t multiple-chronos:deploy .

docker run --rm -it -v /Users/damien/Documents/work/multiple-chronos/dist:/app/dist multiple-chronos:deploy run build

# push to github-pages option

read -p "Do you want to push to github-pages ? " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
echo "push to github pages confirmed"
cd dist
git init
git add .

# Provide a message for the commit

read -p "What is your commit message ? "
if [[ $REPLY ]]
then
COMMITMESSAGE=$REPLY
git commit -m  " $COMMITMESSAGE "
git push -f https://github.com/DamienLopvet/multiple-chronos.git master:gh-pages
cd -
else

echo "No commit message provided, action aborted"

fi
else

  echo "push to gihub pages aborted";

fi

# Push to github repo option

read -p "Do you want to push to update repo ? " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
echo "push to repo confirm";

git add .
git commit -m " $COMMITMESSAGE "
git push



else
  echo "push to repo aborted";
fi

echo "end of script"

#remove deployed image :

docker rmi $(docker images 'multiple-chronos:deploy' -a -q)