"""Arreglo musical por formato (storyboard §6), en compases de 2 s.

`bar` es el compás de inicio contando desde 0; `bars`, cuántos dura.
`silence` son ventanas [inicio, fin) en segundos donde la música calla
(los «tocs» y demás efectos de las escenas siguen sonando).
"""

ARRANGEMENT = {
    "16x9": {
        "sections": [
            {"bar": 0, "bars": 6, "type": "tension", "params": {"halftime_from": 2, "ghosts_from": 4, "riser_from": 5}},
            {"bar": 6, "bars": 1, "type": "build_short"},
            {"bar": 7, "bars": 2, "type": "drop"},
            {"bar": 9, "bars": 12, "type": "groove", "params": {"marimba_from": 4, "sweep_last": True}},
            {"bar": 21, "bars": 2, "type": "breakdown"},
            {"bar": 23, "bars": 3, "type": "build_long"},
            {"bar": 26, "bars": 2, "type": "drop", "params": {"final": True}},
            {"bar": 28, "bars": 2, "type": "outro"},
        ],
        # c.7 t.4 en silencio; última corchea de c.26 en silencio.
        "silence": [(13.5, 14.0), (51.75, 52.0)],
        # Fundido final de 12 frames que termina antes del último frame.
        "fade_out": (59.2, 59.6),
    },
    "9x16": {
        "sections": [
            {"bar": 0, "bars": 2, "type": "tension", "params": {"halftime_from": 0, "ghosts_from": 1, "riser_from": 1}},
            {"bar": 2, "bars": 1, "type": "build_short", "params": {"silence_last_eighth": True}},
            {"bar": 3, "bars": 1, "type": "drop"},
            {"bar": 4, "bars": 6, "type": "groove", "params": {"marimba_from": 2}},
            {"bar": 10, "bars": 2, "type": "breakdown"},
            {"bar": 12, "bars": 2, "type": "drop", "params": {"final": True}},
            {"bar": 14, "bars": 1, "type": "outro"},
        ],
        "silence": [(5.75, 6.0), (23.75, 24.0)],
        "fade_out": (29.4, 29.8),
    },
}
