import cv2
import face_recognition
import psycopg2
from datetime import datetime, timedelta, time
import redis

# Database config
DB_CONFIG = {
    'dbname': 'attendance_db',
    'user': 'admin',
    'password': 'admin',
    'host': 'localhost',
    'port': 5432
}

# redis config
redis_client = redis.Redis(host='localhost', port=6379, db=0)

# initialize known faces and mapping
known_face_encodings = []
known_face_names = []
name_to_userId = {}

# Connect to PostgreSQL
conn = psycopg2.connect(**DB_CONFIG)
cursor = conn.cursor()

# get user mapping
cursor.execute('SELECT id, "fullName" FROM "User"')
users = cursor.fetchall()
for user_id, fullName in users:
    name_to_userId[fullName] = user_id

# Load known images
known_person_image = face_recognition.load_image_file("/home/x/Desktop/face-attendance-system/face-recognition/Berule.jpg")
known_person2_image = face_recognition.load_image_file("/home/x/Desktop/face-attendance-system/face-recognition/melaku.jpg")

known_face_encodings = [
    face_recognition.face_encodings(known_person_image)[0],
    face_recognition.face_encodings(known_person2_image)[0]
]
known_face_names = ["Efa Tariku", "Melaku"]

# Video capture initialization
video_capture = cv2.VideoCapture(0)

def calculate_status(current_dt, shift):
    """
    Calculate attendance status based on the current time and the shift.
    For the morning shift:
      - Before 8:30 AM         => "early"
      - 8:30 AM to 8:40 AM      => "in_time"
      - 8:40 AM to 9:30 AM      => "late"
      - 9:30 AM to 12:00 PM     => "absent"
    For the afternoon shift:
      - Before 1:00 PM          => "early"
      - 1:00 PM to 1:10 PM      => "in_time"
      - 1:10 PM to 2:00 PM      => "late"
      - 2:00 PM to 5:00 PM      => "absent"
    """
    tolerance = timedelta(minutes=10)
    
    if shift == "morning":
        shift_start = current_dt.replace(hour=8, minute=30, second=0, microsecond=0)
        morning_tolerance_end = shift_start + tolerance  # 8:40 AM
        morning_late_end = shift_start + timedelta(hours=1)  # 9:30 AM
        shift_end = current_dt.replace(hour=12, minute=0, second=0, microsecond=0)
        
        if current_dt < shift_start:
            return "early"
        elif shift_start <= current_dt < morning_tolerance_end:
            return "in_time"
        elif morning_tolerance_end <= current_dt < morning_late_end:
            return "late"
        elif morning_late_end <= current_dt < shift_end:
            return "absent"
    else:  # afternoon
        shift_start = current_dt.replace(hour=13, minute=0, second=0, microsecond=0)
        afternoon_tolerance_end = shift_start + tolerance  # 1:10 PM
        afternoon_late_end = shift_start + timedelta(hours=1)  # 2:00 PM
        shift_end = current_dt.replace(hour=17, minute=0, second=0, microsecond=0)
        
        if current_dt < shift_start:
            return "early"
        elif shift_start <= current_dt < afternoon_tolerance_end:
            return "in_time"
        elif afternoon_tolerance_end <= current_dt < afternoon_late_end:
            return "late"
        elif afternoon_late_end <= current_dt < shift_end:
            return "absent"
    # Fallback in case none of the above conditions match
    return "unknown"

while True:
    ret, frame = video_capture.read()
    if not ret:
        continue

    frame = cv2.resize(frame, (0, 0), fx=1, fy=1)

    face_locations = face_recognition.face_locations(frame)
    face_encodings = face_recognition.face_encodings(frame, face_locations)

    for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
        name = "Unknown"

        if True in matches:
            first_match_index = matches.index(True)
            name = known_face_names[first_match_index]
            user_id = name_to_userId.get(name)

            if user_id:
                # Determine current datetime and which shift to use.
                current_dt = datetime.now()
                # Assume if before noon it's morning shift, otherwise afternoon.
                shift = "morning" if current_dt.hour < 12 else "afternoon"

                # Create a Redis key for today to avoid duplicate clock-ins
                current_date = current_dt.date()
                redis_key = f"attendance:{user_id}:{current_date}:{shift}"

                if not redis_client.exists(redis_key):
                    # Check if there's already a clock-in in the DB for this shift window
                    if shift == "morning":
                        shift_start = current_dt.replace(hour=8, minute=30, second=0, microsecond=0)
                        shift_end = current_dt.replace(hour=12, minute=0, second=0, microsecond=0)
                    else:
                        shift_start = current_dt.replace(hour=13, minute=0, second=0, microsecond=0)
                        shift_end = current_dt.replace(hour=17, minute=0, second=0, microsecond=0)
                    
                    cursor.execute('''
                        SELECT id FROM "Attendance" 
                        WHERE "userId" = %s 
                          AND "checkIn" >= %s AND "checkIn" < %s
                    ''', (user_id, shift_start, shift_end))
                    existing = cursor.fetchone()

                    if not existing:
                        # Calculate the status based on the current time and shift.
                        status = calculate_status(current_dt, shift)
                        try:
                            cursor.execute('''
                                INSERT INTO "Attendance" ("userId", "checkIn", "status", "recognizedFace")
                                VALUES (%s, %s, %s, %s)
                            ''', (user_id, current_dt, status, True))
                            conn.commit()
                            # Set Redis key with a 24-hour expiration to prevent duplicate clock-ins
                            redis_client.set(redis_key, "1", ex=timedelta(hours=24))
                            print(f"Clocked in: {name} (User ID: {user_id}) with status '{status}' in the {shift} shift")
                        except Exception as e:
                            print(f"Database error: {e}")
                            conn.rollback()
                    else:
                        print(f"User {name} (User ID: {user_id}) already clocked in for the {shift} shift today")

        # Draw rectangles and labels on the frame for visualization
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)
        cv2.rectangle(frame, (left, bottom - 20), (right, bottom), (0, 0, 255), cv2.FILLED)
        cv2.putText(frame, name, (left + 6, bottom - 6), cv2.FONT_HERSHEY_DUPLEX, 0.5, (255, 255, 255), 1)
        
    cv2.imshow('Video', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Cleanup 
video_capture.release()
cv2.destroyAllWindows()
cursor.close()
conn.close()
