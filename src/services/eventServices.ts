import { Channel, EmbedBuilder, GuildTextBasedChannel, Message, MessageCollector } from "discord.js";


type event = {
    startedAt: number,
    messages: number,
    participants: Map<string, number>,
    collector: MessageCollector
}

export const events = new Map<string, event>();

export const createEvent = async (msg: Message) => {
    try{

        const channel = msg.channel;
        if(events.has(channel.id)) throw new Error('Event stats are already being monitored on this channel! please end it first using !events-stats stop')

        const eventObj: event = {
            startedAt: Date.now(),
            collector: channel.createMessageCollector(),
            messages: 0,
            participants: new Map<string, number>()
        }

        eventObj.collector.on("collect", async (msg, msgs) => {
            eventObj.messages++ 
            
            const userId = msg.author.id;
            if(!eventObj.participants.has(userId)){
                eventObj.participants.set(userId, 1);
            }else{
                const before = eventObj.participants.get(userId) as number;
                eventObj.participants.set(userId, before+1);
            }
        })

        events.set(channel.id, eventObj)

        await msg.reply('## Event monitoring started!')
    }catch(err: any){
        console.log("Err at /services/eventServices.ts/createAd()");
        console.log(err);
        throw new Error(err.message);
    }
}

export const deleteEvent = async (msg: Message) => {
    try{

        await msg.react('✅')
        const channel = msg.channel;

        const embed = await create_stats_embed(channel);

        await (await msg.author.createDM()).send({
            embeds: [embed]
        })

        const data = events.get(channel.id);

        if(!data) throw new Error('Event stats are not being monitored in this channel, please do !events-stats start in order to start monitoring')

        data.collector.stop('event deleted');
        events.delete(channel.id);

    }catch(err: any){
        console.log("Err at /services/eventServices.ts/deleteAd()");
        console.log(err);
        throw new Error(err.message);
    }
}


export const send_stats = async (msg: Message) => {
    try{
        const embed = await create_stats_embed(msg.channel);
        await msg.reply({
            allowedMentions: {repliedUser: false},
            embeds: [embed]
        })

    }catch(err: any){
        console.log("Err at /services/eventServices.ts/send_stats()");
        console.log(err);
        throw new Error(err.message);
    }
}

export const create_stats_embed = async (channel: Channel) => {
    try{
        const data = events.get(channel.id);

        if(!data) throw new Error('Event stats are not being monitored in this channel, please do !events-stats start in order to start monitoring')

        const channelMention = `<#${channel.id}>`;
        const message_count = data.messages;
        const participant_count = data.participants.size; 
        const duration = Math.round((Date.now() - data.startedAt) / 60_000) + " minutes";
        const avg_msg_per_member = Math.round(message_count/participant_count);


        let desc = Array.from(data.participants).sort((a, b) => b[1] - a[1])
            .map((current, i) => {
                return `${i+1}.<@${current[0]}> - \`${current[1]}\``
                    .replace('1.', "🥇")
                    .replace('2.', "🥈")
                    .replace('3.', '🥉');
            }).join('\n')

        let stats = '```css\n' + 
        `- message count:  ${message_count} \n` +
        `- participants: ${participant_count} \n` + 
        `- duration: ${duration} \n` + 
        `- avg msg per member: ${avg_msg_per_member}\n`
        + '```'
        let title = `# Event stats for #${(channel as GuildTextBasedChannel).name}`;

        const embed = new EmbedBuilder()
            .setTitle(title)
            .addFields(
                {name: 'stats', value: stats, inline: false},
                {name: 'leaderboard', value: desc, inline: false}
            )
        return embed;

    }catch(err: any){
        console.log("Err at /services/eventServices.ts/create_stats_embed()");
        console.log(err);
        throw new Error(err.message);
    }
}
