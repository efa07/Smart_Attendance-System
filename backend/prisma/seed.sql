-- Sample shift data for default shifts
-- Morning Shift: 8:00 AM - 4:00 PM
-- Evening Shift: 4:00 PM - 12:00 AM
-- Night Shift: 12:00 AM - 8:00 AM

-- Insert default shifts for each user
INSERT INTO "Shift" ("userId", "shiftType", "shiftStart", "shiftEnd")
SELECT 
    u.id,
    CASE 
        WHEN u.department = 'IT' THEN 'Morning'
        WHEN u.department = 'HR' THEN 'Evening'
        WHEN u.department = 'Finance' THEN 'Night'
        ELSE 'Morning'
    END as shiftType,
    CASE 
        WHEN u.department = 'IT' THEN 
            (CURRENT_DATE + INTERVAL '8 hours')::timestamp
        WHEN u.department = 'HR' THEN 
            (CURRENT_DATE + INTERVAL '16 hours')::timestamp
        WHEN u.department = 'Finance' THEN 
            CURRENT_DATE::timestamp
        ELSE 
            (CURRENT_DATE + INTERVAL '8 hours')::timestamp
    END as shiftStart,
    CASE 
        WHEN u.department = 'IT' THEN 
            (CURRENT_DATE + INTERVAL '16 hours')::timestamp
        WHEN u.department = 'HR' THEN 
            (CURRENT_DATE + INTERVAL '1 day')::timestamp
        WHEN u.department = 'Finance' THEN 
            (CURRENT_DATE + INTERVAL '8 hours')::timestamp
        ELSE 
            (CURRENT_DATE + INTERVAL '16 hours')::timestamp
    END as shiftEnd
FROM "User" u
WHERE NOT EXISTS (
    SELECT 1 FROM "Shift" s WHERE s.userId = u.id
);

-- Insert future shifts for the next 7 days
INSERT INTO "Shift" ("userId", "shiftType", "shiftStart", "shiftEnd")
SELECT 
    u.id,
    CASE 
        WHEN u.department = 'IT' THEN 'Morning'
        WHEN u.department = 'HR' THEN 'Evening'
        WHEN u.department = 'Finance' THEN 'Night'
        ELSE 'Morning'
    END as shiftType,
    CASE 
        WHEN u.department = 'IT' THEN 
            (CURRENT_DATE + INTERVAL '8 hours' + (n || ' days')::interval)::timestamp
        WHEN u.department = 'HR' THEN 
            (CURRENT_DATE + INTERVAL '16 hours' + (n || ' days')::interval)::timestamp
        WHEN u.department = 'Finance' THEN 
            (CURRENT_DATE + (n || ' days')::interval)::timestamp
        ELSE 
            (CURRENT_DATE + INTERVAL '8 hours' + (n || ' days')::interval)::timestamp
    END as shiftStart,
    CASE 
        WHEN u.department = 'IT' THEN 
            (CURRENT_DATE + INTERVAL '16 hours' + (n || ' days')::interval)::timestamp
        WHEN u.department = 'HR' THEN 
            (CURRENT_DATE + INTERVAL '1 day' + (n || ' days')::interval)::timestamp
        WHEN u.department = 'Finance' THEN 
            (CURRENT_DATE + INTERVAL '8 hours' + (n || ' days')::interval)::timestamp
        ELSE 
            (CURRENT_DATE + INTERVAL '16 hours' + (n || ' days')::interval)::timestamp
    END as shiftEnd
FROM "User" u
CROSS JOIN generate_series(1, 7) n
WHERE NOT EXISTS (
    SELECT 1 
    FROM "Shift" s 
    WHERE s.userId = u.id 
    AND s.shiftStart::date = (CURRENT_DATE + (n || ' days')::interval)::date
); 