const fs = require("fs");

// 累积数据并写入本地JSON
function writeJson(params) {
  // 现将json文件读出来
  fs.readFile("./menuData.json", function (err, data) {
    if (err) {
      return console.error(err);
    }
    // 将二进制的数据转换为字符串
    let person = data.toString();
    // 将字符串转换为json对象
    person = JSON.parse(person);
    // 将传来的对象push进数组对象中
    person.data.push(params);
    // 定义一下总条数，为以后的分页打基础
    person.total = person.data.length;
    console.log(person.data);
    // 因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中
    const str = JSON.stringify(person);
    fs.writeFile("./menuData.json", str, function (err) {
      if (err) {
        console.error(err);
      }
      console.log("----------新增菜样----------");
    });
  });
}

// 截取字符串
function getCaption(triggerWords, obj) {
  const index = obj.lastIndexOf(triggerWords);
  obj = obj.substring(index + triggerWords.length, obj.length);
  return obj;
}

// File: src/commands/wtet.js
module.exports = {
  name: "wtet",
  description: "What to eat today?",
  execute(message, args, bot, customMenu) {
    // console.log(args);
    // const randomPickOne = menu[Math.floor(Math.random() * menu.length)];
    const randomPickOneFromDatabase =
      bot.data[Math.floor(Math.random() * bot.data.length)];

    // args原类型是Object，此处提取字符串
    let inputs = args[0].toLowerCase();

    if (message.author.bot) {
      return;
    }

    // 吃了什么
    if (inputs.indexOf(bot.config.triggerWords.eat) !== -1) {
      const str = inputs;
      // const reg = new RegExp(bot.config.triggerWords.eat);
      // const curr = str.replace(reg, "");
      const curr = getCaption(bot.config.triggerWords.eat, str);

      if (curr !== null && curr.indexOf(bot.config.triggerWords.eat) === -1) {
        if (curr !== "" && customMenu.indexOf(curr) === -1) {
          const params = {
            id: bot.total + 1,
            name: curr
          };
          writeJson(params);
          message.reply(`了解，${curr}，记录入数据中心。`);
        } else if (customMenu.indexOf(curr) !== -1) {
          console.log(`重复注入：${curr}`);
          message.reply(
            `了解。报告，${curr}已存在于数据神经中；不再做额外新增。`
          );
        } else {
          return message.channel.send(`请告诉我您今天吃了什么。`);
        }
      }
    }
    // 想吃什么
    else if (inputs.indexOf(bot.config.triggerWords.wish) !== -1) {
      const str = inputs;
      const curr = getCaption(bot.config.triggerWords.wish, str);
      console.log(`想吃：${curr}`);
      if (customMenu.indexOf(curr) !== -1) {
        console.log(`重复注入：${curr}`);
        message.reply(
          `了解。报告，${curr}已存在于数据神经中；不再做额外新增。`
        );
      } else {
        if (
          curr !== null &&
          curr.indexOf(bot.config.triggerWords.wish) === -1
        ) {
          if (curr !== "" && customMenu.indexOf(curr) === -1) {
            const params = {
              id: bot.total + 1,
              name: curr
            };
            writeJson(params);
            message.reply(`了解，${curr}，记录入数据中心。`);
          }
        } else {
          console.log(curr);
          message.reply(`输入格式有误。`);
        }
      }
    }
    // 命令：nb
    else if (inputs.indexOf("nb") !== -1) {
      return message.channel.send("不知道你说的啥但是泡泡NB!");
    }

    // 命令：{prefix}吃什么
    if (inputs.indexOf("吃什么") !== -1) {
      message.reply(`今天试试 **${randomPickOneFromDatabase.name}** 如何？`);
      // return message.channel.send(`${randomPickOne}`);
    }
    // 服务器人数
    else if (inputs.indexOf("server") !== -1) {
      return message.channel.send(
        `Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`
      );
    }

    switch (inputs) {
      // 命令：hi
      case `hi`:
        return message.reply("Hi! 今天吃点儿嘛！");
      // 命令：hi
      case `help`:
        return message.reply(
          "你好，欢迎使用WhatToEatToday BOT Version Alpha！在这里，您可以告诉我今天您吃了什么，或是想吃什么，来记录入神经中枢中；或询问在下吃什么，来为您从神经记忆中随机挑选今日尝试的菜式！或有更多问题，请咨询管理员。"
        );
      // 命令：报菜名
      case `报菜名`:
        return message.channel.send(
          `有${customMenu}，共${customMenu.length}道菜！`
        );
      case `报菜单`:
        return message.channel.send(
          `有${customMenu}，共${customMenu.length}道菜！`
        );
      case `菜单`:
        return message.channel.send(
          `有${customMenu}，共${customMenu.length}道菜！`
        );
      case "deanoSB":
        return message.channel.send("没错没错，谢谢谢谢");

      // default:
      //   return message.channel.send("不知道你说的啥但是泡泡NB!");
    }
  }
};
