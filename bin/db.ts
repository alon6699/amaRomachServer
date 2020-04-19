import { exec } from "child_process";
const mongod = 'mongod --replSet "rs0" --port 27018';
const rs = {
   _id: "rs0",
   members: [
      { _id: 0, host: "localhost:27018" },
   ]
};
const mongo = 'mongo --port 27018' + `rs.initiate(${rs})`

// TODO: write script that open 2 shells and execute this commands
