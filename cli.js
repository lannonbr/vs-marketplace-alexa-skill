const { search } = require('./api');

async function go(query) {
  let extData = await search(query);

  console.log(extData);
}

if (process.argv.length < 3) {
  console.log("CLI requires a search query as input.\nUsage: node cli.js <query>\n(Note: Currently it returns the 1st from the search)");
} else {
  go(process.argv[2]);
}
