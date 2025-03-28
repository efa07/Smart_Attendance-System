import face_recognition
known_image = face_recognition.load_image_file("Berule.jpg")
unknown_image = face_recognition.load_image_file("tt.JPG")

biden_encoding = face_recognition.face_encodings(known_image)[0]
unknown_encoding = face_recognition.face_encodings(unknown_image)[0]

results = face_recognition.compare_faces([biden_encoding], unknown_encoding)