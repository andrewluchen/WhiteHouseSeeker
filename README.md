# White House Seeker
(A shameless attempt to clone Senate Seeker)

## Quick Start

```
# install back-end addons
$ pip install -r requirements

# install front-end addons
$ npm install

# migrate database
$ python manage.py makemigrations
$ python manage.py migrate

# transpile javascript and run server
$ ./node_modules/.bin/webpack --config webpack.config.js
$ python manage.py runserver
```
