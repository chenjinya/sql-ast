# SQL 解析


## INSERT

```
node sql-insert-structure.js
```

input:

```sql
insert into table_name123 (`id`,`name`,sign) values(123,'aaa',"d)d\"d"),(234, 'ccc',"`eeee`")
```

output: 

```json

{
	INSERT: {
		type: 'keyword',
		name: 'insert'
	},
	INTO: {
		type: 'keyword',
		name: 'into'
	},
	TABLE: {
		type: 'table_name',
		name: 'table_name123'
	},
	COLUMN: {
		type: 'column',
		values: ['id', 'name', 'sign']
	},
	VALUES: {
		type: 'values',
		number: 2,
		values: [
			['123', 'aaa', 'd)d\\"d'],
			['234', 'ccc', '`eeee`']
		]
	}
}
```