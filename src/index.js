const cluster = require('cluster');
const os = require('os');
const pino = require('pino');
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  prettyPrint: { colorize: true },
});

const initControlCommands = (dataAsBuffer) => {
  let wcounter = 0; // initialize workers counter
  const data = dataAsBuffer.toString().trim(); // cleanse input
  // list workers command
  if (data === 'lsw') {
    Object.values(cluster.workers).forEach((worker) => {
      wcounter++;
      logger.info(
        `\x1b[32mALIVE: Worker with  PID: ${worker.process.pid}\x1b[0m`
      );
    });
    logger.info(`\x1b[32mTotal of ${wcounter} living workers.\x1b[0m`);
  }
  // -help command
  if (data === '-help') {
    logger.info(
      'lsw -> list workers\nkill :pid -> kill worker\nrestart :pid -> restart worker\ncw ->create worker'
    );
  }
  /// create worker command
  if (data === 'cw') {
    const newWorker = cluster.fork();
    logger.info(`Created new worker with PID ${newWorker.process.pid}`);
    return;
  }
  // here are the commands that have an argument - kill and restart
  const commandArray = data.split(' ');
  // assign the actual command on variable
  const command = commandArray[0];
  if (command === 'kill') {
    // find the corresponding worker
    const filteredArr = Object.values(cluster.workers).filter(
      (worker) => worker.process.pid === parseInt(commandArray[1])
    );
    // check if found
    if (filteredArr.length === 1) {
      // kill it
      filteredArr[0].kill('SIGTERM'); // emit a signal so the master //knows we killed it manually, so he will not restart it
      logger.info(
        `\x1b[31mKilled worker ${filteredArr[0].process.pid} .\x1b[0m`
      );
    } else {
      // Display a friendly error message on bad PID entered
      logger.info(
        `\x1b[31mWorker with PID ${commandArray[1]} does not found. Are you sure this is the PID?\x1b[0m`
      );
    }
  }
  // this command is quite like the kill, i think the explanation would
  // be quite the same
  if (command === 'restart') {
    const filteredArr = Object.values(cluster.workers).filter(
      (worker) => worker.process.pid === parseInt(commandArray[1])
    );
    if (filteredArr.length === 1) {
      logger.info(
        `\x1b[31mWorker ${filteredArr[0].process.pid} restarting\x1b[0m`
      );
      filteredArr[0].disconnect(); // this should be used to kill a process manually
      const nw = cluster.fork();
      logger.info(
        `\x1b[32mWorker is up with new PID ${nw.process.pid}.\x1b[0m`
      );
    } else {
      logger.info(
        `\x1b[31mWorker with PID ${commandArray[1]} does not found. Are you sure this is the PID?\x1b[0m`
      );
    }
  }
};

if (cluster.isMaster) {
  // Take advantage of multiple CPUs
  const cpus = os.cpus().length;

  logger.info(`Taking advantage of ${cpus} CPUs`);
  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }
  // set console's directory so we can see output from workers
  console.dir(cluster.workers, { depth: 0 });

  // initialize our CLI
  process.stdin.on('data', (data) => {
    initControlCommands(data);
  });

  cluster.on('exit', (worker, code) => {
    // Good exit code is 0 :))
    // exitedAfterDisconnect ensures that it is not killed by master cluster or manually
    // if we kill it via .kill or .disconnect it will be set to true
    // \x1b[XXm represents a color, and [0m represent the end of this
    // color in the console ( 0m sets it to white again )
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      logger.info(
        `\x1b[34mWorker ${worker.process.pid} crashed.\nStarting a new worker...\n\x1b[0m`
      );
      const nw = cluster.fork();
      logger.info(`\x1b[32mWorker ${nw.process.pid} will replace him \x1b[0m`);
    }
  });

  logger.info(`Master PID: ${process.pid}`);
} else {
  // how funny, this is all needed for workers to start
  require('./app.js');
}
