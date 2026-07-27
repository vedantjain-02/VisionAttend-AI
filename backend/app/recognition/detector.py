import insightface
from insightface.app import FaceAnalysis

# Load model only once
face_model = FaceAnalysis(name="buffalo_l")
face_model.prepare(
    ctx_id=-1,
    det_size=(640, 640)
)


class FaceDetector:

    def detect(self, frame):
        return face_model.get(frame)