const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./src/data.json', 'utf8'));

data.products = data.products.map(p => {
  const code = p.nameEn || p.name;
  return {
    ...p,
    code: code,
    manualUrl: `/manuals/${code}.pdf`
  };
});

fs.writeFileSync('./src/data.json', JSON.stringify(data, null, 2));
console.log('Updated data.json');
