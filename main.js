const Alexa = require('ask-sdk-core');
const { search } = require('./api');

const resp = "what else would you like to know?";

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "LaunchRequest";
  },
  handle(handlerInput) {
    const speechText = 'Welcome to the Visual Studio Marketplace Skill. What would you like to do. For more info, say help.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('VS Marketplace Skill', speechText)
      .reprompt(speechText)
      .getResponse();
  }
}

const ExtensionIntentHandler = {
  canHandle(handlerInput) {
    console.log(`INTENT: ${JSON.stringify(handlerInput.requestEnvelope)}`)

    return handlerInput.requestEnvelope.request.type === "IntentRequest"
      && handlerInput.requestEnvelope.request.intent.name === "ExtensionIntent";
  },
  handle(handlerInput) {
    let extName = handlerInput.requestEnvelope.request.intent.slots.ExtensionName.value;

    console.log(extName);

    return search(extName).then(extData => {
      console.log(`DATA: ${JSON.stringify(extData)}`);

      let output = `I found the extension ${extData.name}. `;
      output += `It was written by ${extData.author}. `;
      output += `It has ${extData.stats.install + extData.stats.updateCount} downloads and an average rating of ${extData.stats.avgRating} stars. ${resp}`;

      return handlerInput.responseBuilder
        .speak(output)
        .withSimpleCard('VS Marketplace Skill', output)
        .reprompt(resp)
        .getResponse();
    })
  }
}

const InstallsIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest"
      && handlerInput.requestEnvelope.request.intent.name === "InstallsIntent";
  },
  handle(handlerInput) {
    let extName = handlerInput.requestEnvelope.request.intent.slots.ExtensionName.value;

    return search(extName).then(extData => {
      let output = `The Extension ${extData.name} has ${extData.stats.install + extData.stats.updateCount} downloads. ${resp}`;

      return handlerInput.responseBuilder
        .speak(output)
        .withSimpleCard('VS Marketplace Skill', output)
        .reprompt(resp)
        .getResponse();
    })
  }
}

const AuthorIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest"
      && handlerInput.requestEnvelope.request.intent.name === "AuthorIntent";
  },
  handle(handlerInput) {
    let extName = handlerInput.requestEnvelope.request.intent.slots.ExtensionName.value;

    return search(extName).then(extData => {
      let output = `The Extension ${extData.name} was written by ${extData.author}. ${resp}`;

      return handlerInput.responseBuilder
        .speak(output)
        .withSimpleCard('VS Marketplace Skill', output)
        .reprompt(resp)
        .getResponse();
    })
  }
}

const RatingIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest"
      && handlerInput.requestEnvelope.request.intent.name === "RatingIntent";
  },
  handle(handlerInput) {
    let extName = handlerInput.requestEnvelope.request.intent.slots.ExtensionName.value;

    return search(extName).then(extData => {
      let output = `The Extension ${extData.name} has an average rating of ${extData.stats.avgRating} stars based on ${extData.stats.ratingCount} reviews. ${resp}`;

      return handlerInput.responseBuilder
        .speak(output)
        .withSimpleCard('VS Marketplace Skill', output)
        .reprompt(resp)
        .getResponse();
    })
  }
}

const ReleaseDateIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest"
      && handlerInput.requestEnvelope.request.intent.name === "ReleaseDateIntent";
  },
  handle(handlerInput) {
    let extName = handlerInput.requestEnvelope.request.intent.slots.ExtensionName.value;

    return search(extName).then(extData => {
      let output = `The Extension ${extData.name} was initially released on ${extData.releaseDate}. ${resp}`;

      return handlerInput.responseBuilder
        .speak(output)
        .withSimpleCard('VS Marketplace Skill', output)
        .reprompt(resp)
        .getResponse();
    })
  }
}

const LastUpdatedIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest"
      && handlerInput.requestEnvelope.request.intent.name === "LastUpdatedIntent";
  },
  handle(handlerInput) {
    let extName = handlerInput.requestEnvelope.request.intent.slots.ExtensionName.value;

    return search(extName).then(extData => {
      let output = `The Extension ${extData.name} was last updated on ${extData.lastUpdated}. ${resp}`;

      return handlerInput.responseBuilder
        .speak(output)
        .withSimpleCard('VS Marketplace Skill', output)
        .reprompt(resp)
        .getResponse();
    })
  }
}

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest"
      && handlerInput.requestEnvelope.request.intent.name === "AMAZON.HelpIntent";
  },
  handle(handlerInput) {
    const output = `This skill allows you to learn about extensions from the Visual Studio Marketplace.
      You can ask for things such as who wrote an extension, when it was published or updated last,
      how many downloads it has, and what it's rating is. What would you like to do?`;

    return handlerInput.responseBuilder
      .speak(output)
      .withSimpleCard('VS Marketplace Skill', output)
      .reprompt(output)
      .getResponse();
  }
}

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Thanks for using the Visual Studio Marketplace Skill!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('VS Marketplace Skill', speechText)
      .getResponse();
  }
};


const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error: ${error.message}`)

    return handlerInput.responseBuilder
      .speak("Something went wrong. Try again or say help for more info")
      .withSimpleCard('VS Marketplace Skill', "Something went wrong. Try again or say help for more info")
      .reprompt("Something went wrong. Try again or say help for more info")
      .getResponse();
  }
}

let skill;

exports.handler = async function (event, context) {
  if (!skill) {
    skill = Alexa.SkillBuilders.custom()
      .addRequestHandlers(
        LaunchRequestHandler,
        ExtensionIntentHandler,
        InstallsIntentHandler,
        AuthorIntentHandler,
        RatingIntentHandler,
        ReleaseDateIntentHandler,
        LastUpdatedIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler
      )
      .addErrorHandlers(ErrorHandler)
      .create();
  }

  const response = await skill.invoke(event, context);
  console.log(response);

  return response;
}
