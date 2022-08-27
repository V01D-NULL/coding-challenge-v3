# Database

[Relevant source code](../../database.py)

The database used is mongodb.

You will often see the word *collection*, `pymongo` describes a collection as follows:
> A collection is a group of documents stored in MongoDB, and can be thought of as roughly the equivalent of a table in a relational database.

Basic CRUD operations are wrapped inside of the CRUD class, access is performed through the `database` variable:
```py
from database import database
database.create(...)
```

To begin any operation, one must specify the database collection (also parameterized as *key*) and, the data to be inserted where applicable.

Valid keys include:
- 'comment'
- 'rate'
- 'login'

## CREATE:


```py
from database import database

comment = {
	# name = repository owner + repository name
	'name': 'V01D-NULL_coding-challenge-v3',
	'comment': 'What a neat challenge this is!'
}

# Returns: None
database.create(key='comment', data=comment)
```

## READ:
```py
from database import database

# Here we select the collection "comment" and use the key-value pair 'name' as a query

# Returns: 
#  - True if one or more entries exist, otherwise False.
#  or
#  - A list of dictionaries. This is used for the comment system, anything else simply uses True/False
database.read(key='comment', query={'name' : 'V01D-NULL_coding-challenge-v3'})
```

## UPDATE
```py
from database import database

# Insert or replace data of an existing entry in the database.
database.update(key='comment', query={'name': 'V01D-NULL_coding-challenge-v3'}, data={'loves': 'programming'})
```

## DELETE
```py
from database import database

# Delete an entry from the database

# Returns:
# True if the deletion was acknowledged by mongodb, False if there was no entry matching the query or if mongodb failed to delete the item.
database.delete(key='comment', query={'name': 'V01D-NULL_coding-challenge-v3'})
```