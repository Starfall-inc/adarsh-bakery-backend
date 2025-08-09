import { Router } from 'express';
import UserController from '../controllers/user.controller';
import auth from '../middlewares/user/auth.middleware';
import authorize from '../middlewares/authorize.middleware';
import { UserRole } from '../models/user.model';

const router = Router();

router.post('/login', UserController.login);
router.get('/setup-status', UserController.getSetupStatus);
router.post('/initial-setup', UserController.initialSetup);

router.get('/', auth, authorize([UserRole.Admin]), UserController.getAllUsers);
router.get('/:id', auth, authorize([UserRole.Admin]), UserController.getUserById);
router.post('/', auth, authorize([UserRole.Admin]), UserController.createUser);
router.put('/:id', auth, authorize([UserRole.Admin]), UserController.updateUser);
router.delete('/:id', auth, authorize([UserRole.Admin]), UserController.deleteUser);

export default router;
