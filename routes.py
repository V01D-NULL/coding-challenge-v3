import json
from database import database
from operator import contains
from flask import Flask, jsonify, request, render_template, send_from_directory
from typing import Final
from octokit import Octokit # https://pypi.org/project/octokitpy/

# Character limit taken from:
# https://textcleaner.net/character-count/
USERNAME_MAX_LEN: Final[int] = 39

flask_app = Flask(__name__, template_folder='webapp/html/')
github_api = Octokit()

@flask_app.route('/', methods=['GET'])
def route_root():
	return render_template('index.html')

# Serve static html files relative to themselves (i.e. webapp/static/foo.html -> ./foo.html)
@flask_app.route('/<filename>', methods=['GET'])
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
	if len(args.to_dict()) == 0:
		return jsonify({'error': 0})

	# Username limit exceeded?
	username = args.get('username')
	if len(username) > USERNAME_MAX_LEN:
		return jsonify({'error': 1})
	
	repos = github_api.repos.list_for_user(username=username)

	# Does this user exist?
	#
	# Note: This works because, from my observations, github's API uses
	# "message" only when something unexpected occurred
	if contains(repos.json, "message"):
		return jsonify({'error': 2})
	
	# Does this user have any public repos?
	if len(repos.json) == 0:
		return jsonify({'error': 3})
	
	return repos.json

@flask_app.route('/api/rate', methods=['POST', 'GET'])
def route_rate():
	name = request.args.get('name')
	like_status = database.read(key='rate', query={'name': name})
	
	if request.method == 'POST':
		like_type = 'Liked'
		if like_status is not None:
			like_type = 'Liked' if like_status['like'] == 'Disliked' else 'Disliked'
			database.update(key='rate', query={'name': name}, data={"$set":{'like':like_type}})
		else:
			database.create(key='rate', data={'name': name, 'like': like_type})
		
		return jsonify({'like': like_type})

	# GET
	if like_status is None or like_status['like'] is None:
		return jsonify({'like':'No like or dislike'})

	# print(jsonify(like_status))
	return jsonify({'like': like_status['like']})

@flask_app.route('/api/comment', methods=['POST', 'DELETE', 'GET'])
def route_comment():
	id = request.args.get('id')
	name = request.args.get('name')
	edit = request.args.get('edit')

	if request.method == 'POST':
		if id is None or name is None:
			return
		
		comment = request.data.decode()
		if edit is None:
			database.create(key='comment', data={'name': name, 'id': id, 'comment': comment})
		else:
			database.update(key='comment', query={'name': name, 'id': id}, data={
					"$set":{
						'comment':comment
					}
				})

		return jsonify({})

	elif request.method == 'DELETE':
		if not database.delete(key='comment', query={'name': name, 'id': id}):
			return jsonify({'error': 4})
		
		return jsonify({})

	# GET
	return jsonify(database.read(key='comment', query={'name': name}))