from pymongo import MongoClient

class CRUD:
	database_client: MongoClient = None
	database_connection: any = None
	database_collection: dict = None

	def __init__(self, client: MongoClient) -> None:
		self.database_client = client
		self.database_connection = client.api
		self.database_collection = dict({
			'comment': self.database_connection.comments,
			'rate': self.database_connection.ratings
		})

	def create(self, key: str, data: dict) -> None:
		handle = self.database_collection.get(key)
		handle.insert_one(data)

	def read(self, key: str, query: dict) -> dict | bool:
		handle = self.database_collection.get(key)
		if handle is None:
			return {}
		
		# Do we need to query multiple items?
		if key != 'comment':
			return False if handle.find_one(query) is None else True

		# We do, retrieve all items in the collection that match the query.
		result = list(dict())
		for comment in handle.find(query):
			id: str = comment.get('id')
			name: str = comment.get('name')
			comment: str = comment.get('comment')
			result.append(dict({'name': name, 'id': id, 'comment': comment}))
		
		return result

	def update(self) -> None:
		pass

	def delete(self, key: str, query: dict) -> bool:
		handle = self.database_collection.get(key)
		if handle is None:
			return False

		return handle.delete_one(query).acknowledged

database = CRUD(MongoClient())
