// export const validateSubmission = (req, res, next) => {
//   const { name, type, coordinates } = req.body;

//   if (!name || typeof name !== 'string' || name.trim() === '') {
//     return res.status(400).json({ error: "Valid service name is required." });
//   }

//   const validTypes = ['clinic', 'hospital', 'school', 'other'];
//   if (!type || !validTypes.includes(type)) {
//     return res.status(400).json({ error: `Invalid type. Must be one of: ${validTypes.join(', ')}` });
//   }

//   if (!coordinates || typeof coordinates.latitude !== 'number' || typeof coordinates.longitude !== 'number') {
//     return res.status(400).json({ error: "Coordinates must include numerical latitude and longitude." });
//   }

//   next();
// };

const allowedTypes = ['clinic', 'hospital', 'school', 'library', 'shelter', 'police', 'taxi', 'bus_stop', 'train_station'];

export const validateSubmission = (req, res, next) => {
  const { name, type, coordinates } = req.body;
  
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ error: 'Name must be at least 2 characters.' });
  }
  
  if (!allowedTypes.includes(type)) {
    return res.status(400).json({ 
      error: `Invalid type. Allowed types: ${allowedTypes.join(', ')}` 
    });
  }
  
  if (!coordinates || !coordinates.latitude || !coordinates.longitude) {
    return res.status(400).json({ error: 'Valid coordinates are required.' });
  }
  
  next();
};