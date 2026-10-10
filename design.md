---
name: 'Sukjai Club LINE LIFF Member Profile Design Spec'
version: '1.0.0'
owner: 'design-architect'
last-updated: '2026-10-10'
locked: false
modes:
  - 'light'

tokens:
  light:
    surface:
      page: '#F8FAFC'
      card: '#FFFFFF'
      card-subtle: '#F1F5F9'
      badge-neutral: '#F1F5F9'
      badge-gold-bg: '#FEF3C7'
      badge-platinum-bg: '#EEF2FF'
      badge-active-bg: '#ECFDF5'
      state-error-bg: '#FEF2F2'
      state-warning-bg: '#FFFBEB'
      avatar-placeholder-bg: '#F1F5F9'
    border:
      card: '#E2E8F0'
      card-focus: '#2563EB'
      badge-gold: '#FDE68A'
      badge-platinum: '#C7D2FE'
      badge-active: '#A7F3D0'
      state-error: '#FECACA'
      state-warning: '#FDE68A'
      divider: '#F1F5F9'
      avatar-ring: '#FFFFFF'
    text:
      primary: '#0F172A'
      secondary: '#475569'
      muted: '#64748B'
      inverse: '#FFFFFF'
      badge-gold-text: '#92400E'
      badge-platinum-text: '#1E3A8A'
      badge-active-text: '#065F46'
      error-text: '#991B1B'
      warning-text: '#92400E'
      info-text: '#1E40AF'
    accent:
      primary: '#065F46'
      primary-hover: '#047857'
      primary-active: '#064E3B'
      primary-subtle: '#ECFDF5'
    status:
      success: '#065F46'
      warning: '#92400E'
      error: '#991B1B'
      info: '#1E40AF'
    depth:
      level-0: 'none'
      level-1: '0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04)'
      level-2: '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)'

typography:
  hero-display-name:
    size: '22px'
    line: '32px'
    weight: '700'
  brand-title:
    size: '18px'
    line: '26px'
    weight: '600'
  card-subtitle:
    size: '14px'
    line: '22px'
    weight: '400'
  badge-tier:
    size: '14px'
    line: '20px'
    weight: '600'
  field-label:
    size: '14px'
    line: '22px'
    weight: '500'
  field-value:
    size: '16px'
    line: '24px'
    weight: '600'
  field-value-mono:
    size: '16px'
    line: '24px'
    weight: '600'
  body-regular:
    size: '16px'
    line: '24px'
    weight: '400'
  body-medium:
    size: '16px'
    line: '24px'
    weight: '500'
  button-primary:
    size: '16px'
    line: '24px'
    weight: '600'
  button-secondary:
    size: '16px'
    line: '24px'
    weight: '500'
  caption-meta:
    size: '14px'
    line: '20px'
    weight: '400'

shape:
  card: '20px'
  button: '12px'
  badge: '9999px'
  avatar: '50%'
  skeleton: '8px'
  info-box: '12px'

spacing:
  page-padding-x: '16px'
  page-padding-y: '20px'
  card-padding: '24px'
  avatar-size: '88px'
  avatar-margin-bottom: '16px'
  field-gap-y: '16px'
  section-gap: '24px'
  button-gap: '12px'
  tap-target-min: '48px'
  button-height-primary: '52px'

motion:
  fade-in:
    property: 'opacity'
    duration: '200ms'
    easing: 'ease-out'
  skeleton-pulse:
    property: 'opacity'
    duration: '1200ms'
    easing: 'ease-in-out'
  button-press:
    property: 'transform'
    duration: '100ms'
    easing: 'ease-out'

layout:
  breakpoints:
    desktop: '640px'
  grid:
    min-viewport: '360px'
    max-card-width: '440px'
    page-max-width: '480px'

icons:
  set: 'inline-svg'
  sizes:
    sm: '16px'
    md: '20px'
    lg: '24px'
    avatar-fallback: '44px'

naming-convention:
  prefix: '--mb-'
---

<!-- GUARDRAIL BANNER -->
> [!IMPORTANT]
> **Implementation Guardrail for Developers and Designers**:
> Read the frontmatter tokens before writing any HTML or CSS. Use **strictly and only** the design tokens declared above via CSS Custom Properties (`var(--mb-*)`). Do not introduce ad hoc arbitrary hex codes, font sizes, margins, or paddings. For full governance, refer to [Section 10: Guardrails](#10-guardrails).

---

# Sukjai Club (สุขใจ คลับ) — LINE LIFF Member Profile Design Specification

## 1. Document Overview
This document specifies the complete visual design, information architecture, interaction states, accessibility standards, and Thai copy for the single-screen **Member Profile Web Page** accessed via LINE Front-end Framework (LIFF) from the LINE Official Account (OA) rich menu.

- **Status**: Ready for implementation by `designer`
- **Target Stack**: Single static mobile web page using vanilla HTML5, modern CSS3 (Custom Properties), and vanilla JavaScript with `@line/liff` SDK. No heavy front-end frameworks.

---

## 2. Project Context & Audience

### 2.1 The Customer & Use Case
A customer taps the "บัตรสมาชิก" (Member Card) item on the LINE Official Account rich menu inside the LINE chat app. LINE opens the LIFF webview overlay. The customer immediately sees their personal LINE identity (profile picture and display name) framed as a proud, recognizable membership card.

### 2.2 The 20–60 Age Demographic Mandate
The audience spans Thai speakers aged 20 to 60 years old. Usability for users aged 50–60 is an **absolute hard requirement**:
1. **Presbyopia & Vision Degradation**: Small gray text is completely prohibited. Base body text must never be smaller than `16px`. Secondary labels must never be smaller than `14px`. High-contrast pairings (exceeding WCAG AAA 7:1 for text-to-background) ensure effortless readability under various screen brightness levels.
2. **Motor Control & Touch Accuracy**: Tap targets must be at least `48px × 48px` with clear spacing (minimum `12px` gap) to prevent accidental mis-taps. Primary action buttons are sized at `52px` height.
3. **Cognitive Ease & Clarity**: Thai wording must be plain, respectful, and standard without technical jargon, complex slang, or ambiguous abbreviations.
4. **Thai Script Typography**: Thai vowels and tone marks (ไม้เอก, ไม้โท, สระอิ, สระอุ) extend significantly above and below the baseline. All line heights must be set to `1.45`–`1.6` to eliminate glyph clipping.

### 2.3 Available vs. Non-Existent Data
- **Real Available LINE Identity**:
  - LINE Profile Picture URL (string, optional / nullable)
  - LINE Display Name (string, free text: can be 1–50 characters, emoji-only, Thai, Latin, or CJK)
  - LINE Status Message (string, optional / nullable)
  - LINE User ID (opaque string, e.g., `U1234567890abcdef...`, backend/support use only)
- **App-Owned Member Record Data**:
  - Member Number (e.g., `MB-8829-4102`)
  - Member Since Date (e.g., `12 ต.ค. 2566`)
  - Membership Level / Tier (e.g., `Gold Member` / `สมาชิกระดับทอง`)
- **Strictly Excluded Data (Out of Scope)**:
  - No points balance, no transaction history, no coupons, no booking records, no tier progress bars.

---

## 3. Brand Identity & Visual Direction Rationale

### 3.1 Brand Selection: "Sukjai Club" (สุขใจ คลับ)
- **Brand Name**: Sukjai Club (สุขใจ คลับ)
- **Concept**: "สุขใจ" (Sukjai) conveys warmth, trust, contentment, and hospitality. It is universally understood and culturally pleasant across all age brackets (20–60).
- **Owner Redirectability**: This neutral lifestyle brand is isolated entirely in token headers and copy tables. If the business owner provides a proprietary brand name later, substituting the text and `--mb-accent-primary` token will re-skin the entire screen without altering any layout structure or component architecture.

### 3.2 Candidate Directions Evaluated

Before settling on the design, three distinct structural directions were evaluated against the 20–60 LINE user demographic:

| Direction | Skeleton & Architecture | Hierarchy Focus | Pros & Cons | Verdict |
| :--- | :--- | :--- | :--- | :--- |
| **Direction A: Modern Card Wallet** *(บัตรสมาชิกดิจิทัลทรงกระเป๋าเงิน)* | Centered elevated digital card pass container emulating an executive physical membership card. Clean meta rows below hero. | **1.** Hero Avatar & Display Name<br>**2.** Tier Badge<br>**3.** Member ID & Join Date<br>**4.** Utility Actions | Instant mental model connection to a membership card; clear boundaries for older eyes; fits 100% within mobile viewport without scrolling. | **CHOSEN** |
| **Direction B: Minimal Flat Profile Sheet** *(รายการข้อมูลสมาชิกแบบเรียบ)* | Edge-to-edge list-group layout with flat dividing rules, no card elevation or physical enclosure. | Top avatar row followed by linear text list items. | Fast scanability, but lacks warmth, prestige, and visual enclosure; older users struggle to differentiate card data from page background. | Rejected |
| **Direction C: Illustrated Hero Banner** *(แบนเนอร์ภาพประกอบพร้อมหัวเรื่อง)* | Full-bleed decorative header graphic with floating avatar overlapping the seam, followed by content cards. | **1.** Banner Art<br>**2.** Avatar<br>**3.** Profile Details | Visually trendy for younger users, but wastes precious vertical viewport in LINE's in-app browser, pushes key data offscreen, and causes visual clutter. | Rejected |

### 3.3 One-Sentence Rationale for Major Decisions
- **Layout Skeleton (Modern Card Wallet)**: Emulating a physical membership card pass gives 50–60 year old users an intuitive visual anchor they already recognize from real life, while looking sleek and modern for 20-somethings.
- **Hierarchy Strategy (Avatar + Display Name as Hero)**: Prioritizing the customer's own LINE photo (`88px`) and bold display name (`22px`) immediately reassures the user that LINE successfully identified them personally.
- **Density Model (Spacious Comfort)**: Generous `24px` card padding and `16px` row spacing prevent claustrophobic text clustering and facilitate effortless touch interaction.
- **Depth Model (Soft Tactile Elevation)**: A single Level-1 elevated white card against a soft slate canvas (`#F8FAFC`) gives older eyes a high-contrast boundary without heavy drop-shadow clutter.
- **Color Palette (Deep Emerald & Slate)**: Deep Forest Emerald (`#065F46`) provides exceptional contrast (`7.68:1` against white, exceeding WCAG AAA) and evokes trust, financial security, and premium hospitality.

---

## 4. Layout Blueprint & Structural Wireframe

### 4.1 Mobile In-App Viewport (360px – 430px)
The primary runtime environment is LINE's in-app webview. The entire core profile must comfortably fit within typical phone viewports without forcing the user to scroll to see their membership status.

```text
+---------------------------------------------------+  ^
| [LINE In-App Header: Title / Close Button (OS)]   |  | LINE Native Bar
+===================================================+  v
|                                                   |
|   [Sukjai Club Logo / Name]   (Top App Bar)       |  32px
|   "สุขใจ คลับ"                                    |
|                                                   |
|  +---------------------------------------------+  |
|  |             MEMBER PASS HERO CARD           |  |
|  |                                             |  |
|  |                  ( O )   <-- 88px Avatar   |  |
|  |             LINE Profile Pic                |  |
|  |                                             |  |
|  |               สมชาย ใจดี                    |  |  22px Bold Display Name
|  |          "สุขใจทุกวันที่ได้พบกัน"           |  |  14px Status (Optional)
|  |                                             |  |
|  |           [ ★ สมาชิกระดับทอง ]              |  |  Pill Badge (Tier)
|  |                                             |  |
|  |  -----------------------------------------  |  |  Divider Line
|  |                                             |  |
|  |   หมายเลขสมาชิก           MB-8829-4102 [Copy] |  |  16px Mono Value
|  |                                             |  |
|  |   เป็นสมาชิกตั้งแต่          12 ต.ค. 2566     |  |  16px Value
|  |                                             |  |
|  +---------------------------------------------+  |
|                                                   |
|  +---------------------------------------------+  |
|  | [⟳ รีเฟรชข้อมูล]          (52px Primary CTA)|  |
|  +---------------------------------------------+  |
|                                                   |
|  +---------------------------------------------+  |
|  | [ ปิดหน้าต่าง ]           (48px Secondary)  |  |
|  +---------------------------------------------+  |
|                                                   |
|          ID อ้างอิง: U1a2b3c4d5e6...              |  14px Muted Support Text
+---------------------------------------------------+
```

### 4.2 Desktop & Tablet Responsive Adaptation (> 640px)
When opened in a desktop browser (via shared LIFF URL or QR code preview):
- The page wrapper is horizontally centered.
- The member pass card has a `max-width: 440px`.
- The canvas background (`#F8FAFC`) surrounds the centered card with ample padding (`48px 16px`), maintaining the identical, elegant mobile-app proportions without stretching text awkwardly across wide screens.

---

## 5. Component Catalog & Detailed States

### 5.1 Component 1: Brand Header (`.mb-header`)
- **Role**: Establishes the host organization identity cleanly at the top of the viewport.
- **Tokens Used**: `typography.brand-title`, `text.primary`, `spacing.page-padding-y`.
- **Anatomy**:
  - Small vector brand icon (`24px × 24px`, Deep Emerald `#065F46`).
  - Brand name text: `"สุขใจ คลับ"` (`18px`, SemiBold `600`, color `#0F172A`).
- **States**: Fixed static position, centered.

### 5.2 Component 2: Hero Member Pass Card (`.mb-card`)
- **Role**: The primary hero surface of the screen. Holds identity and member data.
- **Tokens Used**: `surface.card`, `border.card`, `depth.level-1`, `shape.card` (`20px`), `spacing.card-padding` (`24px`).
- **Sub-elements**:

#### A. Hero Avatar (`.mb-avatar`)
- **Dimensions**: Exactly `88px × 88px` circular container (`shape.avatar: 50%`).
- **Styling**: `border: 3px solid #FFFFFF`, box-shadow: `0 4px 10px rgba(15, 23, 42, 0.12)`.
- **States**:
  - *Normal*: `<img>` element with `object-fit: cover`, loading with graceful fade-in.
  - *Missing / Null*: Default SVG silhouette glyph (`icons.sizes.avatar-fallback: 44px`) on neutral background (`surface.avatar-placeholder-bg: #F1F5F9`). Accessible attribute: `aria-label="รูปโปรไฟล์สมาชิก (ไม่มีรูปใน LINE)"`.
  - *Loading*: Animated pulsing skeleton circle of `88px × 88px`.

#### B. LINE Display Name (`.mb-display-name`)
- **Role**: The hero textual identity of the customer.
- **Tokens Used**: `typography.hero-display-name` (`22px`, line-height `32px`, font-weight `700`, color `#0F172A`).
- **Edge-Case Protections**:
  - *Long Thai / Latin Names*: Styled with `overflow-wrap: anywhere; word-break: break-word;`. Clamped to a maximum of `2` lines (`-webkit-line-clamp: 2`). Full text available via accessible `title` attribute.
  - *Emoji-only Names*: Sized at `22px` with font stack including `Apple Color Emoji`, `Segoe UI Emoji`, `Noto Color Emoji`. Ample `32px` line-height guarantees emoji ascenders/descenders are never clipped.
  - *Whitespace Safety*: Clean trimming; fallback to `"สมาชิก LINE"` if empty string returned.

#### C. LINE Status Message (`.mb-status-message`)
- **Tokens Used**: `typography.card-subtitle` (`14px`, line-height `22px`, font-weight `400`, color `#475569`).
- **Behavior**: Italicized or enclosed in quotes. Clamped to `2` lines with ellipsis.
- **Absence Handling**: If null, undefined, or empty, the DOM element is omitted or hidden (`display: none;`) with `margin: 0`, leaving **zero awkward gap** between the display name and the tier badge.

#### D. Membership Tier Badge (`.mb-badge`)
- **Role**: Immediate visual confirmation of membership standing.
- **Tokens Used**: `shape.badge` (`9999px` pill), `typography.badge-tier` (`14px`, font-weight `600`), padding: `6px 16px`.
- **Rule**: Meaning is **never** communicated by color alone. Every tier includes an inline SVG icon (star, shield, crown) plus explicit Thai text.
- **Variants**:
  - *Gold Tier*: Background `#FEF3C7`, Text `#92400E`, Border `1px solid #FDE68A`, Icon: Star `★`.
  - *Silver Tier*: Background `#F1F5F9`, Text `#334155`, Border `1px solid #E2E8F0`, Icon: Shield `⛨`.
  - *Platinum Tier*: Background `#EEF2FF`, Text `#1E3A8A`, Border `1px solid #C7D2FE`, Icon: Crown `👑`.
  - *General Member (Default)*: Background `#ECFDF5`, Text `#065F46`, Border `1px solid #A7F3D0`, Icon: Ribbon `✦`.

#### E. Member Meta Rows (`.mb-info-grid`)
- **Layout**: Two horizontal key-value rows separated by a `1px` subtle divider (`#F1F5F9`).
- **Row 1: หมายเลขสมาชิก (Member Number)**
  - Label: `typography.field-label` (`14px`, color `#475569`).
  - Value: `typography.field-value-mono` (`16px`, SemiBold `600`, tabular monospace numbers, color `#0F172A`).
  - Interactive Copy Button: Adjacent `48px × 48px` touch target with copy icon. On tap, copies number to clipboard and triggers a 2-second accessible Thai feedback toast: `"คัดลอกหมายเลขสมาชิกแล้ว"`.
- **Row 2: เป็นสมาชิกตั้งแต่ (Member Since)**
  - Label: `typography.field-label` (`14px`, color `#475569`).
  - Value: `typography.field-value` (`16px`, SemiBold `600`, Thai calendar format e.g., `"12 ต.ค. 2566"`, color `#0F172A`).

### 5.3 Component 3: Action Buttons (`.mb-actions`)
- **Primary CTA: "รีเฟรชข้อมูล" (Refresh Profile)**
  - Height: `button-height-primary: 52px` (optimal for 60yo finger tap accuracy).
  - Background: `accent.primary: #065F46`.
  - Text: `typography.button-primary` (`16px`, Bold `600`, White `#FFFFFF`).
  - States:
    - *Hover*: Background `#047857`.
    - *Active / Pressed*: Background `#064E3B`, transform `scale(0.98)`.
    - *Focus*: Outline `3px solid #2563EB`, offset `2px`.
    - *Loading / Busy*: Shows spinning indicator, button disabled (`pointer-events: none; opacity: 0.8;`).
- **Secondary Action: "ปิดหน้าต่าง" (Close Window)**
  - Height: `48px`.
  - Background: `#FFFFFF`.
  - Border: `1px solid #E2E8F0`.
  - Text: `typography.button-secondary` (`16px`, Medium `500`, color `#475569`).
  - Action: Invokes `liff.closeWindow()`.

---

## 6. The 5 Comprehensive System Screen States

Every state is deliberately designed to provide immediate clarity, preventing confusion or panic among older users.

### State 1: Loading State (`state-loading`)
- **Condition**: Page load, LIFF SDK initialization (`liff.init()`), and profile retrieval (`liff.getProfile()`).
- **Visual Presentation**:
  - Skeleton wireframe matching the exact card geometry to eliminate Cumulative Layout Shift (CLS = 0).
  - Avatar placeholder: `88px × 88px` circle pulsing smoothly (`1200ms ease-in-out`).
  - Display Name placeholder: `160px × 24px` rounded bar.
  - Badge placeholder: `100px × 24px` pill.
  - Meta row placeholders: two `220px × 20px` bars.
  - Loading Status Announcement:
    - Text: `"กำลังโหลดข้อมูลสมาชิก..."` (`16px`, Medium, color `#475569`).
    - Spinner: Accessible SVG ring spinner in Deep Emerald `#065F46`.
    - ARIA: `aria-busy="true"` and `aria-live="polite"`.

```text
+---------------------------------------------+
|               [ Sukjai Club ]               |
|                                             |
|  +---------------------------------------+  |
|  |                ( ::: )                |  |  88px Skeleton Circle
|  |                                       |  |
|  |             [========]                |  |  Name Skeleton Bar
|  |              [======]                 |  |  Badge Skeleton Bar
|  |  -----------------------------------  |  |
|  |   [====]             [===========]    |  |  Row 1 Skeleton
|  |   [====]             [=========]      |  |  Row 2 Skeleton
|  +---------------------------------------+  |
|                                             |
|          ◌ กำลังโหลดข้อมูลสมาชิก...         |
+---------------------------------------------+
```

---

### State 2: Signed-In Profile (`state-signed-in`)
- **Condition**: User is authenticated via LINE LIFF, profile fetched successfully.
- **Visual Presentation**: The full, complete Hero Member Pass Card described in Section 5 with real avatar, display name, status, tier badge, member ID, and join date.

```text
+---------------------------------------------+
|               [ Sukjai Club ]               |
|                                             |
|  +---------------------------------------+  |
|  |                ( ☺ )                  |  |  LINE Photo (88px)
|  |              สมชาย ใจดี               |  |  22px Bold Name
|  |         "สุขใจทุกวันที่ได้พบกัน"      |  |  14px Status
|  |                                       |  |
|  |           [ ★ สมาชิกระดับทอง ]        |  |  Gold Tier Badge
|  |  -----------------------------------  |  |
|  |   หมายเลขสมาชิก     MB-8829-4102 [📋] |  |  16px Mono ID
|  |   เป็นสมาชิกตั้งแต่    12 ต.ค. 2566   |  |  16px Join Date
|  +---------------------------------------+  |
|                                             |
|  +---------------------------------------+  |
|  | [ ⟳ รีเฟรชข้อมูล ]                     |  |  52px Primary CTA
|  +---------------------------------------+  |
|  | [ ปิดหน้าต่าง ]                       |  |  48px Secondary CTA
|  +---------------------------------------+  |
+---------------------------------------------+
```

---

### State 3: Profile Picture Missing (`state-missing-avatar`)
- **Condition**: User is signed in, but `profile.pictureUrl` is `null`, `undefined`, or empty string (common when a user has not uploaded a photo or their LINE privacy restricts it).
- **Visual Presentation**:
  - Layout is 100% identical to State 2; no layout collapse occurs.
  - Avatar circle displays an accessible, polished user silhouette vector icon:
    - Background: `surface.avatar-placeholder-bg: #F1F5F9`.
    - Icon: Centered silhouette in `text.muted: #64748B` (`44px × 44px`).
    - Border: `3px solid #FFFFFF` with gentle shadow.
    - Alt text: `"รูปโปรไฟล์สมาชิก (ไม่มีรูปใน LINE)"`.

```text
+---------------------------------------------+
|               [ Sukjai Club ]               |
|                                             |
|  +---------------------------------------+  |
|  |                ( 👤 )                 |  |  Neutral SVG Silhouette
|  |              สมหญิง มีสุข             |  |  22px Bold Name
|  |           [ ✦ สมาชิกทั่วไป ]          |  |  Tier Badge
|  |  -----------------------------------  |  |
|  |   หมายเลขสมาชิก     MB-5510-2394 [📋] |  |
|  |   เป็นสมาชิกตั้งแต่    05 ม.ค. 2567   |  |
|  +---------------------------------------+  |
+---------------------------------------------+
```

---

### State 4: Opened Outside LINE / Not Signed In (`state-unauthenticated`)
- **Condition**: Web page opened in an external mobile browser (Safari, Chrome) or desktop browser where LIFF is not logged in (`!liff.isLoggedIn()`).
- **Visual Presentation**:
  - Replaces card with a welcoming Authentication Guidance Card.
  - Clear icon: LINE app speech bubble glyph (`48px × 48px`).
  - Title: `"กรุณาเข้าสู่ระบบผ่าน LINE"` (`20px`, Bold, color `#0F172A`).
  - Body Description: `"หน้านี้สำหรับสมาชิก Sukjai Club เพื่อดูข้อมูลบัตรสมาชิก กรุณากดปุ่มด้านล่างเพื่อเข้าสู่ระบบ หรือเปิดผ่านแอปพลิเคชัน LINE"` (`16px`, line-height `24px`, color `#475569`).
  - Primary Action (Height `52px`): `"เข้าสู่ระบบด้วย LINE"` (triggers `liff.login()`).
  - Secondary Action / QR Hint: `"เปิดในแอป LINE"` (deep link to LINE OA).

```text
+---------------------------------------------+
|               [ Sukjai Club ]               |
|                                             |
|  +---------------------------------------+  |
|  |                 [ 💬 ]                |  |  LINE App Icon
|  |                                       |  |
|  |       กรุณาเข้าสู่ระบบผ่าน LINE       |  |  20px Bold Title
|  |                                       |  |
|  |   หน้านี้สำหรับสมาชิก Sukjai Club     |  |  16px Explanation
|  |   เพื่อดูข้อมูลบัตรสมาชิกของท่าน       |  |
|  |   กรุณากดปุ่มด้านล่างเพื่อเข้าสู่ระบบ  |  |
|  |                                       |  |
|  |  +---------------------------------+  |  |
|  |  | [ เข้าสู่ระบบด้วย LINE ]        |  |  |  52px Login CTA
|  |  +---------------------------------+  |  |
|  +---------------------------------------+  |
+---------------------------------------------+
```

---

### State 5: System Failure / Offline State (`state-error`)
- **Condition**: `liff.init()` rejects, network disconnects, or profile API fails.
- **Visual Presentation**:
  - Non-alarming, polite problem resolution card.
  - Alert Icon: Warning shield in deep amber/red (`48px × 48px`).
  - Title: `"ไม่สามารถโหลดข้อมูลสมาชิกได้"` (`20px`, Bold, color `#991B1B`).
  - Plain Thai Description: `"ขออภัย ระบบไม่สามารถเชื่อมต่อกับ LINE ได้ในขณะนี้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต แล้วลองใหม่อีกครั้ง"` (`16px`, line-height `24px`, color `#475569`).
  - Primary Action (Height `52px`): `"ลองใหม่อีกครั้ง"` (Reloads LIFF session).
  - Secondary Action (Height `48px`): `"ปิดหน้านี้"` (`liff.closeWindow()`).

```text
+---------------------------------------------+
|               [ Sukjai Club ]               |
|                                             |
|  +---------------------------------------+  |
|  |                 [ ⚠ ]                 |  |  Accessible Alert Icon
|  |                                       |  |
|  |     ไม่สามารถโหลดข้อมูลสมาชิกได้      |  |  20px Error Title
|  |                                       |  |
|  |   ขออภัย ระบบไม่สามารถเชื่อมต่อกับ    |  |  16px Friendly Message
|  |   LINE ได้ในขณะนี้ กรุณาตรวจสอบ      |  |
|  |   อินเทอร์เน็ต แล้วลองใหม่อีกครั้ง    |  |
|  |                                       |  |
|  |  +---------------------------------+  |  |
|  |  | [ ⟳ ลองใหม่อีกครั้ง ]           |  |  |  52px Retry CTA
|  |  +---------------------------------+  |  |
|  |  | [ ปิดหน้านี้ ]                  |  |  |  48px Close CTA
|  |  +---------------------------------+  |  |
|  +---------------------------------------+  |
+---------------------------------------------+
```

---

## 7. Elevation, Depth & Surface Model

The depth model uses a clean 3-level physical hierarchy that makes card boundaries unmistakably clear to users aged 50–60:

| Level | Token / Value | Surface & Usage | Rationale for Ages 20–60 |
| :--- | :--- | :--- | :--- |
| **Level 0 (Canvas)** | `surface.page: #F8FAFC`<br>Shadow: `none` | The background canvas behind all content. | Very soft cool off-white prevents blinding glare while maximizing contrast against the white card. |
| **Level 1 (Card Pass)** | `surface.card: #FFFFFF`<br>`depth.level-1`: `0 4px 6px -1px rgba(15,23,42,0.06), 0 2px 4px -2px rgba(15,23,42,0.04)`<br>`border: 1px solid #E2E8F0` | The primary Membership Pass card and State dialogue containers. | Dual boundary (tactile soft shadow + 1px slate border) guarantees that even users with reduced contrast vision perceive the exact edges of the card. |
| **Level 2 (Interactive Floating)** | `depth.level-2`: `0 10px 15px -3px rgba(15,23,42,0.08), 0 4px 6px -4px rgba(15,23,42,0.04)` | Copy feedback toast and active button states. | Lifts interactive feedback clearly above the card pass to command immediate attention. |

---

## 8. Motion & Reduced Motion Behavior

### 8.1 Motion Specifications
- **Page Load / State Reveal (`fade-in`)**: `opacity: 0` to `1` over `200ms ease-out`.
- **Skeleton Pulse (`skeleton-pulse`)**: `opacity: 0.6` to `1.0` cycling over `1200ms ease-in-out` infinite.
- **Button Feedback (`button-press`)**: `transform: scale(0.98)` over `100ms ease-out`.

### 8.2 Accessible Reduced-Motion Mandate
For older users or individuals with vestibular disorders:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .mb-skeleton {
    animation: none !important;
    background-color: var(--mb-surface-card-subtle) !important;
    opacity: 0.8 !important;
  }
}
```

---

## 9. Accessibility Specifications (Ages 20–60 Concrete Rules)

### 9.1 Mathematical Contrast Verification Table
All color pairs have been mathematically verified against standard relative luminance formulas (`L1 + 0.05 / L2 + 0.05`).

| Foreground Token | Background Surface | Measured Ratio | WCAG 2.1 Standard | Status |
| :--- | :--- | :--- | :--- | :--- |
| `text.primary` (`#0F172A`) | `surface.card` (`#FFFFFF`) | **17.85 : 1** | AAA (7.0:1 required) | **PASS (Exceptional)** |
| `text.primary` (`#0F172A`) | `surface.page` (`#F8FAFC`) | **17.06 : 1** | AAA (7.0:1 required) | **PASS (Exceptional)** |
| `text.secondary` (`#475569`) | `surface.card` (`#FFFFFF`) | **7.58 : 1** | AAA (7.0:1 required) | **PASS (Exceeds AAA)** |
| `text.secondary` (`#475569`) | `surface.page` (`#F8FAFC`) | **7.24 : 1** | AAA (7.0:1 required) | **PASS (Exceeds AAA)** |
| `text.muted` (`#64748B`) | `surface.card` (`#FFFFFF`) | **4.76 : 1** | AA (4.5:1 required) | **PASS (Meets AA)** |
| `text.inverse` (`#FFFFFF`) | `accent.primary` (`#065F46`) | **7.68 : 1** | AAA (7.0:1 required) | **PASS (Exceeds AAA)** |
| `accent.primary` (`#065F46`) | `accent.primary-subtle` (`#ECFDF5`)| **7.29 : 1** | AAA (7.0:1 required) | **PASS (Exceeds AAA)** |
| `badge-gold-text` (`#92400E`)| `badge-gold-bg` (`#FEF3C7`) | **6.84 : 1** | AA (4.5:1 required) | **PASS (Near AAA)** |
| `badge-platinum-text` (`#1E3A8A`)| `badge-platinum-bg` (`#EEF2FF`)| **10.36 : 1** | AAA (7.0:1 required) | **PASS (Exceptional)** |
| `error-text` (`#991B1B`) | `state-error-bg` (`#FEF2F2`) | **7.60 : 1** | AAA (7.0:1 required) | **PASS (Exceeds AAA)** |
| `warning-text` (`#92400E`) | `state-warning-bg` (`#FFFBEB`) | **6.84 : 1** | AA (4.5:1 required) | **PASS (Near AAA)** |

### 9.2 Typography & Thai Script Legibility
- **Base Body Font Size**: Strictly `16px` (`1rem`). Never lower.
- **Minimum Font Size Anywhere**: `14px` (`0.875rem`) for secondary labels. Micro-text (10px–12px) is strictly forbidden.
- **Thai Line Height Multiplier**: Base line height is `1.5` to `1.6` (`24px` on `16px` text, `32px` on `22px` title). This prevents Thai vowels (สระอิ, สระอี, สระอุ, สระอู) and tonal marks (วรรณยุกต์) from colliding or clipping.
- **Thai System Font Stack**:
  ```css
  font-family: -apple-system, BlinkMacSystemFont, "Sukhumvit Tadmai", "Thonburi", "Sarabun", "Prompt", system-ui, sans-serif;
  ```

### 9.3 Tap Target Dimensions & Touch Separation
- **Primary Action Buttons**: Minimum height `52px`, width `100%`, horizontal padding `20px`.
- **Secondary Buttons & Action Controls**: Minimum height `48px`, minimum width `48px`.
- **Copy Button Touch Target**: Icon is `20px × 20px`, enclosed inside a dedicated `48px × 48px` hit box (`padding: 14px`).
- **Touch Target Separation**: All interactive controls are separated by at least `12px` of vertical or horizontal whitespace to prevent mis-touches.

### 9.4 Robust Real-Content Handling
1. **Long Thai Names**:
   - Containers use `overflow-wrap: anywhere; word-break: break-word;`.
   - Maximum 2 lines with graceful wrap. Container has `min-height: 32px` so 1-line and 2-line names do not distort card geometry.
2. **Emoji-Only Names**:
   - Fully supported without baseline shift or container overflow.
3. **Missing Profile Photo**:
   - Zero broken image layout. Replaced with `88px` neutral silhouette avatar with explicit Thai screen-reader alt text.
4. **Missing Status Message**:
   - Container collapses cleanly with zero empty whitespace gap.

---

## 10. Complete Master Thai UI Copy Reference

Every single user-facing string on the screen is documented below in natural, respectful, age-appropriate Thai:

| Key Identifier | Thai Copy | English Meaning | Usage Context & Tone |
| :--- | :--- | :--- | :--- |
| `brand_name` | สุขใจ คลับ | Sukjai Club | Header brand title |
| `card_type_label` | บัตรสมาชิกดิจิทัล | Digital Member Card | Accessible card classification |
| `avatar_alt_normal` | รูปโปรไฟล์ LINE ของคุณ | Your LINE profile picture | Alt text when image loads |
| `avatar_alt_missing` | รูปโปรไฟล์สมาชิก (ไม่มีรูปใน LINE) | Member avatar (no photo in LINE) | Alt text for default avatar |
| `display_name_fallback` | สมาชิก LINE | LINE Member | Fallback if display name is blank |
| `badge_tier_gold` | สมาชิกระดับทอง | Gold Member | Tier pill badge label |
| `badge_tier_silver` | สมาชิกระดับเงิน | Silver Member | Tier pill badge label |
| `badge_tier_platinum` | สมาชิกระดับแพลทินัม | Platinum Member | Tier pill badge label |
| `badge_tier_regular` | สมาชิกทั่วไป | Regular Member | Tier pill badge label |
| `label_member_id` | หมายเลขสมาชิก | Member Number | Key label for membership code |
| `label_member_since` | เป็นสมาชิกตั้งแต่ | Member Since | Key label for registration date |
| `btn_copy_id` | คัดลอก | Copy | Accessible label for copy button |
| `toast_copied` | คัดลอกหมายเลขสมาชิกแล้ว | Member number copied | Temporary feedback toast |
| `btn_refresh` | รีเฟรชข้อมูล | Refresh Information | Primary CTA button label |
| `btn_close_window` | ปิดหน้าต่าง | Close Window | Secondary button label (`liff.closeWindow()`) |
| `support_ref_prefix` | ID อ้างอิง: | Reference ID: | Footnote label for opaque LINE userId |
| `loading_message` | กำลังโหลดข้อมูลสมาชิก... | Loading member profile... | State 1 text under skeleton |
| `unauth_title` | กรุณาเข้าสู่ระบบผ่าน LINE | Please log in via LINE | State 4 header title |
| `unauth_desc` | หน้านี้สำหรับสมาชิก Sukjai Club เพื่อดูข้อมูลบัตรสมาชิก กรุณากดปุ่มด้านล่างเพื่อเข้าสู่ระบบ หรือเปิดผ่านแอปพลิเคชัน LINE | This page is for Sukjai Club members to view their member card. Please log in or open in LINE. | State 4 explanation body |
| `unauth_btn_login` | เข้าสู่ระบบด้วย LINE | Log in with LINE | State 4 primary button (`liff.login()`) |
| `error_title` | ไม่สามารถโหลดข้อมูลสมาชิกได้ | Unable to load member information | State 5 header title |
| `error_desc` | ขออภัย ระบบไม่สามารถเชื่อมต่อกับ LINE ได้ในขณะนี้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต แล้วลองใหม่อีกครั้ง | We are sorry, the system cannot connect to LINE right now. Please check your connection and retry. | State 5 explanation body |
| `error_btn_retry` | ลองใหม่อีกครั้ง | Try Again | State 5 primary retry button |
| `error_btn_close` | ปิดหน้านี้ | Close this page | State 5 secondary close button |

---

## 11. Implementation Naming Convention & CSS Tokens

All design tokens are mapped to the `--mb-` CSS Custom Property namespace. The implementing designer can paste this exact block into their CSS stylesheet root:

```css
:root {
  /* Surface Tokens */
  --mb-surface-page: #F8FAFC;
  --mb-surface-card: #FFFFFF;
  --mb-surface-card-subtle: #F1F5F9;
  --mb-surface-avatar-placeholder: #F1F5F9;
  --mb-surface-badge-gold: #FEF3C7;
  --mb-surface-badge-platinum: #EEF2FF;
  --mb-surface-badge-active: #ECFDF5;
  --mb-surface-state-error: #FEF2F2;
  --mb-surface-state-warning: #FFFBEB;

  /* Border Tokens */
  --mb-border-card: #E2E8F0;
  --mb-border-focus: #2563EB;
  --mb-border-divider: #F1F5F9;
  --mb-border-badge-gold: #FDE68A;
  --mb-border-badge-platinum: #C7D2FE;
  --mb-border-badge-active: #A7F3D0;
  --mb-border-state-error: #FECACA;

  /* Text Tokens */
  --mb-text-primary: #0F172A;
  --mb-text-secondary: #475569;
  --mb-text-muted: #64748B;
  --mb-text-inverse: #FFFFFF;
  --mb-text-badge-gold: #92400E;
  --mb-text-badge-platinum: #1E3A8A;
  --mb-text-badge-active: #065F46;
  --mb-text-error: #991B1B;
  --mb-text-warning: #92400E;

  /* Accent Tokens */
  --mb-accent-primary: #065F46;
  --mb-accent-primary-hover: #047857;
  --mb-accent-primary-active: #064E3B;
  --mb-accent-primary-subtle: #ECFDF5;

  /* Depth Tokens */
  --mb-depth-level-1: 0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04);
  --mb-depth-level-2: 0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04);

  /* Shape Tokens */
  --mb-shape-card: 20px;
  --mb-shape-button: 12px;
  --mb-shape-badge: 9999px;
  --mb-shape-avatar: 50%;
  --mb-shape-skeleton: 8px;

  /* Spacing Tokens */
  --mb-spacing-page-x: 16px;
  --mb-spacing-page-y: 20px;
  --mb-spacing-card-p: 24px;
  --mb-spacing-avatar-size: 88px;
  --mb-spacing-button-h-primary: 52px;
  --mb-spacing-button-h-secondary: 48px;
  --mb-spacing-gap-fields: 16px;
  --mb-spacing-gap-buttons: 12px;
  --mb-spacing-tap-min: 48px;

  /* Typography Sizing & Line Heights */
  --mb-font-family: -apple-system, BlinkMacSystemFont, "Sukhumvit Tadmai", "Thonburi", "Sarabun", "Prompt", system-ui, sans-serif;
  --mb-font-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  
  --mb-font-size-hero: 22px;
  --mb-line-height-hero: 32px;
  --mb-font-weight-hero: 700;

  --mb-font-size-body: 16px;
  --mb-line-height-body: 24px;

  --mb-font-size-caption: 14px;
  --mb-line-height-caption: 22px;
}
```

---

## 12. Guardrails

### Must:
1. **Adhere to Declared Tokens**: Build strictly with `--mb-*` variables; do not hardcode arbitrary color values or font sizes in element classes.
2. **Preserve Minimum Dimensions**: Maintain button heights at `>= 52px` for primary actions and `>= 48px` for secondary/utility actions.
3. **Preserve Thai Typography Rules**: Maintain line heights `>= 1.45`–`1.6` for all Thai text to prevent glyph clipping.
4. **Honor Robustness Safeguards**: Implement CSS rules `overflow-wrap: anywhere; word-break: break-word;` for the display name and status message containers.
5. **Implement All 5 States**: Ensure State 1 (Loading), State 2 (Signed-in), State 3 (Missing Avatar), State 4 (Unauthenticated), and State 5 (Error) are cleanly togglable via container state classes (e.g. `.is-loading`, `.is-error`).

### Must Not:
1. **Never Invent Phantom Data**: Do not add points balances, coupon counts, purchase logs, or tier progress bars in this round.
2. **Never Use Fragile Font Sizes**: Never use body font sizes below `16px` or label font sizes below `14px`.
3. **Never Rely Solely on Color**: Never indicate membership tier by color alone; always pair color with text and iconography.
4. **Never Leave Empty Layout Gaps**: If the status message or avatar is missing, do not render a blank space or broken image icon.

---

## 13. Open Questions for Project Owner

The following items are logged for the project owner's future review:
1. **Brand Name Customization**: Neutral fictional brand "Sukjai Club" (สุขใจ คลับ) is currently specified. Does the owner wish to replace this with their actual brand name and logo asset?
2. **Physical Store Barcode / QR Code**: Will future iterations require cashiers to scan a dynamic barcode or QR code from this profile screen at point-of-sale?
3. **Membership Tier Logic**: Are membership tiers assigned statically from the backend database, or calculated based on external CRM criteria?

---

## 14. Document Changelog

| Version | Date | Author | Summary of Changes | Reason |
| :--- | :--- | :--- | :--- | :--- |
| `1.0.0` | 2026-10-10 | design-architect | Initial self-contained design spec creation. | Greenfield project foundation for LINE LIFF Member Profile. |
