# pixo
Photo Gallery built using React, NodeJs, Express and MySQL 

## Steps to get project up and running:
* git clone `https://github.com/huiwenhw/pixo`
* `cd pixo` and do `yarn install` 
* `cd client` and do `yarn install`
* start MySQL daemon: `brew services start mysql`
* In pixo/knexfile.js: Change user, password and database to your own credentials
* do `knex migrate:latest`
* start express server: `nodemon .`
* and in another terminal: in `/client folder`, do `yarn start` to start React
