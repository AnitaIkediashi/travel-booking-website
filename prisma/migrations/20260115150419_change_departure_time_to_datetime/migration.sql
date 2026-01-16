/* Manual Migration: Convert String dates to DateTime (Timestamp) 
  This avoids dropping columns and losing data.
*/

-- 1. Convert Segment Table
ALTER TABLE "Segment" 
  ALTER COLUMN "departure_time" TYPE TIMESTAMP(3) 
  USING "departure_time"::TIMESTAMP(3),
  ALTER COLUMN "arrival_time" TYPE TIMESTAMP(3) 
  USING "arrival_time"::TIMESTAMP(3);

-- 2. Convert Legs Table
ALTER TABLE "Legs" 
  ALTER COLUMN "departure_time" TYPE TIMESTAMP(3) 
  USING "departure_time"::TIMESTAMP(3),
  ALTER COLUMN "arrival_time" TYPE TIMESTAMP(3) 
  USING "arrival_time"::TIMESTAMP(3);

-- 3. Re-create the Index (Prisma expects this based on your schema)
CREATE INDEX IF NOT EXISTS "Segment_departure_time_idx" ON "Segment"("departure_time");