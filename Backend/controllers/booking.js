const ParkingSpace = require("../models/parkingSpace");
const Booking = require('../models/booking'); 

const getBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.find({ user: userId });

    const bookingsWithDetails = await Promise.all(
      bookings.map(async (booking) => {
        
        const parkingSpace = await ParkingSpace.findById(booking.parkingSpace);

        if (!parkingSpace) {
          console.error(`Parking space not found for booking ID: ${booking._id}`);
          return {
            parkingSpaceName: 'Unknown',
            fromTime: booking.fromTime,
            toTime: booking.toTime,
          };
        }

        return {
          parkingSpaceName: parkingSpace.name,
          fromTime: booking.fromTime,
          toTime: booking.toTime,
        };
      })
    );

    res.json(bookingsWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

  module.exports = { getBookings }