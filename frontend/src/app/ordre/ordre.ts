import { Atelier } from "../atelier/atelier";
import { Diagnostic } from "../maintenance/diagnostic/diagnostic";
import { Technicien } from "../technicien/technicien";
import { Travaux } from "./travaux";

export interface Ordre {
    id_ordre: number,
    diagnostic: {
        id_diagnostic: number,
        demande: {
            id_demande: number,
            type_avarie: string,
            description: string,
            vehicule: { numparc: number }
        },
        description_panne: string,
        causes_panne: string,
        actions: string,
        date_diagnostic: string,
        heure_diagnostic: string
    },
    urgence_panne: string,
    travaux: Travaux,
    planning: string,
    date_ordre: string,
    status: string,
    atelier: Atelier,
    technicien: Technicien,

}






/**
import { Atelier } from "../atelier/atelier";
import { Diagnostic } from "../maintenance/diagnostic/diagnostic";
import { Technicien } from "../technicien/technicien";

export interface Ordre {
    id_ordre: number,
    diagnostic: Diagnostic,
    urgence_panne: string,
    travaux: string,
    material_requis: string,
    planning: string,
    cout_estime: number,
    date_ordre: string,
    status: string,
    atelier: Atelier,
    technicien: Technicien,

    

}
 */
