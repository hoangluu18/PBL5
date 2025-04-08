interface IProfile {
    id: number;
    customerId: number;
    fullName: string;
    avatar: string | null;
    createdAt: string; // FE nhận Date dưới dạng chuỗi ISO
    totalSpent: number;
    lastOrder: string | null; // Có thể null nếu chưa có đơn hàng
    totalOrder: number;
    address: string[];
    defaultAddress: string | null;
    email: string;
    phone: string;
}

export default IProfile;