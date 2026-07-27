import numpy as np


class FaceEmbedder:

    def get_embedding(self, face):

        """
        Extract embedding from InsightFace face object
        """

        embedding = face.embedding.astype(np.float32)

        embedding = embedding / np.linalg.norm(embedding)

        return embedding