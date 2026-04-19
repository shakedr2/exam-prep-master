-- ============================================================
-- Seed: DevOps Engineer Track — Networking Fundamentals (topic-level)
--
-- Context: Phase 3 (Epic #298) — question-source-of-truth
-- reconciliation. The `networking_fundamentals` topic UUID
-- (22222222-0004-0000-0000-000000000000) is already declared in
-- src/data/topicTutorials.ts as part of the canonical slug↔UUID map,
-- but the referenced seed migration
-- (20260417000001_seed_networking_fundamentals.sql) was never
-- checked in — so Practice returned 0 questions for this topic while
-- the module card advertised 5 (from the static catalog).
--
-- This migration closes that gap by transcribing the 5 existing
-- static networking questions (src/data/questions.ts, entries
-- `networking_fundamentals_1..5`) into the Supabase `questions`
-- table under the declared UUID. No new content is authored — this
-- is a pure relocation of already-shipping content to the canonical
-- source.
--
-- NOT seeded here (deferred to Phase 5 DevOps content epic #242):
--   * curriculum_lessons / concepts / practices rows
--   * Additional questions beyond the initial 5
--
-- All UUIDs are fixed for idempotent re-runs (ON CONFLICT DO NOTHING).
-- ============================================================

-- ---------------------------------------------------------------------------
-- Topic row (only insert; existing data untouched).
-- ---------------------------------------------------------------------------
INSERT INTO topics (id, name, description, icon) VALUES
  ('22222222-0004-0000-0000-000000000000', 'יסודות רשת', 'TCP/IP, DNS, פורטים, HTTP ו-HTTPS', '🌐')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Questions — transcribed from src/data/questions.ts networking_fundamentals_1..5
-- ---------------------------------------------------------------------------

-- Q1 — easy, DNS purpose
INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0031-0000-0000-000000000000',
  '22222222-0004-0000-0000-000000000000',
  'multiple_choice', 'easy', 'networking_dns',
  'מהו תפקידו של DNS ברשת האינטרנט?',
  'להצפין את התעבורה בין שרתים',
  'לתרגם שמות דומיין (למשל example.com) לכתובות IP',
  'לנהל חיבורי TCP בין לקוח לשרת',
  'לחסום גישה לאתרים לפי כתובת IP',
  'b',
  'DNS (Domain Name System) הוא "ספר הטלפונים" של האינטרנט — הוא מתרגם שם דומיין קריא לבני אדם (example.com) לכתובת IP שהמחשב מבין (93.184.216.34). ללא DNS היה צורך לזכור את כתובות ה-IP של כל שרת.',
  'לבלבל בין DNS ל-DHCP. DHCP מחלק כתובות IP למכשירים ברשת פנימית, בעוד DNS ממיר שמות לכתובות IP באופן כללי.',
  false
) ON CONFLICT (id) DO NOTHING;

-- Q2 — easy, HTTPS default port
INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0032-0000-0000-000000000000',
  '22222222-0004-0000-0000-000000000000',
  'multiple_choice', 'easy', 'networking_ports',
  'איזה פורט (port) משמש כברירת מחדל לתעבורת HTTPS?',
  '21',
  '22',
  '80',
  '443',
  'd',
  'פורט 443 הוא פורט ברירת המחדל של HTTPS (HTTP מוצפן דרך TLS). פורט 80 הוא של HTTP רגיל (לא מוצפן), פורט 22 הוא של SSH, ופורט 21 הוא של FTP.',
  'לחשוב ש-HTTP ו-HTTPS חולקים את אותו פורט. הם נפרדים כדי שהדפדפן ידע אם להתחיל handshake של TLS.',
  false
) ON CONFLICT (id) DO NOTHING;

-- Q3 — medium, TCP vs UDP
INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0033-0000-0000-000000000000',
  '22222222-0004-0000-0000-000000000000',
  'multiple_choice', 'medium', 'networking_protocols',
  'מה ההבדל העיקרי בין TCP ל-UDP?',
  'TCP מאובטח יותר מ-UDP',
  'TCP מבטיח הגעת חבילות ושומר על סדר, UDP מהיר יותר אך לא מבטיח משלוח',
  'UDP משמש רק בתוך רשתות פנימיות ו-TCP באינטרנט',
  'אין הבדל מעשי, שניהם זהים',
  'b',
  'TCP (Transmission Control Protocol) הוא פרוטוקול מבוסס חיבור (connection-oriented) שמבצע handshake, מבטיח הגעת כל החבילות ושומר על הסדר — מתאים ל-HTTP, SSH, מיילים. UDP (User Datagram Protocol) שולח חבילות בלי לוודא הגעה או סדר — מהיר יותר, מתאים ל-DNS, וידאו חי, משחקים מקוונים.',
  'לחשוב ש-UDP "פחות טוב" מ-TCP. בכל פרוטוקול יש טריידאוף בין אמינות למהירות.',
  false
) ON CONFLICT (id) DO NOTHING;

-- Q4 — medium, IP address role
INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0034-0000-0000-000000000000',
  '22222222-0004-0000-0000-000000000000',
  'multiple_choice', 'medium', 'networking_ip',
  'מה תפקידה של כתובת IP במודל TCP/IP?',
  'לזהות באופן ייחודי מכשיר או ממשק רשת ולאפשר ניתוב חבילות ביניהם',
  'להצפין את תוכן התקשורת בין שני מחשבים',
  'למנוע התקפות DDoS ברמת הרשת',
  'לשמור את היסטוריית הגלישה של המשתמש',
  'a',
  'כתובת IP (Internet Protocol address) מזהה באופן ייחודי מכשיר או ממשק רשת. הנתבים (routers) משתמשים בכתובות ה-IP כדי לנתב חבילות ממקור ליעד. IPv4 הוא 32 ביט (למשל 192.168.1.10), ו-IPv6 הוא 128 ביט.',
  'לבלבל בין כתובת IP פרטית (192.168.x.x, 10.x.x.x) לכתובת ציבורית. פרטית תקפה רק ברשת מקומית.',
  false
) ON CONFLICT (id) DO NOTHING;

-- Q5 — hard, HTTP request lifecycle
INSERT INTO questions (
  id, topic_id, question_type, difficulty, pattern_family,
  text, option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
) VALUES (
  '33333333-0035-0000-0000-000000000000',
  '22222222-0004-0000-0000-000000000000',
  'multiple_choice', 'hard', 'networking_http_flow',
  'לקוח שולח בקשת HTTP GET ל-https://example.com. איזה רצף שלבים תיאורי ביותר?',
  'השרת מחזיר מיד HTML, ללא שלבים נוספים',
  'DNS lookup → TCP handshake → TLS handshake → בקשת HTTP → תגובת HTTP',
  'TLS handshake → DNS lookup → TCP handshake → בקשת HTTP → תגובה',
  'הדפדפן שולח את הבקשה ישירות לנתב הביתי שמחזיר תשובה',
  'b',
  'השלבים הם: (1) DNS lookup — המרת example.com לכתובת IP. (2) TCP handshake (SYN / SYN-ACK / ACK) — יצירת חיבור מוכוון עם השרת. (3) TLS handshake — החלפת מפתחות הצפנה לערוץ מאובטח (רק ב-HTTPS). (4) שליחת בקשת HTTP GET. (5) השרת מחזיר תגובת HTTP עם גוף התוכן.',
  'לדלג על TLS handshake או להניח שהוא קורה לפני TCP — TLS רץ על גבי חיבור TCP קיים.',
  false
) ON CONFLICT (id) DO NOTHING;
