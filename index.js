//run using command in terminal: node index.js
const Discord = require("discord.js")
const TOKEN = "secret"
const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES"
    ]
})
//var count
var fs = require("fs");

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`)
    client.user.setActivity("Made because of lah700");
})

client.on("messageCreate", (message) => {
    var text = message.content.toLocaleLowerCase();
    if (message.author.bot) return;
    if(text.includes("smh") && message.author.id==249753941535883264){
        fs.readFile('smhCount.txt', function (err, data) {
            if (err) {
               return console.error(err);
            }
             var count = parseInt(data.toString());
             count++;
             fs.writeFile('smhCount.txt', count.toString(), function(err) {
                if (err) {
                   return console.error(err);
                }
            });
         

            message.channel.send({content: "I smh to your smh Salah, you have said smh "+count+" times now.", files: [ "./200w.gif"]})
        
    });

    }
    if(text.includes("shrimp")){
        //count++;
        fs.readFile('shrimpCount.txt', function (err, data) {
            if (err) {
               return console.error(err);
            }
             var count = parseInt(data.toString());
             count++;
             fs.writeFile('shrimpCount.txt', count.toString(), function(err) {
                if (err) {
                   return console.error(err);
                }
            });
         
        if(message.author.id==249753941535883264){
            message.channel.send({content: "SALAH STOP MENTIONING THAT CRUSTACEAN! It has been said "+count+" times now!", files: [ "./scrikmp.jpg"]})
        }else{ 
            message.channel.send({content: "Which one of you FLAT FOOTED CHILDREN mentioned that crustacean?! It has been said "+count+" times now!", files: [ "./scrikmp.jpg"]})
        }
    });
    }
    if(text.includes("prawn")){
        //count++;
        fs.readFile('shrimpCount.txt', function (err, data) {
            if (err) {
               return console.error(err);
            }
             var count = parseInt(data.toString());
             count++;
             fs.writeFile('shrimpCount.txt', count.toString(), function(err) {
                if (err) {
                   return console.error(err);
                }
            });
        if(message.author.id==249753941535883264){
            message.channel.send({content: "Nice try Salah, it's the same thing! It has been said "+count+" times now!", files: [ "./scrikmp.jpg"]})
        }else{ 
            message.channel.send({content: "WHHOOOO MENTIONED THAT CRUSTACEAN?! It has been said "+count+" times now!", files: [ "./scrikmp.jpg"]})
        }
    });
    }
    if(text.includes("caridea")){
        //count++;
        fs.readFile('shrimpCount.txt', function (err, data) {
            if (err) {
               return console.error(err);
            }
             var count = parseInt(data.toString());
             count++;
             fs.writeFile('shrimpCount.txt', count.toString(), function(err) {
                if (err) {
                   return console.error(err);
                }
            });
        if(message.author.id==249753941535883264){
            message.channel.send({content: "Getting all sciency are we Salah? It won't work! You have mentioned that crustacean"+count+" times now!", files: [ "./scrikmp.jpg"]})
        }else{ 
            message.channel.send({content: "Nice try, I know what that means! It has been mentioned "+count+" times now!", files: [ "./scrikmp.jpg"]})
        }
    });
    }
    if(text.includes("$about")){
        message.reply("A bot created by Rohit & Mitch because Salah is obsessed with shrimp. Will keep track of the number of times shrimp has been said")
    }
    if(text.includes("$coin")){
        var value = Math.floor(Math.random() * 2);
        if(value==0){
            message.channel.send("Heads")
        }else{
            message.channel.send("Tails")
        }
    }
    if(message.author.id==249753941535883264){
        var value = Math.floor(Math.random() * 101);
        if(value==69){
            message.reply("Hey Salah, want to play Valorant?")
        }
    }
    if(text.includes("$dishes")){
        message.channel.send("You can barbecue it, boil it, broil it, bake it, saute it. Dey's uh, shrimp-kabobs, shrimp creole, shrimp gumbo. Pan fried, deep fried, stir-fried. There's pineapple shrimp, lemon shrimp, coconut shrimp, pepper shrimp, shrimp soup, shrimp stew, shrimp salad, shrimp and potatoes, shrimp burger, shrimp sandwich. That's about it.")
    }
})
client.login(TOKEN)