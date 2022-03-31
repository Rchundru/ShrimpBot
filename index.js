//run using command in terminal: node index.js
const Discord = require("discord.js")
const dotenv = require("dotenv")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const { Player } = require("discord-player")
var fs = require("fs");
const TOKEN = fs.readFileSync('./text_files/token.txt', "utf8").toString()
const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_VOICE_STATES"
    ]
})
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
        client.user.setActivity(fs.readFileSync('./text_files/status.txt', "utf8").toString()+" $about for help");
    })
    client.on("interactionCreate", (interaction) => {
        async function handleCommand() {
            if (!interaction.isCommand()) return

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
            fs.writeFile('./text_files/shrimpCount.txt', count.toString(), function (err) {
                if (err) {
                    return console.error(err);
                }
            });
            return count;
        }
        var text = message.content.toLocaleLowerCase();
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
                var count = incCount();

                if (message.author.id == 249753941535883264) {
                    message.channel.send({ content: "SALAH STOP MENTIONING THAT CRUSTACEAN! It has been said " + count + " times now!", files: ["./images/scrikmp.jpg"] })
                } else {
                    message.channel.send({ content: "Which one of you FLAT FOOTED CHILDREN mentioned that crustacean?! It has been said " + count + " times now!", files: ["./images/scrikmp.jpg"] })
                }
            }
            if (text.includes("prawn")) {
                var count = incCount();
                if (message.author.id == 249753941535883264) {
                    message.channel.send({ content: "Nice try Salah, it's the same thing! It has been said " + count + " times now!", files: ["./images/scrikmp.jpg"] })
                } else {
                    message.channel.send({ content: "WHHOOOO MENTIONED THAT CRUSTACEAN?! It has been said " + count + " times now!", files: ["./images/scrikmp.jpg"] })
                }
            }
            if (text.includes("caridea")) {
                var count = incCount();
                if (message.author.id == 249753941535883264) {
                    message.channel.send({ content: "Getting all sciency are we Salah? It won't work! You have mentioned that crustacean " + count + " times now!", files: ["./images/scrikmp.jpg"] })
                } else {
                    message.channel.send({ content: "Nice try, I know what that means! It has been mentioned " + count + " times now!", files: ["./images/scrikmp.jpg"] })
                }
            }
            if (text.includes("camarón") || text.includes("camaron")) {
                var count = incCount();
                if (message.author.id == 249753941535883264) {
                    message.channel.send({ content: "¡Hablar en español no me engañará, Salah! ¡Ya lo has dicho " + count + " veces!", files: ["./images/spanishGru.jpg"] })
                } else {
                    message.channel.send({ content: "¡Hablar español no funcionará! Se ha mencionado " + count + " tomos ahora.", files: ["./images/spanishGru.jpg"] })
                }
            }
        }
        if ((text.includes("bitch") || text.includes("hoe")) && message.author.id == 513466168154128415) {
            message.reply("No u");
        }
        if (text.includes("$about")) {
            message.author.send("A bot created by Rohit & Mitch because Salah is obsessed with shrimp. Will keep track of the number of times shrimp has been said")
            message.author.send("Flip a coin using $coin")
            message.author.send("Learn about shrimp dishes using $dishes")
            message.author.send("Roll dice using $dice")
            message.author.send("Receive a quote said by a member of this server with $quote, add a new quote to the list with $addquote")
            message.author.send("Play music using /play song or /play search")
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
                message.author.send("I'm watching you!");
            }
            if (value == 69) {
                message.reply("Hey Salah, want to play Valorant?")
            }
        }
        if(text.startsWith("$quote")){
            var quotes = fs.readFileSync('./text_files/quotes.txt', "utf8").toString()
            var quotesArray = quotes.split("::")
            var index =  Math.floor(Math.random() * quotesArray.length)
            message.reply(quotesArray[index])
        }
        if(text.startsWith("$addquote")){
            var quotes = fs.readFileSync('./text_files/quotes.txt', "utf8").toString()
            var quote = message.content.substring(10);
            var newQuotes = quotes+"::"+quote
            fs.writeFileSync('./text_files/quotes.txt', newQuotes, function (err) {
                if (err) {
                    return console.error(err);
                }
            });
            message.reply("Added "+quote+" to the list.")
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
            message.reply("Added "+mod+" to the mod list.")
        }
        if (text.includes("$69")) {
            message.reply({content: "nice", files: ["./images/nice.jpg"]})
        }
        if (text.includes("$uwu")) {
            message.reply({content: "(┛ಠ_ಠ)┛彡┻━┻", files: ["./images/thinfuckingice.jpg"]})
        }
        if (text.startsWith("$status")) {
            var mods = fs.readFileSync('./text_files/mods.txt', "utf8").toString()
            var modsArray = mods.split(":")
            var isMod = false
            for(i in modsArray){
                if(message.author.id == modsArray[i]){
                    isMod=true;
                }
            }
            if (isMod) {
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