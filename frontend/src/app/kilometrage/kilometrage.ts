export interface Kilometrage {
    id?: number;
    vehiculeId: number;
    date: string;
    driverId: number;
    calcul: number;
    vehicule_immatricule?: string;
    vehicule_numparc?: number;
    chauffeur_nom?: string;
    chauffeur_prenom?: string;
    chauffeur_matricule?: string;
}