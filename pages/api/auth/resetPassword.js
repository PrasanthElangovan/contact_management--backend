import User from '../../../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { resetToken, newPassword } = req.body;
    console.log('Received Token:', resetToken);

    try {
      const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);

      const user = await User.findOne({
        where: {
          id: decoded.id,
          resetToken 
        }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetToken = null; 
      await user.save();

      return res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      if (error.message === 'jwt expired') {
        console.error('JWT Error: Token expired');
        return res.status(400).json({ error: 'Token expired. Please request a new reset link.' });
      } else {
        console.error('JWT Error:', error.message);
        return res.status(400).json({ error: 'Invalid or expired token' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
