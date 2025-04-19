import { Travaux } from "../ordre/travaux"

export interface Intervention {
    id_intervention: number,
    ordre: {
        id_ordre: number,
        diagnostic: {
            id_diagnostic: number,
            demande: {
                vehicule: { numparc: number }
            },
        }
        nom_travail: string,
        urgence_panne: string,
        planning: string,
        date_ordre: string,
    },
    //technicien: Technicien,
    technicien: {
        id_technicien: 0,
        nom: string,
        prenom: string,
        matricule_techn: number,
        email_techn: string,
        specialite: string,
    }
    date_debut: string,
    heure_debut: string,
    date_fin: string,
    heure_fin: string,
    status_intervention: string,
    commentaire: string

}



/*export interface Intervention {
    id_intervention: number,
    id_ordre: number,
    id_technicien: number,
    date_debut: string,
    heure_debut: string,
    date_fin?: string,
    heure_fin?: string,
    status_intervention: string,
    commentaire: string

    //information from join
    ordre_urgence_panne?: string,
    ordre_travaux?: string,
    ordre_material_requis?: string,
    ordre_planning?: string,
    ordre_date_ordre?: string,
    ordre_status?: string,

    technicien_nom?: string,
    technicien_prenom?: string,
    technicien_matricule_techn?: number,
    technicien_email_techn?: string,
    technicien_specialite?: string,
}*/
