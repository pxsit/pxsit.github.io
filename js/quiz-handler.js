// Generic quiz handler with shuffling and tags/difficulty support
(function () {
    // Constants
    const MAX_QUESTIONS = 10;
    const SCROLL_DELAY = 120;
    const RENDER_DELAY = 50;

    // State
    let currentQuestions = [];
    let currentIndex = 0;
    let score = 0;
    let selectedAnswer = null;
    let submitted = false;
    let currentTopic = "";
    let answersLog = [];

    // Initialize quiz data
    window.quizData = window.quizData || {};

    // Cache DOM element getter
    const getStage = () => document.getElementById("quiz-stage");

    /**
     * Fisher-Yates shuffle algorithm - O(n) time complexity
     * Shuffles array in place
     */
    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    /**
     * Shuffle choices while tracking the correct answer index
     */
    function shuffleChoicesOnQuestion(q) {
        if (!q || !Array.isArray(q.choices) || q.choices.length === 0) return q;
        if (typeof q.ans !== "number" || q.ans < 0 || q.ans >= q.choices.length)
            return q;

        const labeled = q.choices.map((c, idx) => ({ c, idx }));
        shuffleArray(labeled);
        q.choices = labeled.map((x) => x.c);
        q.ans = labeled.findIndex((x) => x.idx === q.ans);
        return q;
    }

    /**
     * Escape HTML to prevent XSS
     */
    function escapeHtml(str) {
        if (typeof str !== "string") return str;
        const div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Scroll to quiz section smoothly
     */
    function scrollToQuiz() {
        const quizSection = document.getElementById("final-quiz");
        if (quizSection?.scrollIntoView) {
            quizSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    function render() {
        const stage = getStage();
        if (!stage) {
            setTimeout(render, 50);
            return;
        }

        submitted = false;
        selectedAnswer = null;
        const isEn = window.currentLang === "en"; // Define isEn at the start of render

        if (currentIndex >= currentQuestions.length) {
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
                    const isEn = window.currentLang === "en";
                    const fbText = wasSkipped
                        ? (isEn
                              ? "Skipped. Answer: "
                              : "คุณข้ามข้อนี้ เฉลยคือ: ") + (entry.why || "")
                        : isCorrect
                          ? (isEn ? "Correct! " : "ถูกต้อง! ") +
                            (entry.why || "")
                          : (isEn ? "Incorrect: " : "ผิด: ") +
                            (entry.why || "");

                    const metaRow = `<div class="muted" style="display:flex; gap:8px; align-items:center; flex-wrap:wrap; margin-top:6px;">
                        ${
                            entry.difficulty
                                ? `<span class=\"pill\" style=\"opacity:0.9;\">${String(
                                      entry.difficulty,
                                  ).toUpperCase()}</span>`
                                : ""
                        }
                        ${
                            entry.tags && entry.tags.length
                                ? entry.tags
                                      .map(
                                          (t) =>
                                              `<span class=\"pill\" style=\"opacity:0.9;\">${t}</span>`,
                                      )
                                      .join("")
                                : ""
                        }
                    </div>`;

                    return `
            <div class="quiz-summary-item" style="margin:16px 0; padding:12px; border-radius:12px; background: rgba(0,0,0,0.25);">
              <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
                <span class="pill">${isEn ? "Question " : "ข้อที่ "}${idx + 1}</span>
                <span class="muted">${
                    isCorrect
                        ? isEn
                            ? "Correct"
                            : "ตอบถูก"
                        : wasSkipped
                          ? isEn
                              ? "Skipped"
                              : "ข้าม"
                          : isEn
                            ? "Incorrect"
                            : "ตอบผิด"
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
          <h3 class="h3">${isEn ? "Summary: " : "สรุปผล: "}${currentTopic.toUpperCase()}</h3>
          <p class="muted">${isEn ? `You scored ${score}/${currentQuestions.length}` : `คุณทำได้ ${score}/${currentQuestions.length} ข้อ`}</p>
          <div style="margin-top:12px;">
            ${summaryItems}
          </div>
          <div style="margin-top:1rem; display:flex; justify-content:flex-end; gap:8px;">
            <button class="btn ghost" onclick="backToMenu()">${isEn ? "Back to Menu" : "กลับไปที่เมนู"}</button>
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

        const q = currentQuestions[currentIndex];
        const bg = document.querySelector(".quiz-bg");
        if (bg) bg.className = "quiz-bg " + (q.bg || "");

        const tagsHtml =
            q.tags && q.tags.length
                ? `<div class="muted" style="display:flex; flex-wrap:wrap; gap:6px; margin:6px 0 0 0;">${q.tags
                      .map(
                          (t) =>
                              `<span class="pill" style="opacity:0.9">${escapeHtml(
                                  t,
                              )}</span>`,
                      )
                      .join("")}</div>`
                : "";
        const difficultyHtml = q.difficulty
            ? `<span class="pill" title="difficulty" style="background:rgba(255,255,255,0.14);">${escapeHtml(
                  String(q.difficulty).toUpperCase(),
              )}</span>`
            : "";

        stage.innerHTML = `
            <div class="quiz-card animate-fadeInUp">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
                    <span class="pill">${escapeHtml(
                        currentTopic.toUpperCase(),
                    )}</span>
                    ${difficultyHtml}
                    <span class="muted">${isEn ? "Question " : "ข้อที่ "}${currentIndex + 1} / ${
                        currentQuestions.length
                    }</span>
                </div>
                <h3 style="margin:8px 0 0 0;">${escapeHtml(q.q)}</h3>
                ${tagsHtml}
                <div class="quiz-choices" id="choices"></div>
                <div class="quiz-feedback" id="fb"></div>
                <div style="margin-top:8px; display:flex; justify-content:flex-end; gap:8px;">
                    <button id="quiz-next-btn" class="btn ghost" onclick="nextQuizPage()">${isEn ? "Skip" : "ข้าม"}</button>
                </div>
            </div>`;

        const choicesEl = document.getElementById("choices");
        if (!choicesEl) return;

        q.choices.forEach((c, idx) => {
            const div = document.createElement("div");
            div.className = "quiz-choice";
            div.innerHTML = `<div class="quiz-choice-checkbox"></div><span>${escapeHtml(
                c,
            )}</span>`;
            div.addEventListener("click", () => select(idx, div));
            choicesEl.appendChild(div);
        });
    }

    function select(idx, el) {
        if (submitted) return;
        selectedAnswer = idx;
        const isEn = window.currentLang === "en";

        const nextBtn = document.getElementById("quiz-next-btn");
        if (nextBtn) nextBtn.textContent = isEn ? "Submit" : "ส่งคำตอบ";

        document
            .querySelectorAll(".quiz-choice")
            .forEach((c) => c.classList.remove("selected"));
        el.classList.add("selected");
    }

    function submit() {
        if (submitted || selectedAnswer === null) return;
        submitted = true;
        const isEn = window.currentLang === "en";

        const q = currentQuestions[currentIndex];
        const fb = document.getElementById("fb");
        const allChoices = document.querySelectorAll(".quiz-choice");
        const selectedEl = allChoices[selectedAnswer];
        const isCorrect = selectedAnswer === q.ans;

        if (fb) {
            fb.textContent = isCorrect
                ? isEn
                    ? `Correct! ${q.why}`
                    : `ถูกต้อง! ${q.why}`
                : isEn
                  ? `Incorrect: ${q.why}`
                  : `ผิด: ${q.why}`;
            fb.style.color = isCorrect ? "#34d399" : "#f87171";
        }

        if (selectedEl) {
            selectedEl.classList.add(isCorrect ? "correct" : "incorrect");
        }
        if (!isCorrect && allChoices[q.ans]) {
            allChoices[q.ans].classList.add("correct");
        }
        if (isCorrect) score++;

        // Log the answer with details
        answersLog.push({
            qText: q.q,
            selectedIndex: isCorrect ? q.ans : selectedAnswer,
            correctIndex: q.ans,
            why: q.why,
            tags: q.tags,
            difficulty: q.difficulty,
            choices: q.choices,
        });

        setTimeout(() => {
            currentIndex++;
            render();
        }, 1000);
    }

    window.startQuiz = function (topic, questions) {
        currentTopic = topic;
        currentQuestions = (questions || [])
            .map((q) => shuffleChoicesOnQuestion(q))
            .slice(0, MAX_QUESTIONS);
        currentIndex = 0;
        score = 0;
        submitted = false;
        answersLog = [];

        const stage = getStage();
        if (stage) {
            stage.innerHTML = "";
            render();
        }
    };

    window.nextQuizPage = function () {
        const isEn = window.currentLang === "en";
        const nextBtn = document.getElementById("quiz-next-btn");
        if (
            nextBtn &&
            nextBtn.textContent.trim() === (isEn ? "Submit" : "ส่งคำตอบ")
        ) {
            submit();
        } else {
            currentIndex++;
            render();
        }
    };

    window.backToMenu = function () {
        // Implement back to menu logic
        const stage = getStage();
        if (stage) {
            stage.innerHTML = `<div class="quiz-card animate-fadeInUp" style="text-align:center;">
                <h3 class="h3">${window.currentLang === "en" ? "Quiz Menu" : "เมนูแบบทดสอบ"}</h3>
                <p class="muted">${window.currentLang === "en" ? "Select a topic to start:" : "เลือกหัวข้อเพื่อเริ่ม:"}</p>
                <div id="quiz-topics" style="margin-top:12px;"></div>
            </div>`;
            // Render available topics
            const topicsEl = document.getElementById("quiz-topics");
            if (topicsEl) {
                topicsEl.innerHTML = Object.keys(window.quizData)
                    .map((t) => {
                        const topic = window.quizData[t];
                        return `<div class="quiz-topic" onclick="startQuiz('${t}', ${JSON.stringify(topic.questions)})" style="cursor:pointer; margin:8px 0; padding:12px; border-radius:12px; background: rgba(255,255,255,0.1);">
                            <h4 style="margin:0;">${escapeHtml(t)}</h4>
                            <div class="muted" style="font-size:14px;">${window.currentLang === "en" ? `${topic.description} (${topic.questions.length} questions)` : `${topic.descriptionTH} (${topic.questions.length} ข้อ)`}</div>
                        </div>`;
                    })
                    .join("");
            }
        }
    };

    window.startTopicQuiz = function (topic, questions) {
        // If questions are passed directly, use them (legacy support or manual override)
        if (questions) {
            initQuiz(topic, questions);
            return;
        }

        // Helper to extract correct lang questions
        const getLocalizedQuestions = (data) => {
            if (Array.isArray(data)) return data;
            if (data && (data.en || data.th)) {
                // Default to 'th' if currentLang is missing, or fallback to 'en' if 'th' is missing in data
                const lang = window.currentLang || "th";
                return data[lang] || data["en"] || [];
            }
            return [];
        };

        // Check if data is already loaded
        if (window.quizData && window.quizData[topic]) {
            initQuiz(topic, getLocalizedQuestions(window.quizData[topic]));
            return;
        }

        // Fetch data for the topic
        console.log(`Fetching quiz data for ${topic}...`);

        // Determine path relative to current page location to support GitHub Pages / subdirs
        // If we are in 'lessons/' folder, go up one level to find 'data/'
        const pathPrefix = window.location.pathname.includes("/lessons/")
            ? "../"
            : "";
        const url = `${pathPrefix}data/quiz-${topic}.json?t=${Date.now()}`;

        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                window.quizData[topic] = data;
                initQuiz(topic, getLocalizedQuestions(data));
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
        if (!Array.isArray(questions) || questions.length === 0) {
            console.error(
                "Invalid quiz questions for topic:",
                topic,
                "Data:",
                questions,
            );
            return;
        }

        currentTopic = topic;
        // Deep copy to avoid mutating original question banks
        currentQuestions = questions.map((q) => ({
            ...q,
            choices: Array.isArray(q.choices) ? [...q.choices] : [],
        }));

        // Shuffle questions and choices
        shuffleArray(currentQuestions);
        currentQuestions = currentQuestions.map(shuffleChoicesOnQuestion);

        // Cap at max questions
        if (currentQuestions.length > MAX_QUESTIONS) {
            currentQuestions = currentQuestions.slice(0, MAX_QUESTIONS);
        }

        // Reset state
        currentIndex = 0;
        score = 0;
        answersLog = [];

        // Show quiz section
        const quizSection = document.getElementById("final-quiz");
        if (window.show) {
            window.show("final-quiz");
        } else if (quizSection) {
            quizSection.style.display = "block";
        }

        setTimeout(render, RENDER_DELAY);
        setTimeout(scrollToQuiz, SCROLL_DELAY);
    }

    // Auto-scroll to top on page load
    window.addEventListener("load", () => {
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
        }, 100);
    });
})();
