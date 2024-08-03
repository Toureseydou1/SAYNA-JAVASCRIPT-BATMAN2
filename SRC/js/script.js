// Assurez-vous que le DOM est complètement chargé avant d'exécuter le script
document.addEventListener('DOMContentLoaded', () => {
    // Variables globales pour stocker les données du quiz et le score
    let currentQuestionIndex = 0;
    let score = 0;
    const questionsContainer = document.getElementById('questions-container');
    const resultPopup = document.getElementById('result-popup');
    const resultText = document.getElementById('result-text');
    const closeButton = document.getElementById('close-button');
    
    // Fonction pour récupérer les questions depuis l'API
    async function fetchQuestions() {
        try {
            const response = await fetch('https://api.example.com/quiz');
            const data = await response.json();
            return data.questions; // Assurez-vous que votre API renvoie les questions dans ce format
        } catch (error) {
            console.error('Erreur lors de la récupération des questions:', error);
        }
    }

    // Fonction pour afficher une question et ses choix
    function displayQuestion(question) {
        questionsContainer.innerHTML = `
            <div class="question">${question.text}</div>
            ${question.choices.map((choice, index) => `
                <div class="choice">
                    <input type="radio" name="choice" id="choice-${index}" value="${choice.isCorrect}">
                    <label for="choice-${index}">${choice.text}</label>
                </div>
            `).join('')}
            <button id="submit-answer">Soumettre</button>
        `;
        
        document.getElementById('submit-answer').addEventListener('click', checkAnswer);
        fadeInEffect(questionsContainer);
    }

    // Fonction pour vérifier la réponse de l'utilisateur
    function checkAnswer() {
        const selectedChoice = document.querySelector('input[name="choice"]:checked');
        if (selectedChoice) {
            if (selectedChoice.value === 'true') {
                score++;
            }
            currentQuestionIndex++;
            loadNextQuestion();
        } else {
            alert('Veuillez sélectionner une réponse.');
        }
    }

    // Fonction pour charger la question suivante ou afficher le score final
    function loadNextQuestion() {
        if (currentQuestionIndex < questions.length) {
            displayQuestion(questions[currentQuestionIndex]);
        } else {
            showResult();
        }
    }

    // Fonction pour afficher la popup avec le résultat
    function showResult() {
        resultText.textContent = `Votre score final est ${score} sur ${questions.length}.`;
        resultPopup.style.display = 'block';
    }

    // Fonction pour fermer la popup
    closeButton.addEventListener('click', () => {
        resultPopup.style.display = 'none';
    });

    // Fonction pour appliquer un effet fade-in
    function fadeInEffect(element) {
        element.style.opacity = 0;
        let opacity = 0;
        const interval = setInterval(() => {
            opacity += 0.1;
            element.style.opacity = opacity;
            if (opacity >= 1) clearInterval(interval);
        }, 50);
    }

    // Fonction pour ajouter l'animation de la chauve-souris
    function initBatAnimation() {
        const canvas = document.getElementById('bat-canvas');
        const context = canvas.getContext('2d');
        const batImage = new Image();
        batImage.src = 'assets/Images/bat.png'; // Remplacez par le chemin de votre image de chauve-souris

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        function drawBat(x, y) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(batImage, x - batImage.width / 2, y - batImage.height / 2);
        }

        document.addEventListener('mousemove', (event) => {
            drawBat(event.clientX, event.clientY);
        });

        batImage.onload = () => {
            drawBat(window.innerWidth / 2, window.innerHeight / 2);
        };
    }

    // Initialiser le quiz et l'animation de la chauve-souris
    (async function init() {
        const questions = await fetchQuestions();
        if (questions && questions.length > 0) {
            displayQuestion(questions[currentQuestionIndex]);
        }
        initBatAnimation();
    })();
});

