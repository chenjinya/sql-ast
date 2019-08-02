# SQL 解析

## 语法树AST

仅实现了insert语句

```
node ast.js
```


input:

```sql
insert into table_name123 (`id`,`name`,sign) values(123,'aaa',"d)d\"d"),(234, 'ccc',"`eeee`")
```

output: 

```
//sql
insert into table_name123 (`id`,`name`,sign) values(123,'aaa',"d)d\"d"),(234, 'ccc',"`eeee`")

//ast 语法树
[ { type: 'NameLiteral', value: 'insert' },
  { type: 'NameLiteral', value: 'into' },
  { type: 'NameLiteral', value: 'table_name123' },
  { type: 'CallExpression',
    params: [ [Object], [Object], [Object], [Object], [Object] ] },
  { type: 'NameLiteral', value: 'values' },
  { type: 'CallExpression',
    params: [ [Object], [Object], [Object], [Object], [Object] ] },
  { type: 'CommaLiteral', value: ',' },
  { type: 'CallExpression',
    params: [ [Object], [Object], [Object], [Object], [Object] ] } ]

// 还原
insert into table_name123 ("id", "name", sign) values (123, "aaa", "d)d\"d") ,  (234, "ccc", "`eeee`")
```


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
	"INSERT": {
		"type": "keyword",
		"name": "insert"
	},
	"INTO": {
		"type": "keyword",
		"name": "into"
	},
	"TABLE": {
		"type": "table_name",
		"name": "table_name123"
	},
	"COLUMN": {
		"type": "column",
		"values": ["id", "name", "sign"]
	},
	"VALUES": {
		"type": "values",
		"number": 2,
		"values": [
			["123", "aaa", "d)d\\\"d"],
			["234", "ccc", "`eeee`"]
		]
	}
}
```