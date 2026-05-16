const prisma = require('../lib/prisma');


const updateProfile = async (req, res) => {
  const userId = req.user.sub; 
  const { name, email, role, dob, gender, companyName, businessType, businessName, city, address, gst } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        role,
        gender,
        dob: dob ? new Date(dob) : undefined,
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
        role: user.role,
        gender: user.gender,
        dob: user.dob,
        city: user.city,
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
