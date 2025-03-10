
import cv2
import face_recognition

known_face_encodin = []
known_face_names = []

known_person_image = face_recognition.load_image_file("/home/x/Desktop/face-attendance-system/face-recognition/efa.jpg")
known_person2_image = face_recognition.load_image_file("/home/x/Desktop/face-attendance-system/face-recognition/dagen.jpg")

known_person_encoding = face_recognition.face_encodings(known_person_image)[0]
known_person2_encoding = face_recognition.face_encodings(known_person2_image)[0]

known_face_encodin.append(known_person_encoding)
known_face_encodin.append(known_person2_encoding)

known_face_names.append("Efa")
known_face_names.append("Dagen")

video_capture = cv2.VideoCapture(0)

while True:
    ret,frame = video_capture.read()

    face_locations = face_recognition.face_locations(frame)
    face_encodings = face_recognition.face_encodings(frame,face_locations)

    for (top,right,bottom,left),face_encoding in zip(face_locations,face_encodings):
        matches = face_recognition.compare_faces(known_face_encodin,face_encoding)

        name = "Unknown"

        if True in matches:
            first_match_index = matches.index(True)
            name = known_face_names[first_match_index]

        cv2.rectangle(frame,(left,top),(right,bottom),(0,0,255),2)

        cv2.rectangle(frame,(left,bottom-35),(right,bottom),(0,0,255),cv2.FILLED)
        font = cv2.FONT_HERSHEY_DUPLEX
        cv2.putText(frame,name,(left+6,bottom-6),font,1.0,(255,255,255),1)

    cv2.imshow('Video',frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
video_capture.release()
cv2.destroyAllWindows()
