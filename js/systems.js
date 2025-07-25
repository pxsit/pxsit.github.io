// System-specific content and functionality - Fixed Version
const systemsData = {
    skin: {
        title: "ระบบผิวหนัง",
        description:
            "ผิวหนังเป็นอวัยวะที่ใหญ่ที่สุดของร่างกาย ทำหน้าที่ป้องกันและควบคุมอุณหภูมิ",
        color: "#ffeaa7",
        sections: [
            {
                title: "โครงสร้างผิวหนัง",
                content: [
                    "ชั้นนอกสุด (Epidermis) - ป้องกันจากสิ่งแวดล้อม",
                    "ชั้นกลาง (Dermis) - มีเส้นเลือด ต่อมเหงื่อ และรูขุมขน",
                    "ชั้นใน (Hypodermis) - เก็บไขมันและให้ความอิ่มเอิบ",
                ],
            },
            {
                title: "หน้าที่ของผิวหนัง",
                content: [
                    "ป้องกันร่างกายจากแบคทีเรียและสารเคมี",
                    "ควบคุมอุณหภูมิร่างกาย",
                    "รับความรู้สึกจากสิ่งแวดล้อม",
                    "สร้างวิตามิน D",
                ],
            },
        ],
        quiz: [
            {
                question: "ชั้นผิวหนังชั้นนอกสุดเรียกว่าอะไร?",
                options: ["Epidermis", "Dermis", "Hypodermis", "Subcutaneous"],
                correct: 0,
            },
            {
                question: "ผิวหนังมีหน้าที่ใดต่อไปนี้?",
                options: [
                    "ป้องกันเชื้อโรค",
                    "ควบคุมอุณหภูมิ",
                    "สร้างวิตามิน D",
                    "ทั้งหมดข้างต้น",
                ],
                correct: 3,
            },
        ],
    },
    muscles: {
        title: "ระบบกล้ามเนื้อ",
        description:
            "กล้ามเนื้อทำให้ร่างกายเคลื่อนไหวได้ และช่วยในการทำงานของอวัยวะต่างๆ",
        color: "#fd79a8",
        sections: [
            {
                title: "ประเภทของกล้ามเนื้อ",
                content: [
                    "กล้ามเนื้อเรียบ (Smooth Muscle) - ในอวัยวะภายใน",
                    "กล้ามเนื้อหัวใจ (Cardiac Muscle) - ในหัวใจ",
                    "กล้ามเนื้อลาย (Skeletal Muscle) - ติดกับกระดูก",
                ],
            },
            {
                title: "การทำงานของกล้ามเนื้อ",
                content: [
                    "การหดตัวและคลายตัว",
                    "การทำงานร่วมกันเป็นคู่ตรงข้าม",
                    "การควบคุมโดยระบบประสาท",
                    "การใช้พลังงานจากอาหาร",
                ],
            },
        ],
        quiz: [
            {
                question: "กล้ามเนื้อชนิดใดที่เราควบคุมได้โดยตรง?",
                options: [
                    "กล้ามเนื้อเรียบ",
                    "กล้ามเนื้อหัวใจ",
                    "กล้ามเนื้อลาย",
                    "ทุกชนิด",
                ],
                correct: 2,
            },
            {
                question: "กล้ามเนื้อหัวใจมีลักษณะพิเศษอย่างไร?",
                options: [
                    "หดตัวเองได้",
                    "ไม่เหนื่อยล้า",
                    "ทำงานตลอดชีวิต",
                    "ทั้งหมดข้างต้น",
                ],
                correct: 3,
            },
        ],
    },
    bones: {
        title: "ระบบกระดูก",
        description:
            "กระดูกเป็นโครงสร้างที่แข็งแรง ให้การค้ำจุนและปกป้องอวัยวะสำคัญ",
        color: "#81ecec",
        sections: [
            {
                title: "โครงสร้างกระดูก",
                content: [
                    "กระดูกแข็ง (Compact Bone) - ชั้นนอกที่แข็งแรง",
                    "กระดูกฟองน้ำ (Spongy Bone) - ชั้นในที่มีรูพรุน",
                    "ไขกระดูก (Bone Marrow) - สร้างเซลล์เลือด",
                    "เยื่อหุ้มกระดูก (Periosteum) - เยื่อหุ้มภายนอก",
                ],
            },
            {
                title: "หน้าที่ของระบบกระดูก",
                content: [
                    "ค้ำจุนร่างกายให้ตั้งตรง",
                    "ปกป้องอวัยวะภายใน",
                    "สร้างเซลล์เลือด",
                    "เก็บแคลเซียมและฟอสฟอรัส",
                ],
            },
        ],
        quiz: [
            {
                question: "ร่างกายมนุษย์มีกระดูกทั้งหมดกี่ชิ้น?",
                options: ["186 ชิ้น", "206 ชิ้น", "216 ชิ้น", "226 ชิ้น"],
                correct: 1,
            },
            {
                question: "ไขกระดูกมีหน้าที่อะไร?",
                options: [
                    "สร้างเซลล์เลือด",
                    "เก็บแคลเซียม",
                    "ให้ความแข็งแรง",
                    "ทั้งหมดข้างต้น",
                ],
                correct: 0,
            },
        ],
    },
    organs: {
        title: "อวัยวะภายใน",
        description: "อวัยวะภายในทำหน้าที่สำคัญในการดำรงชีวิต",
        color: "#a29bfe",
        sections: [
            {
                title: "อวัยวะในระบบหายใจ",
                content: [
                    "ปอด - แลกเปลี่ยนออกซิเจนและคาร์บอนไดออกไซด์",
                    "หลอดลม - นำอากาศเข้าสู่ปอด",
                    "กระบังลม - กล้ามเนื้อช่วยหายใจ",
                ],
            },
            {
                title: "อวัยวะในระบบย่อยอาหาร",
                content: [
                    "กระเพาะอาหาร - ย่อยอาหารด้วยกรด",
                    "ลำไส้เล็ก - ดูดซับสารอาหาร",
                    "ตับ - สร้างน้ำดีและกรองสารพิษ",
                    "ไต - กรองของเสียจากเลือด",
                ],
            },
        ],
        quiz: [
            {
                question: "อวัยวะใดที่ทำหน้าที่กรองสารพิษจากร่างกาย?",
                options: ["ปอด", "ตับ", "ไต", "ตับและไต"],
                correct: 3,
            },
            {
                question: "การแลกเปลี่ยนแก๊สเกิดขึ้นที่ใด?",
                options: ["หลอดลม", "ถุงลมปอด", "หัวใจ", "เส้นเลือด"],
                correct: 1,
            },
        ],
    },
    circulatory: {
        title: "ระบบไหลเวียนเลือด",
        description:
            "ระบบที่ทำให้เลือดไหลเวียนไปทั่วร่างกาย นำออกซิเจนและสารอาหาร",
        color: "#fd63a7",
        sections: [
            {
                title: "องค์ประกอบของระบบไหลเวียน",
                content: [
                    "หัวใจ - ปั๊มเลือดไปทั่วร่างกาย",
                    "เส้นเลือดแดง - นำเลือดออกจากหัวใจ",
                    "เส้นเลือดดำ - นำเลือดกลับสู่หัวใจ",
                    "เส้นเลือดฝอย - แลกเปลี่ยนสารระหว่างเลือดและเนื้อเยื่อ",
                ],
            },
            {
                title: "การไหลเวียนของเลือด",
                content: [
                    "การไหลเวียนปอด - หัวใจ → ปอด → หัวใจ",
                    "การไหลเวียนร่างกาย - หัวใจ → อวัยวะต่างๆ → หัวใจ",
                    "หัวใจเป็นปั๊มสี่ห้อง",
                    "เลือดไหลเวียนครบรอบใน 1 นาที",
                ],
            },
        ],
        quiz: [
            {
                question: "หัวใจมีกี่ห้อง?",
                options: ["2 ห้อง", "3 ห้อง", "4 ห้อง", "5 ห้อง"],
                correct: 2,
            },
            {
                question: "เส้นเลือดชนิดใดที่นำเลือดกลับสู่หัวใจ?",
                options: [
                    "เส้นเลือดแดง",
                    "เส้นเลือดดำ",
                    "เส้นเลือดฝอย",
                    "ทุกชนิด",
                ],
                correct: 1,
            },
        ],
    },
};

// Get system content - FIXED VERSION
function getSystemContent(systemType) {
    console.log(`Getting content for system: ${systemType}`);

    const system = systemsData[systemType];
    if (!system) {
        console.error(`System data not found for: ${systemType}`);
        return `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>ไม่พบข้อมูลระบบ</h3>
                <p>ไม่สามารถโหลดข้อมูลของระบบนี้ได้</p>
            </div>
        `;
    }

    try {
        return `
            <div class="system-modal-content">
                <div class="system-header" style="background: linear-gradient(135deg, ${system.color}, ${adjustBrightness(system.color, -20)});">
                    <h2>${system.title}</h2>
                    <p>${system.description}</p>
                </div>
                
                <div class="system-body">
                    <div class="system-sections">
                        ${system.sections
                            .map(
                                (section, index) => `
                            <div class="system-section animate-fadeInUp animate-delay-${index + 1}">
                                <h3>${section.title}</h3>
                                <ul>
                                    ${section.content.map((item) => `<li>${item}</li>`).join("")}
                                </ul>
                            </div>
                        `
                            )
                            .join("")}
                    </div>
                    
                    <div class="system-visual">
                        <div class="system-diagram" data-system="${systemType}">
                            <img src="images/${systemType}-diagram.svg" alt="${system.title}" onerror="this.src='images/placeholder-diagram.svg'">
                            <div class="diagram-controls">
                                <button class="zoom-in" onclick="zoomDiagram(1.2)" title="ขยาย">
                                    <i class="fas fa-search-plus"></i>
                                </button>
                                <button class="zoom-out" onclick="zoomDiagram(0.8)" title="ย่อ">
                                    <i class="fas fa-search-minus"></i>
                                </button>
                                <button class="reset-zoom" onclick="resetZoom()" title="รีเซ็ต">
                                    <i class="fas fa-undo"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="system-quiz">
                    <h3>แบบทดสอบความเข้าใจ</h3>
                    <div id="quiz-container-${systemType}" class="quiz-container">
                        ${generateQuiz(system.quiz, systemType)}
                    </div>
                </div>
                
                <div class="system-footer">
                    <button class="back-to-systems" onclick="closeModal()">
                        <i class="fas fa-arrow-left"></i>
                        กลับไปเลือกระบบอื่น
                    </button>
                    <button class="next-system" onclick="nextSystem('${systemType}')">
                        ระบบถัดไป
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;
    } catch (error) {
        console.error("Error generating system content:", error);
        return `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>เกิดข้อผิดพลาด</h3>
                <p>ไม่สามารถสร้างเนื้อหาได้ กรุณาลองใหม่อีกครั้ง</p>
            </div>
        `;
    }
}

// Generate quiz - FIXED VERSION
function generateQuiz(questions, systemType) {
    if (!questions || !Array.isArray(questions)) {
        return "<p>ไม่มีแบบทดสอบสำหรับระบบนี้</p>";
    }

    try {
        return (
            questions
                .map(
                    (q, index) => `
            <div class="quiz-question" data-question="${index}">
                <h4>คำถามที่ ${index + 1}: ${q.question}</h4>
                <div class="quiz-options">
                    ${q.options
                        .map(
                            (option, optIndex) => `
                        <label class="quiz-option">
                            <input type="radio" name="q${index}" value="${optIndex}">
                            <span>${option}</span>
                        </label>
                    `
                        )
                        .join("")}
                </div>
                <div class="quiz-feedback" id="feedback-${index}"></div>
            </div>
        `
                )
                .join("") +
            `
            <div class="quiz-actions">
                <button class="check-answers" onclick="checkQuizAnswers('${systemType}')">
                    <i class="fas fa-check"></i>
                    ตรวจคำตอบ
                </button>
                <button class="reset-quiz" onclick="resetQuiz('${systemType}')" style="display: none;">
                    <i class="fas fa-redo"></i>
                    ทำใหม่
                </button>
            </div>
            <div class="quiz-results" id="quiz-results-${systemType}"></div>
        `
        );
    } catch (error) {
        console.error("Error generating quiz:", error);
        return "<p>เกิดข้อผิดพลาดในการสร้างแบบทดสอบ</p>";
    }
}

// Initialize system interactions - FIXED VERSION
function initSystemInteractions(systemType) {
    console.log(`Initializing interactions for system: ${systemType}`);

    try {
        // Initialize zoom functionality
        const diagram = document.querySelector(".system-diagram img");
        if (diagram) {
            diagram.style.transform = "scale(1)";
            diagram.style.transition = "transform 0.3s ease";
        }

        // Initialize quiz interactions
        initQuizInteractions(systemType);

        console.log(`System interactions initialized for: ${systemType}`);
    } catch (error) {
        console.error("Error initializing system interactions:", error);
    }
}

// Initialize quiz interactions
function initQuizInteractions(systemType) {
    const quizOptions = document.querySelectorAll(
        '.quiz-option input[type="radio"]'
    );

    quizOptions.forEach((option) => {
        option.addEventListener("change", () => {
            // Clear previous feedback when new option is selected
            const questionDiv = option.closest(".quiz-question");
            const feedback = questionDiv.querySelector(".quiz-feedback");
            if (feedback) {
                feedback.innerHTML = "";
                feedback.className = "quiz-feedback";
            }
        });
    });
}

// Check quiz answers - FIXED VERSION
function checkQuizAnswers(systemType) {
    console.log(`Checking quiz answers for: ${systemType}`);

    try {
        const system = systemsData[systemType];
        if (!system || !system.quiz) {
            console.error("Quiz data not found");
            return;
        }

        const questions = system.quiz;
        let correct = 0;
        let total = questions.length;

        questions.forEach((question, index) => {
            const selectedOption = document.querySelector(
                `input[name="q${index}"]:checked`
            );
            const feedback = document.getElementById(`feedback-${index}`);

            if (!feedback) {
                console.warn(
                    `Feedback element not found for question ${index}`
                );
                return;
            }

            if (selectedOption) {
                const selectedValue = parseInt(selectedOption.value);
                const isCorrect = selectedValue === question.correct;

                if (isCorrect) {
                    correct++;
                    feedback.innerHTML =
                        '<i class="fas fa-check-circle"></i> ถูกต้อง!';
                    feedback.className = "quiz-feedback correct";
                } else {
                    feedback.innerHTML = `<i class="fas fa-times-circle"></i> ผิด คำตอบที่ถูกต้องคือ: ${question.options[question.correct]}`;
                    feedback.className = "quiz-feedback incorrect";
                }
            } else {
                feedback.innerHTML =
                    '<i class="fas fa-exclamation-circle"></i> กรุณาเลือกคำตอบ';
                feedback.className = "quiz-feedback warning";
            }
        });

        // Show results
        const resultsDiv = document.getElementById(
            `quiz-results-${systemType}`
        );
        if (resultsDiv) {
            const percentage = Math.round((correct / total) * 100);

            resultsDiv.innerHTML = `
                <div class="quiz-score ${percentage >= 70 ? "good" : percentage >= 50 ? "fair" : "poor"}">
                    <h4>คะแนนของคุณ: ${correct}/${total} (${percentage}%)</h4>
                    <div class="score-message">
                        ${
                            percentage >= 70
                                ? '<i class="fas fa-trophy"></i> ยอดเยี่ยม! คุณเข้าใจเนื้อหาเป็นอย่างดี'
                                : percentage >= 50
                                  ? '<i class="fas fa-thumbs-up"></i> ดี! แต่ควรทบทวนเนื้อหาอีกครั้ง'
                                  : '<i class="fas fa-book-open"></i> ควรศึกษาเนื้อหาเพิ่มเติม'
                        }
                    </div>
                </div>
            `;
        }

        // Show/hide buttons
        const checkButton = document.querySelector(".check-answers");
        const resetButton = document.querySelector(".reset-quiz");

        if (checkButton) checkButton.style.display = "none";
        if (resetButton) resetButton.style.display = "inline-block";
    } catch (error) {
        console.error("Error checking quiz answers:", error);
    }
}

// Reset quiz
function resetQuiz(systemType) {
    console.log(`Resetting quiz for: ${systemType}`);

    try {
        // Clear all selections
        const radios = document.querySelectorAll('input[type="radio"]');
        radios.forEach((radio) => (radio.checked = false));

        // Clear all feedback
        const feedbacks = document.querySelectorAll(".quiz-feedback");
        feedbacks.forEach((feedback) => {
            feedback.innerHTML = "";
            feedback.className = "quiz-feedback";
        });

        // Clear results
        const resultsDiv = document.getElementById(
            `quiz-results-${systemType}`
        );
        if (resultsDiv) {
            resultsDiv.innerHTML = "";
        }

        // Show/hide buttons
        const checkButton = document.querySelector(".check-answers");
        const resetButton = document.querySelector(".reset-quiz");

        if (checkButton) checkButton.style.display = "inline-block";
        if (resetButton) resetButton.style.display = "none";
    } catch (error) {
        console.error("Error resetting quiz:", error);
    }
}

// Zoom diagram functionality
function zoomDiagram(factor) {
    const diagram = document.querySelector(".system-diagram img");
    if (diagram) {
        const currentTransform = diagram.style.transform;
        const currentScale = currentTransform.match(/scale\(([\d.]+)\)/);
        const scale = currentScale ? parseFloat(currentScale[1]) : 1;
        const newScale = Math.max(0.5, Math.min(3, scale * factor));

        diagram.style.transform = `scale(${newScale})`;
    }
}

function resetZoom() {
    const diagram = document.querySelector(".system-diagram img");
    if (diagram) {
        diagram.style.transform = "scale(1)";
    }
}

// Next system functionality
function nextSystem(currentSystem) {
    const systems = Object.keys(systemsData);
    const currentIndex = systems.indexOf(currentSystem);
    const nextIndex = (currentIndex + 1) % systems.length;
    const nextSystemType = systems[nextIndex];

    openSystemModal(nextSystemType);
}

// Utility function to adjust color brightness
function adjustBrightness(hex, percent) {
    try {
        // Remove # if present
        hex = hex.replace("#", "");

        // Convert hex to RGB
        const num = parseInt(hex, 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = ((num >> 8) & 0x00ff) + amt;
        const B = (num & 0x0000ff) + amt;

        return (
            "#" +
            (
                0x1000000 +
                (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
                (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
                (B < 255 ? (B < 1 ? 0 : B) : 255)
            )
                .toString(16)
                .slice(1)
        );
    } catch (error) {
        console.error("Error adjusting brightness:", error);
        return hex;
    }
}

// Make functions globally available
window.getSystemContent = getSystemContent;
window.initSystemInteractions = initSystemInteractions;
window.checkQuizAnswers = checkQuizAnswers;
window.resetQuiz = resetQuiz;
window.zoomDiagram = zoomDiagram;
window.resetZoom = resetZoom;
window.nextSystem = nextSystem;

console.log("Systems module loaded successfully");
