import express from "express";
import { eventsController } from "../controllers/eventController";

const router = express.Router();

router.post("/", eventsController.addEvent);
router.get("/", eventsController.getAllEvents);
router.delete("/:id", eventsController.deleteEvent);
router.put("/:id", eventsController.updateEvent);

router.post('/register', eventsController.registerForEvent);
router.post('/deregister/:eventId', eventsController.deregisterFromEvent);
router.get('/notifications/:userId', eventsController.getUserNotifications);


export {router as eventRoutes};

//module.exports = router;
