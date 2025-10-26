const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

/**
 * Crée une demande de stage.
 * Attends les champs : nom, prenom, email, service, dateDebut, dateFin, motivation
 */
async function createDemande(data) {
  const required = ['nom', 'prenom', 'email', 'service', 'dateDebut', 'dateFin', 'motivation'];
  for (const key of required) {
    if (!data[key]) throw { status: 400, message: `${key} est requis` };
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(data.email)) throw { status: 400, message: 'Email invalide' };

  const dateDebut = new Date(data.dateDebut);
  const dateFin = new Date(data.dateFin);
  if (isNaN(dateDebut) || isNaN(dateFin)) throw { status: 400, message: 'Dates invalides' };
  if (dateDebut >= dateFin) throw { status: 400, message: 'dateDebut doit être avant dateFin' };

  const created = await prisma.demandeStage.create({
    data: {
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      service: data.service,
      dateDebut,
      dateFin,
      motivation: data.motivation
    }
  });

  return created;
}

async function listDemandes() {
  return await prisma.demandeStage.findMany({
    orderBy: { createdAt: 'desc' } // supprime ou adapte si ton modèle n'a pas dateCreated
  });
}

async function getDemandeById(id) {
  const idNum = Number(id);
  if (!Number.isInteger(idNum)) throw { status: 400, message: 'Id invalide' };

  const demande = await prisma.demandeStage.findUnique({
    where: { id: idNum }
  });

  if (!demande) throw { status: 404, message: 'Demande non trouvée' };
  return demande;
}

async function updateDemandeStatus(id, status) {
  const idNum = Number(id);
  if (!Number.isInteger(idNum)) throw { status: 400, message: 'Id invalide' };
  if (!status) throw { status: 400, message: 'Status est requis' };

  // Optionnel : adapter les statuts autorisés selon ton modèle
  const allowed = ['en_attente', 'acceptee', 'refusee', 'annulee'];
  if (!allowed.includes(status)) {
    throw { status: 400, message: `Status invalide. Valeurs autorisées: ${allowed.join(', ')}` };
  }

  const updated = await prisma.demandeStage.update({
    where: { id: idNum },
    data: { status }
  });

  return updated;
}

module.exports = { createDemande , listDemandes, getDemandeById, updateDemandeStatus};