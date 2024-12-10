const app = document.getElementById("app");

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Startskärmen
function showStartScreen() {
    app.innerHTML = `
        <h1>Trivia Quiz</h1>
        <form id="quizForm"> 
            <label for="numQuestions">Number of questions:</label>
            <input id="numQuestions" name="numQuestions" type="number" value="5" min="1" max="50" required> 
           
            <br><br>

            <label for="category">Select category:</label>
            <select id="category" name="category" required>
                <option value="12">Music</option>
                <option value="18">Computers</option>
                <option value="27">Animals</option>
            </select>

            <br><br>

            <label for="difficulty">Difficulty level:</label>
            <select id="difficulty" name="difficulty" required>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
            </select>

            <br><br>

            <button type="submit">Start Quiz</button>
        </form>
    `; 
    // rubrik
    // Antal frågpr (max 50st)
    // 3 kategorier - musik (12), datorer (18), djur (27) 
    // svårighetsgrad - lätt, medel, svår
    // Startknapp

    // Lägg till eventlistener på formuläret
    const quizForm = document.getElementById("quizForm");
    quizForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Förhindra att sidan laddas om
        const formData = new FormData(quizForm);
        startQuiz(
            formData.get("numQuestions"),
            formData.get("category"),
            formData.get("difficulty")
        );
    });
}

// Startar quiz
function startQuiz(numQuestions, category, difficulty) {
    const apiUrl = `https://opentdb.com/api.php?amount=${numQuestions}&category=${category}&difficulty=${difficulty}&type=multiple`;

    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            questions = data.results;
            currentQuestionIndex = 0;
            score = 0;
            showQuestion();
        })
        .catch(() => {
            app.innerHTML = `<p>Kunde inte ladda frågorna. Kontrollera din anslutning och försök igen.</p>`;
        });
}

// Visa fråga
function showQuestion() {
    const question = questions[currentQuestionIndex];
    const answers = [...question.incorrect_answers];
    answers.push(question.correct_answer);
    answers.sort(() => Math.random() - 0.5);

    app.innerHTML = `
        <h2>${question.question}</h2>
        ${answers
            .map(
                (answer) =>
                    `<button onclick="checkAnswer('${answer}')">${answer}</button>`
            )
            .join("")}
    `;
}

// Kontrollerar svaret
function checkAnswer(answer) {
    if (answer === questions[currentQuestionIndex].correct_answer) {
        score++;
        alert("Rätt!");
    } else {
        alert("Fel! Rätt svar är: " + questions[currentQuestionIndex].correct_answer);
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

// Visa resultat
function showResults() {
    app.innerHTML = `
        <h1>Resultat</h1>
        <p>Du fick ${score} av ${questions.length} rätt!</p>
        <button onclick="showStartScreen()">Spela igen</button>
    `;
}

// Starta spelet
showStartScreen();
