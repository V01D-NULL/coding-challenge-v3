from database import database
from auth import *
from operator import contains
from flask import Flask, jsonify, request, render_template, send_from_directory, session
from typing import Final
from octokit import Octokit # https://pypi.org/project/octokitpy/

# Username character limit taken from:
# https://textcleaner.net/character-count/
USERNAME_MAX_LEN: Final[int] = 39
MAX_COMMENT_LENGTH: Final[int] = 128

flask_app = Flask(__name__, template_folder='webapp/html/')
github_api = Octokit()

@flask_app.route('/', methods=['GET'])
def route_root():	
    return render_template('index.html')

@flask_app.route('/api/logout', methods=['POST'])
def route_logout():
    session['logged_in'] = False
    return jsonify({})

@flask_app.route('/api/login', methods=['POST'])
def route_login():
    username = request.args.get('username')
    password = request.args.get('password')
    
    successful_authentication = authenticate(username, password)
    if successful_authentication is None:
        return jsonify({'success': False, 'error': 'This username does not exist. Check your spelling and try again'})
    
    if successful_authentication:
        session['logged_in'] = True
        session['username'] = username
        return jsonify({'success': True})

    return jsonify({'success': False, 'error': 'Invalid password'})

@flask_app.route('/api/signup', methods=['POST'])
def route_signup():
    username = request.args.get('username')
    password = request.args.get('password')
    
    if not account_exists(username):
        account_create(username, password)
        return jsonify({'success': True})

    return jsonify({'success': False, 'error': 'An account with this username already exists'})

# Serve static html files relative to themselves (i.e. webapp/html/foo.html -> foo.html)
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
        return jsonify({'error': 'Missing required arguments'})

    # Username limit exceeded?
    username = args.get('username')
    if len(username) > USERNAME_MAX_LEN:
        return jsonify({'error': 'Username character limit exceeded (Max: 39)'})
    
    repos = github_api.repos.list_for_user(username=username)

    # Does this user exist?
    #
    # Note: This works because, from my observations, github's API uses
    # "message" only when something unexpected occurred
    if contains(repos.json, "message"):
        return jsonify({'error': 'No such username'})
    
    # Does this user have any public repos?
    if len(repos.json) == 0:
        return jsonify({'error': 'This user has no public repositories'})
    
    return repos.json

@flask_app.route('/api/rate', methods=['POST', 'GET'])
def route_rate():
    name = request.args.get('name')
    entry = database.read(key='rate', query={'name': name})

    if request.method == 'GET':
        if entry is None:
            entry = database.create(key='rate', data={'name': name, 'average': 0, 'collection': dict()})
            return jsonify({'average': 0})
        
        return jsonify({'average': entry['average']})

    if session.get('username') is None:
        return jsonify({'error': 'You must be logged in to perform this action'})
    
    score = int(request.args.get('score'))
    collection = dict(database.read(key='rate', query={'name': name}).get('collection'))
    collection[session.get('username')] = score # Store the updated rating

    average = sum(collection.values()) / len(collection)
    database.update(key='rate', query={'name': name}, data={
        "$set":{
            'average': average, 'collection': collection
        }
    })
    
    return jsonify({'average': average})


@flask_app.route('/api/comment', methods=['POST', 'DELETE', 'GET'])
def route_comment():
    id = request.args.get('id')
    name = request.args.get('name')
    edit = request.args.get('edit')

    if request.method == 'GET':
        return jsonify(database.read(key='comment', query={'name': name}))

    if not session.get('logged_in'):
        return jsonify({'error': 'You must be signed in to perform this action'})

    elif request.method == 'POST':
        if id is None or name is None:
            return jsonify({})
        
        comment = request.data.decode()
        if len(comment) > MAX_COMMENT_LENGTH:
            return jsonify({'error': 'Exceeded maximum character length for this comment'})

        if edit is None:
            database.create(key='comment', data={'name': name, 'username': session.get('username'), 'id': id, 'comment': comment})
        else:
            database.update(key='comment', query={'name': name, 'id': id}, data={
                    "$set":{
                        'comment':comment
                    }
                })

        return jsonify({})

    # DELETE
    if not database.delete(key='comment', query={'name': name, 'username': session.get('username'), 'id': id}):
        return jsonify({'error': 'Failed to delete comment'})
    
    return jsonify({})