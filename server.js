const express = require("express");
const app = express();
const {
  syncAndSeed,
  models: { Team, Region },
} = require("./db");

app.get("/", async (req, res, next) => {
  try {
    const regions = await Region.findAll({
      include: [Team],
    });
    const teams = await Team.findAll({
      include: [Region],
    });
    const html = `
            <html>
            <head>
            <title>
                NBA Teams & Roster by Region
            </title>
            </head>
            <h1> NBA Teams by Region</h1>
            <body>
            <ul>
            ${regions
              .map((region) => { return `
              <h3>${region.name}</h3>
                        ${region.teams.map( (team) => `
                        <li>
                            ${team.name}
                        </li>
                        `).join('')}
                `;
              })
              .join("")}
            </ul>
            </body>
            </html>
        `;

    res.send(html);
  } catch (ex) {
    next(ex);
  }
});

const init = async () => {
  try {
    await syncAndSeed();
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening on port ${port}`));
  } catch (ex) {
    console.log(ex);
  }
};

init();
