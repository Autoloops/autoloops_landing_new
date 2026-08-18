/**
 * Post-build: keep the React launch page as the site root.
 * Greplica stays available at /greplica/ via CRA's copy of public/.
 */
const fs = require("fs");
const path = require("path");

const build = path.join(__dirname, "..", "build");
const shell = path.join(build, "index.html");
const greplicaIndex = path.join(build, "greplica", "index.html");

if (!fs.existsSync(shell)) {
  console.error("[postbuild] missing build/index.html (React shell) — aborting.");
  process.exit(1);
}

if (fs.existsSync(greplicaIndex)) {
  console.log("[postbuild] React launch page is site root");
  console.log("[postbuild] greplica remains at /greplica/");
} else {
  console.log("[postbuild] React launch page is site root (no greplica bundle found)");
}
