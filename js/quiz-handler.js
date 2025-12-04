// Generic quiz handler with shuffling and tags/difficulty support
(function () {
    let currentQuestions = [];
    let i = 0;
    let score = 0;
    let selectedAnswer = null;
    let submitted = false;
    let currentTopic = "";
    // Keep a log of each question, user's selection, and explanation for summary
    let answersLog = [];

    // Initialize quiz data
    window.quizData = window.quizData || {};

    function getStage() {
        return document.getElementById("quiz-stage");
    }

    function shuffleArray(arr) {
        for (let j = arr.length - 1; j > 0; j--) {
            const k = Math.floor(Math.random() * (j + 1));
            [arr[j], arr[k]] = [arr[k], arr[j]];
        }
        return arr;
    }

    function shuffleChoicesOnQuestion(q) {
        if (!Array.isArray(q.choices)) return q;
        const labeled = q.choices.map((c, idx) => ({ c, idx }));
        shuffleArray(labeled);
        q.choices = labeled.map((x) => x.c);
        q.ans = labeled.findIndex((x) => x.idx === q.ans);
        return q;
    }

    function render() {
        const stage = getStage();
        if (!stage) {
            setTimeout(render, 50);
            return;
        }

        submitted = false;
        selectedAnswer = null;

        if (i >= currentQuestions.length) {
            // Render detailed summary with all questions, selections, highlights, and explanations
            const summaryItems = answersLog
                .map((entry, idx) => {
                    const wasSkipped =
                        entry.selectedIndex === null ||
                        entry.selectedIndex === undefined;
                    const isCorrect =
                        !wasSkipped &&
                        entry.selectedIndex === entry.correctIndex;
                    const choiceHtml = entry.choices
                        .map((c, cIdx) => {
                            let cls = "quiz-choice";
                            if (cIdx === entry.correctIndex) cls += " correct";
                            if (
                                !isCorrect &&
                                !wasSkipped &&
                                cIdx === entry.selectedIndex
                            )
                                cls += " incorrect";
                            if (!wasSkipped && cIdx === entry.selectedIndex)
                                cls += " selected";
                            return `<div class="${cls}" style="pointer-events:none"><div class="quiz-choice-checkbox"></div><span>${c}</span></div>`;
                        })
                        .join("");

                    const fbColor = wasSkipped
                        ? "#a3a3a3"
                        : isCorrect
                        ? "#34d399"
                        : "#f87171";
                    const fbText = wasSkipped
                        ? "คุณข้ามข้อนี้ เฉลยคือ: " + (entry.why || "")
                        : isCorrect
                        ? "ถูกต้อง! " + (entry.why || "")
                        : "ผิด: " + (entry.why || "");

                    const metaRow = `<div class="muted" style="display:flex; gap:8px; align-items:center; flex-wrap:wrap; margin-top:6px;">
                        ${
                            entry.difficulty
                                ? `<span class=\"pill\" style=\"opacity:0.9;\">${String(
                                      entry.difficulty
                                  ).toUpperCase()}</span>`
                                : ""
                        }
                        ${
                            entry.tags && entry.tags.length
                                ? entry.tags
                                      .map(
                                          (t) =>
                                              `<span class=\"pill\" style=\"opacity:0.9;\">${t}</span>`
                                      )
                                      .join("")
                                : ""
                        }
                    </div>`;

                    return `
            <div class="quiz-summary-item" style="margin:16px 0; padding:12px; border-radius:12px; background: rgba(0,0,0,0.25);">
              <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
                <span class="pill">ข้อที่ ${idx + 1}</span>
                <span class="muted">${
                    isCorrect ? "ตอบถูก" : wasSkipped ? "ข้าม" : "ตอบผิด"
                }</span>
              </div>
              <h4 style="margin:8px 0 6px 0;">${entry.qText}</h4>
              <div class="quiz-choices">${choiceHtml}</div>
              <div class="quiz-feedback" style="margin-top:6px; color:${fbColor}">${fbText}</div>
              ${metaRow}
            </div>`;
                })
                .join("");

            stage.innerHTML = `
        <div class="quiz-card animate-fadeInUp">
          <h3 class="h3">สรุปผล: ${currentTopic.toUpperCase()}</h3>
          <p class="muted">คุณทำได้ ${score}/${currentQuestions.length} ข้อ</p>
          <div style="margin-top:12px;">
            ${summaryItems}
          </div>
          <div style="margin-top:1rem; display:flex; justify-content:flex-end; gap:8px;">
            <button class="btn ghost" onclick="backToMenu()">กลับไปที่เมนู</button>
          </div>
        </div>`;
            // Smooth scroll to ensure the summary is visible
            setTimeout(() => {
                const quizSection = document.getElementById("final-quiz");
                if (
                    quizSection &&
                    typeof quizSection.scrollIntoView === "function"
                ) {
                    quizSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }
            }, 50);
            return;
        }

        const q = currentQuestions[i];
        const bg = document.querySelector(".quiz-bg");
        if (bg) bg.className = "quiz-bg " + (q.bg || "");

        const tagsHtml =
            q.tags && q.tags.length
                ? `<div class="muted" style="display:flex; flex-wrap:wrap; gap:6px; margin:6px 0 0 0;">${q.tags
                      .map(
                          (t) =>
                              `<span class=\"pill\" style=\"opacity:0.9\">${t}</span>`
                      )
                      .join("")}</div>`
                : "";
        const difficultyHtml = q.difficulty
            ? `<span class="pill" title="difficulty" style="background:rgba(255,255,255,0.14);">${String(
                  q.difficulty
              ).toUpperCase()}</span>`
            : "";

        stage.innerHTML = `
            <div class="quiz-card animate-fadeInUp">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
                    <span class="pill">${currentTopic.toUpperCase()}</span>
                    ${difficultyHtml}
                    <span class="muted">ข้อที่ ${i + 1} / ${
            currentQuestions.length
        }</span>
                </div>
                <h3 style="margin:8px 0 0 0;">${q.q}</h3>
                ${tagsHtml}
                <div class="quiz-choices" id="choices"></div>
                <div class="quiz-feedback" id="fb"></div>
                <div style="margin-top:8px; display:flex; justify-content:flex-end; gap:8px;">
                    <button id="quiz-next-btn" class="btn ghost" onclick="nextQuizPage()">ข้าม</button>
                </div>
            </div>`;

        const choicesEl = document.getElementById("choices");
        q.choices.forEach((c, idx) => {
            const div = document.createElement("div");
            div.className = "quiz-choice";
            div.innerHTML = `<div class="quiz-choice-checkbox"></div><span>${c}</span>`;
            div.onclick = () => select(idx, div);
            choicesEl.appendChild(div);
        });
    }

    function select(idx, el) {
        if (submitted) return;
        selectedAnswer = idx;
        const nextBtn = document.getElementById("quiz-next-btn");
        if (nextBtn) nextBtn.textContent = "ส่งคำตอบ";
        const allChoices = document.querySelectorAll(".quiz-choice");
        allChoices.forEach((c) => c.classList.remove("selected"));
        el.classList.add("selected");
    }

    function submit() {
        if (submitted || selectedAnswer === null) return;
        submitted = true;

        const q = currentQuestions[i];
        const fb = document.getElementById("fb");
        const allChoices = document.querySelectorAll(".quiz-choice");
        const selectedEl = allChoices[selectedAnswer];

        if (selectedAnswer === q.ans) {
            fb.textContent = "ถูกต้อง! " + q.why;
            fb.style.color = "#34d399";
            selectedEl.classList.add("correct");
            score++;
        } else {
            fb.textContent = "ผิด: " + q.why;
            fb.style.color = "#f87171";
            selectedEl.classList.add("incorrect");
            allChoices[q.ans].classList.add("correct");
        }

        // Log the answer for summary
        answersLog.push({
            qText: q.q,
            choices: q.choices.slice(),
            correctIndex: q.ans,
            selectedIndex: selectedAnswer,
            why: q.why,
            difficulty: q.difficulty || null,
            tags: q.tags || [],
        });

        const nextBtn = document.getElementById("quiz-next-btn");
        if (nextBtn) nextBtn.textContent = "ข้อต่อไป";
    }

    window.startTopicQuiz = function (topic, questions) {
        // If questions are passed directly, use them (legacy support or manual override)
        if (questions) {
            initQuiz(topic, questions);
            return;
        }

        // Check if data is already loaded
        if (window.quizData && window.quizData[topic]) {
            initQuiz(topic, window.quizData[topic]);
            return;
        }

        // Fetch data for the topic
        console.log(`Fetching quiz data for ${topic}...`);
        fetch(`/data/quiz-${topic}.json`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                window.quizData[topic] = data;
                initQuiz(topic, data);
            })
            .catch((err) => {
                console.error(`Failed to load quiz data for ${topic}:`, err);
                const stage = getStage();
                if (stage) {
                    stage.innerHTML = `<div class="quiz-card"><h3 style="color:#f87171">Error loading quiz</h3><p>ไม่สามารถโหลดข้อมูลแบบทดสอบได้ (${err.message})</p><button class="btn ghost" onclick="backToMenu()">กลับไปที่เมนู</button></div>`;
                    if (window.show) window.show("final-quiz");
                }
            });
    };

    function initQuiz(topic, questions) {
        currentTopic = topic;
        // Deep-ish copy to avoid mutating original question banks
        currentQuestions = (questions || []).map((q) => ({
            ...q,
            choices: Array.isArray(q.choices) ? q.choices.slice() : [],
        }));
        // Shuffle questions and choices for variety
        shuffleArray(currentQuestions);
        currentQuestions = currentQuestions.map((q) =>
            shuffleChoicesOnQuestion(q)
        );
        // Cap at 10 questions
        if (currentQuestions.length > 10)
            currentQuestions = currentQuestions.slice(0, 10);

        i = 0;
        score = 0;
        answersLog = [];
        const quizSection = document.getElementById("final-quiz");
        if (window.show) {
            window.show("final-quiz");
        } else if (quizSection) {
            quizSection.style.display = "block";
        }
        // Render shortly after showing the section
        setTimeout(render, 50);
        // Smooth scroll to the quiz so users see it immediately
        setTimeout(() => {
            const qs = document.getElementById("final-quiz");
            if (qs && typeof qs.scrollIntoView === "function") {
                qs.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 120);
    }

    window.nextQuizPage = function () {
        if (!submitted) {
            if (selectedAnswer !== null) {
                submit();
            } else {
                // Skip question and log
                const q = currentQuestions[i];
                answersLog.push({
                    qText: q.q,
                    choices: q.choices.slice(),
                    correctIndex: q.ans,
                    selectedIndex: null,
                    why: q.why,
                    difficulty: q.difficulty || null,
                    tags: q.tags || [],
                });
                i++;
                render();
            }
        } else {
            i++;
            render();
        }
    };
})();
