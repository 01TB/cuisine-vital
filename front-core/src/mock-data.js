// Ce fichier simule la réponse de votre API GET /livreur/:livreurId/itineraire

export const mockRouteData = {
  livraisonsDansOrdre: [
    {
      id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      adresse: "Palais de la Reine (Rova)",
      statut: "ASSIGNEE",
      localisation: "Point(47.5323 -18.9227)",
    },
    {
      id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
      adresse: "Gare de Soarano",
      statut: "ASSIGNEE",
      localisation: "Point(47.5222 -18.9038)",
    },
    {
      id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      adresse: "Marché d'Analakely",
      statut: "ASSIGNEE",
      localisation: "Point(47.5255 -18.9069)",
    },
    {
      id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
      adresse: "Lac Anosy",
      statut: "ASSIGNEE",
      localisation: "Point(47.5186 -18.9171)",
    },
  ],
  distanceTotaleMetres: 6133,
  dureeTotaleSecondes: 1245,
  // Ceci est une VRAIE polyline Google Maps pour cet itinéraire
  geometrieItineraire:
    "}_`sAeu`aBwAIe@K_C@yADeAFgABeAAoB@iAJeA`@uC\\aBLa@VYf@_@d@Sj@[r@c@b@Wb@Sj@QhAWtAc@fBa@rBMfAEd@E\\?@?RC\\Ad@A`@?`@?B?n@?lA?zA?`A?d@@d@B`@Jt@L|@Nt@Rl@b@pA`@lAb@nAp@tBb@jAPZVRPHLFPFLHJJHJHh@?f@Ax@AhACl@El@Gf@I`@MPId@Or@M`@I`@Kb@K`@K`@Kh@Kb@Gh@Gj@Ej@Aj@?|@?j@@x@@x@Bv@Bf@Bh@Bl@B|@Bl@Bp@B`@F`@Fl@F`@Ft@F|@Fp@Ft@Fp@Ft@Fp@Ft@Ft@Ft@Ft@Ft@FxAD`AD`ADz@Dz@Dz@Dz@DrADrADnADnADnADnADpAFrAFpAFt@Ft@Fp@Fr@Fr@Fz@Fh@Fh@Fj@Fj@Fl@Fl@Fl@Fl@Fj@Fj@Fj@Ff@Ff@Ff@Ff@Ff@F`BF`BFhBDhBDhBDhBDfBDnBDlBDlBDhBDdBDdBDfBDbBDlAFlAFl@Fl@Fl@Fl@Fl@Ft@Ft@Ft@Ft@Ft@Ft@Ft@Ft@Ft@Ft@Ft@Ft@Ft@Fv@Fv@Fv@Ft@Fv@Fv@Fv@Ft@Fv@Fv@Ft@Ft@Ft@Ft@Ft@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@Fz@F-",
};

export const mockLivreurs = [
  { id: "11111111-1111-1111-1111-111111111111", nom: "Rabe", prenom: "Koto" },
  { id: "22222222-2222-2222-2222-222222222222", nom: "Rakoto", prenom: "Fara" },
];