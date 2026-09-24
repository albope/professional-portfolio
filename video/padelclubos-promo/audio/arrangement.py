"""Arreglo musical por formato, en compases (1 compás = 2 s).

Provisional: se ajusta al storyboard definitivo.
"""

ARRANGEMENT = {
    "16x9": [
        {"bar": 0, "bars": 6, "type": "tension"},
        {"bar": 6, "bars": 1, "type": "build", "params": {"chord": "C"}},
        {"bar": 7, "bars": 4, "type": "drop"},
        {"bar": 11, "bars": 12, "type": "groove", "params": {"energy": 0.9}},
        {"bar": 23, "bars": 3, "type": "groove", "params": {"energy": 0.6, "drums": False}},
        {"bar": 26, "bars": 3, "type": "breakdown"},
        {"bar": 29, "bars": 1, "type": "outro"},
    ],
    "9x16": [
        {"bar": 0, "bars": 2, "type": "tension"},
        {"bar": 2, "bars": 1, "type": "build"},
        {"bar": 3, "bars": 9, "type": "drop"},
        {"bar": 12, "bars": 2, "type": "breakdown"},
        {"bar": 14, "bars": 1, "type": "outro"},
    ],
}
