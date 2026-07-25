import numpy as np


def cosine_similarity(embedding1: np.ndarray,
                      embedding2: np.ndarray) -> float:

    embedding1 = embedding1.astype(np.float32)
    embedding2 = embedding2.astype(np.float32)

    return float(
        np.dot(embedding1, embedding2) /
        (
            np.linalg.norm(embedding1)
            *
            np.linalg.norm(embedding2)
        )
    )