const moment = require('moment');
const fetch = require('node-fetch');
const url = "https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery?api-version=3.0-preview.1";

const query = process.argv[2];

const first = process.argv[3] !== undefined && process.argv[3] === "--first"

// The body of this POST request was created in reference of a POST request sent off by VS Code when searching for an extension.
let body = JSON.stringify({
  filters: [
    {
      criteria: [
        { // FilterType 8: Platform (VS, VS Code, Azure DevOps)
          filterType: 8,
          value: "Microsoft.VisualStudio.Code",
        },
        { filterType: 12, value: "4096" }, // Don't know what this is
        { filterType: 10, value: query } // FilterType 10: Query
      ],
      pageNumber: 1,
      pageSize: 8,
      sortBy: 0,
      sortOrder: 0
    }
  ],
  assetTypes: [],
  flags: 914 // No clue what this is used for
});

fetch(url, {
  method: "POST",
  body,
  headers: {
    "Content-Type": "application/json",
    "User-Agent": "VS-Marketplace-Alexa-Skill/1.0"
  }
}).then(res => res.json())
  .then(data => {
    const exts = data.results[0].extensions;

    for (let ext of exts) {
      let extData = {};

      extData.name = ext.displayName;
      extData.author = ext.publisher.displayName;
      extData.releaseDate = moment(ext.releaseDate).format("LL");
      extData.shortDescription = ext.shortDescription;
      extData.lastUpdated = moment(ext.lastUpdated).format("LL");
      
      extData.stats = {
        install: ext.statistics.filter(s => s.statisticName === "install")[0].value,
        updateCount: ext.statistics.filter(s => s.statisticName === "updateCount")[0].value,
      };

      // Save ratings count only if it exists
      let ratingsCount = ext.statistics.filter(s => s.statisticName === "ratingcount");
      if (ratingsCount.length > 0) {
        extData.stats.ratingCount = ratingsCount[0].value;
      }

      // Save average rating only if it exists 
      let avgRating = ext.statistics.filter(s => s.statisticName === "averagerating");
      if (avgRating.length > 0) {
        extData.stats.avgRating = parseFloat(avgRating[0].value.toFixed(2));
      }

      console.log(extData);
      console.log();

      if (first) return;
    }
  })
