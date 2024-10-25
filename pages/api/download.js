import { Parser as Json2csvParser } from 'json2csv';
import XLSX from 'xlsx';
import Contact from '../../models/contact';

export default async function handler(req, res) {
  const contacts = await Contact.findAll({ raw: true });

  const { format } = req.query; 

  if (format === 'csv') {
    const fields = ['id', 'name', 'email', 'phone', 'address', 'timezone', 'createdAt'];
    const json2csv = new Json2csvParser({ fields });
    const csvData = json2csv.parse(contacts);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=contacts.csv');
    res.send(csvData);
  } else if (format === 'xlsx') {

    const worksheet = XLSX.utils.json_to_sheet(contacts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=contacts.xlsx');
    res.send(buffer);
  } else {
    res.status(400).json({ error: 'Invalid format specified. Use "csv" or "xlsx".' });
  }
}
