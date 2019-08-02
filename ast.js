const sql = "insert into table_name123 (`id`,`name`,sign) values(123,'aaa',\"d)d\\\"d\"),(234, 'ccc',\"`eeee`\")";

console.log(sql);
const numberReg = /[0-9]/;
const letterReg = /[a-z_]/i;
const letterMixNumberReg = /[`a-z0-9_]/i

const tokenizer = (input) => {
  let current = 0;
  let tokens = [];
  while (current < input.length) {
    let char = input[current];
    if (char === '(' || char === ")") {
      let value = char;
      tokens.push({
        type: 'paren',
        value
      });
      current++;
      continue;
    }

    if (char === ',') {
      let value = char;
      tokens.push({
        type: 'comma',
        value
      });

      current++;
      continue;
    }


    if (letterMixNumberReg.test(char)) {
      let value = '';
      while (letterMixNumberReg.test(char)) {
        value += char;
        char = input[++current];
      }
      tokens.push({
        type: 'name',
        value
      })
      continue;
    }

    if (numberReg.test(char)) {
      let value = '';
      while (numberReg.test(char)) {
        value += char;
        char = input[++current];
      }

      tokens.push({
        type: 'number',
        value
      })
      continue;
    }

    if (char === '"' || char === "'") {
      let value = '';
      let s = char;
      char = input[++current];
      while (char !== s) {
        value += char;
        char = input[++current];
        //转义问题
        if (char === s && input[current - 1] === "\\") {
          value += char;
          char = input[++current];
        }
      }
      char = input[++current];

      tokens.push({
        type: 'string',
        value
      });
      continue;
    }
    current++;

  }
  return tokens;
}

const parser = (tokens) => {
  let current = 0;
  const walk = () => {
    let token = tokens[current];
    if (token.type === 'number') {
      current++;
      return {
        type: 'NumberLiteral',
        value: token.value
      }
    }
    if (token.type === 'string') {
      current++;
      return {
        type: 'StringLiteral',
        value: token.value
      }
    }

    if (token.type === 'comma') {
      current++;
      return {
        type: 'CommaLiteral',
        value: token.value
      }
    }

    if (token.type === 'name') {
      current++;
      return {
        type: 'NameLiteral',
        value: token.value
      }
    }


    if (token.type === 'operation') {
      current++;
      return {
        type: 'OperationIdentifier',
        value: token.value
      }
    }

    if (token.type === 'paren' && token.value === '(') {
      let node = {
        type: 'CallExpression',
        params: [],
      }
      token = tokens[++current];
      while ((token.type !== 'paren')
        || (token.type === 'paren' && token.value !== ')')) {
        let _n = walk();
        //容错
        if (_n) {
          node.params.push(_n);
        }
        token = tokens[current];


      }
      current++;
      return node;
    }
    //容错
    current++;
    return null;
  }

  let ast = {
    type: 'Program',
    body: [],
  };

  while (current < tokens.length) {
    //容错
    let node = walk();
    ast.body.push(node)
  }
  return ast;
}

let tokens = tokenizer(sql);
let parse = parser(tokens);

const compile = (node) => {
  if (node.type === "Program") {
    return node.body.map(compile).join(" ");
  } else if (node.type === "CallExpression") {
    return "(" + node.params.map(compile).join("") + ")";
  } else if (node.type === "StringLiteral") {
    return `"${node.value}"`;
  } else if (node.type === "NameLiteral") {
    return node.value;
  } else if (node.type === "CommaLiteral") {
    return node.value + ' ';
  } else if (node.value) {
    return node.value;
  }
}


console.log(parse.body);
console.log(compile(parse));
