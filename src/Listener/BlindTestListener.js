"use strict";

const ytdl = require('ytdl-core');

const Listener = require("../Listener");
const CommandService = require('../Utils/CommandService');
const BlindTest = require('../Model/BlindTest');

class BlindTestListener extends Listener {
    constructor() {
        super();

        this.commandService = new CommandService();
        this.textChannel = null;
        this.currentBlindTest = null;
    }

    onNotify(msg) {
        var commandArray = this.commandService.parseCommand(msg);
        if(commandArray !== null && (commandArray[0] == "bt" || commandArray[0] == "b")) {
            if(commandArray.length > 2) {
                var command = commandArray[1];
                var parameter = commandArray[2];
                switch (command) {
                    case "p":
                    case "propose":
                        msg.delete()
                        .then(msg => {
                            var voiceChannel = msg.member.voiceChannel;
                            if(!voiceChannel) {
                                this.renderAndReply(msg, "blind_test/join_channel.txt");
                            } else if(this.currentBlindTest != null) {
                                this.renderAndReply(msg, "blind_test/bt_occuring.txt");
                            } else {
                                this.propose(parameter, voiceChannel, msg.channel);
                            }
                        });
                        break;
                    case "g":
                    case "guess":
                        msg.delete()
                        .then(msg => {
                            if(this.currentBlindTest == null) {
                                this.renderAndReply(msg, "blind_test/no_bt.txt");
                            } else {
                                var responseArray = commandArray.slice(2);
                                var response = responseArray.join(" ");
                                this.guess(msg.author, response);
                            }
                        })
                        break;
                    default:
                        this.renderAndReply(msg, "blind_test/help.txt", {
                            specialCharacter: this.commandService.specialCharacter
                        });
                        break;
                }
            } else if(commandArray.length > 1) {
                var command = commandArray[1];
                switch (command) {
                    case "r":
                    case "result":
                        var voiceChannel = msg.member.voiceChannel;
                        if(this.currentBlindTest == null) {
                            this.renderAndReply(msg, "blind_test/no_bt.txt");
                        } else if(!voiceChannel) {
                            this.renderAndReply(msg, "blind_test/join_channel.txt");
                        } else {
                            this.result(msg.member.voiceChannel);
                        }
                        break;
                    default:
                        this.renderAndReply(msg, "blind_test/help.txt", {
                            specialCharacter: this.commandService.specialCharacter
                        });
                        break;
                }
            } else {
                this.renderAndReply(msg, "blind_test/help.txt", {
                    specialCharacter: this.commandService.specialCharacter
                });
            }
        }
    }

    propose(videoId, voiceChannel, textChannel) {
        const url = "https://www.youtube.com/watch?v=" + videoId;
        // We fetch the video info to get the name, then we can play the video
        // (provided nothing has gone wrong)
        ytdl.getInfo(url).then((value) => {
            let info = value.player_response.videoDetails
            console.log("Joining channel")
            voiceChannel.join()
            .then(connection => {
                console.log("Channel joined")
                this.textChannel = textChannel;
                this.currentBlindTest = new BlindTest(info.title.toLowerCase(), videoId);
                // Play the video
                const stream = ytdl(url, {filter: 'audioonly'});
                console.log("Playing video id " + videoId)
                var dispatcher = connection.playStream(stream);
                dispatcher.on('end', () => {
                    // If the blind test wasn't already finished, we finish it
                    if(this.currentBlindTest !== null) {
                        this.result(voiceChannel);
                    }
                    voiceChannel.leave();
                });
            })
            .catch(err => {
                console.log(err)
            });
        }).catch((err) => {
            console.log(err);
            this.renderAndSend(textChannel, "blind_text/error.txt");
        })


    }

    result(voiceChannel) {
        var winner = null;
        try {
            var winner = this.currentBlindTest.computeWinner();
        } catch (error) {
            if(error !== "no_response") {
                console.log(error);
            }
        }
        this.renderAndSend(this.textChannel, "blind_test/result.txt", {
            winner: winner,
            videoName: this.currentBlindTest.videoName,
            videoId: this.currentBlindTest.videoId
        });

        this.textChannel = null;
        this.currentBlindTest = null;
        if(voiceChannel.connection) {
            voiceChannel.connection.disconnect();
        }
    }

    guess(author, response) {
        console.log(author.username + ' tried "' + response.toLowerCase() + '"')
        this.currentBlindTest.addResponse(author.id, author.username, response.toLowerCase());
    }
}

module.exports = BlindTestListener;