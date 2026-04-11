-- ============================================================
-- Seed: DevOps Engineer Track — Phase 1 (Python Fundamentals)
--
-- Maps the existing 8 Python topics (fixed UUIDs from migration
-- 20260403000004) to curriculum_modules.
--
-- UUIDs used for track/phase/modules are stable so that this
-- seed can be re-run safely (ON CONFLICT DO NOTHING).
-- ============================================================

-- ---------------------------------------------------------------------------
-- Track: DevOps Engineer
-- Note: "DevOps Engineer" is a proper noun / industry brand name used
-- internationally and is NOT translated. The description field is in the
-- track's default locale (Hebrew). All locale-specific fields are also
-- provided in the curriculum_translations table below.
-- ---------------------------------------------------------------------------
INSERT INTO curriculum_tracks (id, slug, content_id, name, description, default_locale)
VALUES (
  'aaaaaaaa-0001-0000-0000-000000000000',
  'devops-engineer',
  'track.devops-engineer',
  'DevOps Engineer',
  'מסלול הכשרה מלא להנדסת DevOps: פייתון, לינוקס, Git, רשתות, Docker, CI/CD וענן.',
  'he'
)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Phase 1: Python Fundamentals
-- ---------------------------------------------------------------------------
INSERT INTO curriculum_phases (id, track_id, "order", slug, content_id, name, description)
VALUES (
  'bbbbbbbb-0001-0000-0000-000000000000',
  'aaaaaaaa-0001-0000-0000-000000000000',
  1,
  'python-fundamentals',
  'phase.python-fundamentals',
  'יסודות פייתון',
  'כל מה שצריך לדעת כדי לתכנת בפייתון: משתנים, תנאים, לולאות, פונקציות ומבני נתונים.'
)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Modules (one per topic, ordered)
-- topic_ids reference the fixed UUIDs from 20260403000004
-- ---------------------------------------------------------------------------

-- Module 1: Variables & IO  →  topic 0001
INSERT INTO curriculum_modules (id, phase_id, "order", slug, content_id, name, description, icon, topic_ids)
VALUES (
  'cccccccc-0001-0000-0000-000000000000',
  'bbbbbbbb-0001-0000-0000-000000000000',
  1,
  'variables-io',
  'module.python.variables-io',
  'משתנים, טיפוסים וקלט/פלט',
  'הגדרת משתנים, פונקציות print ו-input, המרת טיפוסים (int, float, str, bool).',
  '📦',
  ARRAY['11111111-0001-0000-0000-000000000000']::uuid[]
)
ON CONFLICT (id) DO NOTHING;

-- Module 2: Arithmetic & Operators  →  topic 0002
INSERT INTO curriculum_modules (id, phase_id, "order", slug, content_id, name, description, icon, topic_ids)
VALUES (
  'cccccccc-0002-0000-0000-000000000000',
  'bbbbbbbb-0001-0000-0000-000000000000',
  2,
  'arithmetic',
  'module.python.arithmetic',
  'אריתמטיקה ואופרטורים',
  'פעולות אריתמטיות, עדיפות אופרטורים, חילוק שלם, מודולו ופונקציות math.',
  '🔢',
  ARRAY['11111111-0002-0000-0000-000000000000']::uuid[]
)
ON CONFLICT (id) DO NOTHING;

-- Module 3: Conditions  →  topic 0003
INSERT INTO curriculum_modules (id, phase_id, "order", slug, content_id, name, description, icon, topic_ids)
VALUES (
  'cccccccc-0003-0000-0000-000000000000',
  'bbbbbbbb-0001-0000-0000-000000000000',
  3,
  'conditions',
  'module.python.conditions',
  'תנאים',
  'if / elif / else, אופרטורים לוגיים (and, or, not) והשוואות.',
  '🔀',
  ARRAY['11111111-0003-0000-0000-000000000000']::uuid[]
)
ON CONFLICT (id) DO NOTHING;

-- Module 4: Loops  →  topic 0004
INSERT INTO curriculum_modules (id, phase_id, "order", slug, content_id, name, description, icon, topic_ids)
VALUES (
  'cccccccc-0004-0000-0000-000000000000',
  'bbbbbbbb-0001-0000-0000-000000000000',
  4,
  'loops',
  'module.python.loops',
  'לולאות',
  'for + range(), while, break, continue, לולאות מקוננות ותבניות לולאה נפוצות.',
  '🔁',
  ARRAY['11111111-0004-0000-0000-000000000000']::uuid[]
)
ON CONFLICT (id) DO NOTHING;

-- Module 5: Functions  →  topic 0005
INSERT INTO curriculum_modules (id, phase_id, "order", slug, content_id, name, description, icon, topic_ids)
VALUES (
  'cccccccc-0005-0000-0000-000000000000',
  'bbbbbbbb-0001-0000-0000-000000000000',
  5,
  'functions',
  'module.python.functions',
  'פונקציות',
  'def, פרמטרים, ערך חזרה, ארגומנטים ברירת מחדל, תחום (scope), רקורסיה ו-import.',
  '🧩',
  ARRAY['11111111-0005-0000-0000-000000000000']::uuid[]
)
ON CONFLICT (id) DO NOTHING;

-- Module 6: Strings  →  topic 0006
INSERT INTO curriculum_modules (id, phase_id, "order", slug, content_id, name, description, icon, topic_ids)
VALUES (
  'cccccccc-0006-0000-0000-000000000000',
  'bbbbbbbb-0001-0000-0000-000000000000',
  6,
  'strings',
  'module.python.strings',
  'מחרוזות',
  'len(), אינדוקס, slicing, .upper(), .lower(), .find(), .replace(), .split(), .join(), in.',
  '🔤',
  ARRAY['11111111-0006-0000-0000-000000000000']::uuid[]
)
ON CONFLICT (id) DO NOTHING;

-- Module 7: Lists  →  topic 0007
INSERT INTO curriculum_modules (id, phase_id, "order", slug, content_id, name, description, icon, topic_ids)
VALUES (
  'cccccccc-0007-0000-0000-000000000000',
  'bbbbbbbb-0001-0000-0000-000000000000',
  7,
  'lists',
  'module.python.lists',
  'רשימות',
  'אינדוקס, slicing, .append(), .pop(), .sort(), .reverse(), list comprehensions, רשימות מקוננות.',
  '📋',
  ARRAY['11111111-0007-0000-0000-000000000000']::uuid[]
)
ON CONFLICT (id) DO NOTHING;

-- Module 8: Tuples, Sets & Dicts  →  topic 0008
INSERT INTO curriculum_modules (id, phase_id, "order", slug, content_id, name, description, icon, topic_ids)
VALUES (
  'cccccccc-0008-0000-0000-000000000000',
  'bbbbbbbb-0001-0000-0000-000000000000',
  8,
  'tuples-sets-dicts',
  'module.python.tuples-sets-dicts',
  'טאפלים, סטים ומילונים',
  'יצירה וגישה ל-tuple, פעולות קבוצה (union, intersection), יצירת dict, גישה ואיטרציה.',
  '🗂️',
  ARRAY['11111111-0008-0000-0000-000000000000']::uuid[]
)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- i18n: Hebrew translations for all content entities (default locale)
-- ---------------------------------------------------------------------------

INSERT INTO curriculum_translations (content_id, locale, fields) VALUES
  ('track.devops-engineer', 'he', '{
    "name": "DevOps Engineer",
    "description": "מסלול הכשרה מלא להנדסת DevOps: פייתון, לינוקס, Git, רשתות, Docker, CI/CD וענן."
  }'),
  ('phase.python-fundamentals', 'he', '{
    "name": "יסודות פייתון",
    "description": "כל מה שצריך לדעת כדי לתכנת בפייתון: משתנים, תנאים, לולאות, פונקציות ומבני נתונים."
  }'),
  ('module.python.variables-io', 'he', '{
    "name": "משתנים, טיפוסים וקלט/פלט",
    "description": "הגדרת משתנים, פונקציות print ו-input, המרת טיפוסים (int, float, str, bool)."
  }'),
  ('module.python.arithmetic', 'he', '{
    "name": "אריתמטיקה ואופרטורים",
    "description": "פעולות אריתמטיות, עדיפות אופרטורים, חילוק שלם, מודולו ופונקציות math."
  }'),
  ('module.python.conditions', 'he', '{
    "name": "תנאים",
    "description": "if / elif / else, אופרטורים לוגיים (and, or, not) והשוואות."
  }'),
  ('module.python.loops', 'he', '{
    "name": "לולאות",
    "description": "for + range(), while, break, continue, לולאות מקוננות ותבניות לולאה נפוצות."
  }'),
  ('module.python.functions', 'he', '{
    "name": "פונקציות",
    "description": "def, פרמטרים, ערך חזרה, ארגומנטים ברירת מחדל, תחום (scope), רקורסיה ו-import."
  }'),
  ('module.python.strings', 'he', '{
    "name": "מחרוזות",
    "description": "len(), אינדוקס, slicing, .upper(), .lower(), .find(), .replace(), .split(), .join(), in."
  }'),
  ('module.python.lists', 'he', '{
    "name": "רשימות",
    "description": "אינדוקס, slicing, .append(), .pop(), .sort(), .reverse(), list comprehensions, רשימות מקוננות."
  }'),
  ('module.python.tuples-sets-dicts', 'he', '{
    "name": "טאפלים, סטים ומילונים",
    "description": "יצירה וגישה ל-tuple, פעולות קבוצה (union, intersection), יצירת dict, גישה ואיטרציה."
  }')
ON CONFLICT (content_id, locale) DO NOTHING;
