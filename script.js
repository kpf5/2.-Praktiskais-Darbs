let questions = [];
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const feedbackElement = document.getElementById("feedback");
const scoreContainer = document.getElementById("score-container");
const restartButton = document.getElementById("restart-button");
let currentQuestionIndex = 0;
let score = 0;

async function fetchQuestions() {
	try {
		const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
		if (!response.ok) {
			throw new Error("Failed to fetch questions");
		}
		const data = await response.json();
		questions = data.results;
		if (questions.length > 0) {
			displayQuestion();
		} else {
			questionElement.innerHTML = `<p class="error">No questions available. Please try again later.</p>`;
		}
	} catch (error) {
		console.error(error);
		questionElement.innerHTML = `<p class="error">${error.message}</p>`;
	}
}

fetchQuestions();

function displayQuestion() {
	const currentQuestion = questions[currentQuestionIndex];
	questionElement.innerHTML = decodeHTML(currentQuestion.question);
	optionsElement.innerHTML = "";

	const answers = [currentQuestion.correct_answer, ...currentQuestion.incorrect_answers].sort(() => Math.random() - 0.5);
	answers.forEach(answer => {
		const optionDiv = document.createElement("div");
		const input = document.createElement("input");
		const label = document.createElement("label");

		input.type = "radio";
		input.name = "option";
		input.value = answer;
		label.textContent = decodeHTML(answer);

		optionDiv.appendChild(input);
		optionDiv.appendChild(label);
		optionsElement.appendChild(optionDiv);
	});
}

function decodeHTML(html) {
	const txt = document.createElement("textarea");
	txt.innerHTML = html;
	return txt.value;
}

function checkAnswer() {
	const selectedOption = document.querySelector('input[name="option"]:checked');
	if (selectedOption) {
		const isCorrect = selectedOption.value === questions[currentQuestionIndex].correct_answer;
		feedbackElement.textContent = isCorrect ? "Correct!" : `Wrong! The correct answer was: ${decodeHTML(questions[currentQuestionIndex].correct_answer)}`;
		if (isCorrect) {
			score++;
		}
	} else {
		feedbackElement.textContent = "Please select an option!";
		return;
	}

	document.getElementById("submit-button").disabled = true;
	setTimeout(() => {
		feedbackElement.textContent = "";
		document.getElementById("submit-button").disabled = false;
		if (currentQuestionIndex < questions.length - 1) {
			currentQuestionIndex++;
			displayQuestion();
		} else {
			displayScore();
		}
	}, 2000);
}

function displayScore() {
	questionElement.remove();
	optionsElement.remove();
	document.getElementById("submit-button").remove();

	const scoreMessage = `<p>You scored ${score} out of ${questions.length}.</p>`;
	const answersList = questions.map((q, i) => `<p>${i + 1}. ${decodeHTML(q.correct_answer)}</p>`).join("");
	scoreContainer.innerHTML = `${scoreMessage}<div class="answers">${answersList}</div>`;
	restartButton.style.display = "block";
}

function restartQuiz() {
	currentQuestionIndex = 0;
	score = 0;
	questionElement.innerHTML = "";
	optionsElement.innerHTML = "";
	scoreContainer.innerHTML = "";
	restartButton.style.display = "none";
	fetchQuestions();
}
