import { Router } from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { authRoute } from '../modules/auth/auth.route';
import { listingRoutes } from '../modules/listing/listing.routes';
import { bookingsRoutes } from '../modules/booking/booking.router';
import { paymentsRoutes } from '../modules/payment/payment.route';


const router = Router();

const moduleRoutes = [
    
    {
        path: '/user',
        route: userRoutes
    },
    {
        path:'/auth',
        route: authRoute
    },
    {
        path:'/listing',
        route: listingRoutes
    },
    {
        path:'/booking',
        route: bookingsRoutes
    },
    {
        path:'/payment',
        route: paymentsRoutes
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;