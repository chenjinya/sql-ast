const sql = "insert into table_name123 (`id`,`name`,sign) values(123,'aaa',\"d)d\\\"d\"),(234, 'ccc',\"`eeee`\")";


console.log(sql);
const numberReg = /[0-9]/;
const letterReg = /[a-z_]/i;
const letterMixNumberReg = /[`a-z0-9_]/i

let syntax = {};

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


    if (letterMixNumberReg.test(char)) {
      let value = '';
      while (letterMixNumberReg.test(char)) {
        value += char;
        char = input[++current];
      }
      tokens.push({
        type: 'name',
        value: value.replace(/`/g, "")
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
let tokens = tokenizer(sql);

const parser = (tokens) => {
  let current = 0;
  while (current < tokens.length) {
    let token = tokens[current];
    if (token.type === 'name') {
      if (token.value.toUpperCase() === 'VALUES') {
        syntax['VALUES'] = {
          type: 'values',
          number: 0,
          values: [],
        }
        // syntax['COLUMNS'].process = 0
      } else if (syntax['TABLE']) {
        syntax['COLUMN'].values.push(token.value);
      }
      else if (syntax['INTO']) {
        syntax['TABLE'] = {
          type: 'table_name',
          name: token.value
        };
        syntax['COLUMN'] = {
          type: 'column',
          values: [],
        }
      } else if (token.value.toUpperCase() === 'INTO') {
        syntax['INTO'] = {
          type: 'keyword',
          name: token.value
        };
      } else if (token.value.toUpperCase() === 'INSERT') {
        syntax['INSERT'] = {
          type: 'keyword',
          name: token.value
        };
      }
    } else if (token.type === 'string' || token.type === 'number') {

      if (syntax['VALUES']) {
        if (!syntax['VALUES'].values[syntax['VALUES'].number]) {
          syntax['VALUES'].values[syntax['VALUES'].number] = [];
        }
        syntax['VALUES'].values[syntax['VALUES'].number].push(token.value)
      }
    } else if (token.type === 'paren') {
      if (token.value == ")" && syntax['VALUES']) {
        syntax['VALUES'].number++
      }
    }
    current++;
  }
}

parser(tokens)
console.log(JSON.stringify(syntax));
