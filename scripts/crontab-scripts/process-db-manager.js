const db = require("../../models/index");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const startPort = 3000;
const endPort = 3010;
const childProcesses = []; // Array to store child processes

function findAvailablePort(startPort, endPort, directory, appJSFile) {
  return new Promise((resolve, reject) => {
    let processData = {
      PID: null,
      PORT: null,
    };

    processData.PORT = startPort;

    console.log(
      `running command: PORT=${startPort} node ${directory}/${appJSFile}`
    );

    const childProcess = spawn("node", [path.join(directory, appJSFile)], {
      env: {
        ...process.env,
        PORT: startPort.toString(),
      },
    });

    childProcess.on("spawn", () => {
      console.log("Child Process spawned with PID:", childProcess.pid);
      processData.PID = childProcess.pid;
    });

    childProcesses.push({
      process: childProcess,
      port: startPort,
      pid: childProcess.pid,
      finishFlag: false,
    }); // Store the child process in the array

    childProcess.on("error", (err) => {
      if (err.code === "ENOENT") {
        console.log("r1", err);
        resolve(startPort);
      } else {
        reject(err);
      }
    });

    childProcess.stderr.on("data", (data) => {
      console.error("Child Process stderr:", data.toString());
    });

    childProcess.stdout.on("data", (data) => {
      console.log("Child Process stdout:", data.toString());
    });

    childProcess.on("exit", (code, signal) => {
      if (code !== 0) {
        reject(new Error(`Command exited with code ${code}`));
      } else if (signal === "SIGINT") {
        console.log("Child Process terminated due to SIGINT signal");
        // Perform cleanup or additional processing here
      } else {
        console.log("Child Process completed successfully");
        // Perform cleanup or additional processing here
      }
    });

    process.on("SIGINT", () => {
      // Perform cleanup or additional processing here
      // Terminate all child processes
      const childProcessPromises = childProcesses.map((cp) => {
        return new Promise((resolve) => {
          cp.process.on("exit", (code, signal) => {
            resolve(cp);
          });
          cp.process.kill("SIGINT");
        });
      });

      childProcessPromises.forEach((promise, index) => {
        promise.then((cp) => {
          if (!childProcesses[index].finishFlag) {
            console.log(
              "Child Process received SIGINT signal, System in port: " +
                cp.port +
                " PID: " +
                cp.pid +
                " Finished"
            );
            childProcesses[index].finishFlag = true;
          }
        });
      });

      Promise.all(childProcessPromises).then(() => {
        process.exit();
      });
    });
  });
}

db.sequelize.sync().then(async () => {

    const sites = await db.Sites.findAll();
    console.log(sites);
  findAvailablePort(startPort, endPort, "repositories/app1", "index.js")
    .then((data) => {
      console.log(
        `Found available port: ${data.PORT} with PID: ${data.PID}`,
        data
      );

      // Start your command/process on the found port in a separate thread
      // Retrieve the PID of the process using your desired method and handle as needed
    })
    .catch((err) => {
      fs.appendFile("errors.log", err.toString(), (error) => {
        if (error) {
          console.error("Failed to log error:", error);
        }
      });
    });
});
