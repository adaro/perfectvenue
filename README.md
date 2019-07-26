# Perfect Venue

This is the API layer and frontend web application. The API is a django project 
held within the `perfectvenue` folder. The frontend is built in React and is 
held within the `app` folder.

**API Development**

In order to run the API on your local computer. You'll need to clone the source 
code to a folder on your folder on your computer, create a virtual enviroment, 
install all dependecies, add your `settings.py` file, create your MySQL database, 
and finally run the django server. 

Run the following in a Terminal:
- `git clone https://github.com/adaro/perfectvenue.git`
- `cd perfectvenue/`
- `virtualenv venv`
- `source venv/bin/activate`
- `pip install -r perfectvenue/requirements.txt`

Create your MySQL database:
`mysql -p`
`CREATE DATABASE perfectvenuedb;`

Create settings.py file and add your username/password to the `settings.py` file under `DATABASES` lines 129 and 130. (FYI, these lines are subject to change as we add to `settings.py`)
(**WARNING:** `settings.py` should be kept in a secure location. NEVER check into Git) 

Now back in the terminal, migrate the database and create your Admin user and run the server:
- `python perfectvenue/manage.py migrate`
- `python perfectvenue/manage.py createsuperuser`
- `python perfectvenue/manage.py runserver`

That's it! You can now view the Admin dashboard by navigating to: http://127.0.0.1:8000/admin/


**App Development** 

In order to run the frontend React application you'll need to have `node` and `NPM` install onto your machine. 
Go here to install: https://www.npmjs.com/get-npm. After you've install you'll need to clone the source code, install dependencies and 
run the server. 

Run the following in a Terminal:
- `git clone https://github.com/adaro/perfectvenue.git`
- `cd perfectvenue/app/`
- `npm install`
- `npm start`

That's it!




