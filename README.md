# Sukjai Club (สุขใจ คลับ) — ระบบบัตรสมาชิกดิจิทัล LINE LIFF

เว็บแอปพลิเคชันบัตรสมาชิกดิจิทัล (Member Profile) สำหรับเปิดใช้งานผ่าน **LINE Front-end Framework (LIFF)** จากริชเมนู (Rich Menu) ของ LINE Official Account (LINE OA) ออกแบบตามสถาปัตยกรรม **"LINE Data Only, No Database"** รองรับการ Deploy บน **Vercel** แบบ Serverless 100%

🌐 **Live Demo (Production):** [https://sukjai-club-line-member.vercel.app](https://sukjai-club-line-member.vercel.app)

---

## 1. ภาพรวมแอปพลิเคชันและสิ่งที่สมาชิกเห็น

เมื่อลูกค้ากดปุ่ม "บัตรสมาชิก" จากห้องแชท LINE OA หน้าต่าง LIFF จะเปิดขึ้นมาภายในแอป LINE ทันที โดยลูกค้าจะเห็น:
1. **รูปโปรไฟล์ LINE ของตนเอง (LINE Profile Picture)**: แสดงในกรอบวงกลมขนาด 88px พร้อมขอบสีขาวและเงาสะท้อนระดับพรีเมียม (หากไม่มีรูปใน LINE ระบบจะแสดงภาพ Silhouette สีเทาสุภาพ ไม่แสดงภาพแตก)
2. **ชื่อบัญชี LINE (LINE Display Name)**: แสดงตัวหนาขนาด 22px คมชัด รองรับชื่อยาวและการตัดคำภาษาไทย รวมถึงชื่อที่เป็นอิโมจิล้วน
3. **ข้อความสถานะ (Status Message)**: แสดงข้อความสถานะของ LINE (หากลูกค้าไม่ได้ตั้งไว้ ระบบจะซ่อนส่วนนี้อย่างแนบเนียนโดยไม่ทิ้งช่องว่าง)
4. **หมายเลขสมาชิก (Member Number)**: รหัสสมาชิกรูปแบบ `MB-XXXX-XXXX` คำนวณจากบัญชี LINE ของลูกค้าโดยตรง พร้อมปุ่มกดคัดลอก (Copy) ขนาด 48x48px ที่กดแล้วมีข้อความแจ้งเตือน "คัดลอกหมายเลขสมาชิกแล้ว"
5. **ปุ่มการทำงาน (Actions)**: ปุ่ม "รีเฟรชข้อมูล" (สูง 52px สัมผัสง่าย) และปุ่ม "ปิดหน้าต่าง" (เรียก `liff.closeWindow()`)

> ♿ **การออกแบบเพื่อผู้ใช้งานทุกวัย (อายุ 20–60 ปี)**: ตัวอักษรเนื้อหาหลักไม่เล็กกว่า 16px, ป้ายกำกับไม่เล็กกว่า 14px, ปุ่มกดขนาดใหญ่ 48–52px, และค่าความเปรียบต่างสี (Color Contrast Ratio) ผ่านมาตรฐาน WCAG AAA (>= 7:1) ทำให้อ่านง่ายแม้อยู่กลางแจ้ง

---

## 2. ขั้นตอนการทำงาน: จากการแตะใน LINE สู่บัตรสมาชิก

```
[ ลูกค้าใน LINE ]             [ LIFF Webview ]          [ Serverless API ]         [ เซิร์ฟเวอร์ LINE ]
      │                              │                          │                           │
  1. แตะปุ่มในริชเมนู                │                          │                           │
      ├─────────────────────────────>│                          │                           │
      │   (https://liff.line.me/...) │                          │                           │
      │                              │                          │                           │
      │                         2. liff.init()                  │                           │
      │                              ├──────────────────────────┼──────────────────────────>│
      │                              │<─────────────────────────┼───────────────────────────┤
      │                              │                          │                           │
      │                         3. liff.getProfile()            │                           │
      │                            liff.getIDToken()            │                           │
      │                              ├──────────────────────────┼──────────────────────────>│
      │                              │<─────────────────────────┼───────────────────────────┤
      │                              │  (ID Token JWT)          │                           │
      │                              │                          │                           │
      │                         4. POST /api/member             │                           │
      │                            { idToken }                  │                           │
      │                              ├─────────────────────────>│                           │
      │                              │                          │                           │
      │                              │                          │ 5. ตรวจสอบ Token          │
      │                              │                          │    POST /oauth2/v2.1/verify
      │                              │                          │├─────────────────────────>│
      │                              │                          ││ (id_token & client_id)   │
      │                              │                          │<─────────────────────────┤
      │                              │                          │  คืนค่า: sub (User ID)    │
      │                              │                          │                           │
      │                              │                          │ 6. คำนวณหมายเลขสมาชิก     │
      │                              │                          │    SHA-256(sub) % 10^8    │
      │                              │                          │    -> MB-XXXX-XXXX        │
      │                              │                          │                           │
      │                              │ 7. คืนค่า JSON           │                           │
      │                              │<─────────────────────────┤                           │
      │                              │                          │                           │
      │  8. แสดงผลบัตรสมาชิก         │                          │                           │
      │<─────────────────────────────┤                          │                           │
```

---

## 3. โครงสร้างไฟล์ในโปรเจกต์

```text
demo/
├── vercel.json                 # คอนฟิก Vercel Deployment (cleanUrls: true)
├── .vercelignore               # ระบุไฟล์ที่ไม่ต้องอัปโหลดขึ้น Vercel Function
├── package.json                # Project Manifest (npm start, npm test, Zero Dependencies)
├── server.js                   # Node.js HTTP Server สำหรับรันในเครื่อง (ใช้ Handler เดียวกับ Vercel)
├── README.md                   # คู่มือระบบและขั้นตอนการติดตั้งฉบับสมบูรณ์
├── design.md                   # เอกสาร Design Specification อ้างอิง
├── config.json                 # ไฟล์ตั้งค่าสำหรับ Localhost (เมื่อไม่ใช้ ENV)
├── api/
│   ├── config.js               # Vercel Function: GET /api/config (ตรวจสอบสถานะ LIFF ID)
│   └── member.js               # Vercel Function: POST /api/member (ยืนยัน Token และคำนวณรหัสสมาชิก)
├── public/
│   ├── index.html              # โครงสร้างหน้าเว็บ Semantic HTML รองรับทั้ง 5 สถานะ
│   ├── style.css               # สไตล์ชีต CSS กำหนดตาม Design Tokens (--mb-*) และเกณฑ์ A11y
│   ├── app.js                  # โค้ด JavaScript จัดการ LIFF SDK และ Preview Controller
│   └── images/
│       └── sample-avatar.svg   # ภาพโปรไฟล์การ์ตูนตัวอย่างสำหรับโหมด Preview
└── test/
    └── server.test.js          # ชุดทดสอบอัตโนมัติ (Automated Tests ครอบคลุม 18 รายการ)
```

---

## 4. การรันบนเครื่อง Localhost และโหมดดูตัวอย่าง (Preview Mode)

### คำสั่งรันในเครื่อง
```bash
npm start
# หรือ node server.js
```
เปิดเบราว์เซอร์ไปที่: **`http://localhost:3000`**

### โหมดดูตัวอย่าง (Preview Mode)
เมื่อเซิร์ฟเวอร์ยังไม่ได้ตั้งค่า LIFF ID (ค่าใน `config.json` หรือ Environment Variables เป็นค่าว่าง) หรือเปิดด้วยพารามิเตอร์ `?preview=true` หน้าเว็บจะเข้าสู่ **Preview Mode** โดยอัตโนมัติ:
- มีแถบสีส้มด้านบนระบุชัดเจนว่าเป็น **"โหมดดูตัวอย่าง (Preview Mode) — DEMO DATA"**
- **สลับดูได้ครบทั้ง 5 สถานะ**:
  1. *สมาชิกเข้าสู่ระบบปกติ (Signed-In)*: แสดงรูปโปรไฟล์ตัวอย่างและรหัสสมาชิก
  2. *กำลังโหลดข้อมูล (Loading)*: โครงสร้าง Skeleton กระพริบแบบนุ่มนวล
  3. *ไม่มีรูปโปรไฟล์ LINE (Missing Avatar)*: ไอคอน Silhouette สีเทาสุภาพ
  4. *ยังไม่ได้ล็อกอิน (Unauthenticated)*: หน้าต่างแนะนำให้เข้าสู่ระบบผ่าน LINE
  5. *เกิดข้อผิดพลาด (Error)*: หน้าต่างแจ้งปัญหาพร้อมปุ่ม "ลองใหม่อีกครั้ง"
- **ทดสอบกรณีพิเศษ (Edge Cases)**: ชื่อยาวพิเศษ (ตัดคำไม่ล้นขอบ), ชื่ออิโมจิล้วน, และกรณีไม่มีข้อความสถานะ
- **ทดสอบผ่าน URL Parameter**: เช่น `http://localhost:3000/?state=loading` หรือ `?state=missing-avatar`

---

## 5. การรันชุดทดสอบอัตโนมัติ (Automated Tests)

โปรเจกต์มีชุดทดสอบในตัว ไม่ต้องติดตั้ง Library ภายนอกเพิ่มเติม:

```bash
npm test
# หรือ node test/server.test.js
```

ครอบคลุมการตรวจสอบ 18 หัวข้อสำคัญ:
- การคำนวณหมายเลขสมาชิกแบบคงที่ (Stateless Deterministic SHA-256)
- การทำงานของ Handler ทั้งในโหมด Preview และโหมดเชื่อมต่อจริง
- การรักษาความปลอดภัย: ปฏิเสธคำขอปลอมแปลง (403), ปฏิเสธ Token ว่าง (400), ปฏิเสธ Token ผิด (401)
- การส่งไฟล์ Static และการป้องกัน Directory Traversal Attack
- การตรวจสอบตัวแปร CSS ตามมาตรฐานการเข้าถึง (Font >= 16px, ปุ่ม >= 52px, Contrast >= 7:1)

---

## 6. การ Deploy บน Vercel ด้วย Vercel CLI

### ขั้นที่ 1: ติดตั้งและล็อกอิน Vercel CLI
```bash
npm install -g vercel
vercel login
```

### ขั้นที่ 2: Deploy ครั้งแรก (สำคัญ: ข้อควรระวัง Framework Preset)
สั่ง deploy จากโฟลเดอร์โปรเจกต์:
```bash
vercel
```
เมื่อ CLI ถามคำถาม ให้เลือกดังนี้:
- Set up and deploy? → `y`
- Which scope? → เลือกบัญชีของคุณ
- Link to existing project? → `n` (หรือ `y` หากมีโปรเจกต์เดิม)
- What’s your project’s name? → `sukjai-club-line-member`
- In which directory is your code located? → `./`
- Want to modify these settings? → `y`
  > ⚠️ **ข้อควรระวังสำคัญมาก (Framework Preset Pitfall)**:
  > Vercel อาจตรวจพบ `package.json` แล้วตั้งค่า Preset เป็น `Node.js` โดยอัตโนมัติ ซึ่งจะทำให้ Build พังด้วย Error:
  > `No entrypoint found ... Set package.json "main" to a server file` (เนื่องจาก `server.js` ถูกยกเว้นใน `.vercelignore`)
  > **วิธีแก้**: ในช่อง **Framework Preset** ให้เลือกเป็น **`Other`** เสมอ!

### ขั้นที่ 3: ตั้งค่า Environment Variables บน Vercel
ตั้งค่า 2 ตัวแปรหลัก:
```bash
# 1. ตั้งค่า LIFF_ID (ได้จาก LINE Console)
vercel env add LIFF_ID

# 2. ตั้งค่า LINE_CHANNEL_ID (ตัวเลขด้านหน้าเครื่องหมายขีดของ LIFF ID)
vercel env add LINE_CHANNEL_ID
```
*(เลือกประเภท Environment เป็น `Production`, `Preview`, `Development`)*

### ขั้นที่ 4: สั่ง Deploy ขึ้น Production
```bash
vercel --prod
```
เมื่อเสร็จสิ้น คุณจะได้ **Production URL**:
👉 `https://sukjai-club-line-member.vercel.app`

> ⚠️ **ข้อควรระวังเรื่อง URL**: อย่าใช้ Preview URL ที่มีรหัสสุ่มต่อท้าย (เช่น `https://sukjai-club-...-xxx.vercel.app`) เพราะ Vercel จะติดหน้า Authentication (HTTP 302) ทำให้ LINE โหลดไม่ผ่าน ให้ใช้ **Production Alias URL** เท่านั้น!

---

## 7. ขั้นตอนการตั้งค่าบน LINE Developers Console อย่างละเอียด

### ขั้นที่ 1: สร้าง Provider และ LINE Login Channel
1. เข้าไปที่ [LINE Developers Console](https://developers.line.biz/) แล้วล็อกอินด้วยบัญชี LINE
2. กดสร้าง **Provider** (เช่น ชื่อธุรกิจของคุณ)
3. กด **Create a new channel** แล้วเลือก **LINE Login**
4. กรอกข้อมูล:
   - Channel name: `Sukjai Club`
   - Channel description: `ระบบบัตรสมาชิกดิจิทัล`
   - App types: ติ๊กเลือก `Web app`
5. กดยอมรับเงื่อนไขและสร้าง Channel

### ขั้นที่ 2: เพิ่ม LIFF App
1. ในหน้า Channel ที่สร้าง ให้คลิกแท็บ **LIFF** ด้านบน
2. กดปุ่ม **Add** แล้วตั้งค่าดังนี้:
   - **LIFF app name**: `บัตรสมาชิก`
   - **Size**: `Full` (เต็มหน้าจอ)
   - **Endpoint URL**: `https://sukjai-club-line-member.vercel.app/` *(ต้องเป็น HTTPS Production URL เท่านั้น)*
   - **Scopes**: ติ๊กเลือกทั้ง **`profile`** และ **`openid`** *(สำคัญมาก: หากไม่เลือก `openid` จะไม่สามารถยืนยันตัวตนได้)*
   - **Bot link feature**: `Normal` (หรือ On)
3. กด Add จะได้รับ:
   - **LIFF ID**: เช่น `2006123456-abcdefgh`
   - **LIFF URL**: `https://liff.line.me/2006123456-abcdefgh`
4. หมายเลข **Channel ID** คือตัวเลขด้านหน้าเครื่องหมายขีด `-` ของ LIFF ID (เช่น `2006123456`)

### ขั้นที่ 3: เผยแพร่ Channel (เปลี่ยนสถานะเป็น Published)
> ⚠️ **จุดที่มักตกม้าตายบ่อยที่สุด**:
> Channel ที่สร้างใหม่จะมีสถานะเป็น **Developing** ซึ่งจะอนุญาตให้เฉพาะตัวคุณ (Admin/Developer) เปิดได้เท่านั้น หากลูกค้าทั่วไปเปิดจะขึ้น Error!
> **วิธีแก้**: ให้กดที่ป้าย **Developing** ด้านบนสุดของหน้าจอใน LINE Console แล้วเปลี่ยนเป็น **`Published`** ทันที

---

## 8. ขั้นตอนการสร้างและผูกริชเมนูบน LINE Official Account

1. เข้าสู่ระบบ [LINE Official Account Manager](https://manager.line.biz/)
2. เลือกบัญชี LINE Official Account ของคุณ
3. ไปที่เมนูด้านซ้าย: **แชทและริชคอนเทนต์ (Chat & Rich content)** > **ริชเมนู (Rich menus)**
4. กดปุ่ม **สร้างริชเมนู (Create rich menu)**:
   - กำหนดชื่อริชเมนู และช่วงเวลาแสดงผล
   - เลือกเทมเพลตและอัปโหลดรูปภาพปุ่ม (เช่น รูปปุ่ม "บัตรสมาชิก")
5. ในช่องการทำงาน (Action) ของปุ่มบัตรสมาชิก:
   - ประเภท (Type): เลือก **ลิงก์ (Link)**
   - ใส่ลิงก์: **`https://liff.line.me/<LIFF_ID>`**
   > ⛔ **คำเตือน**: ห้ามใส่ URL ของ Vercel ในช่องนี้! ต้องใส่ URL ที่ขึ้นต้นด้วย `https://liff.line.me/` เสมอ เพื่อให้ LINE เปิดหน้าเว็บในรูปแบบ Webview ภายในแอป LINE พร้อมล็อกอินให้อัตโนมัติ

---

## 9. การรับ QR Code เพิ่มเพื่อน LINE OA

เพื่อให้ลูกค้าสแกนเพิ่มเพื่อนและเห็นริชเมนูบัตรสมาชิก:
1. ในหน้า [LINE Official Account Manager](https://manager.line.biz/)
2. ไปที่เมนูด้านซ้าย: **เพิ่มเพื่อน (Gain friends)** > **คิวอาร์โค้ด (QR code)**
3. กดดาวน์โหลดรูปภาพ QR Code หรือคัดลอกลิงก์เพิ่มเพื่อน (`https://line.me/R/ti/p/@your-account-id`)
4. นำ QR Code ไปพิมพ์ติดหน้าร้าน โต๊ะอาหาร หรือสื่อออนไลน์ เมื่อลูกค้าสแกนเพิ่มเพื่อน จะพบกับริชเมนูบัตรสมาชิกทันที

---

## 10. ตารางแก้ปัญหาตามอาการที่พบ (Troubleshooting)

| อาการที่พบ | สาเหตุ | วิธีแก้ไข |
| :--- | :--- | :--- |
| **เปิดบนคอมฯ แล้วขึ้นหน้า "กรุณาเข้าสู่ระบบผ่าน LINE" (State 4)** | หน้าเว็บถูกเปิดจากภายนอกแอป LINE ซึ่ง LIFF ยังไม่ได้ล็อกอิน | เป็นการทำงานปกติ ให้ทดสอบเปิดผ่านแอป LINE บนมือถือ หรือกดปุ่ม "เข้าสู่ระบบด้วย LINE" บนหน้าเว็บ |
| **ลูกค้ากดริชเมนูแล้วเจอหน้าล็อกอินของ Vercel หรือติด Redirect 302** | Endpoint URL ใน LINE Console ถูกตั้งเป็น Preview URL ที่มีรหัสสุ่ม | เปลี่ยน Endpoint URL ในแท็บ LIFF ให้เป็น Production Alias: `https://sukjai-club-line-member.vercel.app/` |
| **ขึ้น Error: "Channel is developing" หรือลูกค้าคนอื่นเปิดไม่ได้** | LINE Login Channel ยังเป็นสถานะ Developing | เข้า LINE Developers Console แล้วกดเปลี่ยนสถานะ Channel จาก **Developing** เป็น **Published** |
| **หน้าเว็บขึ้นการ์ดสีแดง: "ไม่สามารถโหลดข้อมูลสมาชิกได้" (Token Error)** | ค่า `LINE_CHANNEL_ID` ใน Vercel ไม่ตรงกับ Channel ID จริง | ตรวจสอบ Channel ID (ตัวเลขก่อนเครื่องหมายขีดของ LIFF ID) อัปเดตใน Vercel Env แล้วรัน `vercel --prod` |
| **ชื่อหรือรูปโปรไฟล์ไม่แสดง (ขึ้น Silhouette)** | ไม่ได้ติ๊กเลือก Scope `profile` หรือลูกค้าไม่ได้ตั้งรูปใน LINE | ตรวจสอบในแท็บ LIFF ว่าติ๊กทั้ง `profile` และ `openid` หากลูกค้าไม่มีรูปจริง ระบบจะแสดงรูปเงาสีเทาซึ่งถูกต้องตามที่ออกแบบไว้ |
| **Deploy บน Vercel ไม่ผ่าน: "No entrypoint found"** | Vercel ตรวจจับ Framework ผิดเป็น `node` | เข้า Vercel Dashboard > Settings > General > Framework Preset แล้วเลือกเป็น **`Other`** |

---

## 11. ความปลอดภัย (Security Architecture)

- **ไม่เชื่อถือข้อมูลจาก Client (Zero Trust on Browser)**: เซิร์ฟเวอร์ไม่รับ User ID, ชื่อ, หรือรหัสสมาชิกที่ส่งตรงมาจากเบราว์เซอร์
- **ป้องกันการข้ามโหมด (Strict Mode Isolation)**: หากเซิร์ฟเวอร์ตั้งค่า LIFF ID แล้ว คำขอใดๆ ที่ส่ง `preview: true` หรือ `sampleUserId` จะถูกปฏิเสธทันทีด้วยรหัส **`403 Forbidden`**
- **ตรวจสอบ ID Token ทุกครั้ง**: ไคลเอนต์ต้องส่ง `idToken` (JWT ที่ลงนามโดย LINE) ไปที่ `/api/member` เซิร์ฟเวอร์จะส่งไปตรวจสอบกับ Endpoint ทางการของ LINE (`https://api.line.me/oauth2/v2.1/verify`) โดยตรง
- **ยืนยัน Audience (Channel ID)**: LINE จะตรวจสอบว่า Token นั้นออกให้กับ Channel ID ของร้านคุณจริงหรือไม่ ป้องกันการนำ Token จากแอปอื่นมาสวมสิทธิ์
- **คำนวณแบบ Stateless**: ไม่มีการบันทึกข้อมูลลูกค้าระหว่างทาง ปราศจากความเสี่ยงเรื่องฐานข้อมูลรั่วไหลหรือ SQL/NoSQL Injection

---

## 12. ข้อจำกัดในปัจจุบันและแนวทางพัฒนาต่อ

### ข้อจำกัดในปัจจุบัน
1. **สถาปัตยกรรมไร้ฐานข้อมูล (No Database)**: ข้อมูลทั้งหมดดึงสดจาก LINE จึงไม่มีการเก็บวันเริ่มเป็นสมาชิก (Member Since) หรือระดับสมาชิก (Tier)
2. **โอกาสที่รหัสสมาชิกจะซ้ำกัน (Collision Probability)**:
   - รหัสสมาชิกใช้รูปแบบ `MB-XXXX-XXXX` (ตัวเลข 8 หลัก รวม 100,000,000 รูปแบบ)
   - ความน่าจะเป็นที่สมาชิก 2 คนที่เจาะจงจะมีรหัสซ้ำกัน = **1 ใน 100 ล้าน** (0.000001%)
   - ตามหลัก Birthday Problem ในกลุ่มสมาชิกรวม $k$ คน:
     - สมาชิก 500 คน: โอกาสซ้ำ $\approx 0.125\%$ (1 ใน 800)
     - สมาชิก 1,000 คน: โอกาสซ้ำ $\approx 0.50\%$ (1 ใน 200)
     - จุดที่โอกาสซ้ำถึง 50% ต้องมีสมาชิกประมาณ 11,774 คน
3. **การทดสอบใช้งานจริง**: ณ ขณะจัดทำเอกสารนี้ ระบบผ่านการทดสอบอัตโนมัติ 18 รายการในระบบจำลอง แต่ยังรอการยืนยันการล็อกอินผ่านบัญชี LINE จริงในขั้นตอนสุดท้ายของเจ้าของระบบ

### แนวทางพัฒนาต่อในอนาคต (Next Steps)
- **เชื่อมต่อฐานข้อมูล Serverless** (เช่น Supabase, Vercel Postgres) หากต้องการระบบสะสมแต้ม คูปองส่วนลด หรือประวัติการซื้อ
- **เพิ่มบาร์โค้ด / QR Code บนบัตร** เพื่อให้แคชเชียร์ใช้เครื่องสแกนบาร์โค้ดยิงรับสิทธิ์ที่หน้าร้านได้ทันที
- **เชื่อมต่อ LINE Messaging API** เพื่อส่งข้อความต้อนรับหรือใบเสร็จดิจิทัลกลับเข้าแชท LINE อัตโนมัติเมื่อลูกค้าเปิดดูบัตร
