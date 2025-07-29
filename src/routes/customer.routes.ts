import express from 'express';
import CustomerController from '../controllers/customer.controller';
import validate from '../middlewares/validate.middleware';
import auth from '../middlewares/auth.middleware';
import {
  createCustomerSchema,
  loginCustomerSchema,
  updateCustomerSchema,
  addToCartSchema,
  updateCartItemQuantitySchema,
  removeCartItemSchema,
  addToWishlistSchema,
  removeFromWishlistSchema,
} from '../schemas/validate.schema';

const router = express.Router();

// Auth
router.post('/register', validate(createCustomerSchema), CustomerController.signUp);
router.post('/login', validate(loginCustomerSchema), CustomerController.login);
router.get('/profile', auth, CustomerController.getProfile);
router.put('/profile', auth, CustomerController.updateProfile);

// Cart Management
router.get('/cart', auth, CustomerController.getCart);
router.post('/cart', auth, validate(addToCartSchema), CustomerController.addToCart);
router.put('/cart', auth, validate(updateCartItemQuantitySchema), CustomerController.updateCartItemQuantity);
router.delete('/cart/:productId', auth, validate(removeCartItemSchema), CustomerController.removeCartItem);

// Wishlist Management
router.get('/wishlist', auth, CustomerController.getWishlist);
router.post('/wishlist', auth, validate(addToWishlistSchema), CustomerController.addToWishlist);
router.delete('/wishlist/:productId', auth, validate(removeFromWishlistSchema), CustomerController.removeFromWishlist);

// Customer Management (Admin)
router.get('/', CustomerController.getCustomers);
router.get('/:id', CustomerController.getCustomerById);
router.put('/:id', validate(updateCustomerSchema), CustomerController.updateCustomer);
router.delete('/:id', CustomerController.deleteCustomer);

export default router;
