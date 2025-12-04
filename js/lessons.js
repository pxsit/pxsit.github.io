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
                  <li><strong>Arteries</strong> นำเลือดออกจากหัวใจ ผนังหนา ยืดหยุ่น ความดันสูง</li>
                  <li><strong>Veins</strong> นำเลือดกลับสู่หัวใจ มีลิ้นกันเลือดไหลย้อน ความดันต่ำกว่า</li>
                  <li><strong>Capillaries</strong> เส้นเลือดฝอย ผนังบางมาก เหมาะกับการแลกเปลี่ยนแก๊ส/สารอาหาร</li>
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
                  <img src="/assests/ecg.png" alt="ECG graph" loading="lazy" style="position:absolute; inset:0; width:100%; height:100%; object-fit:contain;" />
                </div>
                <p class="muted" style="margin-top:8px;">เส้นกราฟจำลองรูปแบบการเต้น (ไม่ใช่สัญญาณทางการแพทย์จริง)</p>
              </div>
            </div>
          `,
                },
                {
                    title: "การไหลเวียนของเลือดผ่านหัวใจ",
                    html: `
            <div class="panel">
              <div class="h3">แผนภาพหัวใจ</div>
              <p class="muted">แสดงทิศทางการไหล: เลือดดำจากร่างกาย → หัวใจขวา → ปอด → เลือดแดงกลับหัวใจซ้าย → ส่งไปเลี้ยงร่างกาย ลูกศรจะชี้ชื่อหลอดเลือดหลัก</p>
              <div style="height:260px; position:relative; margin-top:8px; border-radius:12px; overflow:hidden;">
                <img alt="heart" src="/assests/circulatory-diagram.png" loading="lazy" style="position:absolute; inset:0; width:100%; height:100%; object-fit:contain; object-position:center; box-sizing:border-box;">
              </div>
            </div>
          `,
                },
                {
                    title: "ระบบไหลเวียนเล็ก/ใหญ่ (Pulmonary/Systemic)",
                    html: `
            <div class="grid-2">
              <div class="panel"><div class="h3">Pulmonary</div><p class="muted">หัวใจขวา → ปอด → หัวใจซ้าย เพื่อแลกเปลี่ยนแก๊ส</p></div>
              <div class="panel"><div class="h3">Systemic</div><p class="muted">หัวใจซ้าย → ร่างกาย → หัวใจขวา เพื่อส่งออกซิเจนและรับของเสีย</p></div>
            </div>
          `,
                },
                {
                    title: "วัฏจักรการเต้นของหัวใจ (Cardiac cycle)",
                    html: `
            <div class="panel">
              <ul class="list-dot muted">
                <li><strong>Systole:</strong> การบีบตัวของหัวใจ ส่งเลือดออกจากโพรง</li>
                <li><strong>Diastole:</strong> การคลายตัว รับเลือดเข้าสู่หัวใจ</li>
                <li>เสียงหัวใจ S1/S2 เกี่ยวข้องกับการปิดลิ้นหัวใจ</li>
              </ul>
            </div>
          `,
                },
                {
                    title: "ระบบนำไฟฟ้าหัวใจ (Cardiac conduction) และ SA node (Pacemaker)",
                    html: `
            <div class="panel">
              <div class="h3">ใครเป็นตัวกำหนดจังหวะหัวใจ?</div>
              <p class="muted"><strong>SA node</strong> (sinoatrial node) คือ <em>ตัวกระตุ้นการเต้นของหัวใจตามธรรมชาติ (Natural pacemaker)</em> สร้างสัญญาณไฟฟ้าเริ่มต้นที่ห้องบนขวา แล้วแพร่ไปทั่วเอเทรียม</p>
              <div class="h3" style="margin-top:8px;">ลำดับการนำสัญญาณ</div>
              <ul class="list-dot muted">
                <li><strong>SA node</strong> → กระจายทั่วเอเทรียม ทำให้ห้องบนบีบตัว</li>
                <li>สัญญาณถึง <strong>AV node</strong> (หน่วงสั้นๆ เพื่อให้ห้องบนส่งเลือดลงห้องล่าง)</li>
                <li>ผ่าน <strong>Bundle of His</strong> → แตกเป็น <strong>Right/Left bundle branches</strong></li>
                <li>กระจายตาม <strong>Purkinje fibers</strong> ทำให้โพรงหัวใจบีบตัวพร้อมกัน</li>
              </ul>
              <div class="h3" style="margin-top:8px;">การควบคุมจากระบบประสาทอัตโนมัติ</div>
              <p class="muted">ซิมพาเทติกทำให้เต้นเร็วขึ้น พาราซิมพาเทติกทำให้ช้าลง แต่ <strong>SA node</strong> ยังคงเป็นแหล่งจังหวะหลัก</p>
            </div>
          `,
                },
                {
                    title: "การควบคุมความดันโลหิต",
                    html: `
            <div class="panel">
              <ul class="list-dot muted">
                <li><strong>Baroreceptor reflex:</strong> ปรับอัตราหัวใจและหลอดเลือดทันที</li>
                <li><strong>Renin–Angiotensin–Aldosterone:</strong> ควบคุมปริมาตรเลือดระยะยาว</li>
                <li>ระบบประสาทอัตโนมัติ: ซิมพาเทติกหดหลอดเลือด เพิ่มความดัน</li>
              </ul>
            </div>
          `,
                },
                {
                    title: "โรคที่เกี่ยวข้องกับระบบไหลเวียนเลือด",
                    html: `
            <div class="panel">
              <div class="h3">โรคที่พบบ่อย</div>
              <ul class="list-dot muted">
                <li><strong>ความดันโลหิตสูง (Hypertension):</strong> เสี่ยงโรคหัวใจและหลอดเลือดสมอง</li>
                <li><strong>โรคหลอดเลือดหัวใจ (CAD):</strong> หลอดเลือดตีบ/ตัน ทำให้กล้ามเนื้อหัวใจขาดเลือด</li>
                <li><strong>ภาวะหัวใจล้มเหลว:</strong> สูบฉีดเลือดได้ไม่เพียงพอ</li>
              </ul>
            </div>
          `,
                },
                {
                    title: "การดูแลป้องกัน",
                    html: `
            <div class="panel">
              <ul class="list-dot muted">
                <li>ออกกำลังกายสม่ำเสมอ เลือกรับประทานอาหารที่ดีต่อหัวใจ</li>
                <li>ควบคุมน้ำหนัก ลดเค็ม เลิกสูบบุหรี่</li>
                <li>ตรวจสุขภาพและวัดความดันอย่างสม่ำเสมอ</li>
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
              <p class="muted">ระบบประสาททำหน้าที่รับข้อมูล ประมวลผล และสั่งการ ประกอบด้วย <strong>ระบบประสาทส่วนกลาง (CNS)</strong> คือ สมองและไขสันหลัง และ <strong>ระบบประสาทรอบนอก (PNS)</strong> คือ เส้นประสาททั่วร่างกาย</p>
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
                <div class="h3">ภาพประกอบ</div>
                <div style="height:200px; position:relative; border-radius:8px;">
                  <img src="/assests/neurons.jpg" alt="neuron" style="position:absolute; inset:0; width:100%; height:100%; object-fit:contain; object-position:center; box-sizing:border-box; padding:8px;">
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
                <div class="panel">
                  <div class="h3">
                    <span style="display:inline-block;width:12px;height:12px;background:#60a5fa;border-radius:3px;margin-right:6px;">
                      </span>ซีรีบรัม
                        </div>
                          <p class="muted">คิด วิเคราะห์ รับรู้ความรู้สึก การเคลื่อนไหวสมัครใจ</p>
                        </div>
                <div class="panel"><div class="h3"><span style="display:inline-block;width:12px;height:12px;background:#f472b6;border-radius:3px;margin-right:6px;"></span>ซีรีเบลลัม</div><p class="muted">การทรงตัว ประสานงานการเคลื่อนไหว</p></div>
                <div class="panel"><div class="h3"><span style="display:inline-block;width:12px;height:12px;background:#805253;border-radius:3px;margin-right:6px;"></span>ก้านสมอง</div><p class="muted">การหายใจ ชีพจร รีเฟล็กซ์สำคัญ</p></div>
              </div>
            </div>
          `,
                },
                {
                    title: "ก้านสมอง (Brainstem): Midbrain / Pons / Medulla",
                    html: `
            <div class="grid-3">
              <div class="panel">
                <div class="h3">Midbrain (สมองส่วนกลาง)</div>
                <ul class="list-dot muted">
                  <li>ควบคุมรีเฟล็กซ์ด้านการมองเห็น/การได้ยิน (เช่น หันตามเสียง/แสง)</li>
                  <li>เป็นทางผ่านของใยประสาทมอเตอร์สำคัญ</li>
                  <li>เกี่ยวข้องกับการเริ่มการเคลื่อนไหว</li>
                </ul>
              </div>
              <div class="panel">
                <div class="h3">Pons (พอนส์)</div>
                <ul class="list-dot muted">
                  <li>เป็น “สะพาน” เชื่อมสมองหลายส่วน</li>
                  <li>ช่วยควบคุมจังหวะการหายใจ</li>
                  <li>ที่มาของเส้นประสาทสมองบางคู่</li>
                </ul>
              </div>
              <div class="panel">
                <div class="h3">Medulla oblongata (เมดัลลา)</div>
                <ul class="list-dot muted">
                  <li>ศูนย์ควบคุมสำคัญ: หัวใจ หลอดเลือด การหายใจ</li>
                  <li>รีเฟล็กซ์: ไอ จาม อาเจียน กลืน</li>
                  <li>จุดไขว้เส้นใยมอเตอร์หลัก (pyramidal decussation)</li>
                </ul>
              </div>
            </div>
          `,
                },
                {
                    title: "ไดเอนเซฟาลอน (Diencephalon): Thalamus & Hypothalamus",
                    html: `
            <div class="grid-2">
              <div class="panel">
                <div class="h3">Thalamus</div>
                <p class="muted">ศูนย์ถ่ายทอดสัญญาณรับความรู้สึกส่วนใหญ่ไปยังซีรีบรัม มีบทบาทในการตื่นตัว/ความสนใจ</p>
              </div>
              <div class="panel">
                <div class="h3">Hypothalamus</div>
                <ul class="list-dot muted">
                  <li>ควบคุมอุณหภูมิ หิว กระหาย นาฬิกาชีวภาพ</li>
                  <li>เชื่อมโยงระบบประสาท-ต่อมไร้ท่อ (ควบคุมต่อมใต้สมอง)</li>
                  <li>เกี่ยวข้องกับอารมณ์และแรงจูงใจ</li>
                </ul>
              </div>
            </div>
          `,
                },
                {
                    title: "ซีรีบรัม: ตีความตามกลีบสมอง",
                    html: `
            <div class="grid-2">
              <div class="panel">
                <div class="h3">กลีบหน้าผาก (Frontal)</div>
                <p class="muted">การวางแผน เหตุผล บุคลิกภาพ มอเตอร์สมัครใจ</p>
                <div class="h3" style="margin-top:8px;">กลีบข้าง (Parietal)</div>
                <p class="muted">สัมผัส อุณหภูมิ ความเจ็บปวด การรับรู้ตำแหน่งร่างกาย</p>
              </div>
              <div class="panel">
                <div class="h3">กลีบขมับ (Temporal)</div>
                <p class="muted">การได้ยิน ความจำ ภาษา (เวอร์นิเก้)</p>
                <div class="h3" style="margin-top:8px;">กลีบท้ายทอย (Occipital)</div>
                <p class="muted">การมองเห็นและตีความภาพ</p>
              </div>
            </div>
          `,
                },
                {
                    title: "ระบบลิมบิก (Limbic) และปมประสาทฐาน (Basal ganglia)",
                    html: `
            <div class="grid-2">
              <div class="panel">
                <div class="h3">Limbic system</div>
                <ul class="list-dot muted">
                  <li>เกี่ยวข้องกับอารมณ์ ความจำ แรงจูงใจ</li>
                  <li>โครงสร้างสำคัญ: ฮิปโปแคมปัส อะมิกดะลา ซิงกูเลตไจรัส</li>
                </ul>
              </div>
              <div class="panel">
                <div class="h3">Basal ganglia</div>
                <ul class="list-dot muted">
                  <li>ควบคุมการเริ่ม/ความราบรื่นของการเคลื่อนไหว</li>
                  <li>ความผิดปกติเกี่ยวข้องกับพาร์กินสัน/ฮันติงตัน</li>
                </ul>
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
              <div class="panel"><img src="/assests/spinal-cord.png" alt="spinal" style="width:100%; border-radius:8px;"></div>
            </div>
          `,
                },
                {
                    title: "เซลล์เกลีย (Glial cells)",
                    html: `
            <div class="grid-2">
              <div class="panel">
                <div class="h3">ชนิดหลัก</div>
                <ul class="list-dot muted">
                  <li><strong>Astrocytes</strong> รองรับเซลล์ประสาท รักษาสมดุลสารเคมี</li>
                  <li><strong>Oligodendrocytes / Schwann cells</strong> สร้างไมอีลินใน CNS/PNS</li>
                  <li><strong>Microglia</strong> ภูมิคุ้มกันในสมอง เก็บกินเศษเซลล์</li>
                  <li><strong>Ependymal cells</strong> บุโพรงสมอง เกี่ยวข้องกับน้ำไขสันหลัง</li>
                </ul>
              </div>
              <div class="panel">
                <div class="h3">ความสำคัญ</div>
                <p class="muted">เกลียมีบทบาทต่อการส่งสัญญาณ การฟื้นฟู และโรคทางระบบประสาทหลายชนิด</p>
              </div>
            </div>
          `,
                },
                {
                    title: "ศักย์ไฟฟ้าและไซแนปส์",
                    html: `
            <div class="panel">
              <div class="h3">ศักย์ไฟฟ้า (Action potential)</div>
              <ul class="list-dot muted">
                <li>การไหลของ Na+/K+ ทำให้ขั้วเซลล์เปลี่ยนชั่วคราวตามแอกซอน</li>
                <li>ไมอีลินช่วยให้ส่งสัญญาณแบบกระโดด (saltatory) เร็วขึ้น</li>
              </ul>
              <div class="h3" style="margin-top:8px;">ไซแนปส์เคมี</div>
              <p class="muted">สัญญาณไฟฟ้าถูกแปลงเป็นสารสื่อประสาท ปล่อยในช่องไซแนปส์ไปจับตัวรับของเซลล์ถัดไป</p>
            </div>
          `,
                },
                {
                    title: "ระบบประสาทรอบนอก (PNS)",
                    html: `
            <div class="panel">
              <div class="h3">การแบ่งตามการทำงาน</div>
              <ul class="list-dot muted">
                <li><strong>โซมาติก (Somatic):</strong> ควบคุมกล้ามเนื้อลาย ภายใต้อำนาจจิตใจ</li>
                <li><strong>อัตโนมัติ (Autonomic):</strong> ควบคุมอวัยวะภายใน นอกอำนาจจิตใจ</li>
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
                <p class="muted">สู้หรือหนี (Fight/Flight): หัวใจเต้นเร็ว รูม่านตาขยาย หลั่งอะดรีนาลีน</p>
              </div>
              <div class="panel">
                <div class="h3">พาราซิมพาเทติก (Parasympathetic)</div>
                <p class="muted">พักและย่อย (Rest/Digest): หัวใจช้าลง กระตุ้นการย่อย</p>
              </div>
            </div>
          `,
                },
                {
                    title: "สารสื่อประสาทสำคัญ",
                    html: `
            <div class="grid-3">
              <div class="panel"><div class="h3">Acetylcholine</div><p class="muted">การหดตัวของกล้ามเนื้อ และพาราซิมพาเทติก</p></div>
              <div class="panel"><div class="h3">Glutamate / GABA</div><p class="muted">กระตุ้นหลัก vs ยับยั้งหลักใน CNS</p></div>
              <div class="panel"><div class="h3">Dopamine / Serotonin</div><p class="muted">อารมณ์ การให้รางวัล การนอนหลับ</p></div>
            </div>
          `,
                },
                {
                    title: "การปกป้องสมอง: Meninges, CSF, BBB",
                    html: `
            <div class="panel">
              <ul class="list-dot muted">
                <li><strong>Meninges:</strong> Dura, Arachnoid, Pia ป้องกันและรองรับ</li>
                <li><strong>CSF:</strong> ลดแรงกระแทก ควบคุมสิ่งแวดล้อม</li>
                <li><strong>Blood-brain barrier:</strong> คัดกรองสารที่จะเข้าสู่สมอง</li>
              </ul>
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
              <p class="muted">ระบบหายใจแลกเปลี่ยนแก๊ส O2 กับ CO2 ขั้นตอนหลัก 3 ขั้นตอน: (1) Ventilation (2) การแลกเปลี่ยนที่ถุงลม (External) (3) การลำเลียง/แลกเปลี่ยนที่เนื้อเยื่อ (Internal)</p>
            </div>
          `,
                },
                {
                    title: "กายวิภาคทางเดินหายใจ",
                    html: `
            <div class="grid-2">
              <div class="panel">
                <div class="h3">โครงสร้างหลัก</div>
                <ul class="list-dot muted">
                  <li>โพรงจมูก คอหอย กล่องเสียง</li>
                  <li>หลอดลม หลอดลมแขนง และหลอดลมฝอย</li>
                  <li>ถุงลมปอด (Alveoli) และเส้นเลือดฝอย</li>
                </ul>
              </div>
              <div class="panel">
                <div class="h3">หน้าที่</div>
                <p class="muted">กรอง อุ่น ทำให้อากาศชื้น แลกเปลี่ยนแก๊สที่ผนังถุงลม-เส้นเลือดฝอย</p>
              </div>
            </div>
          `,
                },
                {
                    title: "การแลกเปลี่ยนแก๊สที่ปอด",
                    html: `
            <div class="grid-2">
              <div class="panel"><div class="h3">ถุงลมปอด (Alveoli)</div><p class="muted">ผนังบางมาก มีเส้นเลือดฝอยล้อมรอบ ทำให้ O2 แพร่เข้าสู่เลือด และ CO2 แพร่ออกจากเลือดได้ดี</p></div>
              <div class="panel"><img src="/assests/alveoli.jpg" alt="alveoli" style="width:100%; opacity:.6; border-radius:8px;"></div>
            </div>
          `,
                },
                {
                    title: "กลไกการหายใจ: ความยืดหยุ่นและสารลดแรงตึงผิว",
                    html: `
            <div class="panel">
              <ul class="list-dot muted">
                <li><strong>Compliance</strong> ความยืดหยุ่นของปอดและผนังทรวงอก</li>
                <li><strong>Surfactant</strong> ลดแรงตึงผิวในถุงลม ช่วยป้องกันถุงลมแฟบ</li>
                <li>แรงดันลบในช่องเยื่อหุ้มปอดช่วยให้ปอดขยายตัว</li>
              </ul>
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
              <p class="muted">ก้านสมองควบคุมจังหวะหายใจ โดยระดับ CO2 เป็นตัวกระตุ้นหลัก</p>
              <ul class="list-dot muted" style="margin-top:1rem;">
                <li><strong>CO2 สูง:</strong> หายใจเร็ว/ลึกขึ้นเพื่อขับ CO2</li>
                <li><strong>CO2 ต่ำ:</strong> หายใจช้าลง</li>
              </ul>
            </div>
          `,
                },
                {
                    title: "การขนส่งแก๊สในเลือด",
                    html: `
            <div class="grid-2">
              <div class="panel">
                <div class="h3">ออกซิเจน</div>
                <p class="muted">ส่วนใหญ่จับกับฮีโมโกลบิน (Hb) ที่เม็ดเลือดแดง</p>
              </div>
              <div class="panel">
                <div class="h3">คาร์บอนไดออกไซด์</div>
                <p class="muted">ส่วนใหญ่ขนส่งเป็นไบคาร์บอเนต (HCO3-) ในพลาสมา ส่วนหนึ่งจับกับ Hb</p>
              </div>
            </div>
          `,
                },
                {
                    title: "โรคระบบหายใจที่พบบ่อย",
                    html: `
            <div class="panel">
              <ul class="list-dot muted">
                <li><strong>หืด (Asthma):</strong> หลอดลมหดเกร็งและอักเสบ หายใจลำบาก</li>
                <li><strong>ปอดบวม (Pneumonia):</strong> การอักเสบติดเชื้อของถุงลม</li>
                <li><strong>COPD:</strong> ถุงลมเสียหายเรื้อรัง การแลกเปลี่ยนแก๊สลดลง</li>
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
              <p class="muted" style="margin-top:1rem;">ระบบนี้ไม่มีปั๊มโดยตรงเหมือนหัวใจ</p>
            </div>
          `,
                },
                {
                    title: "การก่อตัวของน้ำเหลือง",
                    html: `
            <div class="panel">
              <p class="muted">น้ำส่วนเกินซึมออกจากเส้นเลือดฝอยเข้าสู่ช่องว่างเนื้อเยื่อ กลายเป็นน้ำเนื้อเยื่อ และถูกดูดกลับเข้าหลอดน้ำเหลือง</p>
            </div>
          `,
                },
                {
                    title: "การดูดซึมไขมันและ Chyle (แลคเทียล)",
                    html: `
            <div class="panel">
              <div class="h3">แลคเทียล (Lacteals)</div>
              <p class="muted">ภายในวิลลัสของลำไส้เล็กมีหลอดน้ำเหลืองขนาดเล็กเรียกว่า <strong>lacteals</strong> ทำหน้าที่ดูดซึมไขมัน (chylomicrons) ที่ดูดซึมจากเยื่อบุลำไส้</p>
              <div class="h3" style="margin-top:8px;">Chyle คืออะไร?</div>
              <p class="muted"><strong>Chyle</strong> คือ น้ำเหลืองที่มีไขมันสูง มีลักษณะขาวคล้ายน้ำนม ไหลจากลำไส้เข้าสู่ท่อน้ำเหลืองช่องท้อง รวมตัวที่ <em>cisterna chyli</em> แล้วไหลขึ้น <strong>thoracic duct</strong> ไปเปิดที่ <em>left venous angle</em></p>
            </div>
          `,
                },
                {
                    title: "เส้นทางหลัก: Thoracic duct และ Right lymphatic duct",
                    html: `
            <div class="grid-2">
              <div class="panel"><div class="h3">Thoracic duct</div><p class="muted">รับน้ำเหลืองจากส่วนใหญ่ของร่างกาย เทเข้าสู่หลอดเลือดดำใต้ไหปลาร้าซ้าย</p></div>
              <div class="panel"><div class="h3">Right lymphatic duct</div><p class="muted">รับจากขวาส่วนบนของร่างกาย เทเข้าหลอดเลือดดำใต้ไหปลาร้าขวา</p></div>
            </div>
          `,
                },
                {
                    title: "อวัยวะในระบบน้ำเหลือง",
                    html: `
            <div class="grid-3">
              <div class="panel">
                <div class="h3">ต่อมน้ำเหลือง (Lymph Nodes)</div>
                <p class="muted">กรองน้ำเหลือง ดักจับเชื้อโรค มีลิมโฟไซต์จำนวนมาก</p>
              </div>
              <div class="panel">
                <div class="h3">ม้าม (Spleen)</div>
                <p class="muted">กรองเลือด ทำลาย RBC ที่หมดอายุ สร้างลิมโฟไซต์</p>
              </div>
              <div class="panel">
                <div class="h3">ต่อมไธมัส (Thymus)</div>
                <p class="muted">ที่ T-cell เจริญเติบโตและพัฒนา</p>
              </div>
            </div>
          `,
                },
                {
                    title: "เนื้อเยื่อน้ำเหลือง: Tonsils และ MALT",
                    html: `
            <div class="panel">
              <p class="muted">เนื้อเยื่อน้ำเหลืองกระจาย (MALT) และทอนซิลช่วยดักจับเชื้อโรคที่เข้าสู่ร่างกายผ่านทางเดินอาหารและทางเดินหายใจ</p>
            </div>
          `,
                },
                {
                    title: "บทบาทในระบบภูมิคุ้มกัน",
                    html: `
            <div class="panel">
              <ul class="list-dot muted">
                <li><strong>การสร้างแอนติบอดี:</strong> B-cells ในต่อมน้ำเหลืองสร้างแอนติบอดี</li>
                <li><strong>การทำงานของ T-cells:</strong> ทำลายเซลล์ติดเชื้อหรือผิดปกติโดยตรง</li>
              </ul>
            </div>
          `,
                },
                {
                    title: "ความสัมพันธ์กับระบบไหลเวียนเลือด",
                    html: `
            <div class="panel">
              <p class="muted">รวบรวมน้ำเหลืองจากเนื้อเยื่อกลับเข้าสู่กระแสเลือด ช่วยรักษาสมดุลของเหลว</p>
            </div>
          `,
                },
                {
                    title: "ภาวะบวมน้ำ (Edema) และโรคที่เกี่ยวข้อง",
                    html: `
            <div class="panel">
              <ul class="list-dot muted">
                <li><strong>Lymphedema:</strong> น้ำเหลืองระบายไม่ดี ทำให้บวมเรื้อรัง</li>
                <li><strong>การติดเชื้อของต่อมน้ำเหลือง:</strong> ต่อมโต เจ็บ</li>
              </ul>
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

        const map = {
            home: homeEl,
            menu: menuEl,
            lesson: sectionLesson,
            "final-quiz": sectionQuiz,
        };
        const shown = map[id];
        if (shown) shown.classList.add("is-visible");

        if (
            typeof window !== "undefined" &&
            window.gsap &&
            window.ScrollTrigger &&
            typeof window.ScrollTrigger.refresh === "function"
        ) {
            window.gsap.delayedCall(0, () => window.ScrollTrigger.refresh());
        } else if (id === "menu") {
            document.querySelectorAll(".menu-card").forEach((el) => {
                el.style.opacity = "1";
                el.style.transform = "none";
            });
        }
    }

    window.goToMenu = function () {
        show("menu");
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
        nextBtn.style.display = "inline-flex";
    };

    window.backToMenu = function () {
        show("menu");
    };

    window.prevPage = function () {
        if (state.index > 0) {
            state.index--;
            render();
            nextBtn.style.display = "inline-flex";
        }
    };

    window.nextPage = function () {
        const t = topics[state.topic];
        if (!t) return;
        if (state.index < t.pages.length - 1) {
            state.index++;
            render();
        } else {
            contentEl.innerHTML += `
            <div style="text-align: center; margin-top: 2rem;">
              <button class="cta-button" onclick="window.startTopicQuiz('${state.topic}')">
                <i class="fas fa-award"></i>
                เริ่มแบบทดสอบสำหรับ ${t.name}
              </button>
            </div>`;
            nextBtn.style.display = "none";
        }
    };

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

    window.lessonTopics = topics;
    window.show = show;
})();
