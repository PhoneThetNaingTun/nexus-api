-- Store only the uploaded filename for existing doctor profile images.
UPDATE "User" AS "user"
SET "image" = regexp_replace(
  split_part("user"."image", '?', 1),
  '^.*/',
  ''
)
FROM "DoctorProfile" AS "doctor"
WHERE "doctor"."user_id" = "user"."id"
  AND "user"."image" IS NOT NULL
  AND "user"."image" <> '';
