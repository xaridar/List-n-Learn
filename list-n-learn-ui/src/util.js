export const checkUser = async (username) => {
	const res = await fetch(`/user?name=${username}`);
	const json = await res.json();
	return Object.keys(json).length !== 0;
};

export const speakPhrase = async (phrase, recog = null, response = false) => {
	window.speechSynthesis.cancel();
	const utterance = new SpeechSynthesisUtterance(phrase);
	window.speechSynthesis.speak(utterance);
	await new Promise((res, rej) => {
		utterance.onend = res;
	});
	if (response)
		return new Promise((res, rej) => {
			recog.onresult = function (e) {
				if (e.results[e.results.length - 1].isFinal) {
					recog.onresult = null;
					res(e.results[e.results.length - 1][0].transcript);
				}
			};
		});
};
