-- ============================================================
-- OOP Course Module: Topics, Phase 2, and Curriculum Modules
-- Part 1 of 3 — structural data only
-- ============================================================

-- ---------------------------------------------------------------------------
-- 5 new OOP topics in the existing `topics` table
-- ---------------------------------------------------------------------------
INSERT INTO topics (id, name, description, icon) VALUES
  ('11111111-0009-0000-0000-000000000000', 'מחלקות ואובייקטים',       'class, __init__, self, תכונות ומתודות',            '🏛️'),
  ('11111111-000a-0000-0000-000000000000', 'ירושה',                   'super(), דריסת מתודות, MRO, ירושה מרובה',          '🧬'),
  ('11111111-000b-0000-0000-000000000000', 'פולימורפיזם',             'duck typing, מחלקות אבסטרקטיות, ABC',              '🎭'),
  ('11111111-000c-0000-0000-000000000000', 'קבצים וחריגות',           'open/read/write, try/except/finally, raise',       '📄'),
  ('11111111-000d-0000-0000-000000000000', 'דקורטורים ומתודות מיוחדות', '@property, __str__, __repr__, @staticmethod',    '✨')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Phase 2: Advanced Python (OOP, Files, Decorators)
-- ---------------------------------------------------------------------------
INSERT INTO curriculum_phases (id, track_id, "order", slug, content_id, name, description)
VALUES (
  'bbbbbbbb-0002-0000-0000-000000000000',
  'aaaaaaaa-0001-0000-0000-000000000000',
  2,
  'python-advanced',
  'phase.python-advanced',
  'פייתון מתקדם',
  'תכנות מונחה-עצמים, טיפול בקבצים וחריגות, דקורטורים ומתודות מיוחדות.'
)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 5 Curriculum Modules for Phase 2
-- ---------------------------------------------------------------------------

-- Module 1: Classes & Objects
INSERT INTO curriculum_modules (id, phase_id, "order", slug, content_id, name, description, icon, topic_ids)
VALUES (
  'cccccccc-0009-0000-0000-000000000000',
  'bbbbbbbb-0002-0000-0000-000000000000',
  1,
  'classes-objects',
  'module.python.classes-objects',
  'מחלקות ואובייקטים',
  'הגדרת מחלקות, מתודת __init__, self, תכונות ומתודות של אובייקט.',
  '🏛️',
  ARRAY['11111111-0009-0000-0000-000000000000']::uuid[]
)
ON CONFLICT (id) DO NOTHING;

-- Module 2: Inheritance
INSERT INTO curriculum_modules (id, phase_id, "order", slug, content_id, name, description, icon, topic_ids)
VALUES (
  'cccccccc-000a-0000-0000-000000000000',
  'bbbbbbbb-0002-0000-0000-000000000000',
  2,
  'inheritance',
  'module.python.inheritance',
  'ירושה',
  'ירושה ממחלקת אב, super(), דריסת מתודות, סדר הרזולוציה (MRO).',
  '🧬',
  ARRAY['11111111-000a-0000-0000-000000000000']::uuid[]
)
ON CONFLICT (id) DO NOTHING;

-- Module 3: Polymorphism
INSERT INTO curriculum_modules (id, phase_id, "order", slug, content_id, name, description, icon, topic_ids)
VALUES (
  'cccccccc-000b-0000-0000-000000000000',
  'bbbbbbbb-0002-0000-0000-000000000000',
  3,
  'polymorphism',
  'module.python.polymorphism',
  'פולימורפיזם',
  'duck typing, מחלקות אבסטרקטיות, פולימורפיזם עם פונקציות מובנות.',
  '🎭',
  ARRAY['11111111-000b-0000-0000-000000000000']::uuid[]
)
ON CONFLICT (id) DO NOTHING;

-- Module 4: Files & Exceptions
INSERT INTO curriculum_modules (id, phase_id, "order", slug, content_id, name, description, icon, topic_ids)
VALUES (
  'cccccccc-000c-0000-0000-000000000000',
  'bbbbbbbb-0002-0000-0000-000000000000',
  4,
  'files-exceptions',
  'module.python.files-exceptions',
  'קבצים וחריגות',
  'קריאה וכתיבה לקבצים, מנהל הקשר with, try/except/finally, raise.',
  '📄',
  ARRAY['11111111-000c-0000-0000-000000000000']::uuid[]
)
ON CONFLICT (id) DO NOTHING;

-- Module 5: Decorators & Special Methods
INSERT INTO curriculum_modules (id, phase_id, "order", slug, content_id, name, description, icon, topic_ids)
VALUES (
  'cccccccc-000d-0000-0000-000000000000',
  'bbbbbbbb-0002-0000-0000-000000000000',
  5,
  'decorators-special',
  'module.python.decorators-special',
  'דקורטורים ומתודות מיוחדות',
  '@property, __str__, __repr__, __eq__, @staticmethod ו-@classmethod.',
  '✨',
  ARRAY['11111111-000d-0000-0000-000000000000']::uuid[]
)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- i18n: Hebrew translations for Phase 2 content
-- ---------------------------------------------------------------------------
INSERT INTO curriculum_translations (content_id, locale, fields) VALUES
  ('phase.python-advanced', 'he', '{
    "name": "פייתון מתקדם",
    "description": "תכנות מונחה-עצמים, טיפול בקבצים וחריגות, דקורטורים ומתודות מיוחדות."
  }'),
  ('module.python.classes-objects', 'he', '{
    "name": "מחלקות ואובייקטים",
    "description": "הגדרת מחלקות, מתודת __init__, self, תכונות ומתודות של אובייקט."
  }'),
  ('module.python.inheritance', 'he', '{
    "name": "ירושה",
    "description": "ירושה ממחלקת אב, super(), דריסת מתודות, סדר הרזולוציה (MRO)."
  }'),
  ('module.python.polymorphism', 'he', '{
    "name": "פולימורפיזם",
    "description": "duck typing, מחלקות אבסטרקטיות, פולימורפיזם עם פונקציות מובנות."
  }'),
  ('module.python.files-exceptions', 'he', '{
    "name": "קבצים וחריגות",
    "description": "קריאה וכתיבה לקבצים, מנהל הקשר with, try/except/finally, raise."
  }'),
  ('module.python.decorators-special', 'he', '{
    "name": "דקורטורים ומתודות מיוחדות",
    "description": "@property, __str__, __repr__, __eq__, @staticmethod ו-@classmethod."
  }')
ON CONFLICT (content_id, locale) DO NOTHING;
