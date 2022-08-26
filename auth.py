from database import database

# TODO: Hash 'password'
def authenticate(username, password) -> bool | None:
	if not account_exists(username):
		return None
	
	account = database.read(key='login', query={'username': username, 'password': password})	
	return account.get('password') == password

def account_exists(username) -> bool:
	return database.read(key='login', query={'username': username})
