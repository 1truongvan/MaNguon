import Order from "../models/Order.js";
import mongoose from "mongoose";

const generateOrderNumber = () => {
  const date = new Date();
  const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ORD${yyyymmdd}${random}`;
};

export const createOrder = async (req, res) => {
  try {
    const user_id = req.user.id;
    const order_number = generateOrderNumber();
    const {
      items,
      customer_name,
      customer_phone,
      customer_email,
      shipping_address,
      shipping_ward,
      shipping_district,
      shipping_province,
      subtotal,
      shipping_fee,
      discount_amount,
      tax,
      total_price,
      payment_method,
      shipping_method,
      customer_note,
    } = req.body;
  
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Danh sách sản phẩm (items) bị thiếu" });
    }

    if (!customer_name || !customer_phone || !shipping_address) {
      return res.status(400).json({ message: "Thiếu thông tin người nhận" });
    }

    const newOrder = new Order({
      user_id,
      order_number,

      customer_name,
      customer_phone,
      customer_email,
      shipping_address,
      shipping_ward,
      shipping_district,
      shipping_province,

      items, 

      subtotal,
      shipping_fee,
      discount_amount,
      tax,
      total_price,

      payment_method,
      shipping_method,
      customer_note,
    });

    await newOrder.save();

    res.status(201).json({
      message: "Tạo đơn hàng thành công",
      order: newOrder,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Lỗi khi tạo đơn hàng", error: error.message });
  }
};

// ===== Giữ nguyên các API còn lại ===== //

export const getUserOrders = async (req, res) => {
  try {
    // Nếu là admin -> lấy toàn bộ đơn hàng
    if (req.user.isAdmin || req.user.role === "admin") {
      const orders = await Order.find()
        .populate("user_id", "name email")
        .sort({ created_at: -1 });

      return res.json(orders);
    }

    // User thường -> lấy đơn của họ
    const user_id = req.user.id;
    const orders = await Order.find({ user_id }).sort({ created_at: -1 });

    res.json(orders);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách đơn hàng" });
  }
};


export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const order = await Order.findById(id).populate("user_id", "name email");
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy chi tiết đơn hàng" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, payment_status, admin_note } = req.body;

    const order = await Order.findById(id);
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    if (status) order.status = status;
    if (payment_status) order.payment_status = payment_status;
    if (admin_note) order.admin_note = admin_note;

    if (status === "confirmed") order.confirmed_at = new Date();
    if (status === "shipped") order.shipped_at = new Date();
    if (status === "delivered") order.delivered_at = new Date();
    if (status === "cancelled") order.cancelled_at = new Date();

    order.updated_at = new Date();
    await order.save();

    res.json({ message: "Cập nhật đơn hàng thành công", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi cập nhật đơn hàng" });
  }
};

export const updateOrderInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const {
      customer_name,
      customer_phone,
      shipping_address,
      shipping_ward,
      shipping_district,
      shipping_province,
    } = req.body;

    const order = await Order.findById(id);
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    if (order.user_id.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền sửa đơn này" });
    }

    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Chỉ được chỉnh sửa khi đơn đang pending" });
    }

    if (customer_name) order.customer_name = customer_name;
    if (customer_phone) order.customer_phone = customer_phone;
    if (shipping_address) order.shipping_address = shipping_address;
    if (shipping_ward) order.shipping_ward = shipping_ward;
    if (shipping_district) order.shipping_district = shipping_district;
    if (shipping_province) order.shipping_province = shipping_province;

    order.updated_at = new Date();
    await order.save();

    res.json({ message: "Cập nhật thông tin thành công", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Lỗi khi cập nhật đơn hàng",
      error: error.message,
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndDelete(id);
    res.json({ message: "Xóa đơn hàng thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi xóa đơn hàng" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { order_number: { $regex: search, $options: "i" } }, // Tìm theo mã đơn
          { customer_name: { $regex: search, $options: "i" } }, // Tìm theo tên khách
        ],
      };
    }
    // Kết thúc phần search

    const orders = await Order.find(query) // Thêm query vào đây
      .populate("user_id", "name email")
      .sort({ created_at: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách đơn hàng" });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    if (
      order.user_id.toString() !== userId.toString() &&
      !req.user.isAdmin
    ) {
      return res
        .status(403)
        .json({ message: "Không có quyền hủy đơn hàng này" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        message: "Chỉ có thể hủy đơn hàng khi trạng thái là 'pending'",
        currentStatus: order.status,
      });
    }

    order.status = "cancelled";
    order.cancelled_at = new Date();
    await order.save();

    return res.json({ message: "Đơn hàng đã được hủy thành công", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi hủy đơn hàng", error: error.message });
  }
};

export const getMonthlyIncome = async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));

  try {
    // 1. Tính tổng doanh thu
    const income = await Order.aggregate([
      {
        $match: {
          // Chỉ tính đơn đã thanh toán hoặc đã giao
          status: "delivered", 
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$total_price" },
        },
      },
    ]);

    // 2. Đếm số lượng đơn theo từng trạng thái
    const orderCounts = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      totalRevenue: income.length > 0 ? income[0].totalSales : 0,
      ordersByStatus: orderCounts,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi thống kê", error: error.message });
  }
};