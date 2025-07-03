export interface Store {
  _id: string;                // L'identifiant du magasin (ObjectId sous forme de string)
  name: string;               // Nom du magasin
  address: string;            // Adresse postale
  city: string;               // Ville
  zip_code: string;           // Code postal
  created_at: string;         // Date ISO au format string (ex: "2025-06-21T13:01:15.031Z")
}
