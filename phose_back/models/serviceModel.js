import { db } from "../config/firebase.js";

export const saveUserServiceDb = async (serviceData) => {
  const newDocRef = db.collection('services').doc();
  await newDocRef.set(serviceData);
  return { id: newDocRef.id, ...serviceData };
};

export const updateServiceStatusDb = async (id, status, reviewedAt) => {
  const docRef = db.collection('services').doc(id);
  const doc = await docRef.get();
  
  if (!doc.exists) {
    const error = new Error("Service not found");
    error.code = "NOT_FOUND";
    throw error;
  }

  await docRef.update({ status, reviewedAt });
  return { id, status };
};

export const getApprovedServicesDb = async (limitAmount, typeFilter) => {
  let query = db.collection('services').where('status', '==', 'approved');
  
  if (typeFilter) {
    query = query.where('type', '==', typeFilter);
  }
  
  const snapshot = await query.limit(limitAmount).get();
  
  const services = [];
  snapshot.forEach(doc => {
    services.push({ id: doc.id, ...doc.data() });
  });
  
  return services;
};

export const bulkUpsertServicesDb = async (servicesData) => {
  let batch = db.batch();
  let operationCount = 0;
  let savedCount = 0;

  for (const service of servicesData) {
    const docRef = db.collection('services').doc(service.id);
    batch.set(docRef, service, { merge: true });
    operationCount++;
    savedCount++;

    if (operationCount === 500) {
      await batch.commit();
      batch = db.batch();
      operationCount = 0;
    }
  }

  if (operationCount > 0) {
    await batch.commit();
  }

  return savedCount;
};

// models/serviceModel.js

// ... (your existing functions: saveUserServiceDb, updateServiceStatusDb, getApprovedServicesDb, bulkUpsertServicesDb)

// ✅ NEW: Get pending services (for admin moderation)
export const getPendingServicesDb = async (limitAmount) => {
  let query = db.collection('services')
    .where('status', '==', 'pending')
    .orderBy('createdAt', 'desc'); // Show newest first
  
  const snapshot = await query.limit(limitAmount).get();
  
  const services = [];
  snapshot.forEach(doc => {
    services.push({ id: doc.id, ...doc.data() });
  });
  
  return services;
};

// ✅ NEW: Get rejected/declined services (for admin audit)
export const getDeclinedServicesDb = async (limitAmount) => {
  let query = db.collection('services')
    .where('status', '==', 'declined')
    .orderBy('reviewedAt', 'desc'); // Show most recently reviewed first
  
  const snapshot = await query.limit(limitAmount).get();
  
  const services = [];
  snapshot.forEach(doc => {
    services.push({ id: doc.id, ...doc.data() });
  });
  
  return services;
};