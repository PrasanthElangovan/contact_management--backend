import User from '../../../models/user';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { token } = req.query;

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id); 
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.is_verified) {
      await User.update({ is_verified: true }, { where: { id: decoded.id } });
      return res.status(200).json({ message: 'Email verified successfully.' });
    } else {
      return res.status(200).json({ message: 'Email is already verified.' });
    }
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ error: 'Invalid token' });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(400).json({ error: 'Token has expired' });
    }
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
}
