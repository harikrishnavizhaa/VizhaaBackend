const prisma = require('../lib/prisma');


const createEvent = async (req, res) => {
  const userId = req.user.sub;
  const { 
    name, type, location, date, inTime, outTime, 
    suppliers, dressCode, services, costPerHead, 
    totalCost, advancePaid 
  } = req.body;

  try {
    const event = await prisma.event.create({
      data: {
        userId,
        name,
        type,
        location,
        date,
        inTime,
        outTime,
        suppliers: parseInt(suppliers),
        dressCode,
        services,
        costPerHead: parseFloat(costPerHead),
        totalCost: parseFloat(totalCost),
        advancePaid: parseFloat(advancePaid),
        status: 'Upcoming',
        progress: 0
      }
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event
    });
  } catch (err) {
    console.error('Create Event Error:', err);
    res.status(500).json({ success: false, message: 'Failed to create event', details: err.message });
  }
};

const getEvents = async (req, res) => {
  const userId = req.user.sub;

  try {
    const events = await prisma.event.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      events
    });
  } catch (err) {
    console.error('Get Events Error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch events', error: err.message });
  }
};

const getEventById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.sub;

  try {
    const event = await prisma.event.findFirst({
      where: { id, userId }
    });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.json({
      success: true,
      event
    });
  } catch (err) {
    console.error('Get Event Detail Error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch event details' });
  }
};

module.exports = { createEvent, getEvents, getEventById };
