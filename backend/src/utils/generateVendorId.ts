import User from '../models/User';

/**
 * Generates a highly secure, unique Vendor ID.
 * Format: CW-VENDOR-[8-character Alphanumeric]
 * Example: CW-VENDOR-A82KQ91X
 */
export const generateVendorId = async (): Promise<string> => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluded similar looking chars like I, O, 0, 1
  let isUnique = false;
  let vendorId = '';

  while (!isUnique) {
    let randomPart = '';
    for (let i = 0; i < 8; i++) {
      randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    vendorId = `CW-VENDOR-${randomPart}`;

    // Check for collision in database
    const existingVendor = await User.findOne({ vendorId });
    if (!existingVendor) {
      isUnique = true;
    }
  }

  return vendorId;
};
