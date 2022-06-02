
const {Client,Discord,MessageEmbed,DiscordAPIError }= require("discord.js"); //client is way to communicate with discord server
const client= new Client({intents:32509});//32509  gives access to all possibilities
const Config=require("./config.json") //config file has the token
const axios = require('axios').default;
require("dotenv").config();

const {weatherKey,newsKey,quotesKey}=process.env;

//on ready event 
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

client.on("messageCreate",async msg=>{

    //INITIAL PING
    if(msg.content==="ping"){
        msg.reply("Pong"); //sends msg to particular user by tagging him
       //msg.channel.send("pong") //sends msg to entire channel
       }

    //CAT
    if(msg.content==="!cat"){
        axios.get("https://api.thecatapi.com/v1/images/search")
        .then((res)=>{
            console.log("Cat Image Link: ",res.data[0].url);
            msg.channel.send(res.data[0].url)
        })
        .catch((err)=>{
            console.log("ERROR: ",err)
        })
    }   

    //DOG
    if(msg.content==="!dog"){
        axios.get("https://dog.ceo/api/breeds/image/random")
        .then((res)=>{
            let num=Math.floor(Math.random()*10)
            console.log("Dog Image Link: ",res.data.message)
            msg.channel.send(res.data.message)
        })
        .catch((err)=>{
            console.log("ERROR: ",err)
        })
    }

    //WEATHER
    if(msg.content.startsWith("!weather")){
        let query=msg.content.split(' ');
        if(query.length>1){
            let cityname=query[1];
            let req=await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${weatherKey}`)
            console.log(req.data)
            let data=req.data;

            var temp = Math.round((parseInt(
                data.main.temp_min) - 273.15), 2)

            // Kelvin to celsius and then round
            // off and conversion to atm
            var pressure = Math.round(parseInt(
                    data.main.pressure) - 1013.15)

            var rise = new Date(parseInt(
                    data.sys.sunrise) * 1000);

            var set = new Date(parseInt(
                    data.sys.sunset) * 1000);
            // Unix time to IST time conversion
            
            let description='**** '  + ' ****\nTemperature: '
            + String(temp) + '°C\nHumidity: ' +
            data.main.humidity + ' %\nWeather: '
            + data.weather[0].description +
            '\nPressure: ' + String(pressure)
            + ' atm\nSunrise: ' +
            rise.toLocaleTimeString() +
            ' \nSunset: ' +
            set.toLocaleTimeString() +
            '\nCountry: ' + data.sys.country;

            const cardmsg=new MessageEmbed() //embed different components to one card
                .setColor("GREEN")
                .setTitle(data.name)
                .setDescription(description)
                .setTimestamp()

            msg.reply({
                embeds:[cardmsg] //reply the requester with news card
            })
        }
        
    }

    //QUOTES
    if(msg.content.startsWith("!quote")){
            let req= await axios.get(`https://zenquotes.io/api/quotes/${quotesKey}`)
            const random =(min,max)=>Math.floor(Math.random()*(max-min))+min;
            let id=random(0,req.data.length);
            console.log(req.data[id]);

            let description='**** '  + ' ****\n' + req.data[id].q + ' ****\n\n Author: ' + req.data[id].a;
            const cardmsg=new MessageEmbed() //embed different components to one card
                .setColor("RED")
                .setTitle("QUOTE")
                .setDescription(description)
                .setTimestamp()

            msg.reply({
                embeds:[cardmsg] //reply the requester with news card
            })
       
    }
   
})

//NEWS
const random =(min,max)=>Math.floor(Math.random()*(max-min))+min;
client.on("messageCreate",async msg=>{
if(msg.content.startsWith("!news")){
    let query=msg.content.split(' ');
    if(query.length>1){
    let interest=query[1];
    let req=await axios.get(`https://newsapi.org/v2/everything?q=${interest}&apiKey=${newsKey}`)
    let data=req.data.articles;
    let identity=random(0,data.length);
    let fileDisplay=data[identity]
    const cardmsg=new MessageEmbed() //embed different components to one card
        .setColor("BLURPLE")
        .setTitle(fileDisplay.title)
        .setURL(fileDisplay.url)
        .setDescription(fileDisplay.description)
        .setThumbnail(fileDisplay.urlToImage)
        .setTimestamp()

    msg.reply({
        embeds:[cardmsg] //reply the requester with news card
    })
    }
}
})

//on login event
client.login(Config.token)//makes the bot online



// //assigning roles to user on a server ...eg a moderator role
// client.on("message",msg=>{
//     if(msg.content==="mod-me"){
//         msg.member.roles.add("moderator");
//     }
// })
