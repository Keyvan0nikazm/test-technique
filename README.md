# test-technique

-application full‑stack pour gérer des demandes dans un hopital (frontend React + Ant Design, backend Node.js + Express, base de données gérée via Prisma).

installation et lancement (backend):
    1.installer les dépendances :
    -cd backend
    -npm install
    2.lancer la base de données / dev db (prisma) :
    -npx prisma dev
    3.lancer le backend :
    -cd backend
    -npm start

installation et lancement (frontend) :
    1.installer les dépendances :
    -cd frontend
    -npm install
    1.lancer le frontend :
    -cd frontend
    -npm run dev


Pourquoi avoir utiliser Prisma pour la base de données ?
    - utilisation de prisma pour l'experience developer, migrations, introspections et commande dev (npm prisma dev), qui facilient le démarrage
    - simple d'utilisation, simple a comprendre, lire et écrire, compatible avec différents providers(SQLite, Postgres, MySQL).
    - Génération automatique du client et synchronisation avec schema.prisma.

Pourquoi React pour le frontend ?
    - Composants réutilisables : facilité de découpage UI en composants (ex. DemandeTable,DemandeFormModal).
    - Large écosystème et communauté : abondance de bibliothèques et d'outils (bundlers, dev servers).
    - Ergonomie pour interfaces interactives et état local/remote.

Pourquoi Ant Design (plutôt qu'une autre UI) ?
    - plus facile a appliquer pour avoir des designs simple et efficace
    - Richesse de composants prêts à l'emploie (Table, Modal, Form, ...)

Fichier importants
    - backend/prisma/schema.prisma : schéma de la base de données
    - backend/app.js, backend/routes/* : serveur et routes
    - backend/services/* — logique métier
    - backend/docs/openapi.yaml — documentation API
    - frontend/src/components — composants React principaux (DemandeTable, DemandeFormModal, ...)