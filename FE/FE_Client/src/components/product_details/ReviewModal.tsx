import { useEffect, useState } from "react";
import { Modal, Result, Button, Rate, Input, Form } from "antd";
import { CheckCircleFilled, WarningFilled, ShoppingFilled } from "@ant-design/icons";
import ReviewService from "../../services/review.service";

const { TextArea } = Input;

interface ReviewModalProps {
    visible: boolean;
    onClose: () => void;
    productId: number;
    customerId: number;
    onReviewSubmitted: () => void;
    fetchProducts: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
    visible,
    onClose,
    productId,
    customerId,
    onReviewSubmitted,
    fetchProducts
}) => {
    const [status, setStatus] = useState<"checking" | "canReview" | "alreadyReviewed" | "notPurchased" | "submitted">("checking");
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible) {
            checkReviewStatus();
        }
    }, [visible]);
    const checkReviewStatus = async () => {
        try {
            setStatus("checking"); // Đặt trạng thái là "checking" khi bắt đầu kiểm tra
            setLoading(true);
            const reviewService = new ReviewService();
            const response = await reviewService.checkReview(productId, customerId);
            // Xử lý 3 trường hợp từ API
            if (response === "Bạn chưa mua sản phẩm này hoặc đơn hàng chưa giao đến") {
                setStatus("notPurchased");
            } else if (response === "Bạn đã đánh giá sản phẩm này") {
                setStatus("alreadyReviewed");
            } else if (response === "Bạn có thể đánh giá sản phẩm này") {
                setStatus("canReview");
            }
        } catch (error) {
            console.error("Không thể kiểm tra trạng thái đánh giá:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);
            const reviewService = new ReviewService();
            await reviewService.submitReview(productId, customerId, values.rating, values.content);
            setStatus("submitted");
            onReviewSubmitted(); // Thông báo để component cha cập nhật danh sách đánh giá
            fetchProducts(); // Cập nhật lại danh sách sản phẩm
        } catch (error) {
            console.error("Không thể gửi đánh giá:", error);
        } finally {
            setLoading(false);
        }
    };

    // Hiển thị nội dung modal tùy theo trạng thái
    const renderModalContent = () => {
        switch (status) {
            case "checking":
                return (
                    <div className="text-center p-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Đang kiểm tra...</span>
                        </div>
                        <p className="mt-3">Đang kiểm tra thông tin đánh giá...</p>
                    </div>
                );

            case "notPurchased":
                return (
                    <Result
                        icon={<ShoppingFilled style={{ color: "#faad14" }} />}
                        title="Bạn chưa mua sản phẩm này hoặc đơn hàng chưa giao đến"
                        subTitle="Bạn chưa mua sản phẩm này hoặc đơn hàng chưa giao đến."
                        extra={[
                            <Button key="close" onClick={onClose}>
                                Đóng
                            </Button>
                        ]}
                    />
                );

            case "alreadyReviewed":
                return (
                    <Result
                        icon={<WarningFilled style={{ color: "#faad14" }} />}
                        title="Bạn đã đánh giá sản phẩm này"
                        subTitle="Mỗi khách hàng chỉ có thể đánh giá một lần cho mỗi sản phẩm đã mua."
                        extra={[
                            <Button key="close" onClick={onClose}>
                                Đóng
                            </Button>
                        ]}
                    />
                );

            case "canReview":
                return (
                    <>
                        <div className="text-center mb-4">
                            <h4>Đánh giá sản phẩm</h4>
                            <p className="text-muted">Hãy chia sẻ trải nghiệm của bạn về sản phẩm này</p>
                        </div>
                        <Form form={form} layout="vertical" onFinish={handleSubmit}>
                            <div className="text-center mb-4">
                                <Form.Item
                                    name="rating"
                                    rules={[{ required: true, message: "Vui lòng chọn số sao đánh giá" }]}
                                >
                                    <Rate allowHalf style={{ fontSize: 36, color: "#f8c51c" }} />
                                </Form.Item>
                            </div>

                            <Form.Item
                                name="content"
                                rules={[{ required: true, message: "Vui lòng nhập nội dung đánh giá" }]}
                            >
                                <TextArea
                                    placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
                                    rows={5}
                                />
                            </Form.Item>

                            <div className="text-center">
                                <Button type="default" onClick={onClose} className="me-2">
                                    Hủy
                                </Button>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Gửi đánh giá
                                </Button>
                            </div>
                        </Form>
                    </>
                );

            case "submitted":
                return (
                    <Result
                        icon={<CheckCircleFilled style={{ color: "#52c41a" }} />}
                        title="Đã gửi đánh giá thành công!"
                        subTitle="Cảm ơn bạn đã chia sẻ trải nghiệm của mình về sản phẩm này."
                        extra={[
                            <Button type="primary" key="close" onClick={onClose}>
                                Đóng
                            </Button>
                        ]}
                    />
                );
        }
    };

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            width={500}
            centered
            closable={status !== "checking"}
            maskClosable={status !== "checking"}
        >
            {renderModalContent()}
        </Modal>
    );
};

export default ReviewModal;