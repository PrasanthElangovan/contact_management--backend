import { Op, Sequelize } from 'sequelize'; 
import Contact from '../../../models/contact';
import moment from 'moment-timezone';
import jwt from 'jsonwebtoken'; 

export default async function handler(req, res) {
  const { startDate, endDate, timezone } = req.query;

  if (req.method === 'GET') {
    try {
      const whereClause = {};
      if (startDate && endDate) {
        whereClause.createdAt = {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        };
      }

      let contacts = await Contact.findAll({ where: whereClause, raw: true });

      if (timezone) {
        contacts = contacts.map((contact) => {
          return {
            ...contact,
            createdAt: moment(contact.createdAt).tz(timezone).format(),
          };
        });
      }

      return res.status(200).json(contacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    const { name, email, phone, address, timezone, token } = req.body;

    if (!name || !email || !token) {
      return res.status(400).json({ error: 'Name, email, and token are required' });
    }

    try {

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id; 

      const existingContact = await Contact.findOne({ where: { email } });
      if (existingContact) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      const newContact = await Contact.create({
        name,
        email,
        phone,
        address,
        timezone,
        userId, 
      });

      return res.status(201).json(newContact);
    } catch (error) {
      if (error instanceof Sequelize.UniqueConstraintError) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      console.error('Error creating contact:', error);
      return res.status(500).json({ error: 'Failed to create contact' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
