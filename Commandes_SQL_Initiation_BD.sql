-- Commandes SQL pour l'initiation de la base de données:

-- On supprime ce qui existe

DROP TABLE "zones";
DROP TABLE "markers";

-- Creation des tables


CREATE TABLE "markers" (
	"id"	INTEGER,
	"description"	TEXT,
	"icon"	TEXT,
	"longitude"	REAL,
	"latitude"	REAL,
	"zone"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
	FOREIGN KEY(zone) REFERENCES zones(id) ON DELETE SET NULL
);

CREATE TABLE "zones" (
	"id"	INTEGER,
	"nom"	TEXT,
	"score"	REAL,
	PRIMARY KEY("id" AUTOINCREMENT)
);



-- Insertion de valeurs initiales


INSERT INTO "zones" (
  "id",
  "nom",
  "score"
)
VALUES (
  "1",
  "Versailles",
  "10"
);
INSERT INTO "markers" (
	"id",
	"description",
	"icon",
	"longitude",
	"latitude",
	"zone"
)
VALUES (
	"1",
	"<strong>Exemple</strong><p>Ceci est un exemple. Pour afficher une description, il faut écrire en html dans ce string.</p>",
	"beehive-1",
	"2.135063",
	"48.813032",
	"1"
);
INSERT INTO "markers" (
	"id",
	"description",
	"icon",
	"longitude",
	"latitude",
	"zone"
)
VALUES (
	"2",
	"<strong>Exemple</strong><p>Ceci est un deuxieme exemple. Pour afficher une description, il faut écrire en html dans ce string.</p>",
	"theatre-15",
	"2.145063",
	"48.813032",
	"1"
);