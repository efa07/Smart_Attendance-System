import cv2
import face_recognition
import psycopg2
from datetime import datetime, timedelta # make it ethiopia time later or when in production
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

# Fetch
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

# just for testing
known_face_names = ["Efa", "Melaku"]

video_capture = cv2.VideoCapture(0)

while True:
    ret, frame = video_capture.read()
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
                # Create Redis key with current date
                current_date = datetime.now().date()
                redis_key = f"attendance:{user_id}:{current_date}"

                # Check Redis first
                if not redis_client.exists(redis_key):
                    try:
                        # Insert into database
                        cursor.execute('''
                            INSERT INTO "Attendance" 
                            ("userId", "checkIn", "status", "recognizedFace") 
                            VALUES (%s, %s, %s, %s)
                        ''', (user_id, datetime.now(), "present", True))
                        conn.commit()

                        # Set redis 24-hour expiration
                        redis_client.set(redis_key, "1", ex=timedelta(hours=24))
                        print(f"Checked in: {name} ({user_id})")
                    except Exception as e:
                        print(f"Database error: {e}")
                        conn.rollback()

        # Draw rectangles and labels
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