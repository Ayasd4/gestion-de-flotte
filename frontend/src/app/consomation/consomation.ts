export interface Consomation {
    idConsomation?: number;
    numPark: number;
    QteCarb: number;
    indexkilo: number;
    dateDebut: string;
    calcul?: number;
    idChaff: number;
    idVehicule: number;
    idAgence: number;
    // Related entity information from joins
    chauffeur_nom?: string;
    chauffeur_prenom?: string;
    chauffeur_matricule?: string;
    agence_nom?: string;
    vehicule_numparc?: number;
}