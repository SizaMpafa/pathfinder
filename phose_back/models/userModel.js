import { db } from "../config/firebase.js";

const registerUserDb = async (email, userData) => {
  const userRef = db.collection("users").doc(email.toLowerCase().trim());
  const doc = await userRef.get();

  if (doc.exists) {
    const error = new Error("Email already exists");
    error.code = "ALREADY_EXISTS";
    throw error;
  }

  await userRef.set({
    email: email.toLowerCase().trim(),
    ...userData
  });
  
  return { email, ...userData };
};

const loginUserDb = async (email) => {
  const userRef = db.collection("users").doc(email.toLowerCase().trim());
  const doc = await userRef.get();
  return doc.exists ? doc.data() : null;
};

const getProfileDb = async (email) => {
  const userRef = db.collection("users").doc(email.toLowerCase().trim());
  const doc = await userRef.get();
  
  if (!doc.exists) return null;
  
  const data = doc.data();
  delete data.password;
  return data;
};

export { registerUserDb, loginUserDb, getProfileDb };
