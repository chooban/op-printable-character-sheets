const exec = require('child_process').exec;

module.exports = function commandExists(commandName, callback) {
  exec(`command -v ${commandName}
    2>/dev/null
    && { echo >&1 '${commandName} found'; exit 0; }`,
    (error, stdout) => {
      callback(null, !!stdout);
    });
};
