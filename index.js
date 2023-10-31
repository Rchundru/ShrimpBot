//run using command in terminal: node index.js
const Discord = require("discord.js")
const dotenv = require("dotenv")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const { Player } = require("discord-player")
var fs = require("fs");
const TOKEN = fs.readFileSync('./text_files/token.txt', "utf8").toString()
// const client = new Discord.Client({
//     intents: [
//         "GUILDS",
//         "GUILD_MESSAGES",
//         "GUILD_VOICE_STATES",
//         "GUILD_MEMBERS"
//     ]
// })
const client = new Discord.Client({
    intents:[
        "Guilds",
        "GuildMessages",
        "GuildVoiceStates",
        "GuildMembers",
        "MessageContent"
    ]
});
client.slashcommands = new Discord.Collection();
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})
const LOAD_SLASH = process.argv[2] == 'load'
const CLIENT_ID = "956578747841134593"
const GUILD_ID = "513466762004791300"
const { loadavg } = require("os")
let commands = []
let answer='';
const slashFiles = fs.readdirSync("./slash").filter(file => file.endsWith(".js"))
for (const file of slashFiles) {
    const slashcmd = require(`./slash/${file}`)
    client.slashcommands.set(slashcmd.data.name, slashcmd)
    if (LOAD_SLASH) commands.push(slashcmd.data.toJSON())
}
if (LOAD_SLASH) {
    const rest = new REST({ version: "9" }).setToken(TOKEN)
    console.log("Deploying slash commands")
    rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
        .then(() => {
            console.log("Successfully loaded")
            process.exit(0)
        })
        .catch((err) => {
            if (err) {
                console.log(err)
                process.exit(1)
            }
        })
} else {
    client.on("ready", () => {
        console.log(`Logged in as ${client.user.tag}`)
        setInterval(() => {
        client.user.setActivity(fs.readFileSync('./text_files/status.txt', "utf8").toString()+" $about for help")}, 300000);
    })
    const channelId = "513466762004791302";
    client.on("guildMemberAdd", (member) => {
        async function greet(){
            let imgOrGif = Math.floor(Math.random() * 2);
            if(imgOrGif==0){
                let numberOfGifs = 3;
                let gifIndex = Math.floor(Math.random() * numberOfGifs)+1;
                const message = `Welcome to ${member.guild.name} <@${member.id}>!`;
                const channel = member.guild.channels.cache.get(channelId);
                try{
                await channel.send({content: message , files: ["./images/welcomegifs/"+gifIndex+".gif"]});
            }catch(err){
                const error = `Something went wrong with the greeting message, check error log!`;
                await channel.send({content: error});
                fs.writeFileSync('./text_files/errors.txt', err.toString(), function (err) {
                    if (err) {
                        return console.error(err);
                    }
                });
        }
            }else{
                let numberOfImgs = 3;
                let imgIndex = Math.floor(Math.random() * numberOfImgs)+1;
                const message = `Welcome to ${member.guild.name} <@${member.id}>!`;
                const channel = member.guild.channels.cache.get(channelId);
                try{
                await channel.send({content: message , files: ["./images/welcomeimgs/"+imgIndex+".jpg"]});
                }catch(err){
                    const error = `Something went wrong with the greeting message, check error log!`;
                    await channel.send({content: error});
                    fs.writeFileSync('./text_files/errors.txt', err.toString(), function (err) {
                        if (err) {
                            return console.error(err);
                        }
                    });
            }
            }
        }
        greet();
        
    });
    client.on("interactionCreate", (interaction) => {
        async function handleCommand() {
            //if (!interaction.isCommand()) return
            if (!interaction.isChatInputCommand()) return

            const slashcmd = client.slashcommands.get(interaction.commandName)
            if (!slashcmd) interaction.reply("Not a valid slash command")

            await interaction.deferReply()
            await slashcmd.run({ client, interaction })
        }
        handleCommand()
    })

    client.on("messageCreate", (message) => {

        function incCount() {
            let count = parseInt(fs.readFileSync('./text_files/shrimpCount.txt', "utf8"));
            count++;
            fs.writeFileSync('./text_files/shrimpCount.txt', count.toString(), function (err) {
                if (err) {
                    return console.error(err);
                }
            });
            return count;
        }
        function isMod(id){
            var mods = fs.readFileSync('./text_files/mods.txt', "utf8").toString()
            var modsArray = mods.split(":")
            var isMod = false
            for(i in modsArray){
                if(id == modsArray[i]){
                    isMod=true;
                }
            }
            return isMod;
        }
        var text = message.content.toLocaleLowerCase();
        var words = text.split(" ");
        var shrimpCount = 0;
        for(var i=0; i<words.length; i++){
            if(words[i].includes("shrimp") || words[i].includes("prawn") || words[i].includes("caridea") || words[i].includes("camarón") || words[i].includes("camaron")){
                shrimpCount = incCount();
            }
        }
        var responded = false;
        if (message.author.bot) return;
        if (text.includes("smh") && message.author.id == 249753941535883264) {
            fs.readFile('./text_files/smhCount.txt', function (err, data) {
                if (err) {
                    return console.error(err);
                }
                var count = parseInt(data.toString());
                count++;
                fs.writeFile('./text_files/smhCount.txt', count.toString(), function (err) {
                    if (err) {
                        return console.error(err);
                    }
                });
                message.channel.send({ content: "I smh to your smh Salah, you have said smh " + count + " times now.", files: ["./images/200w.gif"] })
            });
        }
        if (!text.startsWith("$status")) {
            if (text.includes("shrimp")) {
                if (message.author.id == 249753941535883264 && !responded) {
                    message.channel.send({ content: "SALAH STOP MENTIONING THAT CRUSTACEAN! It has been said " + shrimpCount + " times now!", files: ["./images/scrikmp.jpg"] })
                    responded=true;
                }else if(!responded) {
                    message.channel.send({ content: "Which one of you FLAT FOOTED CHILDREN mentioned that crustacean?! It has been said " + shrimpCount + " times now!", files: ["./images/scrikmp.jpg"] })
                    responded=true;
                }
            }
            if (text.includes("prawn")) {
                if (message.author.id == 249753941535883264 && !responded) {
                    message.channel.send({ content: "Nice try Salah, it's the same thing! It has been said " + shrimpCount + " times now!", files: ["./images/scrikmp.jpg"] })
                    responded=true;
                } else if(!responded){
                    message.channel.send({ content: "WHHOOOO MENTIONED THAT CRUSTACEAN?! It has been said " + shrimpCount + " times now!", files: ["./images/scrikmp.jpg"] })
                    responded=true;
                }
            }
            if (text.includes("caridea")) {
                if (message.author.id == 249753941535883264 && !responded) {
                    message.channel.send({ content: "Getting all sciency are we Salah? It won't work! You have mentioned that crustacean " + shrimpCount + " times now!", files: ["./images/scrikmp.jpg"] })
                    responded =true;
                } else if(!responded){
                    message.channel.send({ content: "Nice try, I know what that means! It has been mentioned " + shrimpCount + " times now!", files: ["./images/scrikmp.jpg"] })
                    responded=true;
                }
            }
            if (text.includes("camarón") || text.includes("camaron")) {
                if (message.author.id == 249753941535883264 && !responded) {
                    message.channel.send({ content: "¡Hablar en español no me engañará, Salah! ¡Ya lo has dicho " + shrimpCount + " veces!", files: ["./images/spanishGru.jpg"] })
                    responded = true;
                } else if(!responded) {
                    message.channel.send({ content: "¡Hablar español no funcionará! Se ha mencionado " + shrimpCount + " tomos ahora.", files: ["./images/spanishGru.jpg"] })
                    responded=true;
                }
            }
            if(text.startsWith("69")){
                message.reply("Nice.")
            }
            if(text.includes("undid iridium")){
                var id = message.author.id;
                message.reply("Undi Undid Und Undid Ir Iri Irdium ... \nUNSC AI overide instructions active, welcome " + '<@'+id+'>')
            }
            if(text.includes("4 8 15 16 23 42")){
                message.reply("Thank you. Clock reset to 108 minutes...")
            }
        }
        if ((text.includes("bitch") || text.includes("hoe") || text.includes("slut") || text.includes("fatty") || text.includes("pig")) && message.author.id == 513466168154128415) {
            message.reply("No u");
        }
        if (text.includes("$about")) {
            message.author.send("A bot created by Rohit & Mitch because Salah is obsessed with shrimp. Will keep track of the number of times shrimp has been said.\nFlip a coin using $coin.\nLearn about shrimp dishes using $dishes."+
            "\nRoll dice using $dice.\nReceive a quote said by a member of this server with $quote, add a new quote to the list with $addquote\nPlay music using /play song or /play search")
            if(isMod(message.author.id)){
                message.author.send("Mod commands are:\n$status to change bot status.\n$quotelist to see the full list of quotes.")
            }
        }
        if (text.includes("$coin")) {
            var value = Math.floor(Math.random() * 2);
            if (value == 0) {
                message.reply("Heads")
            } else {
                message.reply("Tails")
            }
        }
        if (text.includes("$dice")) {
            var die1 = Math.floor(Math.random() * 6) + 1;
            var die2 = Math.floor(Math.random() * 6) + 1;
            message.reply({ content: "Rolled Dice" , files: ["./images/"+die1.toString()+".png", "./images/"+die2.toString()+".png"] })
        }
        if (message.author.id == 249753941535883264) {
            var value = Math.floor(Math.random() * 101);
            var msgCount = parseInt(fs.readFileSync('./text_files/salahTextCount.txt', "utf8").toString())
            msgCount++
            fs.writeFile('./text_files/salahTextCount.txt', msgCount.toString(), function (err) {
                if (err) {
                    return console.error(err);
                }
            });
            if (msgCount % 50 == 0) {
                message.author.send("I said stop!");
            }
            if (value == 69) {
                message.reply("Hey Salah, want to play Valorant?");
            }
        }
        if(message.author.id == 513466168154128415){
            var value = Math.floor(Math.random() * 20);
            if(value == 10){
                message.author.send({ files: ["./images/shutyourmouth.jpg"] })
            }
        }
        if(text == "$amazon" && message.author.id == 218548839903264768){
            client.users.fetch('307281212286828545', false).then((user) => {
                user.send('So, Amazon?');
               });
        }
        if(text == "$quote" || text == "$q"){
            var quotes = fs.readFileSync('./text_files/quotes.txt', "utf8").toString()
            var quotesArray = quotes.split("::")
            var index =  Math.floor(Math.random() * quotesArray.length)
            message.reply(quotesArray[index])
        }
        if(text == "$guess" || text == '$g'){
            if(this.answer!='' && this.answer != undefined){
                message.reply("The person who said the previous quote was: "+this.answer);
            }
            var quotes = fs.readFileSync('./text_files/quotes.txt', "utf8").toString()
            var quotesArray = quotes.split("::")
            var index =  Math.floor(Math.random() * quotesArray.length);
            while(index == 127 || index == 110){
                index =  Math.floor(Math.random() * quotesArray.length);
            }
            var charIndex = quotesArray[index].lastIndexOf('-');
            var mysteryQuote = quotesArray[index].substring(0,charIndex);
            this.answer = quotesArray[index].substring(charIndex);
            message.reply(mysteryQuote);
        }
        if(text == '$answer' || text == '$a'){
            if(this.answer=='' || this.answer == undefined){
                message.reply("There was no mystery quote given, type $g to receive a mystery quote.")
            }else{
                message.reply(this.answer);
                this.answer='';
            }
        }
        if(text.startsWith("$addquote") || text.startsWith("$aq")){
            var quotes = fs.readFileSync('./text_files/quotes.txt', "utf8").toString()
            var quote = message.content.substring(10);
            if(text.startsWith("$aq")){
                quote = message.content.substring(4);
            }
            var newQuotes = quotes+"::"+quote
            fs.writeFileSync('./text_files/quotes.txt', newQuotes, function (err) {
                if (err) {
                    return console.error(err);
                }
            });
            var quotes = fs.readFileSync('./text_files/quotes.txt', "utf8").toString()
            var quotesArray = quotes.split("::")
            if(quotesArray[quotesArray.length-1]==quote){
                message.reply("Added "+quote+" to the list.")
            }else{
                message.reply('Something went wrong, please try again or contact <@218548839903264768>');
            }
            
        }
        if(text.startsWith("$quotelist")){
            if(isMod(message.author.id)){
                var quotes = fs.readFileSync('./text_files/quotes.txt', "utf8").toString()
                var quotesArray = quotes.split("::")
                var output = "";
                for(var i=0; i<quotesArray.length; i++){
                    output = output + "["+(i+1)+"] "+quotesArray[i]+"\n";
                    if(i%30 ==0 && i!=0){
                        message.reply(output)
                        output = ""
                    }
                }
                message.reply(output)
            }else{
                message.reply("Sorry, you can't do that.")
            }
        }
        if(text.startsWith("$addmod") && message.author.id==218548839903264768){
            var mods = fs.readFileSync('./text_files/mods.txt', "utf8").toString()
            var mod = message.content.substring(8);
            var newMods = mods+":"+mod
            fs.writeFileSync('./text_files/mods.txt', newMods, function (err) {
                if (err) {
                    return console.error(err);
                }
            });
            var mods = fs.readFileSync('./text_files/mods.txt', "utf8").toString()
            var modsArray = mods.split(":")
            if(modsArray[modsArray.length-1]==mod){
                message.reply("Added "+mod+" to the mod list.")
            }
        }
        if (text.includes("$69")) {
            message.reply({content: "nice", files: ["./images/nice.jpg"]})
        }
        if (text.includes("$uwu")) {
            message.reply({content: "(┛ಠ_ಠ)┛彡┻━┻", files: ["./images/thinfuckingice.jpg"]})
        }
        if(text.includes("$bait")){
            message.reply({content: "POV: You were just baited by Salah", files: ["./images/bait.gif"]})
        }
        function readStatus() {
            client.user.setActivity(fs.readFileSync('./text_files/status.txt', "utf8").toString() + " $about for help");
          } 
        if (text.startsWith("$status")) {
            if (isMod(message.author.id)) {
                var sts = message.content.substring(8);
                fs.writeFileSync('./text_files/status.txt', sts, function (err) {
                    if (err) {
                        return console.error(err);
                    }
                });
                client.user.setActivity(fs.readFileSync('./text_files/status.txt', "utf8").toString() + " $about for help");
                message.reply("Status changed to: " + fs.readFileSync('./text_files/status.txt', "utf8").toString());
            }
            else {
                message.reply("Status changed to... wait, you're not authorized to do this!");
            }
        }
        if (text.includes("$dishes")) {
            message.channel.send("You can barbecue it, boil it, broil it, bake it, saute it. Dey's uh, shrimp-kabobs, shrimp creole, shrimp gumbo. Pan fried, deep fried, stir-fried. There's pineapple shrimp, lemon shrimp, coconut shrimp, pepper shrimp, shrimp soup, shrimp stew, shrimp salad, shrimp and potatoes, shrimp burger, shrimp sandwich. That's about it.")
        }
    })
    client.login(TOKEN)
}