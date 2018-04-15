var kafkaClientService = require('../kafka/KafkaClientService');
var TOPIC_PREFIX = "queuing.";

module.exports.sendPUT = function (req, res, next) {

	// e.g. "/users/profile/:id" -> users
	var serviceClass = req.path.substring(1).split("/")[0];
	var topic = TOPIC_PREFIX + serviceClass;

	var content = {
		method: "put",
		apiURL: req.originalUrl,
		topicRes: topic + ".response",
		params: req.body
	};
	kafkaClientService.sendMessage(topic, 0, content, function(sendErr, serviceRes){
		if(sendErr)
		{
			console.log(sendErr);
			res.status(404).send();
			return;
		}
		console.log(serviceRes);
		res.send(serviceRes);
	});

}
