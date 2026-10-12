# MailHub — الخطة الرئيسية لبناء تطبيق بريد موحد على macOS (Apple Silicon M1+)

> **سند التنفيذ:** هذه وثيقة مواصفات عملية لإعطائها إلى Coding Agent لبناء التطبيق. المستهدف Mac M1/M2/M3/M4 وما بعده بمعمارية ARM64، باستخدام Rust + Tauri 2 + React + TypeScript. اقرأ `UI_DESIGN_SPEC.md` ومهارة `skills/macos-mail-ui/SKILL.md` قبل البدء في تصميم الواجهات.

**الاسم المؤقت:** MailHub (قابل للتغيير).  
**التاريخ:** 2026-10-12.  
**المنصة:** macOS 13+ على Apple Silicon (اختيار تصميمي قابل للتعديل حسب اختبار التوافق).  
**نموذج العمل:** Local-first desktop application؛ لا سيرفر مركزي للرسائل في النسخة الأولى.  
**هدف النطاق:** إدارة عشرات/مئات الحسابات من تطبيق واحد؛ قابلية التوسع لعدد يقارب 1,000 حساب تُختبر ولا تُفترض.

---

## 1. الرؤية والنتيجة المطلوبة

إنشاء تطبيق بريد إلكتروني احترافي للماك يجمع حسابات Gmail وMicrosoft Outlook/Hotmail وإيميلات الدومينات الخاصة (IMAP/SMTP) في واجهة واحدة، مع صندوق وارد موحد، ومجلدات خاصة بكل حساب، وبحث شامل في **المحتوى الذي تم تنزيله وفهرسته محليًا**، وإرسال ورد من عنوان الحساب الصحيح، ومزامنة مرنة منخفضة الاستهلاك، وحماية مناسبة لبيانات البريد.

### المقاييس الأساسية

- التطبيق يظل متجاوبًا عند إضافة حسابات عديدة؛ لا تنشئ اتصالًا دائمًا لكل حساب دون سياسة واضحة.
- تحميل البيانات أولًا بأول حسب الحاجة، لا تنزيل كامل تاريخ البريد والمرفقات تلقائيًا.
- لا تفقد الرسائل ولا تبدّل هوية حساب الإرسال بسبب صندوق الوارد الموحد.
- فشل المصادقة أو المزامنة في حساب لا يمنع بقية الحسابات من العمل.
- واجهة جميلة ومكثفة مثل برامج macOS، تدعم العربية والإنجليزية وتراعي إمكانية الوصول.
- إصدار `.app` و`.dmg` لتوزيع نسخة `arm64`، بعد نجاح البناء على Mac حقيقي أو بيئة macOS مناسبة.

### خارج نطاق MVP

- مزامنة بين عدة أجهزة عبر سيرفر خاص؛ مشاركة صناديق وارد متعددة المستخدمين؛ دعم EWS القديم؛ التشفير الطرفي للبريد؛ محرك ذكاء اصطناعي يحلل رسائل خاصة افتراضيًا؛ تطبيق iPhone؛ شراء خدمات البريد؛ تشغيل كخادم إرسال بريد؛ دعم جميع مزودي البريد النادرين بدون اختبارات توافق.

---

## 2. التقنيات المعتمدة (Technical stack)

| الطبقة | الاختيار | السبب |
|---|---|---|
| سطح المكتب | **Tauri 2** | تطبيق خفيف نسبيًا باستخدام WebKit/WKWebView الخاص بالماك |
| محرك التطبيق | **Rust stable** + Tokio | أداء جيد للعمليات غير المتزامنة وجدولة المزامنة |
| Frontend | **React + TypeScript + Vite** | تطوير واجهات مركبة قابلة للصيانة |
| التنسيق | **Tailwind CSS + shadcn/ui** (مع تكييف macOS) | سرعة بناء عناصر ذات جودة مع عدم الوقوع في القوالب الجاهزة |
| أيقونات | **Lucide** أو SVG محلي | اتساق بصري بدون حمل صور ضخمة |
| State management | Zustand بمحددات subscriptions دقيقة + TanStack Query عند الحاجة | تجنّب إعادة رسم القوائم كلها |
| التخزين | **SQLite** مع migrations وFTS5 | قراءة/بحث محلي، WAL، وفهارس واضحة |
| Provider APIs | Gmail REST API / Microsoft Graph / IMAP & SMTP | تغطية الأنواع الأساسية عبر adapters |
| OAuth | Authorization Code + PKCE بالمتصفح الافتراضي | لا تجمع كلمة مرور Google/Microsoft داخل التطبيق |
| بيانات الاعتماد | **macOS Keychain** من Rust | الاحتفاظ بالـtokens والأسرار خارج SQLite وWebView |
| عرض الرسالة | MIME parser + sanitized/isolated HTML viewer | مقاومة السكربتات والروابط والصور البعيدة |
| الاختبارات | Rust unit/integration + Vitest + Playwright أو بديل UI + اختبارات على macOS | سلامة البروتوكول والتجربة |

**قاعدة:** ثبّت نسخ الاعتمادات في lockfiles بعد التحقق من توافقها؛ لا تفترض إصدار Rust crate أو package ثابتًا من دون التأكد من أحدث توثيق رسمي وقت التنفيذ.

---

## 3. أنواع الحسابات والاتصال

### 3.1 Gmail

- إعداد Google OAuth لتطبيق Desktop، باستخدام المتصفح الافتراضي وPKCE وطريقة callback مصرح بها.
- استخدم Gmail API لمزامنة الرسائل/التصنيفات والإرسال والتعديل بحدود الأذونات الممنوحة.
- اجلب بيانات الحساب بعد التفويض لتحديد الحساب بالفعل وكشف الحسابات المكررة.
- استخدم `historyId` و`users.history.list` للمزامنة التدريجية متى أمكن، وعالج حالات انتهاء `historyId` بإعادة مزامنة منظمة للنطاق المناسب.
- راجع نطاقات `gmail.readonly` و`gmail.modify` و`gmail.send` وغيرها حسب الحاجة الفعلية؛ نطاقات القراءة/التعديل في Gmail قد تكون **restricted** وقد تتطلب تحقق OAuth، خاصة عند نشر التطبيق للآخرين. لا تعد المستخدم بأن عملية النشر التجاري خالية من المراجعة.
- لا تعتمد على كلمة مرور حساب Gmail العادية أو تخزّنها في قاعدة البيانات.

### 3.2 Microsoft Outlook / Hotmail / Microsoft 365

- Microsoft identity platform OAuth delegated access + PKCE؛ أدخل الحسابات الشخصية والمؤسسية ضمن التسجيل المناسب.
- استخدم Microsoft Graph: صلاحيات أدنى قدر مناسب مثل Mail.ReadWrite وMail.Send عند الحاجة مع `offline_access` حسب تدفق تسجيل الدخول.
- استخدم **per-folder delta query** لتتبع إضافة/حذف/تعديل الرسائل. احفظ `@odata.deltaLink` / `@odata.nextLink` كما تعيدها المنصة، فهي رموز opaque لا ينبغي تعديلها يدويًا.
- بعض حسابات المؤسسات تفرض سياسات Admin consent وConditional Access؛ اظهر الخطأ بدقة بدل التحايل على السياسات.

### 3.3 IMAP / SMTP الخاص بالدومينات

- إدخال اسم المستخدم/المضيف/المنفذ والأمان للـ IMAP (قراءة) وSMTP (إرسال)، مع auto-discovery آمن عندما يتوفر، والتحقق اليدوي قبل حفظ الحساب.
- دعم TLS والتحقق من الشهادات وعدم إسقاط التحقق الأمني لمجرد نجاح الاتصال.
- `UIDVALIDITY` + `UID` و`UIDNEXT` أو `MODSEQ/QRESYNC` فقط حيث تدعمها الخدمة؛ تعامل مع اختلاف إمكانيات خوادم IMAP وعدم إتاحة بعض الامتدادات.
- `IDLE` اختياري لعدد صغير من الحسابات المهمة فقط؛ لا تنشئ 1,000 اتصال IDLE مستمر.
- دعم OAuth2/XOAUTH2 إذا يدعم المزود، أو App Password عند السماح بها صراحة؛ لا تطلب كلمات المرور العادية لخدمات Google/Microsoft.
- توفير Test Connection يُظهر فشل تسجيل الدخول أو TLS أو SMTP بشكل مفهوم دون كشف كلمات المرور.

### 3.4 فصل مسؤوليات Provider adapters

أنشئ واجهة Rust (`MailProvider`) لتوحيد عمليات: `connect`, `list_folders`, `initial_sync`, `sync_delta`, `fetch_message_body`, `fetch_attachment`, `send_message`, `apply_action`, `disconnect`. لا تفرض نموذجا موحدا يطمس فروق Gmail labels وIMAP folders وGraph IDs. استخدم capabilities لكل مزود بدلاً من عرض أوامر غير مدعومة.

---

## 4. نطاق المميزات

### أساسي في MVP

1. إضافة/تعديل/إزالة حساب، اختبار الاتصال، وتوضيح حالات الصلاحية والصحة.
2. صندوق وارد موحد **Unified Inbox** + صندوق كل حساب منفصل + مجموعات حسابات قابلة للتسمية.
3. قائمة رسائل ذات تمرير افتراضي **virtualization**؛ غير مقروء، مميز، مرفقات، حساب المصدر.
4. قراءة رسالة بنص عادي أو HTML آمن، حظر الصور الخارجية افتراضيًا.
5. كتابة رسالة + رد + رد للكل + إعادة توجيه + مرفقات أساسية، مع اختيار From صريح.
6. حفظ المسودات محليًا؛ حالة إرسال واضحة ومحاولة آمنة عند الفشل لتجنب الإرسال المكرر.
7. بحث محلي شامل مع مرشحات للحساب/المرسل/الفترة/المرفقات، وبيان نطاق الرسائل المفهرسة.
8. تعديل read/unread وstarred والأرشفة/الحذف مع مراعاة اختلاف المزوّد وإمكانية undo.
9. إخطار اختياري لكل حساب/مجموعة، مع صلاحيات إشعارات النظام.
10. إعدادات لغة RTL/LTR، كثافة عرض، وضع داكن/فاتح/تلقائي، وسياسة المزامنة.
11. لوحة Health للحسابات تظهر paused/needs attention/rate-limited/syncing دون إغراق الشاشة.
12. التخزين المحلي للمرفقات عند الطلب، وسياسة تنظيف واضحة.

### بعد الاستقرار (V1.1+)

- قواعد وفرز آلي محلي، قوالب ردود، توقيعات لكل حساب، Smart Folders، إجراءات متعددة الحسابات موسعة، تصدير/استيراد، اختصارات أكثر، تعدد النوافذ، وفهرسة سياقية محسنة للعربية. أضفها بعد قياس أداء المزامنة وليس قبل استقرارها.

---

## 5. تجربة المستخدم والشاشات

اقرأ `UI_DESIGN_SPEC.md` ومهارة `skills/macos-mail-ui/SKILL.md` كمرجع إلزامي لتصميم وتدقيق الشاشة.

1. **Onboarding**: شاشة ترحيب سريعة، خيارات Gmail/Microsoft/Other، أذونات واضحة، وربط حساب واحد على الأقل، وحالة success أو retry.
2. **Main window**: ثلاثة أعمدة: شريط جانبي للحسابات والمجلدات، قائمة رسائل، قارئ الرسالة؛ تقسيم قابل للسحب والحفظ.
3. **Unified Inbox**: رسالة مميزة بمعرّف حساب المصدر؛ لا تعرض رسائل Sent/Drafts ضمن Unified Inbox دون اختيار المستخدم.
4. **Account Manager**: جدول حسابات سريع البحث، إجراءات pause/reconnect/test/remove وتحديد معدل مزامنة ونطاق البيانات.
5. **Compose Window**: From واضح دائمًا، To/Cc/Bcc، العنوان، المحتوى، المرفقات، المسودة، Send.
6. **Advanced Search**: نتائج فورية من الفهرس المحلي مع فهم هل الرسالة مفهرسة أم لم تصل بعد.
7. **Settings**: الأداء، السعة المحلية، الخصوصية، الإشعارات، واجهة الاستخدام، اختصارات لوحة المفاتيح.
8. **Sync & Activity**: حالة واحدة على مستوى التطبيق، تفصيل أخطاء لكل حساب دون تعطيل الحسابات الأخرى.
9. **Empty / Offline / Reauth states**: نصوص مفيدة وCTA محددة؛ لا تبدو مثل صفحة خطأ Webview.

### معايير الواجهة

- Native-looking macOS، وليست واجهة ويب بمساحة دعائية أو 30 كارت كبيرًا.
- دعم VoiceOver وfocus ring وkeyboard-only ومبدأ `prefers-reduced-motion`.
- واجهة عربية كاملة RTL أو إنجليزية LTR، مع حفظ اتجاه المحتوى الأصلي للرسائل والعناوين.
- لا تجمد الواجهة مع الرسائل الكثيرة، ولا تعتمد على تحميل 10,000 DOM row.

---

## 6. بنية النظام المقترحة

```text
React / TypeScript (trusted UI)
  ├── Window shell / virtualized lists / composer / settings
  ├── typed state (Zustand selectors) + query layer
  └── Tauri IPC commands/events (strictly validated payloads)
                │
                ▼
Rust core (Tauri 2)
  ├── App services: accounts, messages, search, compose, actions
  ├── Scheduler: fair queues, budgets, cancellation, throttling
  ├── Provider adapters
  │     ├── Gmail API + OAuth
  │     ├── Microsoft Graph + OAuth
  │     └── Generic IMAP/SMTP
  ├── MIME parsing + HTML sanitization + safe attachments
  ├── Secure secrets adapter → macOS Keychain
  ├── Persistence adapter → SQLite + FTS5 + migrations
  └── Structured logging with redaction
```

### مقترح بنية مجلدات المشروع

```text
mailhub/
├── package.json
├── pnpm-lock.yaml
├── src/
│   ├── app/               # shell + routes/windows
│   ├── components/        # accessible reusable desktop UI
│   ├── features/
│   │   ├── accounts/
│   │   ├── inbox/
│   │   ├── reader/
│   │   ├── compose/
│   │   ├── search/
│   │   └── settings/
│   ├── state/             # typed selectors, view state
│   ├── lib/               # API IPC adapters, safe utils
│   ├── locales/           # en, ar; RTL tests
│   └── styles/
├── src-tauri/
│   ├── tauri.conf.json
│   ├── capabilities/       # minimal plugin/IPC permissions
│   ├── icons/
│   ├── migrations/
│   └── src/
│       ├── main.rs
│       ├── lib.rs
│       ├── commands/
│       ├── core/           # domain models, service layer
│       ├── providers/      # Gmail / Graph / IMAP-SMTP
│       ├── sync/           # scheduler, worker, backoff
│       ├── storage/        # sqlite, migrations, queries
│       ├── security/       # Keychain, OAuth, HTML hygiene
│       ├── mime/
│       └── tests/
├── tests/                 # frontend + e2e fixtures
├── docs/                  # decisions, release, risks
└── README.md
```

### IPC contract (نماذج)

- `accounts_list() -> Vec<AccountSummary>`
- `account_add_begin(provider) -> PendingAuthResult`
- `account_add_finish(callback_code/state) -> AccountSummary` (validate PKCE/state)
- `account_test(id) -> HealthResult`
- `account_pause(id, paused)`
- `messages_page(scope, cursor, page_size) -> MessagePage`
- `message_open(account_id, remote_id) -> MessageDetail`
- `search_local(query, filters, cursor) -> SearchPage`
- `message_action(ids, action) -> ActionResult` (partial success accounted for)
- `draft_save(data) -> Draft`
- `message_send(draft_id, confirmation_context) -> SendResult`
- `sync_trigger(account_id?) -> SyncRequestAcknowledgement`
- Events: `sync_progress`, `account_status_changed`, `message_delta`, `send_status_changed` (throttled/batched).

**منع الوصول غير المصرح:** صلاحيات Tauri commands/plugins أقل قدر ممكن؛ لا تسمح للـfrontend بتنفيذ Rust shell أو أوامر عامة أو فتح ملفات من مسارات غير مصرح بها. افصل WebView غير الموثوق الذي يعرض HTML البريد عن الـWebView الذي يملك IPC.

---

## 7. تصميم قاعدة البيانات المحلية

استخدم `SQLite` مع migrations وWAL وفهارس مركبة؛ لا تخزن access/refresh tokens أو كلمات المرور في SQLite. مفتاح Keychain مرتبط بمعرف الحساب، وSQLite يحتفظ بمعرف مرجعي فقط.

### كيانات مهمة

| Entity | أعمدة أساسية | ملاحظات |
|---|---|---|
| `accounts` | id, provider, address, display_name, status, settings_json, last_sync_at | تعريف الحساب، provider capabilities |
| `folders` | id, account_id, provider_folder_id, kind, name, sync_cursor | لاحظ فرق Labels/Folders |
| `messages` | id, account_id, provider_message_id, thread_id, subject, sender, snippet, received_at, flags | فريد حسب (account_id, provider_message_id) |
| `message_folders` | message_id, folder_id | علاقة متعددة للتصنيفات |
| `message_bodies` | message_id, text_body, sanitized_body_ref, fetched_at | body lazy / no raw untrusted DOM |
| `attachments` | id, message_id, filename, mime, size, cache_path, cache_state | مسارات sandboxed، تنزيل عند الطلب |
| `sync_state` | account_id, folder_id, token_ref, state, last_success, error_code | متابعة التفاضل وحالة الاستئناف |
| `pending_actions` | id, account_id, operation, target_id, state, retries, idempotency_key | Retry بحذر وتجنب duplicate sending |
| `drafts` | id, account_id, recipients, subject, body_ref, updated_at, state | drafts محفوظة محليًا |
| `account_groups` | id, name, sort_index | مجموعات مخصصة |

### فهارس

- Unique index على `messages(account_id, provider_message_id)`.
- Index على `messages(account_id, received_at DESC)`, `messages(received_at DESC)`, `folders(account_id)`.
- FTS5 للحقول القابلة للبحث (subject, sender, body text عندما يتم تنزيله)، وإدارة تحديث الفهرس atomically بعد تعديل البيانات. اختبر دعم FTS5 الفعلي في نسخة SQLite المضمّنة.
- تدعم Unicode بحدود الـ tokenizer؛ اختبر العربية والمختلط عربي/إنجليزي ولا تعد ببحث صرفي متقدم بلا تنفيذ خاص.
- soft deletes/tombstones للمزامنة، وعمليات transaction للتحديثات؛ تحقق من UIDVALIDITY قبل دمج IMAP flags.
- تجنب حفظ raw MIME ضخم افتراضيًا؛ خزنه فقط عند الحاجة أو حسب إعدادات التخزين.

---

## 8. محرك المزامنة واسع النطاق

### قاعدة جدولة

لا تنفذ loop دائم لكل حساب. استخدم scheduler مركزي fair, bounded, cancellable، مع Task queue حسب الأولوية، وحالة الحساب والشبكة وسبات Mac.

**افتراضات البداية القابلة للقياس:**

- `global_parallel_syncs = 4` (قابل للتعديل بعد benchmark).
- `max_inflight_per_account = 1` في وضع المزامنة الافتراضي.
- جلب أولي آخر **30 يومًا أو أحدث 200 رسالة لكل حساب** وفق الأقل تحميلًا (مع إمكانية طلب بقية التاريخ يدويًا).
- صفحات 50–100 رسالة للـmetadata وفق قيود المزود؛ body عند فتح الرسالة أو البحث الموسع الاختياري.
- حساب نشط ومفتوح: فحص أسرع بطريقة صديقة للمزود؛ حساب نادر الاستخدام: interval أطول وجدولة متدرجة.
- provider/domain-level throttling؛ احترم `Retry-After`، `429`، network backoff/jitter، ومحددات الخدمة.
- Polling مع pause في Low Power Mode / Sleep / Offline قدر الإمكان، واستئناف آمن بعد wake.

**مهم:** هذه أرقام تنفيذ أولية وليست ضمان أداء أو معدلات API دائمة. قِسها واضبطها حسب نتائج 10/100/500 حسابًا في بيئة اختبار اصطناعية.

### State machine للحساب

`DISCONNECTED → AUTHENTICATING → READY → SYNCING → READY`  
`READY/SYNCING → OFFLINE | RATE_LIMITED | AUTH_REQUIRED | ERROR | PAUSED`  
تحدد واجهة المستخدم الإجراء الملائم (Retry/Reconnect/Pause/Details) لكل حالة. لا تخلط حالة “لا رسائل جديدة” مع “تعذر المزامنة”.

### خوارزمية مزامنة أولية

```text
for each eligible account (fair queue):
  acquire global limit + provider limit + per-account lock
  authenticate or refresh token securely
  load saved sync state
  fetch incremental delta when supported
  otherwise fetch bounded headers/flags since checkpoint
  apply changes to SQLite in transactions and update cursors last
  batch UI event(s), update progress
  release locks; schedule next run with jitter/backoff
```

### حالات الفشل الحرجة

- `Gmail historyId` غير صالح ⇒ re-bootstrap محدود ومصحوب برسالة status.
- `Graph delta` انتهى ⇒ re-bootstrap للمجلد المتأثر لا جميع حسابات Outlook.
- `IMAP UIDVALIDITY` تغيّر ⇒ invalidate folder UID mapping وإعادة بناء فهرس المجلد.
- تغير عنوان صندوق أو نقل رسالة ⇒ تعامل مع provider identity وlabels/folders دون ازدواج.
- Network outage ⇒ احتفظ بنتائج المزامنة السابقة، لا تمسح cache.
- Partial failure ⇒ retries محدودة مع سجل واضح، لا تفقد الإجراء المحلي غير المكتمل.

### التعامل مع آلاف الحسابات

- اختبار الواجهة بـ1000 سجل حساب synthetic لا يعني وجود 1000 اتصال فعلي.
- لا تفتح sockets + idle لكل حساب؛ لكل provider/domain budget، مع الاستئناف وتحديد أعلى الحسابات أولوية.
- لابد من خيار Pause للمجموعات ومنع sync كامل التاريخ تلقائيًا.
- لا تدّعِ قابلية دعم 1000 حساب منتج إلا بعد اختبار ضغط وتحقق من القيود الفعلية للخدمات.

---

## 9. الخصوصية والأمان

1. حافظ على access/refresh tokens وApp Passwords داخل **macOS Keychain** مع سياسة وصول مناسبة؛ لا تضعها في JS/localStorage أو SQLite أو ملفات `.env` المرفوعة إلى Git.
2. دعم OAuth 2.0 Authorization Code + PKCE في المتصفح الخارجي، تحقق من `state`, `nonce` إذا انطبق، وredirect URI وtoken expiry؛ لا تستخدم WebView مدمجًا لجمع كلمات مرور المزود.
3. اعرض HTML البريد بعد sanitization شديد وفي سياق منعزل، بدون `script`، وبدون صلاحية Tauri IPC، وبدون تحميل صور/remote resources افتراضيًا؛ امنع JavaScript URL, events, unsafe schemes.
4. روابط البريد الخارجية تفتح عبر معالج روابط آمن في النظام، مع تمييز اختلاف نص الرابط والوجهة عند الحاجة. لا تعرض محتوى remote تلقائيًا لتقليل tracking pixels.
5. المرفقات تُحمّل إلى مجلد مخصص داخل مساحة التطبيق، بأسماء آمنة ومسارات غير قابلة للـtraversal؛ لا تنفذ الملفات ولا تفتحها دون فعل صريح من المستخدم.
6. اتبع TLS والتحقق من الشهادات؛ تجنب `insecure_skip_verify` أو أي تجاوز أمني.
7. صلاحيات Tauri capabilities محدودة؛ امنع أوامر shell عامة أو الوصول لأي ملف غير لازم؛ تعزل واجهة قراءة HTML عن التطبيق الموثوق.
8. sanitize logs: لا body، لا email passwords، لا bearer tokens، لا raw authorization callbacks.
9. عند Remove Account: حذف بيانات Keychain المرتبطة، إيقاف jobs، وحذف cache المحلي فقط بعد اختيار/تأكيد واضحين؛ لا تحذف الرسائل من مزود البريد لمجرد إزالة الحساب من التطبيق.
10. SQLite عادي **غير مشفر تلقائيًا**. وضّح هذا؛ استخدم تشفير Mac FileVault إن كان مفعلًا على الجهاز أو أضف تشفيرًا اختياريًا للقاعدة في مرحلة لاحقة بعد تقييم التكلفة. لا تدّعِ وجود database encryption دون تنفيذه.
11. التنبيهات قد تكشف بيانات على شاشة القفل؛ اجعل previews اختيارية.
12. تجنّب جمع بيانات استخدام أو إرسالها للخارج في MVP. إن أضفت telemetry لاحقًا فتكون opt-in واضحة.

### مخاطر مزودي البريد

- نطاقات Gmail المقيدة وتحقيقات OAuth قد تكون مانع نشر عام؛ جهّز ملاحظات حول الاستخدام الشخصي/التطوير مقابل توزيع تجاري بعد مراجعة سياسات Google.
- Microsoft Graph تتغير صلاحياته ومعدلات استخدامه حسب المؤسسة؛ تعامل مع admin consent.
- بعض IMAP servers قد تحظر parallelism أو الإتصالات المتكررة؛ خفض الاتصال وعرض status ولا تحاول تجاوز قيود المزود.

---

## 10. سياسة التخزين المحلي والملفات

- Metadata-first, lazy body, on-demand attachments.
- شاشة إعدادات تعرض استهلاك كل حساب وتسمح بـ`Clear cached bodies` و`Clear downloaded attachments` مع تأثيرات واضحة.
- Default initial sync: آخر 30 يومًا أو آخر 200 رسالة؛ يمكن للمستخدم طلب مزيد من التاريخ أو “All Mail” لحساب بعينه مع إنذار بالمساحة والوقت.
- حد cache أولي للمرفقات (مثال 1GB عالميًا) مع LRU وprotect للملفات المستخدمة؛ الرقم قابل للتعديل ويحتاج اختبارًا.
- عند تطبيق delete/archive تحرّك state محليًا بشكل optimistic محدود ثم reconcile مع المزود؛ راجع نتائج التعديل ولا تنفذ delete نهائي صامتًا.
- Backup/restore وexport يمكن إضافتهما بعد MVP مع تأمين للملفات والصلاحيات.

**تقدير الحجم:** استهدف مبدئيًا ملف تطبيق Release بحجم 20–60MB بعد التثبيت **دون أي ضمان**، وسجّل القياس الفعلي؛ حجم الرسائل والمرفقات يزيد المساحة بصورة مستقلة وقد يصل لجيجابايت كثيرة.

---

## 11. خارطة الطريق التنفيذية (Phased delivery)

### Phase 0 — إعداد بيئة Mac وبنية المشروع

- افحص `uname -m` = `arm64`، ونسخة macOS، وXcode Command Line Tools وRust/Node/pnpm.
- أنشئ Tauri 2 + React/TS/Vite مع CSS tokens، إعداد Lint/Format/Test، وGit ignore للأسرار.
- اضبط `bundle.macOS.minimumSystemVersion = "13.0"` وbundle identifier مؤقتًا واضحًا، مع صلاحيات Tauri الأقل.
- أنشئ README و`docs/ARCHITECTURE_DECISIONS.md` وتوثيق خطوات التشغيل.
- **خروج المرحلة:** نافذة Mac تعمل محليًا على Apple Silicon، ودخول آمن للتطبيق بدون اتصال بالبريد.

### Phase 1 — تجربة واجهة ممتازة ببيانات تركيبية

- أنشئ three-pane shell، toolbar، sidebar، virtualized message list، reader placeholder آمن، composer، settings، account onboarding mock.
- صمم شاشة حالات empty/loading/offline/error/reconnect مع fixture عربي وإنجليزي.
- فعّل light/dark وRTL/LTR والتقسيم القابل للسحب واختصارات Mac الأساسية.
- استخدم `skills/macos-mail-ui` أثناء التنفيذ وقبل المراجعة النهائية.
- **خروج المرحلة:** جولة end-to-end بـfixtures بدون أزرار وهمية (أي mock action موسوم بوضوح) + صور Screenshots لكل وضع متاح.

### Phase 2 — Persistence + Rust services

- Migrations وجداول schema + FTS5 والتحقق من التفعيل + اختبارات ترحيل قاعدة البيانات.
- Commands typed IPC وerror model ثابت وevents مجمّعة؛ Message repository وlocal drafts.
- واجهة account settings وKeychain adapter واختبارات mock secrets (بدون فتح كلمات مرور في logs).
- **خروج المرحلة:** أضف/اعرض/ابحث/غيّر رسائل fixture من SQLite فعليًا، مع اختبارات.

### Phase 3 — IMAP/SMTP end-to-end

- حساب اختبار IMAP/SMTP تجريبي، TLS الصحيح، list folders، headers-first، fetch body، read/unread، reply/send، سحب مرفق معزول.
- Sync cursors/UIDVALIDITY، connection timeouts، partial failure، cancellation.
- **خروج المرحلة:** إرسال واستقبال على حساب اختبار حقيقي تحت سيطرة المطور، مع لقطات وأدلة اختبار (دون نسخ أسرار).

### Phase 4 — Gmail OAuth + API adapter

- Google Desktop OAuth + PKCE وإدارة tokens وscopes، read/send/action بما يسمح به التفويض، history/delta fallback.
- وثّق متطلبات Verification قبل التوزيع وليس بعده.
- **خروج المرحلة:** حساب Gmail اختبار يتزامن ويرسل من الحساب الصحيح، ويعاد توصيله عند انتهاء صلاحية التفويض.

### Phase 5 — Microsoft Graph adapter

- MSAL-compatible public client flow + PKCE، Graph mail read/write/send، per-folder delta.
- اختبر حساب Microsoft شخصيًا وآخر مؤسسيًا إذا كان متوفرًا، وإلا دوّن عدم تغطية المؤسسي.
- **خروج المرحلة:** Inbox + send + incremental sync + reauth على حساب اختبار.

### Phase 6 — Scale, QA, security review

- اختبارات fixtures من 10، 100، 500، و1000 حساب، مع محاكاة rate limits وإخفاقات الشبكة وSleep/Wake.
- قياس RAM/CPU/DB size وscroll FPS وعدد الاتصالات؛ لا تنشر أرقامًا غير مقاسة.
- فحص HTML sanitization، تعطل مزوّد واحد، recovery، أذونات Tauri، Keychain، RTL، لوحة المفاتيح.
- **خروج المرحلة:** تقرير أداء صريح يذكر حد الحسابات المختبَر بالفعل.

### Phase 7 — إصدار arm64 نهائي

- Release build `.app` و`.dmg` لـ `aarch64-apple-darwin` على Mac.
- مراجعة privacy/perms، signature/notarization عند توزيع التطبيق خارج جهاز المطور وعندما تتوفر شهادات Apple اللازمة.
- Build reproducibility بالـlockfiles وتعليمات تحديث/نسخ احتياطي/حذف بيانات محلية.
- **خروج المرحلة:** ملفات release فعلية تم تشغيلها على M1، مع checksum ومذكرة قياسات الحجم والأداء، ولا تقل `build succeeded` إلا بعد تنفيذ الأمر.

---

## 12. أوامر إعداد مبدئية على Mac (ليست ناتج بناء)

```bash
# Verify Apple Silicon + Xcode tools
uname -m
sw_vers
xcode-select -p

# Install stable Rust with rustup if not present, then add the arm64 target
rustup target add aarch64-apple-darwin

# In the new app project (once created with official Tauri 2 starter):
# Install dependencies / developer workflow
pnpm install
pnpm exec tauri dev

# Apple Silicon release (on macOS; verify current Tauri CLI flags)
pnpm exec tauri build --target aarch64-apple-darwin

# Inspect generated app architecture after actual build
file src-tauri/target/aarch64-apple-darwin/release/bundle/macos/*.app/Contents/MacOS/*
```

**مهم:** لا تقم بتشغيل أمر build على Linux وتعلن أنه ينتج تطبيق macOS موقّعًا. macOS app bundling والتوقيع/notarization يجرى في بيئة macOS مناسبة. راجع التوثيق الرسمي لإصدار Tauri المثبّت وقت التنفيذ.

---

## 13. خطة الاختبار ومعايير النجاح

ارجع إلى `docs/ACCEPTANCE_CHECKLIST.md` للاختبارات المنفذة خطوة بخطوة. بشكل مختصر:

- Rust `cargo test`, formatter وClippy؛ frontend TypeScript typecheck + Vitest + lint.
- Smoke tests على جهاز Mac فعلي: فتح وتغيير الإعدادات، إضافة الحسابات، قراءة ورد من العنوان الصحيح، إرسال SMTP/Gmail/Graph، إعادة اتصال.
- Test matrix: Arabic/English, dark/light, slow/offline, provider 429, OAuth revoked, duplicate account, long subject, odd encodings, body with hostile HTML, big attachments.
- اختبار Keychain: no secrets in database/logs; إزالة الحساب تمحو credentials المحلية وتُظهر خيار إزالة الكاش.
- اختبار محرك المزامنة: incremental deltas لا تحذف بيانات صحيحة، UIDVALIDITY reset لا يسبب فقد دائم.
- UI: لا مجلدات فارغة بلا توجيه، لا تعطيل global بسبب حساب واحد، virtualization صحيحة، focus، VoiceOver، الاختصارات.
- الأداء: اجمع قياسات حقيقية من 10/100/500 حساب synthetic؛ `1000` فقط بعد validation مع عدم تجاوز حدود provider sandbox.

### Targets قابلة للقياس وليست وعودًا

- اختيار رسالة cached واستجابة UI سريعة (هدف أولي أقل من 150ms على M1 بعد الاستقرار).
- التمرير داخل Inbox virtualized بدون jank محسوس عند آلاف الرسائل.
- إبقاء العمليات الشبكية المحدودة ضمن concurrency budgets، بدون 1000 اتصال دائم.
- توثيق حجم التطبيق المحقق والذاكرة والاستهلاك في Release، وليس توقعات Debug.

---

## 14. كيف يُنفَّذ بواسطة Agent بدون تضييع الوقت

**قواعد العمل:**

1. اقرأ كل الوثائق المطلوبة، واعرض checklist قصيرة ثم أنشئ المشروع بالفعل، لا تكتفِ بكتابة pseudo-code.
2. امشِ مرحلة بمرحلة؛ بعد كل مرحلة نفّذ lint/typecheck/test/build المعني، وأصلح الأخطاء قبل التقدم.
3. وثّق أي اختيار أو نقص في `docs/ARCHITECTURE_DECISIONS.md` ولا تخمّن قيود مزود البريد.
4. لا تضع مفاتيح API أو refresh tokens أو كلمات مرور في الكود ولا تطلبها في المحادثة.
5. لا تنفذ Gmail OAuth أو Graph بدون بيانات تسجيل OAuth اللازمة؛ أنشئ setup wizard واضحًا ومواضع تكوين موثقة وتعامل مع غياب هذه الإعدادات بشفافية.
6. أبقِ Mock mode منفصلًا وموسومًا، واحذف مزاعم نجاح الربط الحقيقي عند استخدامه.
7. صمّم الواجهة أولًا بجودة فعلية ثم اربطها بخدمات Rust، بدل توزيع الواجهة على صفحات لا تحتاجها.
8. عند تغييرات المزامنة اختبر إعادة الاستئناف وpartial failure قبل اعتبار الكود جاهزًا.
9. قدّم في كل مرحلة **ملفات تغيّرت / أوامر اختبرت / نتائج فعلية / نواقص متبقية**.
10. لا تبدأ ميزات ذكاء اصطناعي أو cloud backend أو Universal Intel دون موافقة جديدة.

**Definition of Done النهائي:** إصدار macOS ARM64 حقيقي مُشغَّل، حسابات حقيقية اختبارية Gmail/Graph/IMAP إذا توفرت تصاريحها، مزامنة وإرسال وبحث محلي ومرفقات محمية، UI قوية ومدققة، اختبارات passing، README نظيف، وقياسات Release فعلية. دون هذه الأدلة اعتبره prototype أو partial build فقط.

---

## 15. قرارات تحتاج مراجعة لاحقًا (لا توقف بناء البداية)

- العدد الفعلي للحسابات وطبيعة الاستضافة: اضبط scheduling budgets بعد معرفته، وابدأ افتراضياً من 100 حساب test.
- هل كل الرسائل مهمة أم آخر 30 يومًا فقط؟ اجعل هذا إعدادًا لا قرارًا لا رجعة فيه.
- تفضيل واجهة عربية أو إنجليزية افتراضيًا: استخدم لغة النظام مع خيار تغيير.
- الحاجة إلى رمز دخول محلي/تشفير إضافي لقاعدة الرسائل: stage لاحقة بعد threat model.
- هل التوزيع شخصي أم على متجر Apple؟ يختلف مسار التوقيع/التحقق/توافق APIs.

## 16. مراجع رسمية

موثقة بروابط وتاريخ تحقق في `docs/REFERENCE_LINKS.md`. لا تعتمد على هذه الوثيقة وحدها كبديل لسياسات OAuth أو تعليمات Tauri الحالية وقت التنفيذ.
