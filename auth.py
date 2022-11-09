from hashlib import md5
from database import database

def authenticate(username, password):
    if not account_exists(username):
        return None
    
    passwd_hash = hash(password)
    account = database.read(key='login', query={'username': username, 'password': passwd_hash})	
    return compare_hashes(passwd_hash, account.get('password'))

def account_exists(username):
    return database.read(key='login', query={'username': username})

def account_create(username, password):
    database.create(key='login', data={'username': username, 'password': hash(password)})

def hash(password):
    handle = md5(password.encode())
    return handle.hexdigest()

def compare_hashes(hash1, hash2):
    return hash1 == hash2