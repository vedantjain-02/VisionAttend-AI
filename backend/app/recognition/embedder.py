import numpy as np


class FaceEmbedder:

    def get_embedding(self, face):

        """
        Extract embedding from InsightFace face object
        """

        return face.embedding.astype(np.float32)