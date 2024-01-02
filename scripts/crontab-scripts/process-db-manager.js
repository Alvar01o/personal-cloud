const db = require('../../models/index');
const { spawn } = require('child_process');

const startPort = 3000;
const endPort = 4000;


function findAvailablePort(startPort, endPort, directory, appJSFile) {
    return new Promise((resolve, reject) => {
        const server = exec(`POST=${startPort} node ${directory} ${appJSFile}`);

        server.on('error', (err) => {
            if (err.code === 'ENOENT') {
                resolve(startPort);
            } else {
                reject(err);
            }
        });

        server.stdout.on('data', (data) => {
            if (data) {
                findAvailablePort(startPort + 1, endPort)
                    .then(resolve)
                    .catch(reject);
            } else {
                resolve(startPort);
            }
        });

        server.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Command exited with code ${code}`));
            }
        });
    });
}


db.sequelize.sync().then(() => {
    findAvailablePort(startPort, endPort)
    .then((port) => {
      console.log(`Found available port: ${port}`);
      // Start your command/process on the found port in a separate thread
      // Retrieve the PID of the process using your desired method and handle as needed
    })
    .catch((err) => {
      console.error('Failed to find available port:', err);
    });

});