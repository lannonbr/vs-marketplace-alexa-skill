const Alexa = require('ask-sdk-core');
const { search } = require('./api');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "LaunchRequest";
  },
  handle(handlerInput) {
    const speechText = 'Welcome to the VS Marketplace Skill.';

    return handlerInput.responseBuilder
      .speak(speechText)
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
      output += `It has ${extData.stats.install + extData.stats.updateCount} downloads and an average rating of ${extData.stats.avgRating} stars`;

      return handlerInput.responseBuilder
        .speak(output)
        .getResponse();
    })

  }
}

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error: ${error.message}`)

    return handlerInput.responseBuilder
      .speak("I hit an error")
      .reprompt("I hit an error")
      .getResponse();
  }
}

let skill;

exports.handler = async function (event, context) {
  if (!skill) {
    skill = Alexa.SkillBuilders.custom()
      .addRequestHandlers(
        LaunchRequestHandler,
        ExtensionIntentHandler
      )
      .addErrorHandlers(ErrorHandler)
      .create();
  }

  const response = await skill.invoke(event, context);
  console.log(response);

  return response;
}
