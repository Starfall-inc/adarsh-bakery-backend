
import express from 'express';
import CustomerController from '../controllers/customer.controller';
import validate from '../middlewares/validate.middleware';
import { createCustomerSchema, updateCustomerSchema, loginCustomerSchema } from '../schemas/validate.schema';

const router = express.Router();

// Auth
router.post('/signup', validate(createCustomerSchema), CustomerController.signUp);
router.post('/login', validate(loginCustomerSchema), CustomerController.login);

// Customer Management (Admin)
router.get('/', CustomerController.getCustomers);
router.get('/:id', CustomerController.getCustomerById);
router.put('/:id', validate(updateCustomerSchema), CustomerController.updateCustomer);
router.delete('/:id', CustomerController.deleteCustomer);

export default router;
