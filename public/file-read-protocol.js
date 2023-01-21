const { protocol } = require('electron');

function fileReadProtocol() {
  // Name the protocol whatever you want.
  const protocolName = 'electron-safe';

  protocol.registerFileProtocol(protocolName, (request, callback) => {
    const url = request.url.replace(`${protocolName}://`, '');
    try {
      return callback(decodeURIComponent(url));
    } catch (error) {
      // Handle the error as needed
      console.error(error);
    }
  });
}

module.exports = fileReadProtocol;
