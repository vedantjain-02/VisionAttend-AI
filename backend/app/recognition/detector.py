import insightface
from insightface.app import FaceAnalysis


class FaceDetector:

    def __init__(self):

        self.model = FaceAnalysis(
            name="buffalo_l"
        )

        self.model.prepare(
            ctx_id=0,
            det_size=(640, 640)
        )


    def detect(self, frame):

        faces = self.model.get(frame)

        return faces