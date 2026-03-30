const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     responses:
 *       200:
 *         description: List of orders
 */
router.get("/", orderController.getOrders);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             userId: "U001"
 *             restaurantId: "R001"
 *             items:
 *               - name: "Burger"
 *                 quantity: 2
 *                 price: 500
 *             totalPrice: 1000
 *             status: "pending"
 *     responses:
 *       201:
 *         description: Order created
 */
router.post("/", orderController.createOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order found
 */
router.get("/:id", orderController.getOrderById);

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             status: "delivered"
 *     responses:
 *       200:
 *         description: Order updated
 */
router.put("/:id", orderController.updateOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 */
router.delete("/:id", orderController.deleteOrder);

module.exports = router;