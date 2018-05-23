module.exports = {


  friendlyName: 'Create',


  description: 'Create cron job.',


  inputs: {

    serverId: {
      required: true,
      type: 'number',
      custom: async function(valueToCheck) {
        let foundServer = await SdtdServer.findOne(valueToCheck);
        return foundServer 
      }
    },

    command: {
      required: true,
      type: 'string'
    },

    temporalValue: {
      required: true,
      type: 'string',
      custom: function(valueToCheck) {
        const cronParser = require('cron-parser');

        const interval = cronParser.parseExpression(valueToCheck);

        let prevDate = interval.prev().toDate();
        let nextDate = interval.next().toDate();

        return (prevDate.valueOf() + 300000) < nextDate.valueOf()

      }
    }

  },


  exits: {

    success: {
      responseType: '',
      statusCode: 200
    },

    badCommand: {
      statusCode: 400
    }

  },


  fn: async function (inputs, exits) {

    let server = await SdtdServer.findOne(inputs.serverId);
    let allowedCommands = await sails.helpers.sdtd.getAllowedCommands(server);

    let splitCommand = inputs.command.split(' ');

    let commandIdx = allowedCommands.indexOf(splitCommand[0]);

    if (commandIdx === -1) {
      return exits.badCommand(new Error('Invalid command'));
    }

    let createdJob = await CronJob.create({
      command: inputs.command,
      temporalValue: inputs.temporalValue,
      server: inputs.serverId
    }).fetch();

    await sails.hooks.cron.start(createdJob.id);

    sails.log.info(`Created a cron job`, createdJob);

    return exits.success(createdJob);

  }


};