import create from 'zustand'


//just a simple hook to know the state of drawing
export const [useLangHandler] = create(set => ({
    state: "en",
    switch: (lang) => set( s => ({state: s.state = lang}))
}))

export const Language = {
    "en": {
        "language": "English",
        "title": "Table Arranger",
        "by": "by ",
        "1-image": "1. Select image",
        "2-walls": "2. Add Walls", 
        "3-tables": "3. Add Tables",
        "selectImage": "Select image",
        "setLength": "Set Wall Length",
        "draw": "Draw",
        "erase": "Erase",
        "length": "Length",
        "width": "Width",
        "chair": "Chair depth",
        "offset": "Distance to next chair",
        "add": "Add"
    },
    "de": {
        "language": "Deutsch",
        "title": "Tisch-Platzierer",
        "by": "von ",
        "1-image": "1. Bild wählen",
        "2-walls": "2. Wände hinzufügen", 
        "3-tables": "3. Tische hinzufügen",
        "selectImage": "Bild auswählen",
        "setLength": "Wandlänge definieren",
        "draw": "Zeichnen",
        "erase": "Löschen",
        "length": "Länge",
        "width": "Breite",
        "chair": "Stuhltiefe",
        "offset": "Distanz zum nächsten Stuhl",
        "add": "Hinzufügen"
    }
}