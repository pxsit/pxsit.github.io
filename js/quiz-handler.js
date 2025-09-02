// Generic quiz handler
(function() {
    let currentQuestions = [];
    let i = 0;
    let score = 0;
    let answered = false;
    let currentTopic = '';

    function getStage() { return document.getElementById('quiz-stage'); }

    function render() {
        const stage = getStage();
        if (!stage) {
            setTimeout(render, 50);
            return;
        }

        if (i >= currentQuestions.length) {
            stage.innerHTML = `
                <div class="quiz-card animate-fadeInUp">
                    <h3 class="h3">สรุปผล: ${currentTopic.toUpperCase()}</h3>
                    <p class="muted">คุณทำได้ ${score}/${currentQuestions.length} ข้อ</p>
                    <div style="margin-top:1rem; display:flex; justify-content:flex-end;">
                        <button class="btn ghost" onclick="backToMenu()">กลับไปที่เมนู</button>
                    </div>
                </div>`;
            return;
        }

        const q = currentQuestions[i];
        const bg = document.querySelector('.quiz-bg');
        if (bg) { bg.className = 'quiz-bg ' + (q.bg || ''); }

        stage.innerHTML = `
            <div class="quiz-card animate-fadeInUp">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span class="pill">${currentTopic.toUpperCase()}</span>
                    <span class="muted">ข้อที่ ${i + 1} / ${currentQuestions.length}</span>
                </div>
                <h3 style="margin:8px 0 0 0;">${q.q}</h3>
                <div class="quiz-choices" id="choices"></div>
                <div class="quiz-feedback" id="fb"></div>
                <div style="margin-top:8px; display:flex; justify-content:flex-end; gap:8px;">
                    <button class="btn ghost" onclick="nextQuizPage()">Next</button>
                </div>
            </div>`;

        const choices = document.getElementById('choices');
        answered = false;
        q.choices.forEach((c, idx) => {
            const div = document.createElement('div');
            div.className = 'quiz-choice';
            div.textContent = c;
            div.onclick = () => select(idx);
            choices.appendChild(div);
        });
    }

    function select(idx) {
        if (answered) return;
        const q = currentQuestions[i];
        const fb = document.getElementById('fb');
        answered = true;
        if (idx === q.ans) {
            fb.textContent = 'ถูกต้อง! ' + q.why;
            fb.style.color = '#34d399';
            score++;
        } else {
            fb.textContent = 'ผิด: ' + q.why;
            fb.style.color = '#f87171';
        }
    }

    window.startTopicQuiz = function(topic, questions) {
        currentTopic = topic;
        currentQuestions = questions;
        i = 0;
        score = 0;
        if (window.show) {
            window.show('final-quiz');
            setTimeout(render, 50);
        }
    };

    window.nextQuizPage = function() {
        if (!answered) return;
        i++;
        render();
    };
})();
