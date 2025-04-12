export interface Consomation {
    idConsomation?: number;
    numPark: number;
    QteCarb: number;
    indexkilo: number;
    dateDebut: string;
    dateFin: string;
    idChaff: number;
    idVehicule: number;
    idAgence: number;
    // Related entity information from joins
    vehicule_immatricule?: string;
    chauffeur_nom?: string;
    chauffeur_prenom?: string;
    chauffeur_matricule?: string;
    agence_nom?: string;
    vehicule_numparc?: number;
}