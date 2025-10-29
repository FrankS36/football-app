// Load data from JSON file
let appData = {};
let positionData = {};
let formations = {};
let gameBasics = {};
let quizzes = [];
let currentQuizIndex = 0;

// Load data on page load
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        appData = data;
        positionData = data.positions;
        formations = data.formations;
        gameBasics = data.gameBasics;
        quizzes = data.quizzes;
        // Initialize formations with first formation of each type
        showFormation('offense', 0);
        showFormation('defense', 0);
        // Initialize game basics
        loadGameBasics();
        // Initialize quiz
        loadQuiz(currentQuizIndex);
    })
    .catch(error => console.error('Error loading data:', error));

// Show different screens
function showScreen(screenName) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));

    // Show selected screen
    document.getElementById(screenName).classList.add('active');

    // Update nav buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));
    event.target.closest('.nav-btn').classList.add('active');
}

// Show position details
function showPosition(positionKey) {
    const position = positionData[positionKey];
    const detailDiv = document.getElementById('positionDetail');

    let html = `
        <div class="position-detail">
            <h3>${position.name}</h3>
            <div class="role">
                <strong>Main Role:</strong> ${position.role}
            </div>
            <div class="role">
                <strong>Key Responsibilities:</strong>
                <ul style="margin-top: 10px; margin-left: 20px;">
                    ${position.responsibilities.map(r => `<li>${r}</li>`).join('')}
                </ul>
            </div>
            <h4 style="margin-top: 20px; color: #2c3e50;">⭐ Famous Players:</h4>
            <div class="famous-players">
                ${position.famousPlayers.map(player => `
                    <div class="player-card">
                        <strong>${player}</strong>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    detailDiv.innerHTML = html;
    detailDiv.style.display = 'block';
    detailDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Show penalty details
function showPenaltyDetail(penaltyType) {
    alert(`You clicked on ${penaltyType}! In a full app, this would show an animated explanation and examples.`);
}

// Load Quiz
function loadQuiz(index) {
    if (!quizzes || quizzes.length === 0) return;

    const quiz = quizzes[index];
    const questionDiv = document.getElementById('quiz-question');
    const optionsDiv = document.getElementById('quiz-options');
    const counterDiv = document.getElementById('quiz-counter');

    if (!questionDiv || !optionsDiv) return;

    // Update counter
    if (counterDiv) {
        counterDiv.textContent = `Question ${index + 1} of ${quizzes.length}`;
    }

    // Update question
    questionDiv.textContent = quiz.question;

    // Clear and update options
    optionsDiv.innerHTML = '';
    quiz.options.forEach((option, i) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'quiz-option';
        optionDiv.textContent = option.text;
        optionDiv.onclick = () => checkAnswer(optionDiv, option.correct, quiz.explanation);
        optionsDiv.appendChild(optionDiv);
    });
}

// Quiz answer checking with auto-advance
function checkAnswer(element, isCorrect, explanation) {
    // Disable all options
    const allOptions = document.querySelectorAll('.quiz-option');
    allOptions.forEach(opt => opt.style.pointerEvents = 'none');

    const feedbackDiv = document.getElementById('quiz-feedback');

    if (isCorrect) {
        element.classList.add('correct');

        // Show success feedback
        feedbackDiv.className = 'quiz-feedback success';
        feedbackDiv.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 10px;">🎉 Correct!</div>
            <p>${explanation}</p>
            <p style="margin-top: 10px; font-style: italic;">Next question loading...</p>
        `;
        feedbackDiv.style.display = 'block';

        // Move to next question after delay
        setTimeout(() => {
            currentQuizIndex = (currentQuizIndex + 1) % quizzes.length;
            feedbackDiv.style.display = 'none';
            loadQuiz(currentQuizIndex);
        }, 3000);
    } else {
        element.classList.add('incorrect');

        // Show error feedback
        feedbackDiv.className = 'quiz-feedback error';
        feedbackDiv.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 10px;">❌ Not Quite!</div>
            <p><strong>Hint:</strong> ${explanation}</p>
            <p style="margin-top: 10px; font-style: italic;">Try again - you can do it!</p>
        `;
        feedbackDiv.style.display = 'block';

        // Re-enable options after showing feedback
        setTimeout(() => {
            element.classList.remove('incorrect');
            feedbackDiv.style.display = 'none';
            allOptions.forEach(opt => opt.style.pointerEvents = 'auto');
        }, 3000);
    }
}

// AI Feedback simulation
function getAIFeedback() {
    const noteText = document.getElementById('noteInput').value;

    if (!noteText.trim()) {
        alert('Please write something in your notes first!');
        return;
    }

    const feedbackDiv = document.getElementById('aiFeedback');
    const contentDiv = document.getElementById('feedbackContent');

    // Simulate AI response
    contentDiv.innerHTML = `
        <p><strong>Great work!</strong> I can see you're learning about quarterbacks reading the defense. That's a really important skill!</p>
        <p><strong>💭 Think about this:</strong> Why do you think it's important for a quarterback to read the defense BEFORE the snap instead of after?</p>
        <p><strong>🎯 Next Step:</strong> You might want to learn about common defensive formations like "Cover 2" or "Man Coverage" - this will help you understand what quarterbacks are looking for!</p>
        <p><strong>Keep it up!</strong> You're making awesome progress! 🌟</p>
    `;

    feedbackDiv.style.display = 'block';
    feedbackDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Take quiz function
function takeQuiz() {
    showScreen('rules');
    setTimeout(() => {
        document.querySelector('.quiz-container').scrollIntoView({ behavior: 'smooth' });
    }, 300);
}

// Add goal function
function addGoal() {
    const goalText = prompt('What would you like to learn next?');
    if (goalText) {
        const goalsList = document.querySelector('.goals-list');
        const newGoal = document.createElement('div');
        newGoal.className = 'goal-item';
        newGoal.innerHTML = `
            <input type="checkbox" class="goal-checkbox">
            <span>${goalText}</span>
        `;
        goalsList.insertBefore(newGoal, goalsList.lastElementChild);
    }
}

// Formation functions
function showFormationType(type) {
    // Update toggle buttons
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    toggleButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Show/hide formation groups
    const offenseGroup = document.getElementById('offense-formations');
    const defenseGroup = document.getElementById('defense-formations');

    if (type === 'offense') {
        offenseGroup.classList.add('active');
        defenseGroup.classList.remove('active');
    } else {
        defenseGroup.classList.add('active');
        offenseGroup.classList.remove('active');
    }
}

function showFormation(type, index) {
    if (!formations[type]) return;

    const formation = formations[type][index];
    const displayDiv = document.getElementById(`${type}-formation-display`);

    // Update formation buttons
    const buttons = document.querySelectorAll(`#${type}-formations .formation-btn`);
    buttons.forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });

    // Build the formation display HTML
    let html = `
        <div class="formation-display">
            <div class="formation-info">
                <h3>${formation.name}</h3>
                <p class="description">${formation.description}</p>
                <div class="when-to-use">
                    <strong>When to Use:</strong> ${formation.whenToUse}
                </div>
                <div class="formation-strengths">
                    ${formation.strengths.map(strength => `
                        <span class="strength-badge">${strength}</span>
                    `).join('')}
                </div>
            </div>
            <div class="formation-field">
    `;

    // Add position markers
    for (const [pos, coords] of Object.entries(formation.positions)) {
        const side = type === 'offense' ? 'offense' : 'defense';
        const leftStyle = coords.left !== undefined ? `left: ${coords.left}%;` : '';
        const rightStyle = coords.right !== undefined ? `right: ${coords.right}%;` : '';
        const topStyle = `top: ${coords.top}%;`;

        html += `<div class="position-marker ${side}" style="${leftStyle}${rightStyle}${topStyle}">${pos.replace(/2|3|4/, '')}</div>`;
    }

    html += `
            </div>
        </div>
    `;

    displayDiv.innerHTML = html;
}

// Load Game Basics
function loadGameBasics() {
    if (!gameBasics) return;

    const contentDiv = document.getElementById('game-basics-content');
    let html = '<div class="basics-grid">';

    for (const [key, section] of Object.entries(gameBasics)) {
        html += `
            <div class="basics-section">
                <h3 class="basics-title">
                    <span class="basics-icon">${section.icon}</span>
                    ${section.title}
                </h3>
                <div class="basics-facts">
        `;

        section.facts.forEach(fact => {
            html += `
                <div class="fact-card">
                    <div class="fact-header">
                        <span class="fact-label">${fact.label}</span>
                        <span class="fact-value">${fact.value}</span>
                    </div>
                    <p class="fact-explanation">${fact.explanation}</p>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    }

    html += '</div>';
    contentDiv.innerHTML = html;
}
