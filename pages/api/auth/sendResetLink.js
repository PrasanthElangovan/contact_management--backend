import User from '../../../models/user';
import { sendVerificationEmail } from '../../../utils/mail';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      user.resetToken = token; 
      await user.save();

      sendVerificationEmail(email, token);
      return res.status(200).json({ message: 'Password reset email sent.' });
    }

    res.status(404).json({ error: 'User not found' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
