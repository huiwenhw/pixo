# pixo
> Photo Gallery built using React, NodeJs, Express and MySQL 

## Usage
Clone this repo
```
git clone https://github.com/huiwenhw/pixo
cd pixo
```

Install nodemon globally 
```
yarn add nodemon -g
```

Install server and client dependencies 
```
yarn 
cd client 
yarn 
```

Configure MySQL
```
brew services start mysql
```
In pixo/knexfile.js, change connection string to 
```
connection: {
    user: "your_db_user",
    password: "your_db_password",
    database: "your_db_name"
}
```

Start server and client at the same time 
```
yarn dev 
```

Compile index.scss file (this will watch index.scss and compile it to index.css) 
```
yarn sass
```
