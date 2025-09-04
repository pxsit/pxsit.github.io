// Lessons flow and content (Thai requirements implemented)
// Contract:
// - startLesson(topicKey): show #lesson, load pages, set title/bg; hide #menu
// - nextPage(): advance within current lesson; when finished, start final quiz
// - backToMenu(): go back to menu

(function () {
  const sectionLesson = document.getElementById("lesson");
  const sectionMenu = document.getElementById("menu");
  const sectionQuiz = document.getElementById("final-quiz");
  const titleEl = document.getElementById("lesson-title");
  const stepEl = document.getElementById("lesson-step");
  const contentEl = document.getElementById("lesson-content");
  const bgEl = document.getElementById("lesson-bg");
  const nextBtn = document.getElementById("lesson-next");
  const backBtn = document.getElementById("lesson-back");

  const state = { topic: null, index: 0 };
  const completed = new Set();

  const topics = {
    circulatory: {
      name: "Circulatory System",
      bg: "bg-circulatory",
      pages: [
        {
          title: "เลือดและองค์ประกอบของเลือด",
          html: `
            <div class="panel">
              <div class="h3">เลือดคืออะไร?</div>
              <p class="muted">เลือดเป็นของเหลวที่ไหลเวียนในระบบไหลเวียน ทำหน้าที่ลำเลียงออกซิเจน สารอาหาร ฮอร์โมน และขับของเสียไปยังอวัยวะที่เกี่ยวข้อง</p>
            </div>
            <div class="grid-3" style="margin-top:12px;">
              <div class="panel">
                <div class="h3">เม็ดเลือดแดง (RBC)</div>
                <p class="muted">มีฮีโมโกลบินทำหน้าที่พาออกซิเจนจากปอดไปยังเนื้อเยื่อ และรับคาร์บอนไดออกไซด์กลับสู่ปอด</p>
              </div>
              <div class="panel">
                <div class="h3">เม็ดเลือดขาว (WBC)</div>
                <p class="muted">ทำหน้าที่ป้องกันและกำจัดเชื้อโรค มีหลายชนิดเช่น นิวโตรฟิล ลิมโฟไซต์</p>
              </div>
              <div class="panel">
                <div class="h3">เกล็ดเลือด</div>
                <p class="muted">ส่วนประกอบที่ช่วยให้เลือดแข็งตัวเมื่อเกิดบาดแผล ป้องกันการเสียเลือด</p>
              </div>
            </div>
            <div class="panel" style="margin-top:12px;">
              <div class="h3">พลาสมา</div>
              <p class="muted">ส่วนของเหลวของเลือด มีน้ำเป็นองค์ประกอบหลักและมีโปรตีนต่างๆ เช่น อัลบูมิน ไฟบรินโนเจน</p>
            </div>
            <div class="pill" style="margin-top:12px;">พื้นหลังจำลองการไหลของเลือดด้วยอนุภาคเคลื่อนไหว</div>
          `,
          bgAnim: "flow",
        },
        {
          title: "หลอดเลือดและหมู่เลือด",
          html: `
            <div class="grid-2">
              <div class="panel">
                <div class="h3">ชนิดของหลอดเลือด</div>
                <ul class="list-dot muted">
                  <li><strong>Arteries</strong> นำเลือดออกจากหัวใจ ผนังหนา มีความยืดหยุ่น ความดันสูง</li>
                  <li><strong>Veins</strong> นำเลือดกลับสู่หัวใจ มีลิ้นกันเลือดไหลย้อน ความดันต่ำกว่าหลอดเลือดแดง</li>
                  <li><strong>Capillaries</strong> เส้นเลือดฝอย ผนังบางมาก เหมาะกับการแลกเปลี่ยนแก๊สและสารอาหารกับเนื้อเยื่อ</li>
                </ul>
              </div>
              <div class="panel">
                <div class="h3">หมู่เลือด (ABO และ Rh)</div>
                <p class="muted">การให้-รับเลือดต้องคำนึงถึงหมู่เลือดและ Rh เพื่อหลีกเลี่ยงการเกิดปฏิกิริยาภูมิคุ้มกัน</p>
                <div class="panel" style="margin-top:8px; overflow-x:auto;">
                  <table style="width:100%; border-collapse:collapse; color:#e6e6f0;">
                    <thead>
                      <tr style="background:rgba(255,255,255,0.06)">
                        <th style="padding:6px; border:1px solid rgba(255,255,255,0.1)">ผู้ให้</th>
                        <th style="padding:6px; border:1px solid rgba(255,255,255,0.1)">ให้เลือดกับ</th>
                        <th style="padding:6px; border:1px solid rgba(255,255,255,0.1)">รับเลือดจาก</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">O-</td><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">ทุกหมู่ (universal donor)</td><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">O-</td></tr>
                      <tr><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">O+</td><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">O+, A+, B+, AB+</td><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">O+/O-</td></tr>
                      <tr><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">A+</td><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">A+, AB+</td><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">A+/A-/O+/O-</td></tr>
                      <tr><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">A-</td><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">A+, A-, AB+, AB-</td><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">A-/O-</td></tr>
                      <tr><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">B+</td><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">B+, AB+</td><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">B+/B-/O+/O-</td></tr>
                      <tr><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">B-</td><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">B+, B-, AB+, AB-</td><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">B-/O-</td></tr>
                      <tr><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">AB+</td><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">เฉพาะ AB+</td><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">ทุกหมู่ (universal recipient)</td></tr>
                      <tr><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">AB-</td><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">AB+, AB-</td><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">A-/B-/AB-/O-</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          `,
        },
        {
          title: "ความดันเลือดและอัตราการเต้นของหัวใจ",
          html: `
            <div class="grid-2">
              <div class="panel">
                <div class="h3">ความดันโลหิตคืออะไร?</div>
                <p class="muted">แรงดันที่เลือดกระทำต่อผนังหลอดเลือด วัดเป็นมิลลิเมตรปรอท (mmHg) มีค่า Systolic/Diastolic เช่น 120/80</p>
                <div class="h3" style="margin-top:8px;">อัตราการเต้นของหัวใจ</div>
                <p class="muted">จำนวนครั้งที่หัวใจเต้นใน 1 นาที (bpm) ปกติผู้ใหญ่ขณะพัก ~60–100 bpm</p>
              </div>
              <div class="panel">
                <div class="h3">กราฟการเต้นของหัวใจ</div>
                <div style="height:140px; position:relative; background:rgba(255,255,255,0.06); border-radius:8px; overflow:hidden;">
                  <div id="ecg" style="position:absolute; inset:0;"></div>
                </div>
                <p class="muted" style="margin-top:8px;">เส้นกราฟจำลองรูปแบบการเต้น (ไม่ใช่สัญญาณทางการแพทย์จริง)</p>
              </div>
            </div>
          `,
          after: () => drawECG(),
        },
        {
          title: "การไหลเวียนของเลือดผ่านหัวใจ",
          html: `
            <div class="panel">
              <div class="h3">แผนภาพหัวใจ</div>
              <p class="muted">แสดงทิศทางการไหล: เลือดดำจากร่างกาย → หัวใจขวา → ปอด → เลือดแดงกลับหัวใจซ้าย → ส่งไปเลี้ยงร่างกาย ลูกศรจะชี้ชื่อหลอดเลือดหลัก</p>
              <div style="height:260px; position:relative; margin-top:8px; background:rgba(255,255,255,0.04); border-radius:12px; overflow:hidden;">
                <img alt="heart" src="images/circulatory-diagram.svg" style="position:absolute; inset:0; width:100%; height:100%; object-fit:contain; opacity:.4;">
                <svg viewBox="0 0 600 300" style="position:absolute; inset:0;">
                  <defs>
                    <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="3" orient="auto" markerUnits="strokeWidth">
                      <path d="M0,0 L0,6 L9,3 z" fill="#60a5fa" />
                    </marker>
                  </defs>
                  <path d="M100,260 C140,200 160,120 200,100" stroke="#60a5fa" stroke-width="3" fill="none" marker-end="url(#arrow)"></path>
                  <text x="110" y="250" fill="#93c5fd">Vena cava</text>
                  <path d="M210,110 C260,90 300,90 340,110" stroke="#34d399" stroke-width="3" fill="none" marker-end="url(#arrow)"></path>
                  <text x="260" y="95" fill="#a7f3d0">Pulmonary artery</text>
                  <path d="M360,120 C400,140 420,200 480,230" stroke="#f472b6" stroke-width="3" fill="none" marker-end="url(#arrow)"></path>
                  <text x="420" y="210" fill="#fbcfe8">Aorta</text>
                </svg>
              </div>
            </div>
          `,
        },
        {
          title: "โรคที่เกี่ยวข้องกับระบบไหลเวียนเลือด",
          html: `
            <div class="panel">
                <div class="h3">โรคที่พบบ่อย</div>
                <ul class="list-dot muted">
                    <li><strong>โรคความดันโลหิตสูง (Hypertension):</strong> ภาวะที่ความดันเลือดสูงกว่าปกติเรื้อรัง เสี่ยงต่อโรคหัวใจและหลอดเลือดสมอง</li>
                    <li><strong>โรคหลอดเลือดหัวใจ (Coronary Artery Disease):</strong> เกิดจากหลอดเลือดที่ไปเลี้ยงหัวใจตีบหรือตัน ทำให้กล้ามเนื้อหัวใจขาดเลือด</li>
                    <li><strong>ภาวะหัวใจล้มเหลว (Heart Failure):</strong> ภาวะที่หัวใจไม่สามารถสูบฉีดเลือดไปเลี้ยงร่างกายได้เพียงพอ</li>
                </ul>
            </div>
          `,
        },
      ],
    },
    nervous: {
      name: "Nervous System",
      bg: "bg-nervous",
      pages: [
        {
          title: "ภาพรวมและหน้าที่",
          html: `
            <div class="panel">
              <p class="muted">ระบบประสาททำหน้าที่รับข้อมูล ประมวลผล และสั่งการประกอบด้วย <strong>ระบบประสาทส่วนกลาง (CNS)</strong> คือ สมองและไขสันหลัง และ <strong>ระบบประสาทรอบนอก (PNS)</strong> คือ เส้นประสาทที่เชื่อมต่อทั่วร่างกาย</p>
            </div>
          `,
        },
        {
          title: "เซลล์ประสาท (Neuron)",
          html: `
            <div class="grid-2">
              <div class="panel">
                <div class="h3">ส่วนประกอบ</div>
                <ul class="list-dot muted">
                  <li><strong>Dendrites</strong> รับสัญญาณ</li>
                  <li><strong>Cell body</strong> ประมวลผล</li>
                  <li><strong>Axon</strong> ส่งสัญญาณออก</li>
                  <li><strong>Myelin sheath</strong> ช่วยให้ส่งสัญญาณเร็วขึ้น</li>
                  <li><strong>Synapse</strong> จุดเชื่อมต่อระหว่างเซลล์ประสาท</li>
                </ul>
              </div>
              <div class="panel">
                <div class="h3">ภาพประกอบพร้อมลูกศร</div>
                <div style="height:200px; position:relative; background:rgba(255,255,255,0.06); border-radius:8px;">
                  <svg viewBox="0 0 600 200" style="position:absolute; inset:0;">
                    <circle cx="100" cy="100" r="18" fill="#93c5fd"></circle>
                    <text x="70" y="80" fill="#bfdbfe">Dendrites</text>
                    <rect x="180" y="85" width="70" height="30" fill="#34d399" rx="6"></rect>
                    <text x="180" y="80" fill="#d1fae5">Cell body</text>
                    <rect x="280" y="95" width="160" height="10" fill="#f472b6"></rect>
                    <text x="300" y="80" fill="#fbcfe8">Axon</text>
                    <rect x="320" y="90" width="30" height="20" fill="#fde68a" rx="4"></rect>
                    <text x="320" y="130" fill="#fef3c7">Myelin</text>
                    <circle cx="480" cy="100" r="8" fill="#a5b4fc"></circle>
                    <text x="460" y="80" fill="#c7d2fe">Synapse</text>
                    <defs><marker id="arr" markerWidth="10" markerHeight="10" refX="10" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#fff"/></marker></defs>
                    <path d="M120,100 L180,100" stroke="#fff" marker-end="url(#arr)"/>
                    <path d="M250,100 L280,100" stroke="#fff" marker-end="url(#arr)"/>
                    <path d="M440,100 L472,100" stroke="#fff" marker-end="url(#arr)"/>
                  </svg>
                </div>
              </div>
            </div>
          `,
        },
        {
          title: "ระบบประสาทส่วนกลาง (CNS)",
          html: `
            <div class="panel">
              <div class="h3">สมองและไขสันหลัง</div>
              <p class="muted">สมองแบ่งเป็นหลายส่วน เช่น ซีรีบรัม ซีรีเบลลัม ก้านสมอง แต่ละส่วนมีหน้าที่ต่างกัน</p>
              <div class="grid-3" style="margin-top:8px;">
                <div class="panel"><div class="h3"><span style="display:inline-block;width:12px;height:12px;background:#60a5fa;border-radius:3px;margin-right:6px;"></span>ซีรีบรัม</div><p class="muted">คิด วิเคราะห์ รับรู้ความรู้สึก การเคลื่อนไหวสมัครใจ</p></div>
                <div class="panel"><div class="h3"><span style="display:inline-block;width:12px;height:12px;background:#34d399;border-radius:3px;margin-right:6px;"></span>ซีรีเบลลัม</div><p class="muted">การทรงตัว ประสานงานการเคลื่อนไหว</p></div>
                <div class="panel"><div class="h3"><span style="display:inline-block;width:12px;height:12px;background:#f472b6;border-radius:3px;margin-right:6px;"></span>ก้านสมอง</div><p class="muted">การหายใจ ชีพจร รีเฟล็กซ์สำคัญ</p></div>
              </div>
            </div>
          `,
        },
        {
          title: "ไขสันหลังและรีเฟล็กซ์",
          html: `
            <div class="grid-2">
              <div class="panel">
                <p class="muted">ไขสันหลังคือทางผ่านของสัญญาณระหว่างสมองและร่างกาย และควบคุมการตอบสนองอัตโนมัติที่เรียกว่า 'รีเฟล็กซ์' เช่น การกระตุกขาเมื่อถูกเคาะที่หัวเข่า</p>
              </div>
              <div class="panel"><img src="images/nervous.jpg" alt="spinal" style="width:100%; opacity:.6; border-radius:8px;"></div>
            </div>
          `,
        },
        {
          title: "ระบบประสาทรอบนอก (PNS)",
          html: `
            <div class="panel">
              <div class="h3">การแบ่งตามการทำงาน</div>
              <ul class="list-dot muted">
                <li><strong>ระบบประสาทโซมาติก (Somatic):</strong> ควบคุมการเคลื่อนไหวของกล้ามเนื้อลายที่อยู่ใต้อำนาจจิตใจ เช่น การเดิน การหยิบของ</li>
                <li><strong>ระบบประสาทอัตโนมัติ (Autonomic):</strong> ควบคุมอวัยวะภายในที่ทำงานนอกอำนาจจิตใจ เช่น หัวใจ ปอด กระเพาะอาหาร</li>
              </ul>
            </div>
          `,
        },
        {
          title: "ระบบประสาทอัตโนมัติ: ซิมพาเทติก vs พาราซิมพาเทติก",
          html: `
            <div class="grid-2">
                <div class="panel">
                    <div class="h3">ซิมพาเทติก (Sympathetic)</div>
                    <p class="muted">ทำงานในภาวะ "สู้หรือหนี" (Fight or Flight) เช่น เพิ่มอัตราการเต้นของหัวใจ ขยายรูม่านตา</p>
                </div>
                <div class="panel">
                    <div class="h3">พาราซิมพาเทติก (Parasympathetic)</div>
                    <p class="muted">ทำงานในภาวะ "พักและย่อย" (Rest and Digest) เช่น ลดอัตราการเต้นของหัวใจ กระตุ้นการย่อยอาหาร</p>
                </div>
            </div>
            `,
        },
      ],
    },
    respiratory: {
      name: "Respiratory System",
      bg: "bg-respiratory",
      pages: [
        {
          title: "ภาพรวมและขั้นตอนการหายใจ",
          html: `
            <div class="panel">
              <p class="muted">ระบบหายใจแลกเปลี่ยนแก๊ส O2 กับ CO2 ขั้นตอนหลัก 3 ขั้นตอน: (1) การระบายอากาศเข้าสู่ปอด (Ventilation) (2) การแลกเปลี่ยนแก๊สที่ถุงลม (External respiration) (3) การลำเลียงและแลกเปลี่ยนที่เนื้อเยื่อ (Internal respiration)</p>
            </div>
            <div class="pill" style="margin-top:12px;">พื้นหลัง 3D หายใจเคลื่อนไหว</div>
            <div class="breath-anim" style="margin-top:12px; height:160px; position:relative;">
              <div class="orb orb-blue" style="width:110px; height:110px; top:20px; left:20px; opacity:.6;"></div>
              <div class="orb orb-pink" style="width:120px; height:120px; top:30px; right:20px; opacity:.6;"></div>
            </div>
          `,
        },
        {
          title: "การแลกเปลี่ยนแก๊สที่ปอด",
          html: `
            <div class="grid-2">
              <div class="panel"><div class="h3">ถุงลมปอด (Alveoli)</div><p class="muted">เป็นโครงสร้างเล็กๆ ในปอดที่มีผนังบางมาก และมีเส้นเลือดฝอยล้อมรอบ ทำให้ออกซิเจนสามารถแพร่เข้าสู่เลือด และคาร์บอนไดออกไซด์แพร่ออกจากเลือดได้อย่างมีประสิทธิภาพ</p></div>
              <div class="panel"><img src="images/respiratory.jpg" alt="alveoli" style="width:100%; opacity:.6; border-radius:8px;"></div>
            </div>
          `,
        },
        {
          title: "ตารางเปรียบเทียบ ระหว่างหายใจเข้า-ออก",
          html: `
            <div class="panel" style="overflow-x:auto;">
              <table style="width:100%; border-collapse:collapse; color:#e6e6f0;">
                <thead><tr style="background:rgba(255,255,255,0.06)"><th style="padding:8px; border:1px solid rgba(255,255,255,0.1)">กลไก</th><th style="padding:8px; border:1px solid rgba(255,255,255,0.1)">หายใจเข้า (Inhalation)</th><th style="padding:8px; border:1px solid rgba(255,255,255,0.1)">หายใจออก (Exhalation)</th></tr></thead>
                <tbody>
                  <tr><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">กระบังลม</td><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">หดตัวและเลื่อนต่ำลง</td><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">คลายตัวและยกสูงขึ้น</td></tr>
                  <tr><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">กระดูกซี่โครง</td><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">ยกตัวสูงขึ้น</td><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">ลดตัวต่ำลง</td></tr>
                  <tr><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">ปริมาตรในช่องอก</td><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">เพิ่มขึ้น</td><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">ลดลง</td></tr>
                  <tr><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">ความดันในช่องอก</td><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">ลดลง (ต่ำกว่าบรรยากาศ)</td><td style="padding:6px; border:1px solid rgba(255,255,255,0.08)">เพิ่มขึ้น (สูงกว่าบรรยากาศ)</td></tr>
                </tbody>
              </table>
            </div>
          `,
        },
        {
          title: "การควบคุมการหายใจ",
          html: `
            <div class="panel">
                <p class="muted">การหายใจถูกควบคุมโดยศูนย์ควบคุมในสมองส่วนก้านสมอง (Brainstem) ซึ่งจะปรับอัตราการหายใจตามระดับคาร์บอนไดออกไซด์ในเลือดเป็นหลัก</p>
                <ul class="list-dot muted" style="margin-top:1rem;">
                    <li><strong>ระดับ CO2 สูง:</strong> กระตุ้นให้หายใจเร็วและลึกขึ้นเพื่อขับ CO2 ออก</li>
                    <li><strong>ระดับ CO2 ต่ำ:</strong> ทำให้หายใจช้าลง</li>
                </ul>
            </div>
            `,
        },
      ],
    },
    lymphatic: {
      name: "Lymphatics System",
      bg: "bg-lymphatic",
      pages: [
        {
          title: "ภาพรวมและองค์ประกอบ",
          html: `
            <div class="panel">
              <p class="muted">ระบบน้ำเหลืองช่วยระบายน้ำส่วนเกินจากเนื้อเยื่อ กลับสู่กระแสเลือด และมีบทบาทในภูมิคุ้มกัน ประกอบด้วย หลอดน้ำเหลือง ต่อมน้ำเหลือง ม้าม ต่อมไธมัส และน้ำเหลือง</p>
            </div>
          `,
        },
        {
          title: "การไหลของน้ำเหลืองและปัจจัย",
          html: `
            <div class="panel">
              <div class="h3">ปัจจัยที่ช่วยให้น้ำเหลืองไหลเวียน</div>
              <ul class="list-dot muted">
                <li>การบีบตัวของกล้ามเนื้อลายรอบหลอดน้ำเหลือง</li>
                <li>ลิ้นในหลอดน้ำเหลืองป้องกันการไหลย้อน</li>
                <li>ความดันจากการหายใจและการเคลื่อนไหวของร่างกาย</li>
              </ul>
              <p class="muted" style="margin-top:1rem;">ระบบนี้ไม่มีปั๊มโดยตรงเหมือนหัวใจในระบบไหลเวียนเลือด</p>
            </div>
          `,
        },
        {
          title: "อวัยวะในระบบน้ำเหลือง",
          html: `
            <div class="grid-3">
                <div class="panel">
                    <div class="h3">ต่อมน้ำเหลือง (Lymph Nodes)</div>
                    <p class="muted">ทำหน้าที่กรองน้ำเหลือง ดักจับเชื้อโรคและสิ่งแปลกปลอม มีเม็ดเลือดขาวชนิดลิมโฟไซต์อยู่เป็นจำนวนมาก</p>
                </div>
                <div class="panel">
                    <div class="h3">ม้าม (Spleen)</div>
                    <p class="muted">เป็นอวัยวะน้ำเหลืองที่ใหญ่ที่สุด กรองเลือด ทำลายเซลล์เม็ดเลือดแดงที่หมดอายุ และเป็นแหล่งสร้างลิมโฟไซต์</p>
                </div>
                <div class="panel">
                    <div class="h3">ต่อมไธมัส (Thymus)</div>
                    <p class="muted">อยู่บริเวณทรวงอก เป็นแหล่งที่เซลล์เม็ดเลือดขาว T-cell เจริญเติบโตและพัฒนาเต็มที่</p>
                </div>
            </div>
          `,
        },
        {
          title: "บทบาทในระบบภูมิคุ้มกัน",
          html: `
            <div class="panel">
                <p class="muted">ระบบน้ำเหลืองเป็นส่วนสำคัญของระบบภูมิคุ้มกัน โดยทำหน้าที่ผลิตและลำเลียงเซลล์เม็ดเลือดขาวเพื่อต่อสู้กับการติดเชื้อ</p>
                <ul class="list-dot muted" style="margin-top:1rem;">
                    <li><strong>การสร้างแอนติบอดี:</strong> B-cells ในต่อมน้ำเหลืองจะสร้างแอนติบอดีเพื่อต่อต้านเชื้อโรค</li>
                    <li><strong>การทำงานของ T-cells:</strong> T-cells ที่พัฒนาในต่อมไธมัสจะทำลายเซลล์ที่ติดเชื้อหรือเซลล์ที่ผิดปกติโดยตรง</li>
                </ul>
            </div>
            `,
        },
        {
          title: "ความสัมพันธ์กับระบบไหลเวียนเลือด",
          html: `
            <div class="panel">
                <p class="muted">ระบบน้ำเหลืองทำงานใกล้ชิดกับระบบไหลเวียนเลือด โดยจะรวบรวมของเหลว (น้ำเหลือง) ที่ซึมออกจากหลอดเลือดฝอยในเนื้อเยื่อ และนำกลับเข้าสู่กระแสเลือดอีกครั้ง ซึ่งช่วยรักษาสมดุลของเหลวในร่างกาย</p>
            </div>
            `,
        },
      ],
    },
  };

  function setBg(key) {
    bgEl.className = "lesson-bg";
    if (key) bgEl.classList.add(key);
  }

  function render() {
    const t = topics[state.topic];
    if (!t) return;
    const page = t.pages[state.index];
    titleEl.textContent = `${t.name}`;
    stepEl.textContent = `หน้า ${state.index + 1} / ${t.pages.length}`;
    contentEl.innerHTML =
      `<h3 class="h3" style="margin-bottom:8px;">${page.title}</h3>` +
      page.html;
    // Reset any dynamic bg
    clearBloodFlow();
    if (page.bgAnim === "flow") mountBloodFlow();
    if (typeof page.after === "function") setTimeout(page.after, 0);

    // Show/hide back button
    if (backBtn) {
      backBtn.style.display = state.index > 0 ? "inline-flex" : "none";
    }
  }

  function drawECG() {
    const el = document.getElementById("ecg");
    if (!el) return;
    const w = el.clientWidth || 600,
      h = el.clientHeight || 140;
    el.innerHTML = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" width="100%" height="100%">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ef4444"/><stop offset="1" stop-color="#f472b6"/></linearGradient>
      </defs>
      <path id="p" d="" fill="none" stroke="url(#g)" stroke-width="2"/>
    </svg>`;
    const p = el.querySelector("#p");
    // Generate a simple heartbeat-like path
    let d = "M0," + h / 2;
    const period = 120; // px per beat
    for (let x = 0; x < w; x++) {
      let y = h / 2 + Math.sin(x / 8) * 4;
      if (x % period === 20) {
        y = h * 0.2;
      }
      if (x % period === 24) {
        y = h * 0.8;
      }
      if (x % period === 28) {
        y = h * 0.25;
      }
      d += ` L${x},${y}`;
    }
    p.setAttribute("d", d);
  }

  function show(id) {
    // Toggle section visibility (guard if some sections don’t exist on this page)
    const homeEl = document.getElementById("home");
    const menuEl = document.getElementById("menu");
    if (homeEl) homeEl.style.display = id === "home" ? "flex" : "none";
    if (menuEl) menuEl.style.display = id === "menu" ? "block" : "none";
    if (sectionLesson)
      sectionLesson.style.display = id === "lesson" ? "block" : "none";
    if (sectionQuiz)
      sectionQuiz.style.display = id === "final-quiz" ? "block" : "none";

    // Force fade-in visibility when shown programmatically
    const map = {
      home: homeEl,
      menu: menuEl,
      lesson: sectionLesson,
      "final-quiz": sectionQuiz,
    };
    const shown = map[id];
    if (shown) {
      shown.classList.add("is-visible");
    }

    // If GSAP ScrollTrigger is available, refresh after layout changes
    if (
      typeof window !== "undefined" &&
      window.gsap &&
      window.ScrollTrigger &&
      typeof window.ScrollTrigger.refresh === "function"
    ) {
      // Delay to allow layout/style changes to apply before measuring
      window.gsap.delayedCall(0, () => window.ScrollTrigger.refresh());
    } else if (id === "menu") {
      // Non-GSAP fallback: ensure menu cards are visible
      document.querySelectorAll(".menu-card").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    }
  }

  window.goToMenu = function () {
    show("menu");
    // Close mobile menu if open
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    if (hamburger) hamburger.classList.remove("active");
    if (navMenu) navMenu.classList.remove("active");

    const menuEl = document.getElementById("menu");
    if (menuEl && typeof menuEl.scrollIntoView === "function") {
      requestAnimationFrame(() => {
        menuEl.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    // Update hash without jump
    if (history && history.pushState) {
      history.pushState(null, "", "#menu");
    } else if (typeof location !== "undefined") {
      location.hash = "#menu";
    }
  };
  window.startLesson = function (key) {
    state.topic = key;
    state.index = 0;
    setBg(topics[key]?.bg);
    show("lesson");
    render();
    nextBtn.style.display = "inline-flex"; // Ensure next button is visible
  };
  window.backToMenu = function () {
    show("menu");
  };

  window.prevPage = function () {
    if (state.index > 0) {
      state.index--;
      render();
      nextBtn.style.display = "inline-flex"; // Ensure next button is visible after going back
    }
  };

  window.nextPage = function () {
    const t = topics[state.topic];
    if (!t) return;
    if (state.index < t.pages.length - 1) {
      state.index++;
      render();
    } else {
      // End of lesson, show quiz button
      contentEl.innerHTML += `
            <div style="text-align: center; margin-top: 2rem;">
                <button class="cta-button" onclick="window.startTopicQuiz('${state.topic}', window.quizData['${state.topic}'])">
                    <i class="fas fa-award"></i>
                    เริ่มแบบทดสอบสำหรับ ${t.name}
                </button>
            </div>
        `;
      nextBtn.style.display = "none"; // Hide next button
    }
  };
  // Animated blood flow background
  function mountBloodFlow() {
    const wrap = document.createElement("div");
    wrap.className = "blood-flow";
    for (let i = 0; i < 18; i++) {
      const cell = document.createElement("div");
      const t = Math.random();
      cell.className =
        "cell " + (t < 0.6 ? "rbc" : t < 0.9 ? "wbc" : "platelet");
      cell.style.top = Math.random() * 80 + 5 + "%";
      cell.style.animationDuration = Math.random() * 8 + 6 + "s";
      cell.style.animationDelay = -Math.random() * 8 + "s";
      wrap.appendChild(cell);
    }
    contentEl.style.position = "relative";
    contentEl.appendChild(wrap);
  }
  function clearBloodFlow() {
    const old = contentEl.querySelector(".blood-flow");
    if (old) old.remove();
  }

  // Expose topics so other pages (e.g., dedicated full pages) can reuse lesson content
  window.lessonTopics = topics;

  window.show = show;
})();
