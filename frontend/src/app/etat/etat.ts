export interface Etat {
    id_vidange: number,
    vehicule: {
        idvehicule: number,
        numparc: number
    },
    kilometrage: {
        id: number,
        vehiculeId: number;
        //numparc: number,
        calcul: number
    },
    km_derniere_vd: {
        km_vidange: number
    }

    km_prochaine_vd: number,
    reste_km: number,
    date: string
}
