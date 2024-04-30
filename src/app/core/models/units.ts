export interface Unit {
    id: number,
    unit: string,
}

export const foodUnits: { [id: number]: Unit } = {
    1: { id: 1, unit: "Kilogramm (kg)" },
    2: { id: 2, unit: "Gramm (g)" },
    3: { id: 3, unit: "Milligramm (mg)" },
    4: { id: 4, unit: "Liter (l)" },
    5: { id: 5, unit: "Milliliter (ml)" },
};
