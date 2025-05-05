DELIMITER $$
CREATE FUNCTION get_revenue_change(day_offset INT, p_shop_id INT)
RETURNS FLOAT
DETERMINISTIC
BEGIN
    DECLARE net_today FLOAT DEFAULT 0;
    DECLARE net_compare FLOAT DEFAULT 0;
    DECLARE change_rate FLOAT DEFAULT 0;

    -- Lấy doanh thu thuần hôm nay (các đơn hàng ĐƯỢC GIAO hôm nay)
    SELECT IFNULL(SUM(total), 0)
    INTO net_today
    FROM orders
    WHERE order_status = 'DELIVERED'
      AND DATE(deliver_date) = CURRENT_DATE()
      AND shop_id = p_shop_id;

    -- Lấy doanh thu thuần ngày cần so sánh
    SELECT IFNULL(SUM(total), 0)
    INTO net_compare
    FROM orders
    WHERE order_status = 'DELIVERED'
      AND DATE(deliver_date) = DATE_SUB(CURRENT_DATE(), INTERVAL day_offset DAY)
      AND shop_id = p_shop_id;

    -- Tính tỷ lệ thay đổi (%) với các trường hợp đặc biệt
    IF net_compare = 0 AND net_today = 0 THEN
        SET change_rate = 0; -- Cả hai đều 0, không có thay đổi
    ELSEIF net_compare = 0 AND net_today > 0 THEN
        SET change_rate = 100; -- Từ 0 lên có doanh thu, tăng 100%
    ELSEIF net_today = 0 AND net_compare > 0 THEN
        SET change_rate = -100; -- Từ có doanh thu xuống 0, giảm 100%
    ELSE
        SET change_rate = (net_today - net_compare) / net_compare * 100;
    END IF;

    RETURN change_rate;
END$$
DELIMITER ;