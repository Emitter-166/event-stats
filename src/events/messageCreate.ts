import { Client, PermissionFlagsBits } from "discord.js";
import { errHandler } from "..";
import { createEvent, deleteEvent, send_stats } from "../services/eventServices";

export const message_create_listener = (client: Client) => {
    client.on('messageCreate', async msg => {
        try{
            if(!msg.content.startsWith('!events-stats')) return; 
            if(!msg.member) return;
            if(!msg.member?.permissions.has(PermissionFlagsBits.ModerateMembers) && !msg.member?.roles.cache.has('965922532609888302')) throw new Error('Insufficient permissions');

            const cmd = msg.content.split(" ")[1];
            if(!cmd) throw new Error('No arguments provided: start/stop/stats')

            switch(cmd.toLowerCase()){
                case "start": 
                    return await createEvent(msg)
                case "stop":
                    return await deleteEvent(msg)
                case "stats":
                    return await send_stats(msg)
            }
        }catch(err: any){
            console.log("Err at /events/messageCreate.ts/message_create_listener()");
            console.log(err);
            errHandler(err, msg)
        }
    })
}


