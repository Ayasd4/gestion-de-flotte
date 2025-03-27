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
