import SemaphoreSchema from "../models/semaphore";
import ObstructionSchema from "../models/ObstructionSchema";
import PedestrianSchema from "../models/PedestrianSchema";
import log from "../models/logs";

const messageHandlers = new Map<string, Function>();

messageHandlers.set("semaphore/create", createSemaphore);
messageHandlers.set("semaphore/obstruction", logObstruction)
messageHandlers.set("semaphore/pedestrian", logPedestrian);

export function handleMessage(topic: string, message: Buffer) {
  console.log("Message received: ", message.toString());
  const handler = messageHandlers.get(topic);
  if (handler) {
    handler(message);
  } else {
    console.error("No handler for topic: ", topic);
  }
}

async function logObstruction(message:Buffer){
  let json = JSON.parse(message.toString());
  let semaphore = await SemaphoreSchema.findOne({name: json.name});
  if(semaphore){
    console.log("Obstruction detected in semaphore: ", semaphore.name);
    let obstruction = {
      name: semaphore.name,
      time: new Date()
    }
    let obstructionObject = new ObstructionSchema(obstruction);
    await obstructionObject.save();
    let logged = {
        semaphore_id: semaphore.name,
        log: obstructionObject
    }
    let logObject = new log(logged);
    await logObject.save();
  }
  else{
    console.log("Semaphore not found");
  }
}

async function logPedestrian(message:Buffer){
    let json = JSON.parse(message.toString());
    let semaphore = await SemaphoreSchema.findOne({name: json.name});
    if(semaphore){
        console.log("Pedestrian detected in semaphore: ", semaphore.name);
        let pedestrian = {
        name: semaphore.name,
        time: new Date()
        }
        let pedestrianObject = new PedestrianSchema(pedestrian);
        await pedestrianObject.save();
        let logged = {
            semaphore_id: semaphore.name,
            log: pedestrianObject
        }
        let logObject = new log(logged);
        await logObject.save();
    }
    else{
        console.log("Semaphore not found");
    }
}

async function createSemaphore(message: Buffer) {
  let json = JSON.parse(message.toString());

  //create a default semaphore
  let semaphore = {
    name: json.name,
    red_time: 30,
    green_time: 30,
    operating_time: [
      {
        day: "Monday",
        open: "00:00:00",
        close: "23:59:59",
      },
      {
        day: "Tuesday",
        open: "00:00:00",
        close: "23:59:59",
      },
      {
        day: "Wednesday",
        open: "00:00:00",
        close: "23:59:59",
      },
      {
        day: "Thursday",
        open: "00:00:00",
        close: "23:59:59",
      },
      {
        day: "Friday",
        open: "00:00:00",
        close: "23:59:59",
      },
      {
        day: "Saturday",
        open: "00:00:00",
        close: "23:59:59",
      },
      {
        day: "Sunday",
        open: "00:00:00",
        close: "23:59:59",
      },
    ],
  };
  try {
    let semaphore2 = await SemaphoreSchema.findOne({name: json.name});
    if (semaphore2) {
      throw new Error("Semaphore already exists");
    }
    else {
      let semaphoreObject = new SemaphoreSchema(semaphore);
      await semaphoreObject.save();
    }
  } catch (error) {
    //semaphore already exists
    console.log("Semaphore already exists");
    }
}
