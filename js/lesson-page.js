(function () {
    function getTopicFromUrl() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        const topic = filename.replace('.html', '');
        return topic;
    }

    function renderTopic() {
        const topicKey = getTopicFromUrl();
        const topic = (window.lessonTopics || {})[topicKey];
        if (!topic) return;

        const isEn = window.currentLang === 'en';
        const descText = isEn
            ? 'Same content as Lesson Mode, but with full fixed background.'
            : 'เนื้อหาเดียวกับโหมดบทเรียน แต่ภาพพื้นหลังคงที่เต็มหน้า';
        const startQuizText = isEn ? 'Start Quiz for ' : 'เริ่มแบบทดสอบสำหรับ ';
        const menuText = 'Menu';

        const container = document.querySelector('.system-content');
        if (!container) return;

        let sections;
        if (topicKey === 'nervous') {
            sections = buildNervousSections(topic, isEn);
        } else {
            sections = buildStandardSections(topic);
        }

        container.innerHTML = `
            <h1 class="section-title">${topic.name}</h1>
            <p class="section-description">${descText}</p>
            ${sections}
            <div class="lesson-page-actions">
                <button class="cta-button" data-action="start-quiz" data-topic="${topicKey}">
                    <i class="fas fa-award"></i>
                    ${startQuizText}${topic.name}
                </button>
                <a class="btn ghost" href="../index.html#menu">
                    <i class="fas fa-bars"></i> ${menuText}
                </a>
            </div>
        `;

        const quizBtn = container.querySelector('[data-action="start-quiz"]');
        if (quizBtn) {
            quizBtn.addEventListener('click', function () {
                const topic = this.getAttribute('data-topic');
                if (window.startTopicQuiz) {
                    window.startTopicQuiz(topic);
                }
            });
        }
    }
    function buildStandardSections(topic) {
        return topic.pages
            .map(
                (p, idx) => `
                <section class="panel" style="margin-top:16px;">
                    <div class="h3">${idx + 1}. ${p.title}</div>
                    ${p.html}
                </section>
            `
            )
            .join('');
    }
    function buildNervousSections(topic, isEn) {
        const cnsIndex = topic.pages.findIndex(
            (p) =>
                p &&
                typeof p.title === 'string' &&
                (p.title.includes('ระบบประสาทส่วนกลาง') ||
                    p.title.includes('Central Nervous System'))
        );

        return topic.pages
            .map((p, idx) => {
                const section = `
                    <section class="panel" style="margin-top:16px;">
                        <div class="h3">${idx + 1}. ${p.title}</div>
                        ${p.html}
                    </section>`;

                if (idx === cnsIndex) {
                    const brainDiagramTitle = isEn ? 'Brain Diagram' : 'ภาพสมอง';
                    const fallbackText = isEn
                        ? 'Place brain.webp in assets folder'
                        : 'วางไฟล์ brain.webp ในโฟลเดอร์ assets เพื่อแสดงภาพนี้';

                    const placeholder = `
                        <section class="panel" style="margin-top:16px;">
                            <div class="h3">${brainDiagramTitle}</div>
                            <div class="brain-diagram-container">
                                <img 
                                    src="../assets/brain.webp" 
                                    alt="Brain" 
                                    class="brain-diagram-img"
                                    data-fallback-text="${fallbackText}"
                                >
                            </div>
                        </section>`;
                    return placeholder + section;
                }
                return section;
            })
            .join('');
    }
    function setupBrainImageFallback() {
        const brainImg = document.querySelector('.brain-diagram-img');
        if (brainImg) {
            brainImg.addEventListener('error', function () {
                const fallbackText = this.getAttribute('data-fallback-text');
                const container = this.closest('.brain-diagram-container');
                if (container) {
                    this.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'muted';
                    fallback.textContent = fallbackText;
                    container.appendChild(fallback);
                }
            });
        }
    }
    window.backToMenu = function () {
        window.location.href = '../index.html#menu';
    };

    window.renderTopic = renderTopic;

    function init() {
        renderTopic();
        setupBrainImageFallback();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.addEventListener('languageChanged', function () {
        renderTopic();
        setupBrainImageFallback();
    });
})();
