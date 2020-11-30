-- Temporary queries to do unit testing about PUL-9 story

-- Prepare queries for the test suite:
-- Turn a lecture to be online instead of in presence

UPDATE lecture
SET presence = 1, ref_class = 0 
WHERE id = 1;

-- Beware that the date may not be modified, perhaps due to
-- foreign keys integrity
-- Update the date with the current time, add less than 1800
-- and concatenate three zeroes at the end
UPDATE lecture
SET date = 1606047330000
WHERE id = 4;