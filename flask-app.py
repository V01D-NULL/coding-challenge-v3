from os import mkdir
from subprocess import Popen
from routes import flask_app

if __name__ == '__main__':	
	try:
		mkdir('mongodb')
	except FileExistsError:
		pass

	Popen(["mongod", "--dbpath", "mongodb"], stdout=open('mongodb.log', 'w'))
	flask_app.run(debug=True)
