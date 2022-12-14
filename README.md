# Coding Challenge V3

### Getting started:
API used: Github

1. Install dependencies (python3.5+ required):
	- python3 -m pip install -r requirements.txt
	- You can install mongodb for linux [here](https://www.mongodb.com/docs/manual/administration/install-on-linux/)

2. Run the server:
	- python3 flask-app.py

3. Copy and paste the URL logged to the console, et voila!

### Folder structure:
- `meta/` ~ Miscellaneous files
	- `doc` ~ Documentation
	- `res` ~ Images, fonts, etc for the webapp

- `flask-app.py` ~ Server/API entry point
- `auth.py, database.py, route.py` ~ User authentication, database management and API endpoints
- `webapp/` ~ webapp implementation

### Features: 
- Search for a repository given a username and display information about them.
- Rate a repository (results are averaged)
- Create, delete and edit a comment on a repository
- Create, log into and out of accounts
