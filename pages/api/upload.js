import multer from 'multer';
import fs from 'fs';
import csv from 'csv-parser';
import XLSX from 'xlsx';
import Contact from '../../../models/contact'; 

const upload = multer({ dest: 'uploads/' });

export const config = {
  api: {
    bodyParser: false, 
  },
};

const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const contacts = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        contacts.push(row);
      })
      .on('end', () => {
        resolve(contacts);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};

const parseExcel = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
};

const validateAndSaveContacts = async (contacts) => {
  const savedContacts = [];
  for (const contactData of contacts) {
    const { name, email, phone, address, timezone } = contactData;

    if (!name || !email) {
      throw new Error('Name and email are required');
    }

    const existingContact = await Contact.findOne({ where: { email } });
    if (existingContact) {
      throw new Error(`Contact with email ${email} already exists`);
    }

    const contact = await Contact.create({ name, email, phone, address, timezone });
    savedContacts.push(contact);
  }
  return savedContacts;
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error uploading file' });
      }

      const { path } = req.file;
      const extension = path.split('.').pop();

      let contacts = [];
      try {
        if (extension === 'csv') {
          contacts = await parseCSV(path);
        } else if (extension === 'xlsx') {
          contacts = await parseExcel(path);
        } else {
          return res.status(400).json({ error: 'Unsupported file format' });
        }

        const savedContacts = await validateAndSaveContacts(contacts);
        fs.unlinkSync(path); 
        
        return res.status(201).json({ message: 'Contacts uploaded successfully', savedContacts });
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
