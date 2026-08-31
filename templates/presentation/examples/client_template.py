"""Copiar este archivo y sustituir únicamente información validada del cliente."""

DECK = {
    "meta": {
        "title": "BPM Tech · [Cliente] · [Proyecto]",
        "subject": "Propuesta comercial",
        "author": "BPM Tech",
        "company": "BPM Tech",
        "comments": "Completar tras validar el alcance.",
    },
    "slides": [
        {
            "layout": "cover",
            "eyebrow": "PROPUESTA COMERCIAL",
            "client": "[CLIENTE / PROYECTO]",
            "title": "[QUÉ PROPONEMOS EN UNA FRASE]",
            "subtitle": "[Descripción concreta, sin lenguaje genérico]",
            "status": "[BORRADOR / PARA VALIDACIÓN / FINAL]",
            "confidentiality": "PROPUESTA COMERCIAL CONFIDENCIAL",
            "date": "[FECHA]",
        },
        # Añadir después las páginas que la historia necesite. Véase
        # examples/bpm_system/content.py para los 15 patrones disponibles.
    ],
}
