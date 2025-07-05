import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SendOTPAPI, VerifyOTPAPI, ResetPasswordAPI } from "@/api/homePage";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: nhập email, 2: OTP, 3: mật khẩu
  const [formData, setFormData] = useState({ Email: "" });
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Sửa hàm handleSendOTP
  const handleSendOTP = async () => {
    if (!formData.Email.trim()) return toast.error("Vui lòng nhập email");

    setIsLoading(true);
    try {
      const res = await SendOTPAPI(formData.Email);
      toast.success(res.message);
      setStep(2);
    } catch (err) {
      console.log("OTP error:", err);
      toast.error(err.response?.message || "Không thể gửi OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Xác minh OTP
  const handleVerifyOTP = async () => {
    if (!otpCode.trim()) return toast.error("Vui lòng nhập mã OTP");
    console.log("Xác minh OTP:", otpCode, "cho email:", formData.Email);
    setIsLoading(true);
    try {
      const res = await VerifyOTPAPI(formData.Email, otpCode);
      setResetToken(res.reset_token);
      toast.success(res.message);
      setStep(3);
    } catch (err) {
      console.error("Lỗi xác minh OTP:", err);
      toast.error(err.response?.message || "Không thể xác minh OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Đặt lại mật khẩu
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword)
      return toast.error("Vui lòng nhập đầy đủ thông tin");

    if (newPassword !== confirmPassword)
      return toast.error("Mật khẩu xác nhận không khớp");

    if (newPassword.length < 6)
      return toast.error("Mật khẩu phải có ít nhất 6 ký tự");

    if (!resetToken)
      return toast.error(
        "Token đặt lại mật khẩu không tồn tại hoặc chưa được xác minh",
      );

    setIsLoading(true);
    try {
      const res = await ResetPasswordAPI(
        formData.Email,
        resetToken,
        newPassword,
      );
      toast.success(res.message);
      setTimeout(() => (window.location.href = "/dang-nhap"), 1500);
    } catch (err) {
      console.error("Lỗi xác minh OTP:", err.response?.errors);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 px-4 py-12">
      <div className="mx-auto max-w-lg overflow-hidden rounded-xl bg-white shadow-md">
        <div className="bg-orange-500 px-6 py-4 text-center text-white">
          <h1 className="text-xl font-bold">Quên mật khẩu</h1>
          <p className="text-sm">
            {step === 1 && "Nhập email để nhận mã OTP"}
            {step === 2 && "Nhập mã OTP được gửi qua email"}
            {step === 3 && "Đặt lại mật khẩu mới"}
          </p>
        </div>

        <div className="space-y-6 p-6">
          {step === 1 && (
            <>
              <label className="block text-sm">Email</label>
              <input
                type="email"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
                className="w-full rounded border px-4 py-2"
                placeholder="Nhập email"
              />
              <button
                onClick={handleSendOTP}
                disabled={isLoading}
                className="w-full rounded bg-orange-500 py-2 text-white hover:bg-orange-600 disabled:opacity-50"
              >
                {isLoading ? "Đang gửi..." : "Gửi mã OTP"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-sm text-gray-600">
                Đã gửi mã OTP đến email:{" "}
                <span className="font-bold">{formData.Email}</span>
              </p>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                maxLength={6}
                className="w-full rounded border px-4 py-2 text-center font-mono text-xl"
                placeholder="Nhập mã OTP"
              />
              <button
                onClick={handleVerifyOTP}
                disabled={isLoading}
                className="w-full rounded bg-orange-500 py-2 text-white hover:bg-orange-600 disabled:opacity-50"
              >
                {isLoading ? "Đang xác minh..." : "Xác minh"}
              </button>
              <p className="mt-2 text-center text-sm">
                <button
                  onClick={() => handleSendOTP()}
                  className="text-blue-600 underline"
                >
                  Gửi lại mã OTP
                </button>
              </p>
            </>
          )}

          {step === 3 && (
            <>
              <label className="block text-sm">Mật khẩu mới</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded border px-4 py-2"
                placeholder="Nhập mật khẩu mới"
              />
              <label className="mt-2 block text-sm">Xác nhận mật khẩu</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded border px-4 py-2"
                placeholder="Nhập lại mật khẩu"
              />
              <button
                onClick={handleResetPassword}
                disabled={isLoading}
                className="mt-3 w-full rounded bg-orange-500 py-2 text-white hover:bg-orange-600 disabled:opacity-50"
              >
                {isLoading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
              </button>
            </>
          )}

          <div className="text-center">
            <button
              onClick={() => (window.location.href = "/dang-nhap")}
              className="text-sm text-blue-600 underline"
            >
              ← Quay lại đăng nhập
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
