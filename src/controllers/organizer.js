const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updateProfile = async (req, res) => {
  const userId = req.user.sub; // sub from JWT payload
  const { name, email, companyName, businessType, businessName, city, address, gst } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        companyName,
        businessType,
        businessName,
        city,
        address,
        gst,
      },
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        mobile: user.mobile,
        name: user.name,
        email: user.email,
        businessName: user.businessName,
        companyName: user.companyName,
        businessType: user.businessType,
      },
    });
  } catch (err) {
    console.error('Profile Update Error:', err);
    res.status(500).json({ message: 'Failed to update profile', details: err.message });
  }
};

module.exports = { updateProfile };
