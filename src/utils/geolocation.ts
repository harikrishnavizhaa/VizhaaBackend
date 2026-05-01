/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Distance in kilometers
 */
export const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
};

const toRad = (degrees: number): number => {
    return degrees * (Math.PI / 180);
};

/**
 * Find users within a certain radius
 * @param centerLat Center latitude
 * @param centerLon Center longitude
 * @param users Array of users with latitude and longitude
 * @param radiusKm Radius in kilometers
 * @returns Filtered users within radius
 */
export const findUsersWithinRadius = <T extends { latitude: number | null; longitude: number | null }>(
    centerLat: number,
    centerLon: number,
    users: T[],
    radiusKm: number
): T[] => {
    return users.filter((user) => {
        if (!user.latitude || !user.longitude) return false;

        const distance = calculateDistance(
            centerLat,
            centerLon,
            user.latitude,
            user.longitude
        );

        return distance <= radiusKm;
    });
};
