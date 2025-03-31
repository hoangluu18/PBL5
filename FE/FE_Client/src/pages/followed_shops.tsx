import React, { useEffect, useState } from 'react';
import { Typography, Breadcrumb, Button, Spin } from 'antd';
import ShopList from '../components/ShopList';
import FollowingShopService from '../services/following_shop.service';
import IFollowingShopDto from '../models/dto/FollowingShopDto';

const { Title } = Typography;

const FollowedShops: React.FC = () => {
    const [shops, setShops] = useState<IFollowingShopDto[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [pageNum, setPageNum] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const customerId = 1; // Thay thế bằng ID động từ context hoặc localStorage nếu cần

    const followingShopService = new FollowingShopService();

    const fetchShops = async (page: number, append: boolean = false) => {
        try {
            setLoading(true);
            const data = await followingShopService.getFollowingShops(page, customerId);

            // Kiểm tra nếu không còn dữ liệu
            if (data.length === 0) {
                setHasMore(false);
            } else {
                if (append) {
                    // Thêm dữ liệu mới vào danh sách hiện tại
                    setShops(prevShops => [...prevShops, ...data]);
                } else {
                    // Thay thế danh sách hiện tại
                    setShops(data);
                }
            }
        } catch (error) {
            console.error('Failed to fetch following shops:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Lấy dữ liệu khi component được mount
        fetchShops(1);
    }, []);

    const handleSeeMore = () => {
        // Tăng số trang và lấy thêm dữ liệu
        const nextPage = pageNum + 1;
        setPageNum(nextPage);
        fetchShops(nextPage, true);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <Breadcrumb style={{ marginBottom: '20px' }}>
                <Breadcrumb.Item href='/'>Trang chủ</Breadcrumb.Item>
                <Breadcrumb.Item>Cửa hàng theo dõi</Breadcrumb.Item>
            </Breadcrumb>
            <Title level={2}>Cửa hàng theo dõi của bạn</Title>

            {shops.length > 0 ? (
                <>
                    <ShopList shops={mapApiDataToShopList(shops)} />

                    <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '30px' }}>
                        {loading ? (
                            <Spin />
                        ) : (
                            hasMore && (
                                <Button
                                    type="primary"
                                    onClick={handleSeeMore}
                                    size="large"
                                >
                                    Xem thêm
                                </Button>
                            )
                        )}
                    </div>
                </>
            ) : (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    {loading ? (
                        <Spin size="large" />
                    ) : (
                        <p>Bạn chưa theo dõi cửa hàng nào.</p>
                    )}
                </div>
            )}
        </div>
    );
};

// Hàm chuyển đổi dữ liệu API sang định dạng mà ShopList có thể hiểu được
const mapApiDataToShopList = (apiData: IFollowingShopDto[]) => {
    return apiData.map(shop => ({
        id: shop.shopId,
        name: String(shop.shopName),
        image: `http://localhost:5173/src/assets/shop-images/${shop.photo}` || 'https://via.placeholder.com/150',
        rating: Number(shop.rating) || 0,
        followers: Number(shop.peopleTracking) || 0
    }));
};

export default FollowedShops;