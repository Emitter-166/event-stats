import { Message } from "discord.js";

export const createEvent = async (msg: Message) => {
    try{
        
    }catch(err: any){
        console.log("Err at /services/eventServices.ts/createAd()");
        console.log(err);
        throw new Error(err.message);
    }
}

export const deleteEvent = async (msg: Message) => {
    try{
    
    }catch(err: any){
        console.log("Err at /services/eventServices.ts/deleteAd()");
        console.log(err);
        throw new Error(err.message);
    }
}

