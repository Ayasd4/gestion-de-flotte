import { Demande } from "src/app/demande/demande";

export interface Diagnostic {
    id_diagnostic: number,
    demande: {id_demande: number},
    description_panne: string,
    causes_panne: string,
    actions: string,
    date_diagnostic: string,
    heure_diagnostic: string
}