import { Chauffeur } from "../chauffeur/chauffeur";
import { Vehicule } from "../vehicule/vehicule";

export interface Demande {
    id_demande: number;
    date_demande: string;
    type_avarie: string;
    description: string;
    date_avarie: string;
    heure_avarie: string; 
    statut: string;
    vehicule: Vehicule;
    chauffeur: Chauffeur;
}
