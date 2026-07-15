import express from "express";
import { 
  getApprovedServices, 
  getDeclinedServices, 
  getPendingServices, 
  moderateService, 
  seedFromOverpass, 
  submitService 
} from "../controllers/serviceController.js";
import { validateSubmission } from "../middleware/validateService.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/', getApprovedServices);
router.post('/submit', verifyToken, requireRole(['user', 'admin']), validateSubmission, submitService);
router.post('/seed-overpass', verifyToken, requireRole(['admin']), seedFromOverpass);
router.patch('/moderate/:id', verifyToken, requireRole(['admin']), moderateService);
router.get('/pending', verifyToken, requireRole(['admin']), getPendingServices);
router.get('/declined', verifyToken, requireRole(['admin']), getDeclinedServices);

export default router;