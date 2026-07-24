from app.recognition.detector import FaceDetector
from app.recognition.capture import FaceCapture


detector = FaceDetector()


capture = FaceCapture(
    save_path="storage/faces/test_user",
    detector=detector
)


capture.capture_faces(
    count=20
)