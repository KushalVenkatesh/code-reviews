const express = require("express");
const app = express();
app.use(express.json());
const port = 3000;

app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/redeem", function (req, res) {
  const credits = req.body.credits;
  const userId = req.body.userId;
  console.log(`redeeming ${credits} credits for user ${userId}`);

  try {
    const hours = redeemCredits(credits, userId);
    res.send({
      status: `User ${userId} redeemed ${credits} credits to get ${hours} hours.`,
    });
  } catch (err) {
    res.status(400).send({
      status: err,
    });
  }
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});

/**
 * The player can purchase gaming hours by redeeming
 * credits. How many hours one credit is
 * worth depends on the level of the player.
 */
function redeemCredits(credits, playerId) {
  playerLevel = getPlayerLevel(playerId);
  hours = convertCreditsToHours(playerLevel, credits);

  redeemHoursToPlayerProfile(hours, credits, playerId);
  return hours;
}

/**
 * Returns the level of the player.
 */
function getPlayerLevel(playerId) {
  levelQuery = "SELECT playerLevel FROM players WHERE playerId = " + playerId;
  playerLevel = executeQuery(levelQuery);

  return playerLevel;
}

/**
 * Adds the purchased hours to the players game hours.
 */
function redeemHoursToPlayerProfile(hours, credits, playerId) {
  hourQuery = "SELECT hours FROM players WHERE playerId = " + playerId;
  oldHours = executeQuery(hourQuery);

  updateQuery = "Update players SET hours = " + (oldHours + hours) + " WHERE playerId = " + playerId;

  try {
    executeQuery(updateQuery);
  } catch (err) {
    throw new Error("Could not add hours.");
  }

  chargeCreditsFromPlayer(credits, playerId);
}

/**
 * Charges the player with the credits redeemed.
 */
function chargeCreditsFromPlayer(credits, playerId) {
  creditQuery = "SELECT credits FROM players WHERE playerId = " + playerId;
  oldCredits = executeQuery(hourQuery);

  updateQuery = "Update players SET credits = " + (oldCredits - credits) + " WHERE playerId = " + playerId;

  try {
    executeQuery(updateQuery);
  } catch (err) {
    throw new Error("Could not charge credits: " + err);
  }
}

/**
 * This method converts the credits to game hours. Gamers that
 * have a lower gaming level get more game hours for their credits.
 * For more advanced gamers, buying new credits is more expensive.==
 */
function convertCreditsToHours(playerLevel, credits) {
  if (playerLevel < 3) {
    return 3 * credits;
  } else if (playerLevel > 3 && playerLevel <= 8) {
    return 1.5 * credits;
  } else {
    return 1 * credits;
  }
}


/**
* The remainer of this file is not part of the review but mimics the backend - which is not fully implemented for this example.
**/

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function executeQuery() {
  return getRandomInt(13);
}
