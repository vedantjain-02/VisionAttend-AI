import cv2

from app.recognition.detector import FaceDetector
from app.recognition.embedder import FaceEmbedder


detector = FaceDetector()
embedder = FaceEmbedder()

camera = cv2.VideoCapture(0)

while True:

    ret, frame = camera.read()

    if not ret:
        break

    faces = detector.detect(frame)

    for face in faces:

        embedding = embedder.get_embedding(face)

        print("=" * 50)
        print("Embedding Length :", len(embedding))
        print("First 10 Values  :", embedding[:10])

        box = face.bbox.astype(int)

        cv2.rectangle(
            frame,
            (box[0], box[1]),
            (box[2], box[3]),
            (0,255,0),
            2
        )

    cv2.imshow("Embedding Test", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

camera.release()
cv2.destroyAllWindows()