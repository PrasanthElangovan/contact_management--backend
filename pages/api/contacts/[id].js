import Contact from '../../../models/contact';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Contact ID is required' });
  }

  try {
    if (req.method === 'GET') {
      const contact = await Contact.findByPk(id);
      return contact 
        ? res.status(200).json(contact) 
        : res.status(404).json({ error: 'Contact not found' });
      
    } else if (req.method === 'PUT') {
        const { name, email, phone, address, timezone } = req.body;
    
        if (!name && !email && !phone && !address && !timezone) {
          return res.status(400).json({ error: 'No fields provided for update' });
        }
    
        try {
          const contact = await Contact.findByPk(id);
          if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
          }

          contact.name = name || contact.name;
          contact.email = email || contact.email;
          contact.phone = phone || contact.phone;
          contact.address = address || contact.address;
          contact.timezone = timezone || contact.timezone;
    
          await contact.save();
          res.status(200).json(contact);
        } catch (error) {
          console.error('Error updating contact:', error);
          res.status(500).json({ error: 'Failed to update contact' });
        }
      }
    
    
      
       else if (req.method === 'DELETE') {

      const contactDeleted = await Contact.destroy({ where: { id } });
      return contactDeleted 
        ? res.status(204).end() 
        : res.status(404).json({ error: 'Contact not found' });
      
    } else {

      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {

    console.error('Error handling request:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
