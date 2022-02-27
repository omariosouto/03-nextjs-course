const jwt = require('jsonwebtoken');

const SECRET_KEY = '29847dhasuodnsjkazxcn jkasdh789123y';

const nossoToken = jwt.sign(
    {
      name: 'Mario',
    },
    SECRET_KEY,
    {
      expiresIn: '1y',
      subject: '1'
    }
);
console.log(nossoToken);
const TOKEN_GERADO = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTWFyaW8iLCJpYXQiOjE2NDU5OTQ1MTEsImV4cCI6MTY3NzU1MjExMSwic3ViIjoiMSJ9.hTV8C-Od8HRxgdRlpK86nCzyBBJ9NrDPngQsCk8eH1c';

// console.log(jwt.verify(TOKEN_GERADO, 'outra-chave'));
console.log(jwt.decode(nossoToken));
