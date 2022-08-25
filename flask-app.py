# from json import 
from operator import contains
from sys import exit
from typing import Final

# Depends: https://pypi.org/project/octokitpy/
try:
	from octokit import Octokit
except ImportError:
	print('octokit is missing, please install it: pip3 install octokitpy')
	exit(1)

from flask import Flask, jsonify, request, render_template, send_from_directory

# Character limit taken from:
# https://textcleaner.net/character-count/
USERNAME_MAX_LEN: Final[int] = 39

flask_app = Flask(__name__, template_folder='webapp/html/')
github_api = Octokit()

@flask_app.route('/', methods=['GET'])
def route_root():
	return render_template('index.html')

# Serve static html files relative to themselves (i.e. webapp/static/foo.html -> ./foo.html)
@flask_app.route('/<filename>')
def download_file(filename: str):
	valid_resources = ["png", "jpeg", "jpg"]
	for x in valid_resources:
		if filename.endswith(x):
			return send_from_directory("meta/res/", filename)
	
	# Folders have the same name as the file extension.
	# As a result determining which file to load is relatively fast:
	path = f"webapp/{filename.split('.')[1]}"
	return send_from_directory(path, filename)


@flask_app.route('/api/repositories', methods=['GET'])
def route_repos():
	args = request.args

	# Missing required arguments?
	print(args.to_dict())
	if len(args.to_dict()) == 0:
		return jsonify({'error': 0})

	# Username limit exceeded?
	username = args.get('username')
	if len(username) > USERNAME_MAX_LEN:
		return jsonify({'error': 1})
	
	repos = github_api.repos.list_for_user(username=username)

	# Check if the user exists.
	#
	# Note: From my observations, github's API uses
	# "message" only when something unexpected occurred
	if contains(repos.json, "message"):
		return jsonify({'error': 2})
	
	# Does this user have any public repos?
	if len(repos.json) == 0:
		return jsonify({'error': 3})
	
	return repos.json

@flask_app.route('/api/comment', methods=['POST'])
def route_comment():
	comment = request.data.decode()
	print(comment)

	return f'Data:\n\n{comment}\n'


if __name__ == '__main__':	
	flask_app.run(debug=True)
